// THIRD-PARTY PACKAGES 
const express = require("express");

// "Product" CLASS
const Product = require("../models/product"); 

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {Function} next 
 * @returns {null}
 */
module.exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

module.exports.getProducts = (req, res, next) => {
  //  products IS AN ARRAY OF ITEMS/OBJECTS
  Product.fetchAll((products) => {
    res.render("admin/products", {
      path: "/admin/products",
      prods: products,
      pageTitle: "Admin Products",
    });
  });
};

/**
 * SAVES A PRODUCT INTO THE DATABASE / FILE
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, description, price);
  product.save(res);
  // res.redirect("/");
};
