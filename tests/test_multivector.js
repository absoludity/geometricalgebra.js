define(['underscore', 'multivector'], function(_, mv) {


module("MultiVector constructor checks.");


test("MultiVector constructor sets terms by value.", function() {
    var term = new mv.MultiVectorTerm(1, [1, 3]);
    var terms = [
        term,
        new mv.MultiVectorTerm(1, [2, 3]),
    ];

    var vector = new mv.MultiVector(terms);
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
        ]
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

});

