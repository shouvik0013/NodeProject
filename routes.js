const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;


    if(url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Message Input</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="txtMessage"><button type="submit">Send</button></form></body>');
        return res.write('</html>');
    }

    if(url === '/message' && method === 'POST') {

        const body = [];

        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log(parsedBody);
            // fs.writeFileSync('message.txt', message);
            fs.writeFile('message.txt', message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            })
            
        });

        
    }

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Server Response</title></head>');
    res.write('<body><h1>First Response From The Node Server</h1></body>');
    res.write('</html>');
    res.end();
}


module.exports = requestHandler;


    