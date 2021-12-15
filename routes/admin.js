/* LOCAL MODULES */

// UTILS
const rootDir = require("../utils/path"); // supplies the dirname of app.js
// CONTROLLERS
const adminController = require("../controllers/admin");

// third party modules
const express = require("express");

// CODES STARTS 
const router = express.Router();

// PATH: /admin/add-product
router.get("/add-product", adminController.getAddProduct);
// PATH: /admin/products
router.get("/products", adminController.getProducts);

// PATH: /admin/product
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
