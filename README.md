# node-http2-server-push-example
As explained at [this meetup](https://www.meetup.com/NodeJS-Israel/events/250058149). (blogpost link will be linked on near future).

1. remember to create your secure certificate if you don't have one. (if you are testing on localhost, take a look [here](certificate/how-to-create-localhost-certificate.md)).
2. `npm i`
3. start your desired server!
    - for native server:
        ```
        node native/index.js
        ```
    - for koa server:
        ```
        node koa/index.js
        ```
    - for hapi server:
        ```
        node hapi/index.js
        ```
    - for express server:

        1. run once:
        ```
        node express/fix-spdy.js
        ```
        2. run:
        ```
        node express/spdy.js
        ```

also, take a look at chrome DevTools to investigate the network traffic, and I also recomment you to look at `chrome://net-internals/#http2` (both on Chrome browser).

For any issues/questions/improvements/enhancements - open an issue/PR :)
