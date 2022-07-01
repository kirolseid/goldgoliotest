const { v4: uuidv4 } = require('uuid');
const db = require('../db/connect').getDb;
const ObjectId = require('mongodb').ObjectId;

const collectionName = 'chatRooms';

class Message {
	constructor(message, media, from, to) {
		this._id = uuidv4();
		this.message = message;
		this.media = media ? media : 'text'
		this.from = new ObjectId(from);
		this.to = new ObjectId(to);
		this.seen = false;
		this.date = new Date();

	}
	addMessage = async roomId => {
		return await db().collection(collectionName).updateOne({ _id: new ObjectId(roomId) }, { $addToSet: { chatHistory: this } }); // returns a promise
	};



}

module.exports = Message;
