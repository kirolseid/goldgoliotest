const getIo = require('../helpers/socket').getIo;

const sendError = require('../helpers/sendError');
const User = require('../models/user');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const ChatRoom = require('../models/chatRoom');
exports.getUserAfterLogin = async (req, res, next) => {
	const userId = req.userId;
	console.log('working');
	try {
		// const user = await UserModel.find({ userRef: userId }).populate({
		// 	path: 'userRef',
		// })
		const user = await User.getUser(userId)

		if (!user) sendError('User with given id does not found', 403);
		res.status(200).json({ message: 'User fetched successfully', user });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};
exports.findPeople = async (req, res, next) => {
	const userId = req.userId;
	try {
		const user = await User.find({ userRef: userId });



		if (!user) sendError('User with given Id does not exist', 404);
		// get all users but himself and his friends
		const allUsers = await UserModel.aggregate([
			{
				$match: {
					$and: [{ userId: { $not: { $eq: new ObjectId(userId) } } }]
				}
			},
			{ $project: { password: 0, email: 0, chats: 0, } }
		]);
		res.status(200).json({ people: allUsers });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};
exports.getSharedChatRoom = async (req, res, next) => {
	const whoWatchedId = req.userId; // the user who watched
	const { userId } = req.params; // the user to get his data
	try {
		const user = await User.getUserAggregated([
			{ $match: { userRef: new ObjectId(userId) } },
			{
				$project: {
					password: 0,
					email: 0,
				}
			},
			{ $lookup: { from: 'users', localField: 'friends', foreignField: '__id', as: 'userFriends' } },
			{
				$project: {
					friends: 0,
					'userFriends.password': 0,
					'userFriends.chats': 0,
				}
			}
		]);

		const userWhoWatched = await User.getUser(whoWatchedId);

		for (let userChatRoom of user.chats) {
			for (let userWhoWatchedChatRoom of userWhoWatched.chats) {
				if (userChatRoom.toString() === userWhoWatchedChatRoom.toString()) {
					user.sharedChatRoom = userChatRoom;
				}
			}
		}

		res.status(200).json({ user: user });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};
exports.createChatRoom = async (req, res, next) => {
	const { userFromId, userToAddId } = req.body;//me
	try {
		const userFromData = await User.getUser(userFromId);
		const userToData = await User.getUser(userToAddId);


		const hasSimilarElement = userFromData.chats.some((item) => userToData.chats.some(item2 => item.toString() === item2.toString()))
		if (!hasSimilarElement) {
			const chatRoom = new ChatRoom(new ObjectId(userFromId), new ObjectId(userToAddId));
			const addedRoom = await chatRoom.addChatRoom();
			const insertedRoomId = addedRoom.insertedId;
			const userFromFilter = { userRef: new ObjectId(userFromId) };
			const userToFilter = { userRef: new ObjectId(userToAddId) };
			await Promise.all([
				User.updateUserWithCondition(userFromFilter, { $addToSet: { chats: new ObjectId(insertedRoomId) } }),
				User.updateUserWithCondition(userToFilter, { $addToSet: { chats: new ObjectId(insertedRoomId) } }),
			]);
		}
		res.status(200).json({ message: 'Friend Recieve messsage successfully', to: userToAddId, });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.removeChat = async (req, res, next) => {
	// const { userId } = req;
	const { ids } = req.body;

	try {
		ids.forEach(async element => {
			const sharedRoomId = new ObjectId(element.roomId);
			await ChatRoom.deleteChatRoom(element.userOne, element.userTwo);
			await User.updateUserWithCondition({ userRef: new ObjectId(element.userOne) }, { $pull: { chats: sharedRoomId } });
			await User.updateUserWithCondition({ userRef: new ObjectId(element.userTwo) }, { $pull: { chats: sharedRoomId } });
		});
		getIo().emit('removeChat', ids);

		res.status(200).json({ message: `chat removed successfully` });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};


exports.blockChat = async (req, res, next) => {
	const { chatRoomId, userId } = req.body;//me

	try {
		const chatRoom = await ChatRoom.GetChatRoomById(chatRoomId);
		const query = chatRoom.blocked.block !== true ? { $set: { blocked: { block: true, blockedBy: userId } } } : { $set: { blocked: { block: false, blockedBy: '' } } };
		await ChatRoom.updateChatCodition({ _id: new ObjectId(chatRoomId) }, query);
		getIo().emit('blocked', chatRoom);
		res.status(200).json({ message: `Friend blocked successfully`, chatRoom });

	} catch (error) {
		console.log(error);
		getIo().emit('blocked', { error: error.message });
	}
};
