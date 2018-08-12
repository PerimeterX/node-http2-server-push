const Express = require('express');
const Spdy = require('spdy');
const Https = require('https');
const { certificate, getFiles, getFileHttp1 } = require('../shared');

const http1app = Express();
http1app.use(Express.static('assets'));

const http2app = Express();
http2app.use((req, res) => {
    const reqPath = req.url === '/' ? '/index.html' : req.url
    if (req.url === '/') {
        for(let i = 1; i <= 100; i++) {
            const assetPath = `/pxlogo${i}.png`;
            const file = getFileHttp1(assetPath);
            const stream = res.push(assetPath, {
                request: { accept: '*/*' },
                response: { 'content-type': file.contentType }
            });
            stream.end(file.content)
        }
    }
    const file = getFileHttp1(reqPath)
    res.writeHead(200, { 'Content-Type': file.contentType });
    res.end(file.content, 'utf-8');
});

Https.createServer(certificate, http1app).listen(3001, 'localhost', () => {
    Spdy.createServer(certificate, http2app).listen(3000, 'localhost', () => {
        console.log(`Express running at https://localhost:3000`)
    });
});
