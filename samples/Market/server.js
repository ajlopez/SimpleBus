
var simplebus = require('../..');

var bus = simplebus.createBus();
var server = simplebus.createServer(bus, 3000);

server.start();

console.log('Listening on port 3000');

