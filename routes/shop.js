// core modules
const path = require("path");

// third-party modules
const express = require("express");

// local modules
const productsController = require("../controllers/products");

// here router is also kind of app or a pluggable app
const router = express.Router();

router.get("/", productsController.getProducts);

module.exports = router;
