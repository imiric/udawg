
var Dawg = require('..'),
    should = require('chai').should(),
    _ = require('lodash');

describe('Dawg', function() {
  var dawg = Dawg();
  dawg.root = {last: false, edges: {
    f: {last: false, edges: {o: {last: false, edges: {o: {last: true, edges: {}}}}}},
    b: {last: false, edges: {a: {last: true, edges: {
      r: {last: true, edges: {}},
      z: {last: true, edges: {}},
    }}}}
  }}

  describe('#insert(word)', function() {
    it('should insert a word in the dictionary', function() {
      var d = Dawg(),
          words = ['foo', 'ba', 'bar', 'baz'];

      words.forEach(function(w) {
        d.insert(w);
      });

      dawg.root.should.deep.equal(d.root);
    });

    it('should not insert duplicate nodes', function() {
      var before = _.cloneDeep(dawg.root);
      dawg.insert('foo');
      dawg.root.should.deep.equal(before);
      dawg.root = before;
    });
  });

  describe('#lookup(word)', function() {
    it('should search for a word in the dictionary', function() {
      dawg.lookup('foo').should.deep.equal({last: true, edges: {}});
      should.equal(dawg.lookup('barma'), null);
      should.equal(dawg.lookup('fo'), null);
    });

  });

  describe('#lookup(word, false)', function() {
    it('should search for words in the dictionary that start with a prefix', function() {
      dawg.lookup('fo', false).should.deep.equal({last: false, edges: {o: {last: true, edges: {}}}});
    });
  });

  describe('#values(node)', function() {
    it('should extract all words contained in the dictionary starting from node', function() {
      dawg.values(dawg.root).should.deep.equal(['foo', 'ba', 'bar', 'baz']);
      dawg.values(dawg.root.edges.b).should.deep.equal(['a', 'ar', 'az']);
      dawg.values(dawg.root.edges.b, 'b').should.deep.equal(['ba', 'bar', 'baz']);
    });
  });
});
