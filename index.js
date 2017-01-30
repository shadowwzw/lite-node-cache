const bluebird = require('bluebird');
const _ = require('lodash');
module.exports = class Cache {
    constructor({ttl = 30000, garbageCollectorTimeInterval = 10000, garbageCollectorAsyncMode = false,  debugMode = false} = {}) {
        this.debugMode = debugMode;
        this.storage = new Map();
        if (Number.isInteger(ttl)) {
            this.ttl = ttl;
        } else {
            throw new Error("lite-node-cache: ttl parameter is not valid");
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
            throw new Error("lite-node-cache: garbageCollectorTimeInterval parameter is not valid");
        }
        this.garbageCollectorIsExecuted = 0;
    }

    get(key) {
        if (this.storage.has(key)) {
            const item = this.storage.get(key);
            if(item.ttl !== 0){
                const ttl = (item.ttl !== null) ? item.ttl : this.ttl;
                if (Date.now() - item.created > ttl) {
                    this.delete(key);
                    this.debug("lite-node-cache: Removed the key when get. ttl elapsed.");
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
                    resolve(this.get(key));
                } catch (err) {
                    reject(err);
                }
            }, 0);
        });
    }

    set(key, value, ttl = null) {
        if(ttl !== null && ( !Number.isInteger(ttl) && ttl >= 0 )){
            throw Error("lite-node-cache: ttl parameter is not valid in set method");
        }
        const has = this.storage.has(key);
        const item = {
            value,
            created: Date.now(),
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
                    resolve(this.set(key, value, ttl));
                } catch (err) {
                    reject(err);
                }
            }, 0);
        });
    }

    mget(keys) {
        const resultArray = [];
        for (let i = 0; i < keys.length; i++) {
            resultArray.push(this.get(keys[i]));
        }
        return resultArray;
    }

    mset(keys, values, ttl) {
        const resultArray = [];
        for (let i = 0; i < keys.length; i++) {
            resultArray.push(this.set(keys[i], values[i], ttl[i]));
        }
        return resultArray;
    }

    debug() {
        if (this.debugMode) console.log.apply(this, arguments);
    }

    removeGarbage() {
        let removedCount = 0;
        for (let i = 0; i < this.elements.length; i++) {
            const key = this.elements[i];
            if (this.storage.has(key)) {
                const item = this.storage.get(key);
                if(item.ttl !== 0){
                    const ttl = ( item.ttl !== null) ? item.ttl : this.ttl;
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
            this.debug("lite-node-cache: garbage collector started");
            setInterval(()=> {
                let removedCount = 0;
                removedCount += this.removeGarbage();
                if (removedCount)
                    this.debug("lite-node-cache: the garbage collector made ​​a clean cache (removed " + removedCount + " items)");
            }, this.garbageCollectorTimeInterval);
        } else {
            this.debug("lite-node-cache: the garbage collector is already running");
        }
    }

    removeGarbageAsync(key) {
        return new bluebird((resolve, reject)=> {
            setTimeout(()=> {
                try {
                    if (this.storage.has(key)) {
                        const item = this.storage.get(key);
                        if(item.ttl !== 0){
                            const ttl = ( item.ttl !== null ) ? item.ttl : this.ttl;
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
            this.debug("lite-node-cache: garbage collector started in async mode");
            const self = this;

            bluebird.coroutine(function* GCLoop() {
                try {
                    yield bluebird.delay(self.garbageCollectorTimeInterval);
                    const removedArray = [];
                    for (let i = 0; i < self.elements.length; i++) {
                        removedArray.push(self.removeGarbageAsync(self.elements[i], self).then(function (result) {
                            return result;
                        }));
                    }
                    if (self.debugMode)
                        bluebird.coroutine(function* () {
                            let removedArrayResolved = yield bluebird.all(removedArray);
                            removedArrayResolved = _.compact(removedArrayResolved);
                            if (removedArrayResolved.length)
                                self.debug("lite-node-cache: the garbage collector made ​​a clean cache (removed " + removedArrayResolved.length + " items)");
                        })();
                    yield bluebird.coroutine(GCLoop)();
                } catch (err) {
                    self.debug("lite-node-cache: " + err);
                }
            })();
        } else {
            this.debug("lite-node-cache: the garbage collector is already running");
        }
    }
};