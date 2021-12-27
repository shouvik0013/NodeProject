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

      let updatedProduct;

      // ADD A NEW PRODUCT OR INCREASE THE QUANTITY
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        // INCREASE qty BY ONE
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + productPrice;

      // WRITE UPDATED CART BACK TO FILE
      fs.writeFile(pathToCartData, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
}

module.exports = Cart;
