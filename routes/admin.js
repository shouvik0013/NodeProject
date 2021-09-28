const app = require('express');


const router = app.Router();

// path: /admin/add-product => 
router.get('/add-product', (req, res, next) => {
    console.log('In the 2nd middleware');
    res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

// path: /admin/product
router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});


module.exports = router;