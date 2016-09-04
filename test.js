var assert = require("assert");
var _ = require("lodash");
var Cache = require("lite-node-cache");
describe('lite-node-cache', function() {
  describe('create cacheInstance', function functionName() {
    it("create instance with ttl", function functionName() {
      var cacheInstance = new Cache({});
      assert(_.isObjectLike(cacheInstance), "cacheInstance is not a object");
      assert(_.isFunction(cacheInstance.get, "cacheInstance.get is not a function"));

    });
  });

  describe('save key (number), save value (number)', function() {
    // it('should return -1 when the value is not present', function() {
    //   assert.equal(-1, [1,2,3].indexOf(4));
    // });
  });
});
