
exports = module.exports = init;

/**
 * Module initialization function.
 *
 * @param {Array.<string>=[]} words - Initial dictionary data.
 * @public
 */
function init() {
  return new Dawg();
}


/**
 * A directed acyclic word graph, a.k.a. minimal acyclic finite state automata.
 *
 * @constructor
 * @private
 * @see {@link http://en.wikipedia.org/wiki/Deterministic_acyclic_finite_state_automaton}
 *   for more information.
 */
function Dawg() {
  this.root = new DawgNode();
  return this;
}

/**
 * A node in the DAWG.
 *
 * @constructor
 * @private
 */
function DawgNode() {
  this.edges = {};
  this.last = false;
  return this;
}

/**
 * Insert a word in the dictionary.
 *
 * @param {string} word
 */
Dawg.prototype.insert = function(word, node) {
  if (!word) {
    node.last = true;
    return;
  }

  var letter = word[0],
      node = node || this.root;

  if (typeof node == 'undefined') {
    this.root = node = new DawgNode();
  } else {
    var edge = node.edges[letter];
    if (typeof edge == 'undefined') {
      node.edges[letter] = node = new DawgNode();
    } else {
      node = edge;
    }
  }

  this.insert(word.slice(1), node);
}


/**
 * Search the dictionary for the given word or prefix.
 *
 * @param {string} word
 * @param {Boolean} [exact=true] - Whether to search for an exact or a prefix match.
 * @returns {DawgNode|null} - The leaf node if the word is in the dictionary,
 *   or null otherwise.
 */
Dawg.prototype.lookup = function(word, exact, node) {
  exact = exact === false ? exact : true;

  if (!word) {
    return (node && node.last) ? node : (exact ? null : node);
  }

  node = node || this.root;
  var next = node.edges[word[0]];

  if (typeof next == 'undefined') {
    return null;
  } else {
    return this.lookup(word.slice(1), exact, next)
  }
}


/**
 * Extract the words contained in the dictionary starting with `node`.
 *
 * @param {DawgNode} node
 * @returns {Array} - The collection of contained words.
 */
Dawg.prototype.values = function(node) {
  if (!node) {
    return [];
  }

  var values = [],
      word = '';

  if (node.last) {
    values.push(word);
  }

  for (var letter in node.edges) {
    var childValues = this.values(node.edges[letter]);
    if (childValues.length) {
      childValues.forEach(function(val) {
        values.push(letter + val);
      });
    } else {
      values.push(word + letter)
    }
  }

  return values;
}
