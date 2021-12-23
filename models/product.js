// CORE MODULES
const fs = require("fs");
const path = require("path");

// THIRD PARTY MODULES
const express = require("express");

// LOCAL MODULES
const rootDir = require("../utils/path");
const generateUniqueId = require("generate-unique-id");

// PATH TO DATA FILE
const pathToProductsData = path.join(rootDir, "data", "products.json");

// PRODUCES AN ARRAY AND CALLS CB WITH THAT ARRAY
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
        console.log("Error in file reading. Details: " + err);
        return cb([]); // PASSING EMPTY ARRAY AS ARGUMENT
      }
    }
  });
};

// CLASS DEFINITION
class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  /**
   *
   * @param {Express.Response} res
   * SAVES THE CURRENT OBJECT AND REDIRECTS TO "/"
   */
  save(res) {
    // GENERATING UNIQUE-ID
    this.id = generateUniqueId({ length: 10, useLetters: false });
    // products -> ARRAY OF OBJECTS
    getProductsFromFile((products) => {
      
      products.push(this); // PUSHES CURRENT OBJECT TO THE ARRAY
      
      // CONVERTING products INTO JSON STRING
      const productsArray = JSON.stringify(products);
      // WRITING BACK THE UPDATED ARRAY INTO DISK
      fs.writeFile(pathToProductsData, productsArray, (err) => {
        console.log("Writing into file completed");
        if (err) {
          console.log(err);
        }
        res.redirect("/");
      });
    });
  }

  static fetchAll(cb) {
    // cb is a callback function
    getProductsFromFile(cb);
  }

  /**
   *
   * @param {String} id
   * @param {Function} cb
   * FINDS THE PRODUCT WITH THE SPECIFIC ID
   * AND CALL cb WITH THE PRODUCT
   */
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const productWithPassedId = products.find((product, index) => {
        if (product.id === id) return true;
        return false;
      });
      cb(productWithPassedId);
    });
  }
}

module.exports = Product;
