const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.getLogin = (req, res, next) => {
  // console.log("Cookie -> ");
  // console.log(req.get("Cookie").split(";")[1].trim().split("=")[1]);
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1] === "true";
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postLogin = (req, res, next) => {
  User.findById("61effb32665b359e46125cf6")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true; // here session is actually being stored
      // into mongodb, so depending on the situation it takes some time to write it back
      // to mongodb
      req.session.save((err) => {
        if (err) {
          console.log("ERROR IN SAVING SESSION INTO DATABASE");
        }
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error in logout -> " + err);
    }
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return newUser.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })

    .catch((err) => {
      console.log("ERROR IN auth.postSignup");
    });
};
