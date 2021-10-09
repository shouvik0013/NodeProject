// core modules
const path = require("path");

// third-party modules
const express = require("express");

// local modules
const rootDir = require("./../utils/path");
const adminData = require("./admin");
// const admin = require('./admin');

// here router is also kind of app or a pluggable app
const router = express.Router();

router.get("/", (req, res, next) => {
  // console.log('In the 2nd middleware');
  // res.send('<h1>This is the shopping page</h1>');
  let products = adminData.products;
  console.log("shop.js", products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
});

module.exports = router;
