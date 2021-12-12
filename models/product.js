// core modules
const fs = require("fs");
const path = require("path");

// local modules
const rootDir = require("../utils/path");

// path for data file
const p = path.join(rootDir, "data", "products.json");

// SIMPLY PRODUCES AN ARRAY AND CALLS CB WITH THAT ARRAY
// AND CALLS CB WITH ARRAY
const getProductsFromFile = (cb) => {
  // here cb is a callback function
  // here cb expects an array as an argument
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]); // passing an empty array
    } else {
      try {
        const parsedArray = JSON.parse(fileContent);
        cb(parsedArray); // passing an array with items
      } catch (error) {
        console.log("Error in file reading. Details: " + err);
        return cb([]); // passing an empty array
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

  save(res) {
    // products is the array of the objects which have been read from file
    getProductsFromFile((products) => {
      products.push(this); // pushes a new object into the array
      // the line below registers a callback function
      // when writing into file is done, callback function will be called
      const productsArray = JSON.stringify(products);
      fs.writeFile(p, productsArray, (err) => {
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
}

module.exports = Product;
