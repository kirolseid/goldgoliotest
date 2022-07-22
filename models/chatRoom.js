const mongodb = require('mongodb');

const collectionName = 'chatRooms';
const db = require('../db/connect').getDb;
const ObjectId = mongodb.ObjectId;

class ChatRoom {
	constructor(userOne, userTwo, chatHistory = [], blocked = {}) {
		// it doesn`t make any difference but i will make the user who sent the request userOne just to avoid randomity
		this.userOne = userOne;
		this.userTwo = userTwo;
		this.chatHistory = chatHistory;
		this.blocked = {
			block: false,
			blockBy: ''
		}
	}
	addChatRoom = () => {
		return db().collection(collectionName).insertOne(this);
	};
	static detectSharedRoom = (userId, friendId) => {
		const sharedRoomQuery = {
			$or: [
				{ $and: [{ userOne: { $eq: new ObjectId(userId) } }, { userTwo: new ObjectId(friendId) }] },
				{
					$and: [{ userOne: { $eq: new ObjectId(friendId) } }, { userTwo: { $eq: new ObjectId(userId) } }]
				}
			]
		};

		return sharedRoomQuery;
	};
	static GetChatRoom = ids => {
		return db().collection(collectionName).find({ _id: { $in: ids } });
	};
	static GetChatRoomById = id => {
		return db().collection(collectionName).findOne({ _id: new ObjectId(id) });
	};
	static getSharedChatRoom = (userId, friendId) => {
		const sharedRoomQuery = this.detectSharedRoom(userId, friendId);
		return db().collection(collectionName).findOne(sharedRoomQuery);
	};
	static getChatRoomAggregated = aggregationArray => {
		return db().collection(collectionName).aggregate(aggregationArray).next();
	};

	static getChatRoomsAggregated = aggregationArray => {
		return db().collection(collectionName).aggregate(aggregationArray).toArray();
	};

	static updateChatWithCondition = (filterObj, conditionObj, arrayFilterObj) => {
		return db().collection(collectionName).updateOne(filterObj, conditionObj, arrayFilterObj);
	};
	static updateChatCodition = (conditionObj, updatingObj) => {
		return db().collection(collectionName).updateOne(conditionObj, updatingObj);
	};
	static deleteChatRoom = (userId, friendId) => {
		const sharedRoomQuery = this.detectSharedRoom(userId, friendId);
		return db().collection(collectionName).deleteOne(sharedRoomQuery);
	};

}

module.exports = ChatRoom;
