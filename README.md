# Store

Store is a minimal key-value data store for Node.js. The storage format is loosely inspired by Git, as each key-value pair is stored in the local file system using plain files, internally indexed with SHA1 sums.

## Importing

If you correctly installed Store, you can access all the functionalities of the module by requiring the `store` module.

```js
var store = require('store');
```

## Writing a value

To write a value into the data store, you use the `store.write()` function. The function has the following signature:

```js
store.write(root, key, value, encoding, done);
```

The parameters understood by the function are:
- `root` - String - a path to an existing folder in the local file system which will be used as the root for the data store.
- `key` - String - the key of the key-value pair you want to store.
- `value` - String or Buffer - the value of the key-value pair you want to store.
- `encoding` - String - the encoding of the value. This parameter is ignored if the value is a buffer.
- `done` - Function - the callback which will be called when the value has been written. The callback receives as input one parameter, an optional error object which is non null if an error occurred during the writing process.

## Reading a value

To read a value into the data store, you use the `store.read()` function. The function has the following signature:

```js
store.read(root, key, encoding, done):
```

The parameters understood by the function are:
- `root` - String - a path to an existing folder in the local file system which will be used as the root for the data store.
- `key` - String - the key whose associated value you want to retrieve.
- `encoding` - String - the encoding used when reading the value.
- `done` - Funcion - the callbackk which will be called when the value has been retrieved from the data store. The callback receives as input three parameters. The first parameter is an optional error object which will be non null if an error occurred during the reading process. The second parameter is a boolean flag which is `true` if the key has been found in the data store, `false` otherwise. The third paramter is the retrieved value, if found. If the `encoding` parameter has been specified, the value will be returned as a string, otherwise it will be returned as a buffer.

## Running tests

If you want to run unit tests included in the project, you can execute `npm test` from the root of the project. Similarly, if you want to run some basic perfomance tests, you can execue `npm run-script perf` from the root of the project.
