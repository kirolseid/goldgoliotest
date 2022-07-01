const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const ObjectId = require('mongodb').ObjectId;
// const getIo = require('../helpers/socket').getIo;

module.exports = socketIsAuth = userToken => {
	const errorMessage = 'User is not authenticated...';
	// console.log('userToken',userToken);
	if (!userToken) throw new Error(errorMessage);

	const decodedToken = jwt.decode(userToken, 'secretKey');

	if (!decodedToken) throw new Error(errorMessage);

	return decodedToken.userId;
};
