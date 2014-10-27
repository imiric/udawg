udawg
=====

This is a small, barely working, **_incomplete_** implementation of a Directed
Acyclic Word Graph, a.k.a.
[Minimal Acyclic Finite State Automaton](http://en.wikipedia.org/wiki/Deterministic_acyclic_finite_state_automaton),
a data structure closely related to a [Trie](http://en.wikipedia.org/wiki/Trie).

Its purpose is to efficiently store a large word dataset and allow for quick
lookups, which is typically used in spell checkers, autocomplete engines or
environments with limited memory.

The work here was largely inspired by Steve Hanov's
[article](http://stevehanov.ca/blog/index.php?id=115). The main difference is
that this implementation should work with unsorted data, and allow value
retrieval.

Use at your own risk. Patches welcome.


Setup
-----
```
npm install udawg
```


License
-------

[MIT](LICENSE)
