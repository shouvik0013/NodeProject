// local modules
const rootDir = require("../utils/path"); // supplies the dirname of app.js
const adminController = require("../controllers/admin");

// third party modules
const express = require("express");

// coding starts form here
const router = express.Router();

// path: /admin/add-product
router.get("/add-product", adminController.getAddProduct);
// PATH: /admin/products
router.get("/products", adminController.getProducts);

// path: /admin/product
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
