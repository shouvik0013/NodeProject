const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address")
      .normalizeEmail(),
    body("password")
      .trim()
      .custom((value, { req }) => {
        if (value.length < 6) {
          throw new Error("Password is too short");
        }
        const regex = new RegExp(/[0-9]+/);
        if (!regex.test(value)) {
          throw new Error("Password must contain numerical values");
        }
        return true;
      }),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true;

        return User.findOne({ email: value }).then((user) => {
          console.log(
            "FROM routes.auth.js  User Object -> " +
              JSON.stringify(user, null, 2)
          );
          if (user) {
            console.log("FROM routes.auth.js user already exists");
            return Promise.reject(
              "EMAIL ALREADY EXISTS PLEASE USE DIFFERENT ONE"
            );
          }
        });
      }),
    body(
      "password",
      "Password must be at least 6 characters long and must be alphanumeric"
    )
      .trim()
      .isLength({ min: 6, max: 50 })
      .isAlphanumeric(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Two passwords do not match");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
