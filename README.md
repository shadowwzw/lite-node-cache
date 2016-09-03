# lite-node-cache
Universal module for caching databases query, http requests and more. Fast start. It is easy to understand.
This module for [node](http://nodejs.org).

[![Latest Stable Version](https://img.shields.io/npm/v/lite-node-cache.svg)](https://www.npmjs.com/package/lite-node-cache)
[![License](https://img.shields.io/npm/l/lite-node-cache.svg)](https://www.npmjs.com/package/lite-node-cache)
[![NPM Downloads](https://img.shields.io/npm/dt/lite-node-cache.svg)](https://www.npmjs.com/package/lite-node-cache)

## Installation

```bash
$ npm install lite-node-cache
```

## Usage

```js
var Cache = require("lite-node-cache");
var cacheInstance = new Cache({
    ttl: 6000 // the lifetime of the recording in milliseconds
});

// set new item in cache
cacheInstance.set("key1", "value1");

// get value from cache after 3 seconds
setTimeout(function () {
    var item = cacheInstance.get("key1");
    console.log(item); // "value1"
}, 3000);

// get value from cache after 6.5 seconds
setTimeout(function () {
    var item = cacheInstance.get("key1");
    console.log(item); // false
}, 6500);
```

## Example with http request

```js
var Cache = require("lite-node-cache");
var request = require('request');
var cacheInstance = new Cache({
    ttl: 6000, // the lifetime of the recording in milliseconds
    garbageCollectorTimeInterval: 10000,
    garbageCollectorAsyncMode: false,
    debugMode: true
});

setInterval(function () {
    var url = "http://google.ru";
    var result = cacheInstance.get(url);
    if (result) {
       console.log("get value from cache");
       // do something with result...
    } else {
        request(url, function (err, result) {
            if (err) console.log(err.message);
            cacheInstance.set(url, result);
            console.log("new request and save in cache");
            // do something with result...
        });
    }
}, 1000);
```

## Api

### create cacheInstance
```js
var Cache = require("lite-node-cache");
var cacheInstance = new Cache({
    ttl: 6000,
    garbageCollectorTimeInterval: 10000,
    garbageCollectorAsyncMode: false,
    debugMode: true
});
```
####Arguments:

options (Object type):

ttl (Integer) (default value: 30000) - the lifetime of the recording in milliseconds,

garbageCollectorTimeInterval (Integer) (default value: 10000) - frequency of garbage collector,

garbageCollectorAsyncMode (Boolean) (default value: false) - Asynchronous cleaning mode in order not to block the execution of the script,

debugMode (Boolean) (default value: false) - In this mode, you will receive valuable information that will help you to debug the script.

#### Returns:

(any type): the cached value or false if the lifetime value has expired or value is not exist.

### get value from cache
```js
cacheInstance.get(key);
```
#### Arguments:
key (any type): key to obtain the value from the cache.

#### Returns:
(any type): the cached value or false if the lifetime value has expired or value is not exist.

### set value in cache
```js
cacheInstance.set(key, value, [ttl = null]);
```
#### Arguments:
key (any type): key by which it will be possible to get the value from the cache.

#### Returns:
(boolean): it returns true if the value has been overwritten and False if the value is not there, and you have created a new one.

## License

The MIT License (MIT)

Copyright (c) 2016 Gavrilov Ruslan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
