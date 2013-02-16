
var simpleremote = require('simpleremote');

function Bus() 
{
	var messages = [];
	var subscriptions = [];
	
	this.post = function(message) {
		messages.push(message);
		
		subscriptions.forEach(function(sub) {
			if (sub.predicate == null || sub.predicate(message))
				process.nextTick(function() { sub.callback(message)});
		});
	}
	
	this.subscribe = function(predicate, callback) {
		if (predicate && typeof predicate == 'object')
			predicate = makeObjectPredicate(predicate);
			
		subscriptions.push({ predicate: predicate, callback: callback });
		
		messages.forEach(function(msg) {
			if (predicate == null || predicate(msg)) 
                process.nextTick(function() { callback(msg); });
		});
	}
}

function makeObjectPredicate(obj)
{
	return function(msg) {
		for (var name in obj)
			if (typeof obj[name] == 'function') {
				if (!obj[name](msg[name],msg))
					return false;
			}
			else if (msg[name] != obj[name])
				return false;
				
		return true;
	};
}

function Server(bus, port, host) {
    var server;
    
    this.start = function () {
        server = simpleremote.createRemoteServer(bus);
        server.listen(port, host);
    }
    
    this.stop = function () {
        if (server) {
            server.close();
            server = null;
        }
    }
}

function Client(port, host) {
    var client;
    var remote;
    
    this.start = function (fn) {
        client = simpleremote.createRemoteClient();
        client.on('remote', function (bus) {
            remote = bus;
            if (fn)
                fn();
        });
        client.connect(port, host);
    }
    
    this.post = function (msg, cb) {
        remote.post(msg, function (err, result) {
            if (cb) cb(err, result);
        });
    }
    
    this.stop = function () {
        if (client) {
            client.end();
            client = null;
        }
    }
}

exports.createBus = function() { return new Bus(); }

exports.createServer = function (bus, port, host) { return new Server(bus, port, host); }

exports.createClient = function (port, host) { return new Client(port, host); }