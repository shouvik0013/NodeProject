// local modules
const rootDir = require("../utils/path"); // supplies the dirname of app.js
const productsController = require("../controllers/products");

// third party modules
const express = require("express");

// coding starts form here
const router = express.Router();


// path: /admin/add-product
router.get("/add-product", productsController.getAddProduct);

// path: /admin/product
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
