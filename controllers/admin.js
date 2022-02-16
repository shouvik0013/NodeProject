// THIRD-PARTY PACKAGES
const express = require("express");
const { validationResult } = require("express-validator/check");
const fileHelper = require("../utils/file");
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
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
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
  Product.find({ userId: req.user })
    .select("title imageUrl price _id description")
    .populate("userId", "name email")
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        path: "/admin/products",
        prods: products,
        pageTitle: "Admin Products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postEditProduct = (req, res, next) => {
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const productId = req.body.productId;
  const errors = validationResult(req);

  console.log(productId);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/add-product",
      editing: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        _id: productId,
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        fileHelper(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then((result) => {
        console.log("Result after updating a product -> " + result);
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/**
 * SAVES A PRODUCT INTO THE DATABASE
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  console.log("FROM postAddProduct. imageUrl ->");
  console.log(image);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: {
        title: title,
        price: price,
        description: description,
      },
      hasError: true,
      errorMessage: "Attached file is not an image",
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: {
        title: title,
        imageUrl: image.originalname,
        price: price,
        description: description,
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

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
    .catch((err) => {
      console.log("Database operation failed");
      // return res.status(500).render("admin/edit-product", {
      //   pageTitle: "Add Product",
      //   path: "/admin/add-product",
      //   editing: false,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description,
      //   },
      //   hasError: true,
      //   errorMessage: "Database operation failed, please try again!",
      //   validationErrors: []
      // });

      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/**
 * Deletes product from file/database &
 * if present in Cart also deletes the product
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findOne({_id: productId, userId: req.user})
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper(product.imageUrl);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then((result) => {
      // console.log("PRODUCT HAS BEEN DELETED");
      // console.log("RESULT OF DELETION -> " + result);
      // res.redirect("/admin/products");
      res.status(200).json({ message: "Success" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting product failed" });
    });
};
