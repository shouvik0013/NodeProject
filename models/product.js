const getDb = require("../utils/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, description, imageUrl, price, id, userId) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOperationPromsie;
    if (this._id) {
      // Update the product
      dbOperationPromsie = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperationPromsie = db.collection("products").insertOne(this);
    }

    return dbOperationPromsie
      .then((result) => {
        console.log(result);
        return result;
        // return Promise.resolve(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return Promise.resolve(products);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
