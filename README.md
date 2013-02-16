# SimpleBus

Simple Service Bus implementation, for Node.js.

## Installation

Via npm on Node:

```
npm install simplebus
```

## Usage

Reference in your program:

```js
var simplebus = require('simplebus');
```

Create a local message bus:
```js
var bus = simplebus.createBus();
```

Send a message to local bus:
```js
bus.post("foo");
bus.post({ operation: 'sale', price: 100, quantity: 10 });
```

Subscribe to a message
```js
// to all message
bus.subscribe(null, function (msg) { ... });
// to messages with property operation === 'sale'
bus.subscribe({ operation: 'sale' }, function(msg) { ... });
// to messages that satisfy a predicate
bus.subscribe(function (msg) { return msg.price < 100; }, function(msg) { ... });
```

Expose a bus as a server:
```js
var server = simplebus.createServer(bus, port, [host]);
server.start();
///
server.stop();
```

Consume as a client:
```js
var client = simplebus.createClient(port, [host]);
client.start(function () {
	client.post("foo");
	client.subscribe(function (msg) { return msg.price > 100 }, function (msg) { .... });
});
///
client.stop();
```

## Development

```
git clone git://github.com/ajlopez/SimpleBus.git
cd SimpleBus
npm install
npm test
```

## Samples

TBD

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleBus) and submit
[pull requests](https://github.com/ajlopez/SimpleBus/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

(Thanks to [JSON5](https://github.com/aseemk/json5) by [aseemk](https://github.com/aseemk). 
This file is based on that project README.md).