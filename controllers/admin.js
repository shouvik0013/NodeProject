// THIRD-PARTY PACKAGES
const express = require("express");

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
    isAuthenticated: req.session.isLoggedIn
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
  Product.find({userId: req.user})
    .select("title imageUrl price _id description")
    .populate("userId", "name email")
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        path: "/admin/products",
        prods: products,
        pageTitle: "Admin Products",
        isAuthenticated: req.session.isLoggedIn
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
        isAuthenticated: req.session.isLoggedIn
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

  Product.findById(productId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("Result after updating a product -> " + result);
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

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      console.log("PRODUCT CREATED -> " + result);
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
  Product.findByIdAndRemove(productId)
    .then((result) => {
      console.log("PRODUCT HAS BEEN DELETED");
      console.log("RESULT OF DELETION -> " + result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
