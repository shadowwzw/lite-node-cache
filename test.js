var assert = require("assert");
var _ = require("lodash");
var Cache = require("lite-node-cache");
var bluebird = require("bluebird");

describe('lite-node-cache', function() {
  describe('create cacheInstance', function functionName() {
    it("create instance without arguments", function functionName() {
      var cacheInstance = new Cache({ ttl: 1000});
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
        
        it("set keys in loop (1 to 99)", function functionName() {
          for(let i = 0; i < 100; i++){
            assert(!cacheInstance.set(i, i), "set new key must return false");
            assert.strictEqual(cacheInstance.get(i, i), i);
          }
        });

        it("get keys in loop (1 to 99)", function functionName() {
          for(let i = 0; i < 100; i++){
            assert(cacheInstance.set(i, i), "if the key is rewritten should return true");
            assert.strictEqual(cacheInstance.get(i, i), i);
          }
        });

        it("get keys in loop (1 to 99) after 5 second", function functionName(done) {
          setTimeout(function functionName() {
            for(let i = 0; i < 100; i++){
              assert(cacheInstance.set(i, i), "if the key is rewritten should return true");
              assert.strictEqual(cacheInstance.get(i, i), i);
            }
            done();
          }, 500);
        });

        it("get keys in loop (1 to 99) after 5 second", function functionName(done) {
          setTimeout(function functionName() {
            for(let i = 0; i < 100; i++){
              assert(cacheInstance.set(i, i), "if the key is rewritten should return true");
              assert.strictEqual(cacheInstance.get(i, i), i);
            }
            done();
          }, 500);
        });
      });
    });
  });

  describe('save key (number), save value (number)', function() {
    // it('should return -1 when the value is not present', function() {
    //   assert.equal(-1, [1,2,3].indexOf(4));
    // });
  });
});
