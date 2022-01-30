// CONTROLLERS
const adminController = require("../controllers/admin");
// THIRD PARTY MODULES
const express = require("express");

// CODE STARTS
const router = express.Router();

// Authentication middleware
const isAuth = require("../middleware/is-auth");


// PATH: /admin/add-product
router.get("/add-product", isAuth, adminController.getAddProduct);

// PATH: /admin/product
router.post("/add-product", isAuth, adminController.postAddProduct);
// PATH: /admin/products
router.get("/products", isAuth, adminController.getProducts);


// PATH: /admin/edit-product/1231978
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// PATH: /admin/edit-product
router.post("/edit-product", isAuth, adminController.postEditProduct);

// PATH: /admin/delete-product
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
