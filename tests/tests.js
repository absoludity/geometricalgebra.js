module("MultiVectorTerm Tests");

test("MultiVectorTerm factor sets state.", function() {
    var term = new MultiVectorTerm(3.579, [1, 3]);

    ok(term.factor === 3.579, "Factor is set for term.");
    ok(_.isEqual([1, 3], term.basis),  "Basis are set for term.");
});
 
test("MultiVectorTerm factor must be a number.", function() {
    var non_numbers = [
        "a",
        NaN
    ];
    _.each(non_numbers, function(non_number){
        throws(function() {MultiVectorTerm(non_number, []);}, 
               TypeError,
               "No error or incorrect error thrown for test value: " +
               non_number);
    });
});

test("MultiVectorTerm basis must be defined.", function() {
    throws(function() {new MultiVectorTerm(3.5);},
           TypeError,
           "The basis must be defined.");
});

test("MultiVectorTerm basis must be a array of integers only.", function() {
    var non_basis = [
        null,
        [],
        [null],
        [undefined],
        [2, 1, "a"],
        [2, 1, 3.3]
    ];
    _.each(non_basis, function(basis){
        throws(function() {MultiVectorTerm(3.5, basis);},
              TypeError,
              "The basis is an array of integers: " + basis);
    });
});

test("truthy", function() {
  ok(true, "true is truthy");
  equal(1, true, "1 is truthy");
  notEqual(0, true, "0 is NOT truthy");
});
