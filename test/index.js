
var Dawg = require('..'),
    should = require('chai').should(),
    _ = require('lodash');

describe('Dawg', function() {
  var dawg = Dawg(),
      p = {last: false, edges: {p: {last: true, edges: {}}}};
  dawg.root = {last: false, edges: {
    b: {last: false, edges: {l: {last: false, edges: {i: p, o: {last: false, edges: {o: p}}}}}},
    c: {last: false, edges: {a: {last: false, edges: {t: {last: true, edges: {
      n: {last: false, edges: {i: p}},
      s: {last: true, edges: {}}
    }}}}}}
  }};

  describe('#insert(word)', function() {
    it('should insert a word in the dictionary', function() {
      var d = Dawg(),
          words = ['blip', 'bloop', 'cat', 'catnip', 'cats'];

      words.forEach(function(w) {
        d.insert(w);
      });

      dawg.root.should.deep.equal(d.root);

      // Test MA-FSA object reuse
      var ip1 = d.root.edges.b.edges.l.edges.i,
          ip2 = d.root.edges.c.edges.a.edges.t.edges.n.edges.i;
      ip1.should.equal(ip2);
    });

    it('should not insert duplicate nodes', function() {
      var before = _.cloneDeep(dawg.root);
      dawg.insert('catnip');
      dawg.root.should.deep.equal(before);
      dawg.root = before;
    });
  });

  describe('#lookup(word)', function() {
    it('should search for a word in the dictionary', function() {
      dawg.lookup('blip').should.deep.equal({last: true, edges: {}});
      should.equal(dawg.lookup('barma'), null);
      should.equal(dawg.lookup('fo'), null);
    });

  });

  describe('#lookup(word, false)', function() {
    it('should search for words in the dictionary that start with a prefix', function() {
      dawg.lookup('bl', false).should.deep.equal(
        {last: false, edges: {i: p, o: {last: false, edges: {o: p}}}}
      );
    });
  });

  describe('#values(node)', function() {
    it('should extract all words contained in the dictionary starting from node', function() {
      dawg.values(dawg.root).should.have.members(['blip', 'bloop', 'cat', 'catnip', 'cats']);
      dawg.values(dawg.root.edges.b).should.have.members(['lip', 'loop']);
      dawg.values(dawg.root.edges.b, 'b').should.have.members(['blip', 'bloop']);
    });
  });
});
