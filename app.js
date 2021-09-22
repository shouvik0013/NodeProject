const http = require('http');


const express = require('express');


const app = express();

app.use((req, res, next) => {
    console.log('In the first middleware');
    next();
});

app.use((req, res, next) => {
    console.log('In the 2nd middleware')
})


// here app is also a valid request handler
const server = http.createServer(app);

server.listen(3000);