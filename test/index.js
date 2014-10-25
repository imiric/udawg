
var Dawg = require('..'),
    should = require('chai').should();

describe('Dawg', function() {
  var dawg = Dawg();
  dawg.root = {last: false, edges: {
    f: {last: false, edges: {o: {last: false, edges: {o: {last: true, edges: {}}}}}},
    b: {last: false, edges: {a: {last: false, edges: {
      r: {last: true, edges: {}},
      z: {last: true, edges: {}},
    }}}}
  }}

  describe('#insert(word)', function() {
    it('should insert a word in the dictionary', function() {
      var d = Dawg(),
          words = ['foo', 'bar', 'baz'];

      words.forEach(function(w) {
        d.insert(w);
      });

      dawg.root.should.deep.equal(d.root);
    });
  });

  describe('#lookup(word)', function() {
    it('should search for a word in the dictionary', function() {
      dawg.lookup('foo').should.deep.equal({last: true, edges: {}});
      should.equal(dawg.lookup('barma'), null);
      should.equal(dawg.lookup('fo'), null);
    });
  });
});
