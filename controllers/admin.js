const Product = require("../models/product"); // Product is a class

// ACTS LIKE MIDDLEWARE FUNCTION
module.exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

module.exports.getProducts = (req, res, next) => {
  // here products is an array
  Product.fetchAll((products) => {
    res.render("admin/products", {
      path: "/admin/products",
      prods: products,
      pageTitle: "Admin Products",
    });
  });
};

module.exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, description, price);
  product.save(res);
  // res.redirect("/");
};
