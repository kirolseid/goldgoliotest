const express = require('express');
const usersControllers = require('../controllers/users');
const isAuth = require('../middlewares/isAuth');
const router = express.Router();
router.get('/userAFterLogin', isAuth, usersControllers.getUserAfterLogin);
router.get('/findPeople', isAuth, usersControllers.findPeople);
router.get('/sharedChatRoom/:userId', isAuth, usersControllers.getSharedChatRoom);

router.patch('/createChatRoom', isAuth, usersControllers.createChatRoom);
router.patch('/blockChat', usersControllers.blockChat);

router.patch('/removeChat', isAuth, usersControllers.removeChat);






module.exports = router;
