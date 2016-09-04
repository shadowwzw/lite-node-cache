var assert = require("assert");
var _ = require("lodash");
var Cache = require("lite-node-cache");
var bluebird = require("bluebird");

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

      describe('set new key (number), value (number), ttl is defalut and get all', function() {

        it("set keys in loop (1 to 10)", function functionName() {
          for(let i = 0; i < 10; i++){
            assert(!cacheInstance.set(i, i), "set new key must return false");
            assert.strictEqual(cacheInstance.get(i, i), i);

            assert(!cacheInstance.set(i+"", { prop: i}), "set new key must return false");
            assert.strictEqual(cacheInstance.get(i+"").prop, i);

            assert(!cacheInstance.set(i+"1", [i]), "set new key must return false");
            assert.strictEqual(cacheInstance.get(i+"1")[0], i);

            // assert(!cacheInstance.set({ prop: 1}, i), "set new key must return false");
            // assert.strictEqual(cacheInstance.get({ prop: 1}, i), i);
          }
        });

        it("get keys in loop (1 to 10)", function functionName() {
          for(let i = 0; i < 10; i++){
            assert(cacheInstance.set(i, i), "if the key is rewritten should return true");
            assert.strictEqual(cacheInstance.get(i, i), i);
          }
        });

        it("set and get keys in loop (1 to 10) after 500 ms", function functionName(done) {
          setTimeout(function functionName() {
            for(let i = 0; i < 10; i++){
              assert(cacheInstance.set(i, i), "if the key is rewritten should return true");
              assert.strictEqual(cacheInstance.get(i, i), i);
            }
            done();
          }, 100);
        });

        it("get ans set keys in loop (1 to 10) after 1100 ms", function functionName(done) {
          setTimeout(function functionName() {
            for(let i = 0; i < 10; i++){
              assert.strictEqual(cacheInstance.get(i, i), false);
              assert(!cacheInstance.set(i, i), "set new key must return false");
              assert.strictEqual(cacheInstance.get(i, i), i);
            }
            done();
          }, 300);
        });
      });
    });
  });

});
