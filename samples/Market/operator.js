
var simplebus = require('../..');

var client = simplebus.createClient(3000);

var operations = [ 'sale', 'buy' ];
var products = [ 'wheat', 'corn', 'soy', 'rice' ];

client.start(function() {
	postOperation();
});

function postOperation()
{
    var operation = createOperation();
    console.dir(operation);
    client.post(operation);
    setTimeout(postOperation, 1000);
}

function createOperation()
{
    return {
        operation: operations[getRandom(operations.length)],
        product: products[getRandom(products.length)],
        price: getRandom(1000)
    };
}

function getRandom(n)
{
	return Math.floor(Math.random() * n);
}

