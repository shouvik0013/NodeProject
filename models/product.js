// core modules
const fs = require("fs");
const path = require("path");

// local modules
const rootDir = require("../utils/path");

// path for data file
const p = path.join(rootDir, "data", "products.json");

// helper function
const getProductsFromFile = (cb) => {
  // here cb is a callback function
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

// Class definition
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log("Writing into file");
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static fetchAll(cb) {
    // cb is a callback function
    getProductsFromFile(cb);
  }
};
