var assert = require("assert");
var _ = require("lodash");
var Cache = require("lite-node-cache");

describe('lite-node-cache', function() {
  describe('create cacheInstance', function functionName() {

    it("create instance", function functionName() {
      var cacheInstance = new Cache({ ttl: 200, debugMode: false});
      assert(_.isObjectLike(cacheInstance), "cacheInstance is not a object");
      assert(_.isFunction(cacheInstance.get, "cacheInstance.get is not a function"));
      assert(_.isFunction(cacheInstance.set, "cacheInstance.set is not a function"));
      assert(_.isFunction(cacheInstance.getAsync, "cacheInstance.getAsync is not a function"));
      assert(_.isFunction(cacheInstance.setAsync, "cacheInstance.setAsync is not a function"));
      assert(_.isFunction(cacheInstance.mget, "cacheInstance.mget is not a function"));
      assert(_.isFunction(cacheInstance.mset, "cacheInstance.mset is not a function"));
      assert(_.isFunction(cacheInstance.debug, "cacheInstance.debug is not a function"));
      assert(_.isFunction(cacheInstance.removeGarbage, "cacheInstance.removeGarbage is not a function"));
      assert(_.isFunction(cacheInstance.garbageCollector, "cacheInstance.garbageCollector is not a function"));
      assert(_.isFunction(cacheInstance.removeGarbageAsync, "cacheInstance.removeGarbageAsync is not a function"));
      assert(_.isFunction(cacheInstance.garbageCollectorAsync, "cacheInstance.garbageCollectorAsync is not a function"));

      describe('testing get and set, ttl is defalut and get all', function() {

        it("set keys in loop (1 to 10)", function functionName() {
          for(let i = 0; i < 10; i++){
            assert(!cacheInstance.set(i, i), "set new key must return false");
            assert.strictEqual(cacheInstance.get(i), i);

            assert(!cacheInstance.set(i+"", { prop: i}), "set new key must return false");
            assert.strictEqual(cacheInstance.get(i+"").prop, i);

            assert(!cacheInstance.set(i+"1", [i]), "set new key must return false");
            assert.strictEqual(cacheInstance.get(i+"1")[0], i);

            let array = [i];
            assert(!cacheInstance.set(array, i), "set new key must return false");
            assert.strictEqual(cacheInstance.get(array), i);

            let obj = {prop: i};
            assert(!cacheInstance.set(obj, i), "set new key must return false");
            assert.strictEqual(cacheInstance.get(obj), i);

            let array2 = [i];
            assert(!cacheInstance.set(array2, array), "set new key must return false");
            assert.strictEqual(cacheInstance.get(array2), array);

            let obj2 = {prop: i};
            assert(!cacheInstance.set(obj2, obj), "set new key must return false");
            assert.strictEqual(cacheInstance.get(obj2), obj);
          }
        });

        it("get keys in loop (1 to 10)", function functionName() {
          for(let i = 0; i < 10; i++){
            assert(cacheInstance.set(i, i), "if the key is rewritten should return true");
            assert.strictEqual(cacheInstance.get(i), i);
          }
        });

        it("set and get keys in loop (1 to 10) after 500 ms", function functionName(done) {
          setTimeout(function functionName() {
            for(let i = 0; i < 10; i++){
              assert(cacheInstance.set(i, i), "if the key is rewritten should return true");
              assert.strictEqual(cacheInstance.get(i), i);
            }
            done();
          }, 100);
        });

        it("get ans set keys in loop (1 to 10) after 1100 ms", function functionName(done) {
          setTimeout(function functionName() {
            for(let i = 0; i < 10; i++){
              assert.strictEqual(cacheInstance.get(i), false);
              assert(!cacheInstance.set(i, i), "set new key must return false");
              assert.strictEqual(cacheInstance.get(i), i);
            }
            done();
          }, 300);
        });
      });
    });
  });

  describe("testing garbageCollector", function functionName() {
    var cacheInstance2 = new Cache({ ttl: 200, garbageCollectorAsyncMode: false, garbageCollectorTimeInterval: 50,  debugMode: false});
    it("Remove Expired keys", function functionName(done) {
      cacheInstance2.set(11, 11);
      assert.strictEqual(cacheInstance2.get(11), 11);
      setTimeout(function functionName() {
        assert(!cacheInstance2.set(11, 11), "garbage collector did not remove the expired key");
        done();
      }, 300);
      });
  });

  describe("testing garbageCollector in Async mode", function functionName() {
    var cacheInstance2 = new Cache({ ttl: 200, garbageCollectorAsyncMode: true, garbageCollectorTimeInterval: 50,  debugMode: false});
    it("Remove Expired keys", function functionName(done) {
      cacheInstance2.set(22, 22);
      assert.strictEqual(cacheInstance2.get(22), 22);
      setTimeout(function functionName() {
        assert(!cacheInstance2.set(22, 22), "garbage collector did not remove the expired key");
        done();
      }, 300);
      });
  });

});
