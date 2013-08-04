# Market sample

## Run

Start the server process in one terminal:
```
node server
```

Start the operator process in one or more terminal. It will produce random messages, with buy or sale products:
```
node operator
```

Start the subscriber process in one or more terminal. Examples:
```
node subscriber
node subscriber -o buy
node subscriber -o sale
node subscriber -p wheat
node subscriber -p wheat -o buy
```
The `-p` or `--product` flag indicates the product to listen, ie `wheat`.
The `-o` or `--operation` flag indicates the operation to listen: `buy` or `sale`.
