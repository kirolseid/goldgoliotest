const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
var cors = require('cors')
const path = require('path')
var bodyParser = require('body-parser')
const initDb = require('./db/connect').initDb;
const initIo = require('./helpers/socket').initIo;
const usersRoutes = require('./routes/users');
const usersSockets = require('./sockets/users');
const mongoose = require('mongoose');
const multer = require('multer')

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api/users', usersRoutes);

// error handler middleware
app.use((error, req, res, next) => {
	console.log('error', error);
	const errorMessage = error.message ? error.message : 'something went wrong';
	const statusCode = error.statusCode ? error.statusCode : 500;
	console.log('statusCode', statusCode);

	res.status(statusCode).json({ error: errorMessage });
});



const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads')
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random())
		cb(null, uniqueSuffix + '-' + file.originalname)
	}
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

function fileFilter(req, file, cb) {

	if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
		cb(null, true)
	} else {
		cb(null, true)

	}
	// To accept the file pass `true`, like so:
}
var upload2 = multer({ storage: storage }).single("file")
app.post("/api/chat/uploadfiles", (req, res) => {
	upload2(req, res, err => {
		if (err) {
			return res.json({ success: false, err })
		}
		return res.json({ success: true, url: res.req.file.path });
	})
});

const upload = multer({ dest: 'uploads', storage, fileFilter })


app.use(upload.single('file'))



app.use(require('./routes/signup.routes'));
app.use(require('./routes/signin.routes'));
app.use(require('./routes/getDetails.routes'));
app.use(require('./routes/updateProfils.routes'));
app.use(require('./routes/uploadMedia.routes'));
app.use(require('./routes/follow.routes'));
app.use(require('./routes/offer.routes'));
app.use(require('./routes/Likes&comments.routes'));




app.post("/upload", (req, res) => {
	const file = req.file;
	const imagename = req.file.filename
	// const imageURL = 'http://localhost:3000/uploads/'+imagename
	const imageURL = req.protocol + "://" + req.headers.host + '/uploads/' + imagename
	console.log(file);

	if (file) {
		// console.log(req.file,imageURL);
		res.json({ imageURL })
	} else {
		throw new Error('file upload unsuccessful')
	}
	// console.log(req.file);
})




app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))



// initializing the database using native mongoDB driver
initDb((error, client) => {
	if (error) {
		console.log('error', error);
		console.log('Failed To Connect...');
	} else {
		console.log('Connected...');
		let httpServer;
		if (process.env.PORT) {
			console.log('Production');
			httpServer = app.listen(process.env.PORT);
		} else {
			console.log('Development');
			httpServer = app.listen(1502);
		}

		const io = initIo(httpServer);
		io.on('connection', socket => {
			socket.on('changeActivityStatusFromClient', data => {
				usersSockets.changeActivityStatus(data);
			});

			socket.on('onChats', data => {
				usersSockets.onChats(data.userToken);
			});

			socket.on('joinRoom', data => {
				usersSockets.joinChatRoom(socket, data.chatRoomId, data.userId,);
			});

			socket.on('privateMessage', data => {
				console.log('privateMessageapi');
				usersSockets.sendPrivateMessage(data.chatRoomId, data.messageData, data.userToken);
			});

			socket.on('messageIsSeen', data => {
				usersSockets.messageSeen(socket, data);
			});

			socket.on('typing', data => {
				const { userId, isTyping, roomId } = data;
				io.in(roomId).emit('isTyping', { userId, isTyping });
			});

			socket.on("disconnect", async () => {
				console.log(`${socket.id} disconnected`);

			});


		});
	}
});


// okkkkkkkkkkkkkkkkk



// mongoose.connect('mongodb://localhost:27017/goldGolio15');
// mongoose.connect('mongodb+srv://admin:admin@cluster0.9aoqp.mongodb.net/GoldGolio');
mongoose.connect('mongodb+srv://admin:admin@cluster0.9aoqp.mongodb.net/GoldGolioMobiletest', { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
