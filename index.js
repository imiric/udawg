
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
  return this;
}

/**
 * Insert a word in the dictionary.
 *
 * @param {string} word
 */
Dawg.prototype.insert = function(word) {
}


/**
 * Search the dictionary for the given word.
 *
 * @param {string} word
 */
Dawg.prototype.lookup = function(word) {
}
