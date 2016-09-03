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
var cache = new Cache({
    ttl: 6000 // the lifetime of the recording in milliseconds
});

// set new item in cache
cache.set("key1", "value1");

// get value from cache after 3 seconds
setTimeout(function () {
    var item = cache.get("key1");
    console.log(item); // "value1"
}, 3000);

// get value from cache after 6.5 seconds
setTimeout(function () {
    var item = cache.get("key1");
    console.log(item); // false
}, 6500);
```

## Example with http request

```js

```

## Api

### get value for cache
```js
cache.get(key);
```
Arguments:
key (any type): key to obtain the value from the cache.

Returns:
(any type): the cached value or false if the lifetime value has expired or value is not exist.

## License

The MIT License (MIT)

Copyright (c) 2016 Gavrilov Ruslan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
