"use strict";
import {Server} from './server.js';
process.env.TZ = 'Europe/London'
let server = new Server().app;
let port = process.env.PORT || 5300;
server.listen(port, () => {
    console.log('server is running on', port);
});



