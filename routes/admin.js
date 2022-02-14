// THIRD PARTY MODULES
const express = require("express");

// CONTROLLERS
const adminController = require("../controllers/admin");

const { body, check } = require("express-validator/check");

// CODE STARTS
const router = express.Router();

// Authentication middleware
const isAuth = require("../middleware/is-auth");

// PATH: /admin/add-product
router.get("/add-product", isAuth, adminController.getAddProduct);

// PATH: /admin/product
router.post(
  "/add-product",
  [
    body(
      "title",
      "Title must be at least 3 characters long and should contain only alphanumeric values"
    )
      .trim()
      .isString()
      .isLength({ min: 3, max: 40 }),
    body("price").isFloat().withMessage("Enter only decimal values"),
    body("description")
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage("Description must be at least 5 characters long"),
  ],
  isAuth,
  adminController.postAddProduct
);
// PATH: /admin/products
router.get("/products", isAuth, adminController.getProducts);

// PATH: /admin/edit-product/1231978
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// PATH: /admin/edit-product
router.post(
  "/edit-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3, max: 40 })
      .trim()
      .withMessage(
        "Title must be at least 3 characters long and should contain only alphanumeric values"
      ),
    body("price").isDecimal().withMessage("Enter only decimal values"),
    body("description")
      .isLength({ min: 5, max: 200 })
      .trim()
      .withMessage("Must be at least 5 characters long"),
  ],
  isAuth,
  adminController.postEditProduct
);

// PATH: /admin/delete-product
router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
