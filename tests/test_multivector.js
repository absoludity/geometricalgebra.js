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

});

