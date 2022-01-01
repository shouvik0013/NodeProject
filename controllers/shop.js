const express = require("express");
const Product = require("../models/product"); // Product  is a class
const Cart = require("../models/cart");

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
  Product.findById(prodId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
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
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }

      res.render("shop/cart", {
        pageTitle: "Your Cart",
        products: cartProducts,
        path: "/cart",
      });
    });
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  console.log("Product id -> " + productId);
  Product.findById(productId, (product) => {
    Cart.addProduct(product.id, Number(product.price));
  });
  res.redirect("/cart");
};

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {Function} next 
 */
module.exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  const redirectCallBack = () => {
    return res.redirect('/cart');
  }
  Product.findById(productId, (product) => {
    if (!product) {
      console.log('Failed to remove item from the cart');
      return res.redirect('/cart');
    }
    Cart.deleteProduct(product.id, product.price, redirectCallBack);
  })
}

module.exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
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

/*
  module.exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {

    for (prod of cart.products) {
      console.log('Product ID ' + prod.id + ' and qty ' + prod.qty);
    }

    Product.fetchAll((products) => {
      const productsInCart = products.filter((prod, index) => {
        const flag = false;
        for (let cartProd of cart.products) {
          if (cartProd.id == prod.id) {
            return flag = true
          }
        }
        return flag;
      });
    
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        products: productsInCart,
        path: "/cart",
      });
    })
  });
*/
