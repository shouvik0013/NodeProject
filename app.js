const path = require('path');


const express = require('express');
const bodyParser = require('body-parser');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


const app = express();


app.use(bodyParser.urlencoded({extended: false}));

// adminRoutes is also a valid middleware
app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    // res.status(404).send('<h1>Requested page not found</h1>');
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

// here app is also a valid request handler
// const server = http.createServer(app);

// server.listen(3000);

app.listen(3000);