const getDb = require("../utils/database").getDb;
const { ObjectId } = require("mongodb");
class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    let updatedCart = {
      items: updatedCartItems,
    };

    let db = getDb();
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) },
      {
        $set: {
          cart: updatedCart,
        },
      }
    );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => {
      return item.productId;
    });
    console.log("Product IDs -> " + productIds);
    return db.collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        console.log("Fetched products from database -> " + products);
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
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
