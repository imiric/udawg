
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


// Used to keep track of node IDs
var nextId = 1;

/**
 * A node in the DAWG.
 *
 * @constructor
 * @private
 */
function DawgNode() {
  this.id = nextId;
  nextId = nextId + 1;
  this.edges = {};
  this.last = false;
  return this;
}

/**
* A unique identifier for this node
*/
DawgNode.prototype.toString = function() {
  var str = this.last ? '1' : '0';

  for (var letter in this.edges) {
    str = str + letter + this.edges[letter].id;
  }

  return str;
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
  this.uncheckedNodes = [];
  this.minimizedNodes = {};
  return this;
}

/**
 * Insert a word in the dictionary.
 *
 * @param {string} word
 */
Dawg.prototype.insert = function(word, node) {
  if (!word) {
    if (typeof node != 'undefined') {
      node.last = true;
    }
    // FIXME: Minimizing graph messes up value extraction.
    //this.minimize();
    return;
  }

  var letter = word[0],
      node = node || this.root;

  if (typeof node == 'undefined') {
    this.root = node = new DawgNode();
  } else {
    var edge = node.edges[letter];
    if (typeof edge == 'undefined') {
      var next = new DawgNode(), hash = node.toString();
      this.uncheckedNodes.push([node, letter, next]);
      node.edges[letter] = next;
      // Since the edges changed, update the hash if the node is already minimized
      this.updateHash(hash, node, letter);
      node = next;
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
 * Minimize the graph by eliminating duplicates
 */
Dawg.prototype.minimize = function() {
  for (var i=this.uncheckedNodes.length - 1; i >= 0; i--) {
    var e = this.uncheckedNodes[i], paren = e[0], letter = e[1], child = e[2];
    if (child in this.minimizedNodes) {
      paren.edges[letter] = this.minimizedNodes[child];
    } else {
      this.minimizedNodes[child] = child;
    }
    this.uncheckedNodes.pop();
  }
}

/**
 * Update the hash of an existing node in the minimized collection
 *
 * @param {string} oldHash
 * @param {DawgNode} node
 */
Dawg.prototype.updateHash = function(oldHash, node) {
  if (oldHash in this.minimizedNodes) {
    delete this.minimizedNodes[oldHash];
    this.minimizedNodes[node] = node;
  }
}

/**
 * Extract the words contained in the dictionary starting with `node`.
 *
 * @param {DawgNode} node
 * @param {string} [prefix=''] - An optional prefix to add to all located words.
 * @returns {Array} - The collection of contained words.
 */
Dawg.prototype.values = function(node, prefix) {
  if (!node) {
    return [];
  }

  var values = [],
      word = prefix || '';

  if (node.last) {
    values.push(word);
  }

  for (var letter in node.edges) {
    var childValues = this.values(node.edges[letter]);
    if (childValues.length) {
      childValues.forEach(function(val) {
        values.push(word + letter + val);
      });
    } else {
      values.push(word + letter)
    }
  }

  return values;
}
