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
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

module.exports.getProducts = (req, res, next) => {
  const fetchAllHandler = (products) => {
    res.render("admin/products", {
      path: "/admin/products",
      prods: products,
      pageTitle: "Admin Products",
    });
  };
  Product.fetchAll(fetchAllHandler);
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 * @returns {null}
 */
module.exports.getEditProduct = (req, res, next) => {
  const editQuery = req.query.edit;
  let editMode = true;

  if (editQuery !== 'true') {
    editMode = false
  }

  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
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
