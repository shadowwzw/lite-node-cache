const assert = require("assert");
const _ = require("lodash");
const Cache = require("./index");

describe('lite-node-cache', function() {
  describe('create cacheInstance', function functionName() {

    it("create instance", function functionName() {
      const cacheInstance = new Cache({ ttl: 200, debugMode: false});
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

            const array = [i];
            assert(!cacheInstance.set(array, i), "set new key must return false");
            assert.strictEqual(cacheInstance.get(array), i);

            const obj = {prop: i};
            assert(!cacheInstance.set(obj, i), "set new key must return false");
            assert.strictEqual(cacheInstance.get(obj), i);

            const array2 = [i];
            assert(!cacheInstance.set(array2, array), "set new key must return false");
            assert.strictEqual(cacheInstance.get(array2), array);

            const obj2 = {prop: i};
            assert(!cacheInstance.set(obj2, obj), "set new key must return false");
            assert.strictEqual(cacheInstance.get(obj2), obj);
          }
        });

        it("delete key test", function functionName() {
          assert(!cacheInstance.set("key1", "value1"), "set new key must return false");
          assert.strictEqual(cacheInstance.get("key1"), "value1");
          assert(cacheInstance.delete("key1"), "after removal should return true");
          assert(!cacheInstance.get("key1"), "should return False because the key does not exist.");
          assert.strictEqual(_.findIndex(cacheInstance.elements, function functionName(item) {
            return item === "key1";
          }), -1);
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
    const cacheInstance2 = new Cache({ ttl: 200, garbageCollectorAsyncMode: false, garbageCollectorTimeInterval: 50,  debugMode: false});
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
    const cacheInstance2 = new Cache({ ttl: 200, garbageCollectorAsyncMode: true, garbageCollectorTimeInterval: 50,  debugMode: false});
    it("Remove Expired keys", function functionName(done) {
      cacheInstance2.set(22, 22);
      assert.strictEqual(cacheInstance2.get(22), 22);
      setTimeout(function functionName() {
        assert(!cacheInstance2.set(22, 22), "garbage collector did not remove the expired key");
        done();
      }, 300);
      });
  });

  describe("Testing custom ttl", function functionName() {
    const cacheInstance2 = new Cache({ ttl: 50, garbageCollectorAsyncMode: true, garbageCollectorTimeInterval: 10,  debugMode: false});
    it("Remove Expired keys", function functionName(done) {
      cacheInstance2.set(22, 22, 150);
      assert.strictEqual(cacheInstance2.get(22), 22);

      setTimeout(function functionName() {
        assert(cacheInstance2.set(22, 22, 100), "should return true if a key replacement");

        setTimeout(function functionName() {
          assert(!cacheInstance2.set(22, 22), "garbage collector did not remove the expired key");
          done();
        }, 150);
      }, 100);

      });
  });

});
