
function Bus() 
{
	var messages = [];
	
	this.post = function(message) {
		messages.push(message);
	}
}

exports.createBus = function() { return new Bus(); }

