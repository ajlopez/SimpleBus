
var simplebus = require('../..'),
    sargs = require('simpleargs');

var client = simplebus.createClient(3000);
sargs.define('p', 'product', null, 'Product to subscribe');
sargs.define('o', 'operation', null, 'Operation to subscribe');
var options = sargs.process(process.argv);

client.start(function() {
    client.subscribe(options, function(msg) {
        console.dir(msg);
    });
});

