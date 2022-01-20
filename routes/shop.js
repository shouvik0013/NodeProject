/* CORE MODULES */
const path = require("path");

/* THIRD PARTY MODULES */
const express = require("express");

/* LOCAL MODULES */
const shopController = require("../controllers/shop");
const { route } = require("./admin");

// router is also kind of app or a pluggable app
const router = express.Router();

// PATH: /
router.get("/", shopController.getIndex);
// PATH: /products
router.get("/products", shopController.getProducts);

// PATH: /products/874729902
router.get("/products/:productId", shopController.getProduct);

// PATH: /cart
router.get("/cart", shopController.getCart);
// PATH: /cart
router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

// router.get("/orders", shopController.getOrders);

router.post("/create-order", shopController.postOrder);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
