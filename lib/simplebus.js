
var simpleremote = require('simpleremote'),
    simplefunc = require('simplefunc');

function Bus(size) 
{
	var messages = [];
	var subscriptions = [];
	
	this.post = function(message) {
		messages.push(message);
        
        if (size && messages.length > size)
            messages.shift();
        
		subscriptions.forEach(function(sub) {
			if (sub.predicate == null || sub.predicate(message))
				setImmediate(function() { sub.callback(message)});
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

function RemoteServer(bus, clients) {
    this.post = function (msg) {
        bus.post(msg);
    }
    
    this.subscribe = function (predicate, clientid, subid) {
        bus.subscribe(simplefunc.decode(predicate), function(msg) {
            clients[clientid].post(msg, subid);
        });
    }
}

function Server(bus, port, host) {
    var server;
    var clients = [];
    var nclient = 0;
    
    this.start = function () {
        server = simpleremote.createRemoteServer(new RemoteServer(bus, clients));

        server.on('remote', function (newclient) {
            var id = ++nclient;
            registerClient(id, newclient);
            newclient.setId(id);
        });

        server.listen(port, host);
    }
    
    this.stop = function () {
        if (server) {
            server.close();
            server = null;
        }
    }
    
    function registerClient(id, client) {
        clients[id] = client;
    }
    
    function unregisterClient(id) {
        delete clients[id];
    }
}

function RemoteClient(fn, callbacks)
{
    this.setId = function (id) {
        this.id = id;
        if (fn)
            fn();
    }
    
    this.post = function (msg, subid) {
        callbacks[subid].apply(null, [msg]);
    }
}

function Client(port, host) {
    var client;
    var remoteclient;
    var remotebus;
    var callbacks = [];
    var ncallback = 0;
    
    this.start = function (fn) {
        remoteclient = new RemoteClient(fn, callbacks);
        client = simpleremote.createRemoteClient(remoteclient);
        client.on('remote', function (bus) {
            remotebus = bus;
        });
        client.on('error', function (err) {
            fn(err);
        });
        client.connect(port, host);
    }
    
    this.post = function (msg, cb) {
        remotebus.post(msg, function (err, result) {
            if (cb) cb(err, result);
        });
    }
    
    this.stop = function () {
        if (client) {
            client.end();
            client = null;
        }
    }
    
    this.subscribe = function (predicate, callback) {
        var subid = ++ncallback;
        callbacks[subid] = callback;        
        remotebus.subscribe(simplefunc.encode(predicate), remoteclient.id, subid);
        return subid;
    }
}

exports.createBus = function(size) { return new Bus(size); }

exports.createServer = function (bus, port, host) { return new Server(bus, port, host); }

exports.createClient = function (port, host) { return new Client(port, host); }