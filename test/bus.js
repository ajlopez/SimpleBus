
var simplebus = require('../');

exports['Create Bus'] = function(test) {
	var bus = simplebus.createBus();
	test.ok(bus);
    test.done();
}
