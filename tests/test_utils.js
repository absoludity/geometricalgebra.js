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


module("bubbleSortCount checks.");


test("Sorts and returns the number of swaps required.", function() {
    var examples = [
        {list: [1, 2, 3], swaps: 0},
        {list: [1, 3, 2], swaps: 1},
        {list: [3, 1, 2], swaps: 2},
        {list: [3, 2, 1], swaps: 3}
    ];

    _.each(examples, function(example) {
        var result = utils.bubbleSortCount(example.list);
        equal(example.swaps, result.swaps, "The number of swaps to sort " +
                                           "is returned.");
        example.list.sort();
        deepEqual(result.list, example.list, "The resulting list is " +
                                         "sorted: " + result.list);
    });
});

});

