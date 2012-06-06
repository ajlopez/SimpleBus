
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
	bus.subscribe(null, function(msg) {
		test.equal(msg, "foo");
		test.done();
	});
}

exports['Subscribe and Post Message'] = function(test) {
	test.expect(1);
	var bus = simplebus.createBus();
	bus.subscribe(null, function(msg) {
		test.equal(msg, "foo");
		test.done();
	});
	bus.post("foo");
}

exports['Subscribe with Predicate and Post Message'] = function(test) {
	test.expect(1);
	var bus = simplebus.createBus();
	bus.subscribe(function(msg) { return msg == "foo" }, function(msg) {
		test.equal(msg, "foo");
		test.done();
	} );
	bus.post("bar");
	bus.post("bazinga");
	bus.post("foo");
}

exports['Subscribe with Object Example and Post Message'] = function(test) {
	test.expect(2);
	var bus = simplebus.createBus();
	bus.subscribe({ topic: "foo" }, function(msg) {
		test.equal(msg.topic, "foo");
		test.equal(msg.amount, 3000);
		test.done();
	});
	bus.post({ topic: "bar", amount: 1000});
	bus.post({ topic: "bar", amount: 2000});
	bus.post({ topic: "foo", amount: 3000});
}

