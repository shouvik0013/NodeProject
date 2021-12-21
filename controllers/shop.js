const express = require('express');
const Product = require("../models/product"); // Product  is a class

module.exports.getProducts = (req, res, next) => {
  // here we pass an arrow function as an argument
  // products is an array of objects
  
  Product.fetchAll((products) => {
    // body of the arrow function
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {Function} next 
 */
module.exports.getProduct = (req, res, next) => {
  /**
   *  @type {String} 
   * GETTING productId FROM REQUEST URL
  */
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    const productTitle = product.title;
    res.render('shop/product-detail', {
      product: product,
      pageTitle: productTitle,
      path: '/products'
    })
  })
}

module.exports.getIndex = (req, res, next) => {
  // products is an array of objects
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

module.exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
  });
};

module.exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

module.exports.getCheckout = (res, req, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
