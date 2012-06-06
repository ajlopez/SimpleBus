
var simplebus = require('../');

exports['Create Bus'] = function(test) {
	var bus = simplebus.createBus();
	test.ok(bus);
    test.done();
}

exports['Post Message and Subscribe'] = function(test) {
	test.expect(1);
	var bus = simplebus.createBus();
	bus.post("foo");
	bus.subscribe(function(msg) {
		test.equal(msg, "foo");
		test.done();
	});
}

exports['Subscribe and Post Message'] = function(test) {
	test.expect(1);
	var bus = simplebus.createBus();
	bus.subscribe(function(msg) {
		test.equal(msg, "foo");
		test.done();
	});
	bus.post("foo");
}

