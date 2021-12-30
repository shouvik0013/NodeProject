const fs = require("fs");
const path = require("path");

// LOCAL MODULE
const rootDir = require("../utils/path");

// PATH TO CART DATA-FILE
const pathToCartData = path.join(rootDir, "data", "carts.json");

class Cart {
  static addProduct(id, productPrice) {
    /**
     * STRUCTURE OF CART
     * cart = {products: [{id:123, qty: 2}, {id:898, qty:8}], totalPrice: 8987};
     */

    // FETCH THE PREVIOUS CART
    fs.readFile(pathToCartData, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        try {
          cart = JSON.parse(fileContent);
        } catch (error) {
          console.log(error);
        }
      }

      // ANALYZE THE CART => FIND EXISTING CART
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      let productToBeAddedOrUpdated;

      // ADD A NEW PRODUCT OR INCREASE THE QUANTITY
      if (existingProduct) {
        productToBeAddedOrUpdated = { ...existingProduct };
        // INCREASE qty BY ONE
        productToBeAddedOrUpdated.qty = productToBeAddedOrUpdated.qty + 1;
        cart.products[existingProductIndex] = productToBeAddedOrUpdated;
      } else {
        productToBeAddedOrUpdated = { id: id, qty: 1 };
        cart.products = [...cart.products, productToBeAddedOrUpdated];
      }
      cart.totalPrice = cart.totalPrice + productPrice;

      // WRITE UPDATED CART BACK TO FILE
      fs.writeFile(pathToCartData, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice, redirectCallback) {
    fs.readFile(pathToCartData, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = JSON.parse(fileContent);
      const product = updatedCart.products.find((prod) => prod.id === id);
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== product.id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;
      fs.writeFile(pathToCartData, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log(err);
        }
        redirectCallback();
      })
    });
  }

  /**
   * Fetches the cart from database/file &
   * calls cb with the cart like cb(cart)
   * @param {Function} cb Callback function
   */
  static getCart(cb) {
    fs.readFile(pathToCartData, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        return cb(null);
      }
      cb(cart);
    })
  }
}

module.exports = Cart;
