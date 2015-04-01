
var simplebus = require('../');

exports['Create Bus'] = function(test) {
	var bus = simplebus.createBus();
	test.ok(bus);
    test.done();
}

exports['Post Message and Subscribe'] = function(test) {
	test.async();
	var bus = simplebus.createBus();
	bus.post("foo");
	bus.subscribe(null, function(msg) {
		test.equal(msg, "foo");
		test.done();
	});
}

exports['Subscribe and Post Message'] = function(test) {
	test.async();
	var bus = simplebus.createBus();
	bus.subscribe(null, function(msg) {
		test.equal(msg, "foo");
		test.done();
	});
	bus.post("foo");
}

exports['Subscribe with Predicate and Post Message'] = function(test) {
	test.async();
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
	test.async();
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

exports['Subscribe with Object Example containing Property Predicate and Post Message'] = function(test) {
	test.async();
	var bus = simplebus.createBus();
	bus.subscribe({
			topic: "foo",
			amount: function(amount) { return amount > 9000; }
		}, 
		function(msg) {
			test.equal(msg.topic, "foo");
			test.equal(msg.amount, 10000);
			test.done();
		});
	bus.post({ topic: "bar", amount: 1000});
	bus.post({ topic: "bar", amount: 2000});
	bus.post({ topic: "foo", amount: 3000});
	bus.post({ topic: "foo", amount: 4000});
	bus.post({ topic: "foo", amount: 9000});
	bus.post({ topic: "foo", amount: 10000});
}

exports['Subscribe with Object Example containing Property Predicate and Post Two Messages'] = function(test) {
	test.async();
	var bus = simplebus.createBus();
	bus.subscribe({
			topic: "foo",
			amount: function(amount) { return amount > 9000; }
		}, 
		function(msg) {
			test.equal(msg.topic, "foo");
			test.ok(msg.amount > 9000);
            if (msg.amount == 12000)
                test.done();
		});
	bus.post({ topic: "bar", amount: 1000});
	bus.post({ topic: "bar", amount: 2000});
	bus.post({ topic: "foo", amount: 3000});
	bus.post({ topic: "foo", amount: 4000});
	bus.post({ topic: "foo", amount: 9000});
	bus.post({ topic: "foo", amount: 10000});
	bus.post({ topic: "foo", amount: 12000});
}

exports['Create bus with size'] = function(test) {
	test.async();
	var bus = simplebus.createBus(2);
    
    for (var k = 1; k <= 4; k++)
      	bus.post({ topic: "bar", amount: 1000 * k});
        
    var total = 0;

	setImmediate(function () { bus.subscribe({
			topic: "bar"
		}, 
		function(msg) {            
			test.equal(msg.topic, "bar");
			test.ok(msg.amount >= 1000);
            total += msg.amount;
            if (total == 3000 + 4000)
                test.done();
		})
        });
}
