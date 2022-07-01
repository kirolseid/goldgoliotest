const getIo = require('../helpers/socket').getIo;

exports.increaseRoomMembers = (room, eventName) => {
	const io = getIo();


	var numClients = io.sockets.adapter.rooms[room]!=undefined ? Object.keys(io.sockets.adapter.rooms[room]).length:0;

		io.in(room).emit(eventName, numClients);

};

exports.projectGroupMembers = group => {
	let newMembers = group.groupMembers.map(member => {
		let newMember = (({ _id, username,  online, img }) => ({
			_id,
			username,
			online,
			img
		}))(member);

		return newMember;
	});

	return newMembers;
};

exports.newChatHistory = room => {
	const newChatHistory = room.chatHistory.map(message => {
		let newMessage = { ...message };

		// change the fromUser into an object
		let fromUser = { ...newMessage.fromUser[0] };
		// destructure our desired data
		let newFromUser = (({ userRef, username,  online, img }) => ({
			userRef,
			username,
			online,
			img
		}))(fromUser);

		newMessage.fromUser = newFromUser;

		return newMessage;
	});

	return newChatHistory;
};
