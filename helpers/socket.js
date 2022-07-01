const socketIo = require('socket.io');

let _io;
exports.initIo = httpServer => {
	_io = socketIo(httpServer,{ cors: {
		origin: "*",
		credentials: false,
	  },});
	//   console.log(_io);
	return _io;
};

exports.getIo = () => {
	if (!_io) console.log('io is not initialized');
	return _io;
};
