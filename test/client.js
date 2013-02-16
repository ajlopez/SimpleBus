
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

exports['Client Subscribe to All Message'] = function(test) {
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


exports['Client Subscribe to Message with Property/Value'] = function(test) {
	var bus = simplebus.createBus();

    test.expect(4);
    
    var server = simplebus.createServer(bus, 3001);
        
    server.start();
    
    var client = simplebus.createClient(3001);
    
    client.start(function () {
        client.subscribe({ operation: 'sale' }, function (msg) {
            test.ok(msg);
            test.equal(msg.operation, 'sale');
            test.equal(msg.price, 20);
            test.equal(msg.quantity, 1);
            client.stop();
            server.stop();
            test.done();
        });
        
        bus.post({ operation: 'buy', price: 100, quantity: 10 });
        bus.post({ operation: 'sale', price: 20, quantity: 1 });
    });
}
