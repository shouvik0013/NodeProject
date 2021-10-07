// core modules
const path = require('path');


// local modules
const rootDir = require('../utils/path');   // supplies the dirname of app.js

// third party modules
const express = require('express');


const router = express.Router();

// to store products data
const products = [];


// path: /admin/add-product 
router.get('/add-product', (req, res, next) => {
    // console.log('In the 2nd middleware');
    // res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// path: /admin/product
router.post('/add-product', (req, res, next) => {
    // console.log(req.body);
    products.push({title: req.body.title});
    res.redirect('/');
});


module.exports = {
    routes: router,
    products: products
}