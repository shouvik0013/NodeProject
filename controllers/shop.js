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

module.exports.getCheckout = (res, req, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
