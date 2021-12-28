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

// PRODUCES AN ARRAY AND CALLS "cb" WITH THAT ARRAY
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
   * @param {express.Response} res
   * SAVES THE CURRENT OBJECT AND REDIRECTS TO "/"
   */
  save(res) {
    // GENERATING UNIQUE-ID
    this.id = generateUniqueId({ length: 10, useLetters: false });
    // products -> ARRAY OF OBJECTS
    getProductsFromFile((products) => {
      products.push(this); // PUSHES CURRENT OBJECT TO THE ARRAY

      // CONVERTING products INTO JSON STRING
      const productsArrayJsonString = JSON.stringify(products);
      // WRITING BACK THE UPDATED ARRAY INTO DISK
      fs.writeFile(pathToProductsData, productsArrayJsonString, (err) => {
        
        if (err) {
          console.log(err);
        }
        console.log("Writing into file completed");
        res.redirect("/");
      });
    });
  }

  static fetchAll(cb) {
    // "cb" IS A callback
    getProductsFromFile(cb);
  }

  /**
   * FINDS THE PRODUCT WITH THE SPECIFIC ID
   * AND CALL cb WITH THE PRODUCT
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
}

module.exports = Product;
