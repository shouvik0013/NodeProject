const getDb = require("../utils/database").getDb;
const { ObjectId } = require("mongodb");
class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    let db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(userId) {
    let db = getDb();

    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = User;
