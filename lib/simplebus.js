
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
	
	this.subscribe = function(predicate, callback) {
		if (predicate && typeof predicate == 'object')
			predicate = makeObjectPredicate(predicate);
			
		subscriptions.push({ predicate: predicate, callback: callback });
		
		messages.forEach(function(msg) {
			if (predicate == null || predicate(msg)) callback(msg);
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

exports.createBus = function() { return new Bus(); }

