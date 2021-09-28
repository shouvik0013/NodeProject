const app = require('express');

// here router is also kind of app or a pluggable app
const router = app.Router();

router.get('/', (req, res, next) => {
    console.log('In the 2nd middleware');
    res.send('<h1>This is the shopping page</h1>');
});



module.exports = router;