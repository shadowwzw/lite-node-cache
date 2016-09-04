const bluebird = require('bluebird');
const _ = require('lodash');
module.exports = class Cache {
    constructor({ttl = 30000, garbageCollectorTimeInterval = 10000, garbageCollectorAsyncMode = false,  debugMode = false} = {}) {
        this.debugMode = debugMode;
        this.storage = new Map();
        if (Number.isInteger(ttl)) {
            this.ttl = ttl;
        } else {
            throw new Error("universal-lite-node-cache: ttl parameter is not valid");
        }
        this.elements = [];
        if (Number.isInteger(garbageCollectorTimeInterval) && garbageCollectorTimeInterval >= 0) {
            if (garbageCollectorTimeInterval !== 0) {
                this.garbageCollectorTimeInterval = garbageCollectorTimeInterval;
                if (garbageCollectorAsyncMode) {
                    this.garbageCollectorAsync();
                }
                else {
                    this.garbageCollector();
                }
            }
        }
        else {
            throw new Error("universal-lite-node-cache: garbageCollectorTimeInterval parameter is not valid");
        }
        this.garbageCollectorIsExecuted = 0;
    }

    get(key) {
        if (this.storage.has(key)) {
            var item = this.storage.get(key);
            if(item.ttl !== 0){
                var ttl = (item.ttl !== null) ? item.ttl : this.ttl;
                if (Date.now() - item.created > ttl) {
                    this.debug("universal-lite-node-cache: Remove the key when get. ttl elapsed.");
                    this.delete(key);
                    return false;
                } else {
                    return item.value;
                }
            }else{
                return item.value;
            }
        } else {
            return false;
        }
    }

    getAsync(key) {
        return new bluebird(function (resolve, reject) {
            setTimeout(()=> {
                try {
                    var result = this.get(key);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }, 0);
        });
    }

    set(key, value, ttl = null) {
        if(ttl !== null && ( !Number.isInteger(ttl) && ttl >= 0 )){
            throw Error("universal-lite-node-cache: ttl parameter is not valid in set method");
        }
        var has = this.storage.has(key);
        var created = Date.now();
        var item = {
            value,
            created,
            ttl
        };
        this.storage.set(key, item);
        this.elements.push(key);
        return has;
    }

    delete(key) {
        if(this.storage.delete(key)){
          _.remove(this.elements, function functionName(item) {
            return item === key;
          });
          return true;
        }else{
          return false;
        }
    }

    setAsync(key, value, ttl) {
        return new bluebird(function (resolve, reject) {
            setTimeout(()=> {
                try {
                    var result = this.set(key, value, ttl);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }, 0);
        });
    }

    mget(keys) {
        var resultArray = [];
        for (var i = 0; i < keys.length; i++) {
            resultArray.push(this.get(keys[i]));
        }
        return resultArray;
    }

    mset(keys, values, ttl) {
        var resultArray = [];
        for (var i = 0; i < keys.length; i++) {
            resultArray.push(this.set(keys[i], values[i], ttl[i]));
        }
        return resultArray;
    }

    debug(...spread) {
        if (this.debugMode) console.log(...spread);
    }

    removeGarbage() {
        var removedCount = 0;
        for (let i = 0; i < this.elements.length; i++) {
            var key = this.elements[i];
            if (this.storage.has(key)) {
                var item = this.storage.get(key);
                if(item.ttl !== 0){
                    var ttl = ( item.ttl !== null) ? item.ttl : this.ttl;
                    if (Date.now() - item.created > ttl) {
                        this.delete(key);
                        i--;
                        removedCount++;
                    }
                }
            }
        }
        return removedCount;
    }

    garbageCollector() {
        if (!this.garbageCollectorIsExecuted) {
            this.garbageCollectorIsExecuted++;
            this.debug("universal-lite-node-cache: garbage collector started");
            setInterval(()=> {
                var removedCount = 0;
                removedCount += this.removeGarbage();
                if (removedCount)
                    this.debug("universal-lite-node-cache: the garbage collector made ​​a clean cache (removed " + removedCount + " items)");
            }, this.garbageCollectorTimeInterval);
        } else {
            this.debug("universal-lite-node-cache: the garbage collector is already running");
        }
    }

    removeGarbageAsync(key) {
        return new bluebird((resolve, reject)=> {
            setTimeout(()=> {
                try {
                    if (this.storage.has(key)) {
                        var item = this.storage.get(key);
                        if(item.ttl !== 0){
                            var ttl = ( item.ttl !== null ) ? item.ttl : this.ttl;
                            if (Date.now() - item.created > ttl) {
                                this.delete(key);
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }else{
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }
                } catch (err) {
                    reject(err);
                }
            }, 0);
        });
    }

    garbageCollectorAsync() {
        if (!this.garbageCollectorIsExecuted) {
            this.garbageCollectorIsExecuted++;
            this.debug("universal-lite-node-cache: garbage collector started in async mode");
            let self = this;

            bluebird.coroutine(function* GCLoop() {
                try {
                    yield bluebird.delay(self.garbageCollectorTimeInterval);
                    let removedArray = [];
                    for (let i = 0; i < self.elements.length; i++) {
                        removedArray.push(self.removeGarbageAsync(self.elements[i], self).then(function (result) {
                            return result;
                        }));
                    }
                    if (self.debugMode)
                        bluebird.coroutine(function* () {
                            var removedArrayResolved = yield bluebird.all(removedArray);
                            removedArrayResolved = _.compact(removedArrayResolved);
                            if (removedArrayResolved.length)
                                self.debug("universal-lite-node-cache: the garbage collector made ​​a clean cache (removed " + removedArrayResolved.length + " items)");
                        })();
                    yield bluebird.coroutine(GCLoop)();
                } catch (err) {
                    self.debug("universal-lite-node-cache: " + err);
                }
            })();
        } else {
            this.debug("universal-lite-node-cache: the garbage collector is already running");
        }
    }
};
