// geometricalgebra.js
//
// Copyright (c) 2013 - Michael Nelson <absoludity@gmail.com>
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
define(['underscore', 'multivector'], function(_, mv) {


module("MultiVector constructor checks.");


test("MultiVector constructor sets terms by value.", function() {
    var term = new mv.MultiVectorTerm(1, [1, 3]);
    var terms = [
        term,
        new mv.MultiVectorTerm(1, [2, 3]),
    ];

    var vector = new mv.MultiVector(terms);
    // Updating the term that was used to create the multivector
    // has no effect.
    term.basis[1] = 2;

    deepEqual(vector.terms, [
        new mv.MultiVectorTerm(1, [1, 3]),
        new mv.MultiVectorTerm(1, [2, 3]),
    ]);
});


test("Initial terms must be MultiVectorTerms or numbers.", function() {
    var bad_examples = [
        [mv.MultiVectorTerm(1, [1]), 3, "a"],
        [mv.MultiVectorTerm(1, [1]), null, 3],
        [mv.MultiVectorTerm(1, [1]), 3, undefined],
    ];

    _.each(bad_examples, function(bad_example) {
        throws(function() { mv.MultiVector(bad_example); },
               TypeError,
               "Terms for a multivector must be MultiVectorTerms " +
               "or numbers.");
    });
});


test("Numbers passed to constructor are converted to terms.", function() {
    var terms = [
        -6.75,
        new mv.MultiVectorTerm(1, [2, 3]),
    ];

    var vector = new mv.MultiVector(terms);

    deepEqual(vector.terms, [
        new mv.MultiVectorTerm(-6.75, []),
        new mv.MultiVectorTerm(1, [2, 3]),
    ]);
});


test("A string representation can be used to construct " +
     "a multivector.", function() {
    var vector = new mv.MultiVector("3 + y - 2xy - 5xz");

    deepEqual(vector.terms, [
        new mv.MultiVectorTerm(3, []),
        new mv.MultiVectorTerm(1, [2]),
        new mv.MultiVectorTerm(-2, [1, 2]),
        new mv.MultiVectorTerm(-5, [1, 3]),
    ]);
});


test("String parsing is consistant with output.", function() {
    var examples = [{
        input: "5x+y",
        output: "5x + 1y",
    }, {
        input: "5x + -y",
        output: "5x - 1y",
    }, {
        input: "5x - +y",
        output: "5x - 1y",
    }, {
        input: "5x - +2y",
        output: "5x - 2y",
    }, {
        input: "5x - -2y",
        output: "5x + 2y",
    }];

    _.each(examples, function(example) {
        var result = new mv.MultiVector(example.input);
        equal(result.toString(), example.output);
    });

});


test("Like terms are collected during construction.", function() {
    var examples = [{
        terms: [
            6,
            new mv.MultiVectorTerm(3, [2, 2]),
            new mv.MultiVectorTerm(1, [2, 3]),
            new mv.MultiVectorTerm(3, [2, 3]),
        ],
        expected_terms: [
            new mv.MultiVectorTerm(9, []),
            new mv.MultiVectorTerm(4, [2, 3]),
        ],
    }, {
        terms: [
            new mv.MultiVectorTerm(3, [1, 2]),
            new mv.MultiVectorTerm(-3, [1, 2]),
        ],
        expected_terms: [],
    }];

    _.each(examples, function(example) {
        var result = new mv.MultiVector(example.terms);
        deepEqual(result.terms, example.expected_terms,
                  "Like terms are collected.");
    });
});


test("Terms are sorted within the multivector.", function() {

    var result = new mv.MultiVector([
        new mv.MultiVectorTerm(3, [2, 3, 1]),
        new mv.MultiVectorTerm(3, [2, 3]),
        6,
        new mv.MultiVectorTerm(3, [1, 3]),
        new mv.MultiVectorTerm(3, [1, 2]),
    ]);

    deepEqual(result.terms, [
        new mv.MultiVectorTerm(6, []),
        new mv.MultiVectorTerm(3, [1, 2]),
        new mv.MultiVectorTerm(3, [1, 3]),
        new mv.MultiVectorTerm(3, [2, 3]),
        new mv.MultiVectorTerm(3, [1, 2, 3]),
    ]);
});


module("MultiVector toString checks.");


test("A multivector can be printed as a string.", function() {
    var examples = [{
        terms: [
            6,
            new mv.MultiVectorTerm(3, [1, 2]),
            new mv.MultiVectorTerm(-1, [2, 3]),
            new mv.MultiVectorTerm(3, [1, 2, 3]),
        ],
        expected_string: "6 + 3xy - 1yz + 3xyz",
    }, {
        terms: [
            6,
            new mv.MultiVectorTerm(3, [1, 4]),
            new mv.MultiVectorTerm(-1, [2, 3]),
            new mv.MultiVectorTerm(3, [1, 2, 3]),
        ],
        expected_string: "6 + 3e1e4 - 1e2e3 + 3e1e2e3",
    }];

    _.each(examples, function(example) {
        equal(new mv.MultiVector(example.terms).toString(),
              example.expected_string);
    });
});


test("The e1 notation can be used explicitely with " +
     "smaller grades.", function() {
    var terms = [
        6,
        new mv.MultiVectorTerm(3, [1, 2]),
        new mv.MultiVectorTerm(-1, [2, 3]),
        new mv.MultiVectorTerm(3, [1, 2, 3]),
    ];

    var result = new mv.MultiVector(terms).toString({xyz: false});

    equal(result, "6 + 3e1e2 - 1e2e3 + 3e1e2e3");
});


module("MultiVector parsing checks.");


test("A MultiVector can be created via parsing a string.", function() {
    var examples = [{
        string: "4 + 3xz",
        expected: new mv.MultiVector([4, new mv.MultiVectorTerm(3, [1, 3])]),
    }, {
        string: " -3xy + 4e1e2",
        expected: new mv.MultiVector([new mv.MultiVectorTerm(1, [1, 2])]),
    }, {
        string: "+ 5.345zx",
        expected: new mv.MultiVector([new mv.MultiVectorTerm(-5.345, [1, 3])]),
    }, {
        string: "-1e12e8 - 1 + 2xz",
        expected: new mv.MultiVector([
            new mv.MultiVectorTerm(-1, [12, 8]),
            new mv.MultiVectorTerm(2, [1, 3]),
            -1,
        ]),
    }];

    _.each(examples, function(example) {
        deepEqual(mv.MultiVector.parse(example.string),
                  example.expected);
    });
});


module("MultiVector multiplication checks.");


test("Two multivectors can be multiplied.", function() {
    var examples = [{
        one: new mv.MultiVector("1x + 2y + 3z"),
        two: new mv.MultiVector("2x + 3y + 4z"),
        expected: new mv.MultiVector("20 - 1xy - 2xz - 1yz"),
    }, {
        one: new mv.MultiVector("5x + 5y + 5z"),
        two: new mv.MultiVector("5x + 5y + 5z"),
        expected: new mv.MultiVector("75"),
    }, {
        one: new mv.MultiVector("0"),
        two: new mv.MultiVector("5x + 5y + 5z"),
        expected: new mv.MultiVector("0"),
    }, {
        one: new mv.MultiVector("1"),
        two: new mv.MultiVector("5x + 5y + 5z"),
        expected: new mv.MultiVector("5x + 5y + 5z"),
    }];

    _.each(examples, function(example) {
        equal(example.one.mul(example.two).toString(),
              example.expected.toString());
    });
});


module("MultiVector addition checks.");


test("Two multivectors can be added.", function() {
    var examples = [{
        one: new mv.MultiVector("1x + 2y + 3z"),
        two: new mv.MultiVector("2x + 3y + 4z"),
        expected: new mv.MultiVector("3x + 5y + 7z"),
    }, {
        one: new mv.MultiVector("5x + 5y + 5xz"),
        two: new mv.MultiVector("5x + 5y + 5z"),
        expected: new mv.MultiVector("10x + 10y + 5z + 5xz"),
    }, {
        one: new mv.MultiVector("0"),
        two: new mv.MultiVector("5x + 5y + 5z"),
        expected: new mv.MultiVector("5x + 5y + 5z"),
    }];

    _.each(examples, function(example) {
        equal(example.one.add(example.two).toString(),
              example.expected.toString());
    });
});


test("Two multivectors can be subtracted.", function() {
    var examples = [{
        one: new mv.MultiVector("1x + 2y + 3z"),
        two: new mv.MultiVector("2x + 3y + 4z"),
        expected: new mv.MultiVector("-1x - 1y - 1z"),
    }, {
        one: new mv.MultiVector("5x + 5y + 5xz"),
        two: new mv.MultiVector("5x + 5y + 5z"),
        expected: new mv.MultiVector("-5z + 5xz"),
    }, {
        one: new mv.MultiVector("5x + 5y + 5z"),
        two: new mv.MultiVector("0"),
        expected: new mv.MultiVector("5x + 5y + 5z"),
    }];

    _.each(examples, function(example) {
        equal(example.one.sub(example.two).toString(),
              example.expected.toString());
    });
});


test("The geometric product is associative for vectors", function() {
    var examples = [[
        new mv.MultiVector("1x + 2y + 3z"),
        new mv.MultiVector("2x + 3y + 4z"),
        new mv.MultiVector("-3x + 4.5y - 8z"),
    ], [
        new mv.MultiVector("-x + 2y - 3z"),
        new mv.MultiVector("2x + 3y + 4z"),
        new mv.MultiVector("-9x + 25y + 20z"),
    ]];

    _.each(examples, function(example) {
        equal(
            (example[0].mul(example[1])).mul(example[2]).toString(),
            example[0].mul((example[1].mul(example[2]))).toString());
    });
});

});

