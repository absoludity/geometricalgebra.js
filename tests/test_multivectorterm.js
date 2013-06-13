define(['underscore', 'multivectorterm'], function(_, mvt) {


module("MultiVectorTerm constructor checks.");


test("MultiVectorTerm factor sets state.", function() {
    var examples = [
        {factor: 3.579, basis: [1, 3]},
        {factor: 4, basis: []}
    ];
    _.each(examples, function(example){
        var term = new mvt.MultiVectorTerm(example.factor, example.basis);

        ok(term.factor === example.factor, "Factor is set for term.");
        ok(_.isEqual(term.basis, example.basis),  "Basis are set for term.");
    });
});


test("MultiVectorTerm factor must be a number.", function() {
    var non_numbers = [
        "a",
        NaN
    ];
    _.each(non_numbers, function(non_number){
        throws(function() {mvt.MultiVectorTerm(non_number, []);},
               TypeError,
               "No error or incorrect error thrown for test value: " +
               non_number);
    });
});


test("MultiVectorTerm basis must be defined.", function() {
    throws(function() {new mvt.MultiVectorTerm(3.5);},
           TypeError,
           "The basis must be defined.");
});


test("MultiVectorTerm basis must be a array of integers only.", function() {
    var non_basis = [
        null,
        [null],
        [undefined],
        [2, 1, "a"],
        [2, 1, 3.3]
    ];
    _.each(non_basis, function(basis){
        throws(function() {new mvt.MultiVectorTerm(3.5, basis);},
              TypeError,
              "The basis is an array of integers: " + basis);
    });
});


test("MultiVectorTerms are simplified on creation.", function() {
    var examples = [{
        factor: 1.5, basis: [3, 1, 2],
        expected_factor: 1.5, expected_basis: [1, 2, 3]
    }, {
        factor: 1.5, basis: [3, 2, 1],
        expected_factor: -1.5, expected_basis: [1, 2, 3]
    }, {
        factor: 1.5, basis: [3, 3, 1],
        expected_factor: 1.5, expected_basis: [1]
    }];

    _.each(examples, function(example) {
        var term = new mvt.MultiVectorTerm(example.factor, example.basis);
        deepEqual(term.basis, example.expected_basis,
              "The terms basis vectors are simplified on creation.");
        equal(term.factor, example.expected_factor,
            "The factor has the correct sign depending on basis vector " +
            "simplification.");
    });
});


module("MultiVectorTerm multiplication checks.");


test("Multiplying by something other than a multivector term of " +
     "number fails.", function() {
    var examples = [
        null,
        "hello",
        'c',
    ];
    var term = new mvt.MultiVectorTerm(3.5, [1]);

    _.each(examples, function(example) {
        throws(function() { term.mul(example); },
               TypeError,
               "A MultiVectorTerm cannot be multiplied by " + example);
    });
});


test("Multiypling by a number results in simply multiplication.", function() {
    var examples = [{
        term: new mvt.MultiVectorTerm(1.5, [1, 2]), factor: 2,
        expected_term: new mvt.MultiVectorTerm(3, [1, 2])
    }, {
        term: new mvt.MultiVectorTerm(1.5, [1, 2]), factor: -3.5,
        expected_term: new mvt.MultiVectorTerm(-5.25, [1, 2])
    }];

    _.each(examples, function(example) {
        var result = example.term.mul(example.factor);
        deepEqual(result, example.expected_term,
                  "Multipling by a number results in scalar multiplication.");
    });
});


test("Multiplying by a MultiVectorTerm.", function() {
    var examples = [{
        term: new mvt.MultiVectorTerm(1.5, [1, 2]),
        multiplicand: new mvt.MultiVectorTerm(-2, [2, 3]),
        expected_term: new mvt.MultiVectorTerm(-3.0, [1, 3])
    }, {
        term: new mvt.MultiVectorTerm(1.5, [1, 2]),
        multiplicand: new mvt.MultiVectorTerm(-2, [1, 2]),
        expected_term: new mvt.MultiVectorTerm(3.0, [])
    }];
    _.each(examples, function(example) {
        var result = example.term.mul(example.multiplicand);
        deepEqual(result, example.expected_term,
                  "Multipling by a MultiVectorTerm is a vector product.");
    });
});


test("Multiplication can be chained.", function() {
    var examples = [{
        multiplicands: [
            new mvt.MultiVectorTerm(1.5, [1, 2]),
            new mvt.MultiVectorTerm(-3.5, [2, 3]),
            new mvt.MultiVectorTerm(1.0, [1, 3])
        ],
        expected_term: new mvt.MultiVectorTerm(5.25, [])
    }, {
        multiplicands: [
            new mvt.MultiVectorTerm(1.5, [1, 2]),
            new mvt.MultiVectorTerm(-3.5, [1, 3]),
            new mvt.MultiVectorTerm(1.0, [1])
        ],
        expected_term: new mvt.MultiVectorTerm(5.25, [1, 2, 3])
    }];

    _.each(examples, function(example) {
        var result = _.head(example.multiplicands);
        _.each(_.tail(example.multiplicands), function(multiplicand) {
            result = result.mul(multiplicand);
        });

        deepEqual(result, example.expected_term);
    });
});


module("MultiVectorTerm toString checks.");


test("Defaults to x, y, z for <= 3 basis vectors.", function() {
    var examples = [{
        term: new mvt.MultiVectorTerm(1.5, [1, 2]),
        out: "1.5xy"
    }, {
        term: new mvt.MultiVectorTerm(-2.345, [1, 2, 3]),
        out: "-2.345xyz"
    }];

    _.each(examples, function(example) {
        equal(example.term.toString(), example.out);
    });

});


test("Can explicitly request e1, e2 notation for basis vectors.", function() {
    var examples = [{
        term: new mvt.MultiVectorTerm(1.5, [1, 2]),
        out: "1.5e1e2"
    }, {
        term: new mvt.MultiVectorTerm(-2.345, [1, 2, 3]),
        out: "-2.345e1e2e3"
    }];

    _.each(examples, function(example) {
        equal(example.term.toString({xyz: false}), example.out);
    });
});


test("Terms with more than 3 dimensions automatically use e1 " +
     "notation.", function() {
    var examples = [{
        term: new mvt.MultiVectorTerm(1.5, [1, 4]),
        out: "1.5e1e4"
    }, {
        term: new mvt.MultiVectorTerm(-2.345, [1, 2, 3, 4, 5]),
        out: "-2.345e1e2e3e4e5"
    }];

    _.each(examples, function(example) {
        equal(example.term.toString(), example.out);
    });

});


module("MultiVectorTerm parsing checks.");


test("A MultiVectorTerm can be created via parsing a string.", function() {
    var examples = [{
        string: "3xz",
        expected: new mvt.MultiVectorTerm(3, [1, 3]),
    }, {
        string: "+4e1e2",
        expected: new mvt.MultiVectorTerm(4, [1, 2]),
    }, {
        string: "+ 5.345zx",
        expected: new mvt.MultiVectorTerm(-5.345, [1, 3]),
    }, {
        string: "-1e12e8",
        expected: new mvt.MultiVectorTerm(1, [8, 12]),
    }];

    _.each(examples, function(example) {
        deepEqual(mvt.MultiVectorTerm.parse(example.string),
                  example.expected);
    });
});


test("A TypeError is thrown when a string cannot be parsed as " +
     "a term.", function() {
    var examples = [
        "3xza",
        "a4xy",
        "3e3e4e",
    ];

    _.each(examples, function(example) {
        throws(function() { mvt.MultiVectorTerm.parse(example);});
    });
});

});
