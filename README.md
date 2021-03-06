# **lite-node-cache**
Universal module for caching databases query, http requests and more. Using ES6. Detailed documentation. Good test coverage.
This module for [node](http://nodejs.org).

[![Latest Stable Version](https://img.shields.io/npm/v/lite-node-cache.svg)](https://www.npmjs.com/package/lite-node-cache)
[![License](https://img.shields.io/npm/l/lite-node-cache.svg)](https://www.npmjs.com/package/lite-node-cache)
[![NPM Downloads](https://img.shields.io/npm/dt/lite-node-cache.svg)](https://www.npmjs.com/package/lite-node-cache)

## **Installation**

```bash
$ npm install lite-node-cache --save
```
or
```bash
$ yarn add lite-node-cache
```
----------
## **Usage**

```js
// const Cache = require("lite-node-cache/es5"); // if es6 not support.
const Cache = require("lite-node-cache"); // if es6 support.
const cacheInstance = new Cache({
    ttl: 6000 // the lifetime of the recording in milliseconds
});

// set new item in cache
cacheInstance.set("key1", "value1");

// get value from cache after 3 seconds
setTimeout(function () {
    console.log(cacheInstance.get("key1")); // "value1"
}, 3000);

// get value from cache after 6.5 seconds
setTimeout(function () {
    console.log(cacheInstance.get("key1")); // false
}, 6500);
```
----------
## **Example with http request**

```js
// const Cache = require("lite-node-cache/es5"); // if es6 not support.
const Cache = require("lite-node-cache"); // if es6 support.
const request = require('request');
const cacheInstance = new Cache({
    ttl: 6000, // the lifetime of the recording in milliseconds
    garbageCollectorTimeInterval: 10000,
    garbageCollectorAsyncMode: false,
    debugMode: true
});

const url = "http://google.ru";

setInterval(function () {
    let result = cacheInstance.get(url);
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
----------
## **Example with mysql query**

```js
// const Cache = require("lite-node-cache/es5"); // if es6 not support.
const Cache = require("lite-node-cache"); // if es6 support.
const mysql = require('mysql');
const cacheInstance = new Cache({
    ttl: 6000, // the lifetime of the recording in milliseconds
    garbageCollectorTimeInterval: 10000,
    garbageCollectorAsyncMode: false,
    debugMode: true
});

const connection  = mysql.createPool({
  connectionLimit : 1,
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
});

setInterval(function () {
    let query = 'SELECT 1 + 1 AS solution';
    let result = cacheInstance.get(query);
    if (result) {
       console.log("get query result from cache");
       // do something with result...
       console.log(result[0].solution); // 2
    } else {
        connection.query(query, function (err, rows, fields) {
            if (err) throw err;
            cacheInstance.set(query, rows);
            console.log("new query and save result in cache");
            // do something with result...
            console.log(rows[0].solution); // 2
        });
    }
}, 3000);
```
----------
## **Api**

### **create cacheInstance**
```js
// const Cache = require("lite-node-cache/es5"); // if es6 not support.
const Cache = require("lite-node-cache"); // if es6 support.
const cacheInstance = new Cache({
    ttl: 6000,
    garbageCollectorTimeInterval: 10000,
    garbageCollectorAsyncMode: false,
    debugMode: true
});
```
####**Arguments**:

*options (Object type):*

*ttl (Integer) (default value: 30000):* The lifetime of the recording in milliseconds.

*garbageCollectorTimeInterval (Integer) (default value: 10000):* Frequency of garbage collector (in milliseconds).

*garbageCollectorAsyncMode (Boolean) (default value: false):* Asynchronous cleaning mode in order not to block the execution of the script.

*debugMode (Boolean) (default value: false):* In this mode, you will receive valuable information that will help you to debug the script.

#### **Returns**:

*(Object):* cacheInstance.

### **get value from cache (Synchronous)**
```js
cacheInstance.get(key);
```
#### **Arguments**:
*key (any type):* Key to obtain the value from the cache.

#### **Returns**:
*(any type):* The cached value or false if the lifetime value has expired or value is not exist.

### **set value in cache (Synchronous)**
```js
cacheInstance.set(key, value, [ttl = null]);
```
#### **Arguments**:
*key (any type):* Key by which it will be possible to get the value from the cache.

*value (any type):* Value for storage in the cache.

*ttl (Integer) (optional):* The lifetime of the recording in milliseconds.

#### **Returns**:
*(boolean):* It returns true if the value has been overwritten and False if the value is not there, and you have created a new one.

### **remove key from cache (Synchronous)**
```js
cacheInstance.remove(key);
```
#### **Arguments**:
*key (any type):* Key is removed from the cache.

#### **Returns**:
*(boolean):*: Returns true if an element in the cache existed and has been removed, or false if the element does not exist.

### **delete key in cache (alias of remove) (Synchronous)**
```js
cacheInstance.delete(key);
```
#### **Arguments**:
*key (any type):* Key is removed from the cache.

#### **Returns**:
*(boolean):*: Returns true if an element in the cache existed and has been removed, or false if the element does not exist.

### **get keys from cache (Synchronous)**
```js
cacheInstance.keys();
```

#### **Returns**:
*(Array):* Returns an array of all existing keys in cacheInstance.

#### **Example**:
```js
cacheInstance.set("key1", "value1");
cacheInstance.set("key2", "value2");
cacheInstance.keys(); // ["key1", "key2"]
```

----------

## **Testing**

```bash
$ npm run build && npm test
```
----------

## **License**

MIT License

Copyright (c) 2017 Gavrilov Ruslan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
