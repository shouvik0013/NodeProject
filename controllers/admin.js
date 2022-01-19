// THIRD-PARTY PACKAGES
const express = require("express");
const mongodb = require("mongodb");

// "Product" CLASS
const Product = require("../models/product");

/**
 * Renders the AddProduct Page
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 * @returns {null}
 */
module.exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

/**
 * Fetches all products from database and
 * renders them to the page
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        path: "/admin/products",
        prods: products,
        pageTitle: "Admin Products",
      });
    })
    .catch((err) => console.log(err));
};

/**
 * Edits a product and saves it into file
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 * @returns {null}
 */
module.exports.getEditProduct = (req, res, next) => {
  const editQuery = req.query.edit;
  let editMode = true;

  if (editQuery !== "true") {
    editMode = false;
  }

  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;
  // Product.findByPk(productId)
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        console.log("No product found");
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
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
module.exports.postEditProduct = (req, res, next) => {
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const productId = req.body.productId;
  const updatedProduct = new Product(
    updatedTitle,
    updatedDescription,
    updatedImageUrl,
    updatedPrice,
    productId
  )
  updatedProduct.save()
    .then((result) => {
      // console.log("Returned result " + result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

/**
 * SAVES A PRODUCT INTO THE DATABASE
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, description, imageUrl, price);
  product
    .save()
    .then((result) => {
      console.log(result);
      console.log("Product saved");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

/**
 * Deletes product from file/database &
 * if present in Cart also deletes the product
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then((result) => {
      console.log("PRODUCT DESTROYED");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
