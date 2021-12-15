/* CORE MODULES */
const path = require("path");

/* THIRD PARTY MODULES */
const express = require("express");

/* LOCAL MODULES */
const shopController = require("../controllers/shop");

// router is also kind of app or a pluggable app
const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
