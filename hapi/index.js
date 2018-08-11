const Https = require('https');
const Http2 = require('http2');
const Hapi = require('hapi');
const Inert = require('inert');
const Underdog = require('underdog');
const { certificate } = require('../shared');

const imagesHandler = {
    method: 'get',
    path: '/{param*}',
    handler: { directory: { path: 'assets' } }  
};

const getHttp1Server = async () => {
    const server = Hapi.server({
        tls: true,
        port: 3001,
        listener: Https.createServer(certificate)
    });
    await server.register(Inert);
    server.route([imagesHandler]);
    return server;
}

const getHttp2Server = async () => {
    const server = Hapi.server({
        tls: true,
        port: 3000,
        listener: Http2.createSecureServer(certificate)
    });

    await server.register(Inert);
    await server.register(Underdog);
    server.route([
        {
            method: 'get',
            path: '/',
            handler: (request, h) => {
                const response = h.file('assets/index.html');
                for(let i=1; i<=100; i++) {
                    h.push(response, `/logosmall${i}.png`);
                }
                return response;
            }
        },
        {
            ...imagesHandler,
            config: { isInternal: true } //To demonstrate that it must have been pushed, not requested directly
        },
    ]);

    return server;
}

(async () => {
    const http1Server = await getHttp1Server();
    const http2Server = await getHttp2Server();
    await http1Server.start();
    await http2Server.start();
    console.log(`Hapi running at https://localhost:3000`);
})();
