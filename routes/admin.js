// local modules
const rootDir = require("../utils/path"); // supplies the dirname of app.js
const productsController = require("../controllers/products");

// third party modules
const express = require("express");

const router = express.Router();

// to store products data

/**
 *@type {Array.<Number>}
 */

// path: /admin/add-product
router.get("/add-product", productsController.getAddProduct);

// path: /admin/product
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
