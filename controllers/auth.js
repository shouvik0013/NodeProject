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
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: msg,
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let fetchedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid credentials");
        return res.redirect("/login");
      }
      fetchedUser = user;
      return bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = fetchedUser;
          return req.session.save((err) => {
            if (err) {
              console.log("ERROR IN SAVING SESSION");
            }
            res.redirect("/");
          });
        }
        req.flash("error", "Invalid credentials");
        res.redirect("/login");
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
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: msg
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
        req.flash("error", "EMAIL ALREADY EXISTS PLEASE USE DIFFERENT ONE");
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
