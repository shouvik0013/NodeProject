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
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      try {
        cb(JSON.parse(fileContent));
      } catch (error) {
        console.log("Error in file reading. Details: " + err);
        return cb([]);
      }
    }
  });
};

// CLASS DEFINITION
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save(res) {
    // products is the array of the files which have been read
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log("Writing into file");
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
};
