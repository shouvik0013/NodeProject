/* CORE MODULES */
const path = require("path");

/* THIRD PARTY MODULES */
const express = require("express");

/* LOCAL MODULES */
const shopController = require("../controllers/shop");
const { route } = require("./admin");
const isAuth = require("../middleware/is-auth");

// router is also kind of app or a pluggable app
const router = express.Router();

// PATH: /
router.get("/", shopController.getIndex);
// PATH: /products
router.get("/products", shopController.getProducts);

// PATH: /products/874729902
router.get("/products/:productId", shopController.getProduct);

// PATH: /cart
router.get("/cart", isAuth, shopController.getCart);
// PATH: /cart
router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

router.post("/create-order", isAuth, shopController.postOrder);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
