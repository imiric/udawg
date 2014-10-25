
var Dawg = require('..'),
    should = require('chai').should();

describe('Dawg', function() {
  describe('#insert(word)', function() {
    it('should insert a word in the dictionary', function() {
      var dawg = Dawg();
      dawg.insert('foo');
    });
  });

  describe('#lookup(word)', function() {
    it('should search for a word in the dictionary', function() {
      var dawg = Dawg();
      dawg.lookup('foo');
    });
  });
});
