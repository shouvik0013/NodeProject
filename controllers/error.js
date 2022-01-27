module.exports.get404 = (req, res, next) => {
  // res.status(404).send('<h1>Requested page not found</h1>');
  res
    .status(404)
    .render("404", {
      pageTitle: "Page not found",
      path: "404",
      isAuthenticated: req.isLoggedIn,
    });
};
