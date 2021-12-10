// core modules
const path = require("path");

// third-party modules
const express = require("express");

// local modules
const shopController = require("../controllers/shop");

// here router is also kind of app or a pluggable app
const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", shopController.getCart);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
