define(['underscore', 'utils'], function(_, utils) {


module("isArrayOfInts checks.");


test("Returns true if arg is an array of ints", function() {
    var true_examples = [
        [],
        [1],
        [3, 38749, 6]
    ];
    _.each(true_examples, function(example){
        equal(true, utils.isArrayOfInts(example));
    });
});


test("Returns false if arg is not an array of ints", function() {
    var false_examples = [
        null,
        [null],
        [undefined],
        [2, 1, "a"],
        [2, 1, 3.3]
    ];
    _.each(false_examples, function(example){
        equal(false, utils.isArrayOfInts(example));
    });
});

});

