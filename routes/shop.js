// core modules
const path = require('path');

// third-party modules
const app = require('express');

// local modules
const rootDir = require('./../utils/path');

// here router is also kind of app or a pluggable app
const router = app.Router();

router.get('/', (req, res, next) => {
    // console.log('In the 2nd middleware');
    // res.send('<h1>This is the shopping page</h1>');
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});



module.exports = router;