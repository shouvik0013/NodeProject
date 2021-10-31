const Product = require("../models/product"); // Product holds a class

module.exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true,
    });
};

module.exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect("/");
};

module.exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render("shop", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
            hasProducts: products.length > 0 ? true : false,
            activeShop: true,
            productCSS: true,
        });
    });
};
