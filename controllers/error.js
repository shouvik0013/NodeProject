const express = require("express");

module.exports.get404 = (req, res, next) => {
  // res.status(404).send('<h1>Requested page not found</h1>');
  res
    .status(404)
    .render("404", {
      pageTitle: "Page not found",
      path: "404",
      isAuthenticated: req.session.isLoggedIn,
    });
};

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {Function} next 
 */
module.exports.get500 = (req, res, next) => {
  res.render("500", {
    pageTitle: "Technical Error",
    path: "505",
    isAuthenticated: req.session.isLoggedIn
  })
}
