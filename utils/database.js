const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;


let _db;

/**
 * Get backs a mongoDb client & calls cb
 * @param {Function} cb
 */
const mongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://devusr:ddreb0660@cluster0.fyweo.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected to MONGODB SERVER!!!");
      _db = client.db()
      cb();
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Returns db
 * @returns {mongodb.Db}
 */
const getDb = () => {
  if (_db) {
    return _db
  }

  throw 'No database found';
}

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
