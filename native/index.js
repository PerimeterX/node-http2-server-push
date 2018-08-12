const Http2 = require('http2');
const Https = require('https');
const { certificate, getFiles, getFileHttp1 } = require('../shared');

const { HTTP2_HEADER_PATH } = Http2.constants

const onRequestHttp1 = (req, res) => {
    const file = getFileHttp1(req.url)
    res.writeHead(200, { 'Content-Type': file.contentType });
    res.end(file.content, 'utf-8');
}

const files = getFiles();

const onRequestHttp2 = (req, res) => {
    const reqPath = req.url === '/' ? '/index.html' : req.url
    const file = files.get(reqPath)

    if (reqPath === '/index.html') {
        for(let i = 1; i <= 100; i++) {
            push(res.stream, `/pxlogo${i}.png`)
        }
    }
    res.stream.respondWithFD(file.fileDescriptor, file.headers)
}

const push = (stream, path) => {
    const file = files.get(path)
    stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (err, pushStream) => {
      pushStream.respondWithFD(file.fileDescriptor, file.headers)
    })
  }

Https.createServer(certificate, onRequestHttp1).listen(3001, 'localhost', () => {
    Http2.createSecureServer(certificate, onRequestHttp2).listen(3000, 'localhost', () => {
        console.log(`Native running at https://localhost:3000`)
    });
});
