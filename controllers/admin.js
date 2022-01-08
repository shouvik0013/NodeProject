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
  });
};

module.exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
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
  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
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

  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        console.log("Product not found");
        return res.redirect("/");
      }

      // product.title = updatedTitle;
      // product.price = updatedPrice;
      // product.description = updatedDescription;
      // product.imageUrl = updatedImageUrl;

      product.update({
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        imageUrl: updatedImageUrl
      })

      // SAVING THE PRODUCT INTO THE DATABASE
      return product.save();
    })
    .then((result) => {
      console.log("Product is updated & saved to database");
      console.log("Returned result " + result);
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

  req.user
    .createProduct({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      UserId: req.user.id,
    })
    .then((result) => {
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
  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      console.log("PRODUCT DESTROYED");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
