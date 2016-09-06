# **lite-node-cache**
Universal module for caching databases query, http requests and more. Fast start. It is easy to understand. Good test coverage.
This module for [node](http://nodejs.org).

[![Latest Stable Version](https://img.shields.io/npm/v/lite-node-cache.svg)](https://www.npmjs.com/package/lite-node-cache)
[![License](https://img.shields.io/npm/l/lite-node-cache.svg)](https://www.npmjs.com/package/lite-node-cache)
[![NPM Downloads](https://img.shields.io/npm/dt/lite-node-cache.svg)](https://www.npmjs.com/package/lite-node-cache)

## **Installation**

```bash
$ npm install lite-node-cache
```
----------
## **Usage**

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
----------
## **Example with http request**

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
----------
## **Example with mysql query**

```js
var Cache = require("lite-node-cache");
var mysql = require('mysql');
var cacheInstance = new Cache({
    ttl: 6000, // the lifetime of the recording in milliseconds
    garbageCollectorTimeInterval: 10000,
    garbageCollectorAsyncMode: false,
    debugMode: true
});

var connection  = mysql.createPool({
  connectionLimit : 1,
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
});

setInterval(function () {
    var query = 'SELECT 1 + 1 AS solution';
    var result = cacheInstance.get(query);
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
var Cache = require("lite-node-cache");
var cacheInstance = new Cache({
    ttl: 6000,
    garbageCollectorTimeInterval: 10000,
    garbageCollectorAsyncMode: false,
    debugMode: true
});
```
####**Arguments**:

*options (Object type):*

*ttl (Integer) (default value: 30000)* - the lifetime of the recording in milliseconds,

*garbageCollectorTimeInterval (Integer) (default value: 10000)* - frequency of garbage collector,

*garbageCollectorAsyncMode (Boolean) (default value: false)* - Asynchronous cleaning mode in order not to block the execution of the script,

*debugMode (Boolean) (default value: false)* - In this mode, you will receive valuable information that will help you to debug the script.

#### **Returns**:

*(any type):* the cached value or false if the lifetime value has expired or value is not exist.

### **get value from cache**
```js
cacheInstance.get(key);
```
#### **Arguments**:
*key (any type):* key to obtain the value from the cache.

#### **Returns**:
*(any type):* the cached value or false if the lifetime value has expired or value is not exist.

### **set value in cache**
```js
cacheInstance.set(key, value, [ttl = null]);
```
#### **Arguments**:
*key (any type):* key by which it will be possible to get the value from the cache.

#### **Returns**:
*(boolean):* it returns true if the value has been overwritten and False if the value is not there, and you have created a new one.

### **delete value in cache**
```js
cacheInstance.delete(key);
```
#### **Arguments**:
*key (any type):* key is removed from the cache;

#### **Returns**:
*(boolean):* Returns true if an element in the cache existed and has been removed, or false if the element does not exist.

----------

## **Testing**

```bash
$ npm install mocha -g
$ cd lite-node-cache
$ mocha test.js
```
----------
## **License**

The MIT License (MIT)

Copyright (c) 2016 Gavrilov Ruslan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
///
