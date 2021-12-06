// core modules
const fs = require("fs");
const path = require("path");

// local modules
const rootDir = require("../utils/path");

// path for data file
const p = path.join(rootDir, "data", "products.json");

// helper function which returns array of content objects
const getProductsFromFile = (cb) => {
  // here cb is a callback function
  // here cb expects an array as an argument
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]); // passing an empty array
    } else {
      try {
        cb(JSON.parse(fileContent)); // passing an array with items
      } catch (error) {
        console.log("Error in file reading. Details: " + err);
        return cb([]); // passing an empty array
      }
    }
  });
};

// CLASS DEFINITION
class Product {
  constructor(title) {
    this.title = title;
  }

  save(res) {
    // products is the array of the files which have been read
    getProductsFromFile((products) => {
      products.push(this); // pushes a new object into the array
      // the line below registers a callback function
      // when writing into file is done, callback function will be called
      fs.writeFile(p, JSON.stringify(products), (err) => {
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
