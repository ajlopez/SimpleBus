
var simplebus = require('../');

exports['Create Server, Client'] = function(test) {
	var bus = simplebus.createBus();
    var server = simplebus.createServer(bus, 3001);
    
    test.expect(0);
    
    server.start();
    
    var client = simplebus.createClient(3001);
    
    client.start(function () {
        client.stop();
        server.stop();
        test.done();
    });
}

exports['Post Message from Client to Server'] = function(test) {
	var bus = simplebus.createBus();

    test.expect(1);

	bus.subscribe(null, function(msg) {
		test.equal(msg, "foo");
        client.stop();
        server.stop();
		test.done();
	});
    
    var server = simplebus.createServer(bus, 3001);
        
    server.start();
    
    var client = simplebus.createClient(3001);
    
    client.start(function () {
        client.post("foo");
    });
}

exports['Client Subscribe'] = function(test) {
	var bus = simplebus.createBus();

    test.expect(1);
    
    var server = simplebus.createServer(bus, 3001);
        
    server.start();
    
    var client = simplebus.createClient(3001);
    
    client.start(function () {
        client.subscribe(null, function (msg) {
            test.equal(msg, "foo");
            client.stop();
            server.stop();
            test.done();
        });
        
        bus.post("foo");
    });
}
