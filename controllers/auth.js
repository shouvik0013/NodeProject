const express = require("express");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { Schema, Types, SchemaType } = require("mongoose");
const { validationResult } = require("express-validator/check");

const User = require("../models/user");

const transport = nodeMailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);
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
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
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
  const error = validationResult(req);
  let fetchedUser;
  console.log(error.array());
  if (!error.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: error.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: error.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid credentials");
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: 'Invalid credentials',
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [{param: 'email'}],
        });
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
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: 'Invalid credentials',
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [{param: 'password'}],
        });
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
    errorMessage: msg,
    oldContent: { email: "", password: "", confirmPassword: "" },
    validationErrors: [],
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    /**
     * errors.array()
     * OUTPUT: [
                {
                  value: 'test',
                  msg: 'Invalid value',
                  param: 'email',
                  location: 'body'
                }
              ]
     */
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldContent: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
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
      return transport.sendMail({
        to: email,
        from: "shouvik0013@gmail.com",
        subject: "Signup completed",
        html: "<h1>You successfully signed up!</h1>",
      });
    })
    .catch((err) => {
      console.log("FROM SENDGRID -> " + err);
    });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.getReset = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  return res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: msg,
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
      res.redirect("/reset");
    }

    const token = buf.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No user found with provided email-id");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user
          .save()
          .then((result) => {
            res.redirect("/");
            return transport.sendMail({
              to: req.body.email,
              from: "shouvik0013@gmail.com",
              subject: "Request Password Reset",
              html: `
              <p>You requested password to reset</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset</p>
            `,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let msg = req.flash("error");
      if (msg.length > 0) {
        msg = msg[0];
      } else {
        msg = null;
      }

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: msg,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log("ERROR IN auth.js getNewPassword -> " + err);
    });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
module.exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let fetchedUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: Types.ObjectId(userId),
  })
    .then((user) => {
      fetchedUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      fetchedUser.password = hashedPassword;
      fetchedUser.resetToken = undefined;
      fetchedUser.resetTokenExpiration = undefined;
      return fetchedUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log("FROM auth.js postNewPassword -> " + err);
    });
};
