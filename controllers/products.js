const Product = require("../models/product"); // Product holds a class

module.exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
  });
};

module.exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save(res);
  // res.redirect("/");
};

module.exports.getProducts = (req, res, next) => {
  // here we pass an arrow function as an argument
  Product.fetchAll((products) => {
    // body of the arrow function
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0 ? true : false,
      activeShop: true,
      productCSS: true,
    });
  });
};
