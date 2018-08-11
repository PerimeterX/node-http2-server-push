const Http2 = require('http2');
const Https = require('https');
const Koa = require('koa');
const Static = require('koa-static')
const { certificate, getFiles } = require('../shared');

const { HTTP2_HEADER_PATH } = Http2.constants

const http1app = new Koa();
http1app.use(Static('assets'));

const files = getFiles();

const http2app = new Koa();
http2app.use(async (ctx, next) => {
    const reqPath = ctx.url === '/' ? '/index.html' : ctx.url
    const file = files.get(reqPath)

    if (reqPath === '/index.html') {
        for(let i = 1; i <= 100; i++) {
            push(ctx.res.stream, `/logosmall${i}.png`)
        }
    }
    ctx.res.stream.respondWithFD(file.fileDescriptor, file.headers)
});

const push = (stream, path) => {
    const file = files.get(path)
    stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (err, pushStream) => {
      pushStream.respondWithFD(file.fileDescriptor, file.headers)
    })
  }

Https.createServer(certificate, http1app.callback()).listen(3001, 'localhost', () => {
    Http2.createSecureServer(certificate, http2app.callback()).listen(3000, 'localhost', () => {
        console.log(`Koa running at https://localhost:3000`)
    });
});
