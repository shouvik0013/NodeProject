// CONTROLLERS
const adminController = require("../controllers/admin");
// THIRD PARTY MODULES
const express = require("express");

// CODE STARTS
const router = express.Router();

// PATH: /admin/add-product
router.get("/add-product", adminController.getAddProduct);
// PATH: /admin/product
router.post("/add-product", adminController.postAddProduct);
// // PATH: /admin/products
// router.get("/products", adminController.getProducts);


// // PATH: /admin/edit-product/1231978
// router.get("/edit-product/:productId", adminController.getEditProduct);

// // PATH: /admin/edit-product
// router.post("/edit-product", adminController.postEditProduct);

// // PATH: /admin/delete-product
// router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
