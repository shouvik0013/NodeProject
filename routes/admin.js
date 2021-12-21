// CONTROLLERS
const adminController = require("../controllers/admin");
// THIRD PARTY MODULES
const express = require("express");

// CODE STARTS
const router = express.Router();

// PATH: /admin/add-product
router.get("/add-product", adminController.getAddProduct);
// PATH: /admin/products
router.get("/products", adminController.getProducts);

// PATH: /admin/product
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
