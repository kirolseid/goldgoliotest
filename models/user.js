const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const db = require('../db/connect').getDb;
const collectionName = 'users';
class User {
	constructor(username,  email, userRef, docModel) {
		console.log(username,email,userRef,docModel);
		// personal properties
		this.username = username;
		this.email = email;
		this.img = '/assets/images/avatar.png';
		this.userRef = userRef;
		this.docModel = docModel;
		this.joinedAt = new Date();
		// advanced properties
		this.online = false;
		this.chats = [];

	}
	addUser = () => {
		return db().collection(collectionName).insertOne(this);
	};
	static getUser = userId => {
		return db().collection(collectionName).findOne({ userRef: new ObjectId(userId) },);
	};
	static getUsersAggregated = aggregationArr => {
		return db().collection(collectionName).aggregate(aggregationArr).toArray();
	};
	static getUserAggregated = (aggregationArr) => {
		return db().collection(collectionName).aggregate(aggregationArr).next();
	};

	static getUserWithConditionForLogin = condition => {
		return db().collection(collectionName).findOne(condition);
	};
	static getUserWithCondition = condition => {
		return db().collection(collectionName).findOne(condition, { projection: { password: 0 } });
	};
	static getUsersWithCondition = condition => {
		return db().collection(collectionName).find(condition, { projection: { password: 0 } }).toArray();
	}
	static updateUserWithCondition = (conditionObj, updatingObj) => {
		return db().collection(collectionName).updateOne(conditionObj, updatingObj);
	};
	static updateUsersWithACondition = (conditionObj, updatingObj) => {
		return db().collection(collectionName).updateMany(conditionObj, updatingObj);
	};
}
module.exports = User;
