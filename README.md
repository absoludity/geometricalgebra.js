Geometric Algebra with JS
=========================

Copyright 2013 Michael Nelson <michael@liveandletlearn.net>

Geometric Algebra provides a different way of thinking about vectors,
geometry and their applications to physics. You can read more on the
[Wikipedia article](http://en.wikipedia.org/wiki/Geometric_algebra)
but be warned that it gets (unnecessarily) complicated rather quickly.
I've created this JavaScript port of an
[old Python geometric algebra library](https://launchpad.net/pymultivector)
that I wrote a few years ago with the aim of eventually creating an
interactive introduction to Geometric Algebra - highlighting it's
simplicity and beauty.


Getting started
---------------

```
$ git clone https://github.com/absoludity/geometricalgebra.js.git
$ npm install
$ bin/shell
```

This will drop you in a nodejs REPL with the multivector library already
loaded into the namespace as mv, where you can create vectors:

```javascript
var v1 = new mv.MultiVector("2x + 3y");
var v2 = new mv.MultiVector("x + 2y");
```

and multiply them together:

```javascript
v1.mul(v2).toString()
'8 + 1xy'
```

For example, if you multiply two vectors of unit length together,
your can use the result to rotate any other vectors. Here we'll
create a unit vector along the x-axis, and a unit vector that is
45 degrees towards the y-axis. In this case
it's easier to create the terms explicitly rather than relying on
the parsing of a string:

```javascript
var x = new mv.MultiVector([new mv.MultiVectorTerm(1, [1])]);
var x45y = new mv.MultiVector([
    new mv.MultiVectorTerm(1.0 / Math.sqrt(2), [1]),
    new mv.MultiVectorTerm(1.0 / Math.sqrt(2), [2]),
]);
```

Verify that the second vector is indeed unit length (well, with
floating-point errors) and then create the rotation by simply
multiplying the two vectors:
```javascript
x45y.mul(x45y).toString()
'0.9999999999999998'

var rotate45 = x45y.mul(x);
rotate45.toString()
'0.7071067811865475 - 0.7071067811865475xy'
```

We can now apply the rotation one or more times to see the results:

```javascript
rotate45.mul(x).toString()
'0.7071067811865475x + 0.7071067811865475y'
rotate45.mul(rotate45).mul(x).toString()
'0.9999999999999998y'
rotate45.mul(rotate45).mul(rotate45).mul(x).toString()
'-0.7071067811865474x + 0.7071067811865474y'
```

Running unit tests
------------------

You can run the unit-tests with:
```
$ bin/grunt test
```

Or if you run `bin/grunt` in a console, it will by default run tests
and lint the code on each file save.

Debugging test output is much easier in a browser - the same tests
will render in your favourite browser simply by opening the tests/index.html file.

Current build status: [![Build Status](https://travis-ci.org/absoludity/geometricalgebra.js.png)](https://travis-ci.org/absoludity/geometricalgebra.js)



Using geometricalgebra.js in the browser
----------------------------------------

This module uses the excellent [RequireJS](http://requirejs.org/) library
to keep module loading sane. You can view the
[tests/main.js](tests/main.js) which is loaded by the
[tests/index.html](tests/index.html) for an example. With a similar setup
you can use the multivector module with:

```javascript
require(['multivector'], function(mv) {
   var myvec = new mv.MultiVector("x + y");
   // etc.
});
```


Warning - differences from established Geometric Algebra
--------------------------------------------------------

Most formal definitions of geometric algebra define the geometric product as
a combination of an inner and outer product. This implementation doesn't
define these products separately (although they can be derived), instead it
assumes only two axioms:

Given any set of basis vectors (technically, unit-length orthogonal vectors):

1. The product of a basis vector with itself is unity (ie. **xx** == 1 ==
   **yy**).
1. The product of two different basis vectors is anti-communative (ie. **xy** ==
   - **yx**).


With only these two assumptions the library can demonstrate other properties
of geometric algebra, such as the associativity of the geometric product
for vectors:

```javascript
var v3 = new mv.MultiVector("-5x - 1y");
v1.mul(v2.mul(v3)).toString()
'-41x - 3y'
(v1.mul(v2)).mul(v3).toString()
'-41x - 3y'
```

**But** these two assumptions also ensure that an outer product is not
associative - just like the traditional cross-product of two vectors - whereas
all definitions that I've seen of [Geometric Algebra][1][2]define the outer product
as an associative product. Consider yourself warned - geometricalgebra.js may
be crack.

[1]: http://www.mrao.cam.ac.uk/~clifford/publications/ps/imag_numbs.pdf "See equation 2.1 of 'The Geometric Algebra of Spacetime' which is prefixed with 'By construction, the outer product is associative'."

[2]: http://books.google.de/books?id=AXTQXnws8E8C&pg=PA17&dq=outer+product+associative "Equation 1.22 of 'Geometric Algebra and Applications to Physics', then scroll back to the start of the derivation at equation 1.16a (the first one, there are two equation 1.16as on page 15) where it appears to assume the associativity of the outer product."



