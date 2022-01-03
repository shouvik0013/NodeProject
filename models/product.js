
// THIRD PARTY MODULES
const express = require("express");

// LOCAL MODULES
const generateUniqueId = require("generate-unique-id");
const db = require('../utils/database');
const Cart = require('./cart');





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
    
  }

  /**
   * Returns a Promise of fetched data from database
   * @returns {Promise}
   */
  static fetchAll() {
    return db.execute('SELECT * FROM products;'); 
    // db.excute() RETURNS A PROMISE
  }

  
  static findById(id) {
    
  }

  static deleteById(id) {
    
  }
}

module.exports = Product;
