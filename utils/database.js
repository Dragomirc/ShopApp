const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = cb => {
    MongoClient.connect(
        `mongodb+srv://Dragomir:${
            process.env.DATABASE_PASSWORD
        }@cluster0-lie0b.mongodb.net/shop?retryWrites=true&w=majority`,
        { useNewUrlParser: true }
    )
        .then(client => {
            console.log("Connected");
            _db = client.db();
            cb(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "Not database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
