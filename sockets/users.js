const getIo = require('../helpers/socket').getIo;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const User = require('../models/user');
const ChatRoom = require('../models/chatRoom');
const Message = require('../models/message');
const socketIsAuth = require('../sockets/socketIsAuth');
const socketHelpers = require('./socket-helpers');
exports.changeActivityStatus = async ({ userToken, online }) => {
	try {
		const userId = socketIsAuth(userToken);
		const query = online === true ? { $set: { online: true } } : { $set: { online: false } };
		getIo().emit('changeActivityStatus', { userId, online });
		await User.updateUserWithCondition({ userRef: new ObjectId(userId) }, query);
	} catch (error) {
		getIo().emit('changeActivityStatus', { error: error.message });
	}
};
exports.onChats = async userToken => {
	console.log('onChats');
	try {
		const userId = socketIsAuth(userToken);
		const user = await User.getUser(userId);
		const userChatRooms = user.chats; // [id, id, id]
		// get only the chats that its chatHistory has some messages
		if (userChatRooms.length < 1) {
			return getIo().emit('userChats', { userId: userId, userChats: [] });
		}
		// // exclude chats with no message(chat) history
		// const room = await ChatRoom.GetChatRoom(userChatRooms);
		// console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;room', room);
		const userChats = await ChatRoom.getChatRoomsAggregated([
			{
				$match: {
					$and: [{ _id: { $in: userChatRooms } }, { chatHistory: { $ne: [] } }]
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'userOne',
					foreignField: 'userRef',
					as: 'firstUser'
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'userTwo',
					foreignField: 'userRef',
					as: 'secondUser'
				}
			},
			{
				$project: {
					userOne: 0,
					userTwo: 0,
					'firstUser.chats': 0,
					'secondUser.chats': 0,
				}
			}
		]);
		const mappedUserChats = userChats.map(chat => {
			const newChat = { ...chat };
			newChat.firstUser = { ...newChat.firstUser[0] };
			newChat.secondUser = { ...newChat.secondUser[0] };
			const lastMessage = { ...newChat.chatHistory[newChat.chatHistory.length - 1] };
			newChat.lastMessage = lastMessage;
			newChat.lastMessageDate = lastMessage.date;
			let unreadMessages = 0;
			for (let i = newChat.chatHistory.length - 1; i >= 0; i--) {
				const message = newChat.chatHistory[i];
				if (message.seen === false && message.from.toString() !== userId.toString()) {
					unreadMessages++;
				}
			}
			newChat.unreadMessages = unreadMessages;
			let newChatForm = (({ _id, firstUser, secondUser, lastMessage, lastMessageDate, unreadMessages }) => ({
				_id,
				firstUser,
				secondUser,
				lastMessage,
				lastMessageDate,
				unreadMessages,
				isSelected: false
			}))(newChat);
			return newChatForm;
		});
		const sortedUserChats = mappedUserChats.slice().sort((a, b) => b.lastMessageDate - a.lastMessageDate);
		getIo().emit('userChats', { userId: userId, userChats: sortedUserChats });
	} catch (error) {
		console.log(error);
		getIo().emit('userChats', { error: error.message });
	}
};
// seen is done
exports.joinChatRoom = async (socket, chatRoomId, userId) => {
	const roomToLeave = Object.keys(socket.rooms)[1];
	let userIdCopy;
	try {
		// const userId = socketIsAuth(userToken);
		userIdCopy = userId;
		socket.leave(roomToLeave);
		socket.join(chatRoomId);
		socketHelpers.increaseRoomMembers(chatRoomId, 'userTwoIsActive');
		const tempChatRoom = await ChatRoom.getChatRoomAggregated([{ $match: { _id: new ObjectId(chatRoomId) } }]);
		if (!tempChatRoom) throw new Error('chat room is not found');
		let chatRoom;
		if (tempChatRoom.chatHistory.length > 0) {
			chatRoom = await ChatRoom.getChatRoomAggregated([
				{ $match: { _id: new ObjectId(chatRoomId) } },
				{
					$lookup: {
						from: 'users',
						localField: 'userOne',
						foreignField: 'userRef',
						as: 'firstUser'
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'userTwo',
						foreignField: 'userRef',
						as: 'secondUser'
					}
				},
				{ $unwind: '$chatHistory' },
				{
					$lookup: {
						from: 'users',
						foreignField: 'userRef',
						localField: 'chatHistory.from',
						as: 'chatHistory.fromUser'
					}
				},
				{ $unwind: '$chatHistory.from' },
				{ $group: { _id: '$_id', root: { $mergeObjects: '$$ROOT' }, chatHistory: { $push: '$chatHistory' } } },
				{ $replaceRoot: { newRoot: { $mergeObjects: ['$root', '$$ROOT'] } } },
				{ $project: { root: 0 } },
				{
					$project: {
						userOne: 0,
						userTwo: 0,
					}
				}
			]);
		} else {
			chatRoom = await ChatRoom.getChatRoomAggregated([
				{ $match: { _id: new ObjectId(chatRoomId) } },
				{
					$lookup: {
						from: 'users',
						localField: 'userOne',
						foreignField: 'userRef',
						as: 'firstUser'
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'userTwo',
						foreignField: 'userRef',
						as: 'secondUser'
					}
				},
				{
					$project: {
						userOne: 0,
						userTwo: 0,
					}
				}
			]);
		}
		// tweek our chatRoom a little bit
		const newChatRoom = { ...chatRoom };
		newChatRoom.firstUser = { ...newChatRoom.firstUser[0] };
		newChatRoom.secondUser = { ...newChatRoom.secondUser[0] };
		// do the same for chatHistory messages..
		const newChatHistory = socketHelpers.newChatHistory(newChatRoom);
		newChatRoom.chatHistory = newChatHistory;
		// set the undread messages from the other user to seen
		let newUnreadMessages = [];
		let newUnreadMessagesSender;
		for (let message of newChatRoom.chatHistory) {
			if (message.seen === false && message.fromUser.userRef.toString() !== userId.toString()) {
				newUnreadMessages.push(message._id);
				if (!newUnreadMessagesSender) newUnreadMessagesSender = message.fromUser.userRef.toString();
			}
		}
		if (newUnreadMessages.length > 0) {
			getIo().emit('setUnseenMessagesToTrue', {
				messages: newUnreadMessages,
				room: chatRoomId,
				to: newUnreadMessagesSender
			});
			await ChatRoom.updateChatWithCondition(
				{ _id: new ObjectId(chatRoomId) },
				{ $set: { 'chatHistory.$[el].seen': true } },
				{ arrayFilters: [{ 'el._id': { $in: newUnreadMessages } }] }
			);
		}
		getIo().emit('chatRoomIsJoined', { chatRoom: newChatRoom, from: userId });
	} catch (error) {
		console.log(error);
		getIo().emit('chatRoomIsJoined', { error: error.message, from: userIdCopy });
	}
};
exports.sendPrivateMessage = async (socket, messageData, userToken) => {
	const { username, media, message, to } = messageData;
	try {
		const from = socketIsAuth(userToken);
		const clientChatRoom = socket; // the chatRoomId of the user
		const newMessage = new Message(message, media, from, to);
		const foundUserTo = await User.getUserAggregated([
			{ $match: { userRef: new ObjectId(to) } },
			{
				$project: {
					username: 1,
					email: 1,
					online: 1,
					img: 1
				}
			}
		]);
		// making instanced message to prevent aggregation the from while realtime texting
		const quickMessageForOtherUser = {
			_id: newMessage._id,
			date: newMessage.date,
			seen: newMessage.seen,
			fromUser: {
				userRef: from,
				username: username,
			},
			toUser: {
				UserRef: to,
				username: foundUserTo.username,
			},
			message: message,
			media: media ? media : 'text'
		};
		getIo().in(clientChatRoom).emit('privateMessageBack', quickMessageForOtherUser);
		// send another event to handle the outside
		await newMessage.addMessage(clientChatRoom);
		getIo().emit('privateMessageBackFromOutside', to);
	} catch (error) {
		console.log(error);
		getIo().emit('privateMessageBack', { error: error.message });
	}
	// emit the message back to the other user before it is store in the databse for fast performance
};
exports.messageSeen = async (socket, { messageId }) => {
	try {
		const clientChatRoom = Object.keys(socket.rooms)[1]; // the chatRoomId of the user
		getIo().in(clientChatRoom).emit('seen', messageId);
		await ChatRoom.updateChatWithCondition(
			{ 'chatHistory._id': messageId },
			{ $set: { 'chatHistory.$.seen': true } },
			null
		);
	} catch (error) {
		getIo().emit('seen', { error: error.message });
	}
};
