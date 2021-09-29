// core modules
const path = require('path');

// third-party modules
const express = require('express');
const bodyParser = require('body-parser');

// local modules
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./utils/path');


const app = express();

// parses the incoming message
app.use(bodyParser.urlencoded({extended: false}));
// exposes public folder publically, so we can directly access them
app.use(express.static(path.join(rootDir, 'public')));

// adminRoutes is also a valid middleware
app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    // res.status(404).send('<h1>Requested page not found</h1>');
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
})

// here app is also a valid request handler
// const server = http.createServer(app);

// server.listen(3000);

app.listen(3000);