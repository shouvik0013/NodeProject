// CORE MODULES
const fs = require("fs");
const path = require("path");

// THIRD PARTY MODULES
const express = require("express");

// LOCAL MODULES
const rootDir = require("../utils/path");
const generateUniqueId = require("generate-unique-id");
const Cart = require('./cart');


// PATH TO DATA FILE
const pathToProductsData = path.join(rootDir, "data", "products.json");


/**
 * Fetch products from file and calls cb with products like cb(products)
 * @param {Function} cb callback Function 
 */
const getProductsFromFile = (cb) => {
  // here cb expects an array as an argument
  fs.readFile(pathToProductsData, (err, fileContent) => {
    if (err) {
      cb([]); // passing an empty array
    } else {
      try {
        /** @type {Array} */
        const parsedArray = JSON.parse(fileContent);
        cb(parsedArray); // CALL cb() WITH parsedArray
      } catch (error) {
        console.log("Error in converting file-content into an Array. Details: " + err);
        return cb([]); // PASSING EMPTY ARRAY AS ARGUMENT
      }
    }
  });
};

// CLASS DEFINITION
class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  /**
   *
   * @param {express.Response} res
   * SAVES THE CURRENT OBJECT AND REDIRECTS TO "/"
   */
  saveToFile(res) {
    // CHECKING IF THE PRODUCT EXISTS OR NOT
    if (this.id) {
      getProductsFromFile((products) => {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProductsArray = [...products];
        updatedProductsArray[existingProductIndex] = this;
        
        const updatedProductsJsonString = JSON.stringify(updatedProductsArray)

        fs.writeFile(pathToProductsData, updatedProductsJsonString, (err) => {
          if (err) {
            console.log(err);
            console.log("Failed to write into file");
            return res.redirect("/");
          }

          console.log("Writing into file has been done");
          return res.redirect("/admin/products");
        });
      });
    } else {
      getProductsFromFile((products) => {
        this.id = generateUniqueId({ length: 10, useLetters: false });
        products.push(this);
        const productsArrayJsonString = JSON.stringify(products);

        fs.writeFile(pathToProductsData, productsArrayJsonString, (err) => {
          if (err) {
            console.log(err);
            return res.redirect('/admin/products');
          }
          console.log("Writing into file completed");
          res.redirect("/");
        });
      });
    }
  }

  /**
   * Fetch all products from file and call cb with products like cb(products)
   * @param {Fuction} cb callback function 
   */
  static fetchAll(cb) {
    // "cb" IS A callback
    getProductsFromFile(cb);
  }

  /**
   * FINDS THE PRODUCT WITH THE SPECIFIC ID
   * AND CALL cb WITH THE PRODUCT LIKE cb(product)
   * @param {String} id ID OF THE PRODUCT
   * @param {Function} cb CALLBACK FUNCTION
   */
  static findById(id, cb) {
    const findProductHandler = (products) => {
      const productWithPassedId = products.find((product, index) => {
        if (product.id === id) return true;
        return false;
      });
      cb(productWithPassedId);
    };

    getProductsFromFile(findProductHandler);
  }

  static deleteById(id, redirectCallback) {
    getProductsFromFile((products) => {
      const product = products.find(prod => prod.id === id);
      const productsWithoutProductWithPassedID = products.filter((prod) => prod.id !== id);
      fs.writeFile(pathToProductsData, JSON.stringify(productsWithoutProductWithPassedID), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price, redirectCallback);
        }
      })
    })
  }
}

module.exports = Product;
