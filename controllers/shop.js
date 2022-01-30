const express = require("express");
const Product = require("../models/product"); // Product  is a class
const Order = require("../models/order");
const order = require("../models/order");

module.exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      //console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};
/**
 * Fetches the specific products &
 * displays the details of the product
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 * @returns {null}
 */
module.exports.getProduct = (req, res, next) => {
  /**
   *  @type {String}
   * GETTING productId FROM REQUEST URL
   */
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      //console.log("Details of the product -> ");
      //console.log(product);
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

/**
 * Fetches all products from database/file &
 * displays the products
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 * @returns {null}
 */
module.exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      //console.log(products);
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.prodId")
    .then((user) => {
      console.log("Products Array -> ");
      console.log(JSON.stringify(user, null, 2));
      const fetchedProducts = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        products: fetchedProducts,
        path: "/cart",
      });
    })
    .catch((err) => console.log(err));
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("PRODUCT SAVED INTO CART -> " + result);
      res.redirect("/cart");
    });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeProductFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.prodId")
    .then((user) => {
      console.log("USER CART DATA -> ");
      console.log(JSON.stringify(user.cart.items, null, 2));
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.prodId._doc },
        };
      });

      const newOrder = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products: products,
      });

      return newOrder.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

module.exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user })
    .then((orders) => {
      console.log("ORDER OF THE USER ->");
      console.log(JSON.stringify(orders, null, 2));
      return orders;
    })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your orders",
        path: "/orders",
        orders: orders,
      });
    });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 * @returns {null}
 */
module.exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
