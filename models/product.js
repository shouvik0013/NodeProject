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
        console.log("Error in file reading. Details: " + err);
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
        const copyProducts = [...products];
        copyProducts[existingProductIndex] = this;

        const updatedProducts = copyProducts;

        const updatedProductsJsonString = JSON.stringify(updatedProducts);
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
          }
          console.log("Writing into file completed");
          res.redirect("/");
        });
      });
    }
  }

  /**
   * Fetch all the products from the database or file and
   * call cb with the products like cb(products)
   * @param {Function} cb
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


  /**
   * Deletes product with specified id, write the updated array to the file
   * and redirects to the '/admin/products'
   * @param {String} id 
   * @param {express.Response} res 
   */
  static deleteProductById(id, res) {
    const deleteProductHandler = (products) => {
      const indexOfProductToBeDeleted = products.findIndex((prod) => prod.id === id);
      const copyOfProducts = [...products];
      const deletedProduct = copyOfProducts.splice(indexOfProductToBeDeleted, 1);
      console.log( 'Deleted product is ' + deletedProduct);
      const updatedArrayOfProductsJsonString = JSON.stringify(copyOfProducts);

      // WRITING BACK THE UPDATED ARRAY TO THE FILE
      fs.writeFile(pathToProductsData, updatedArrayOfProductsJsonString, (err) => {
        if (err) {
          console.log(err);
          return res.redirect('/admin/products');
        }
        console.log('Writing into file is done');
        res.redirect('/admin/products');
      })
    };

    getProductsFromFile(deleteProductHandler);
  }
}
module.exports = Product;
