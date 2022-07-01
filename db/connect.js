const mongodb = require('mongodb');
require('dotenv').config()


const MongoClient = mongodb.MongoClient;

let _db;
let _client;
// connecting url
// const mongoUrl =process.env.ENV == 'DEV' ? `${process.env.DATABASE_DEV}` : `${process.env.DATABASE_TEST}`
const mongoUrl = "mongodb+srv://admin:admin@cluster0.9aoqp.mongodb.net/GoldGolioMobiletest?retryWrites=true&w=majority"

exports.initDb = async cb => {
	if (_db) return cb(null, _client);
	try {
		_client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
		_db = _client.db();
		cb(null, _client);
	} catch (error) {
		cb(error, null);
	}
};

exports.getDb = () => {
	if (!_db) throw 'Not Connected...';

	return _db;
};
