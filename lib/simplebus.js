
function Bus() 
{
	var messages = [];
	var subscriptions = [];
	
	this.post = function(message) {
		messages.push(message);
		
		subscriptions.forEach(function(sub) {
			if (sub.predicate == null || sub.predicate(message))
				sub.callback(message);
		});
	}
	
	this.subscribe = function(callback, predicate) {
		subscriptions.push({ predicate: predicate, callback: callback });
		
		messages.forEach(function(msg) {
			if (predicate == null || predicate(msg)) callback(msg);
		});
	}
}

exports.createBus = function() { return new Bus(); }

