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


test("BasisVectors are ordered and simplified.", function() {
    var examples = [
        {in: [1, 2, 2, 3], out: {sign: 1, list: [1, 3]}},
        {in: [1, 3, 2, 3], out: {sign: -1, list: [1, 2]}},
        {in: [3, 2, 1, 1, 2], out: {sign: 1, list: [3]}}
    ];

    _.each(examples, function(example) {
        var result = utils.orderBasisVectors(example.in);
        deepEqual(result, example.out, "Basis vectors are reordered and " +
                                       "simplified.");
    });
});

module("Private utility method checks.");


test("Sorts and returns the number of swaps required.", function() {
    var examples = [
        {list: [1, 2, 3], swaps: 0},
        {list: [1, 3, 2], swaps: 1},
        {list: [3, 1, 2], swaps: 2},
        {list: [3, 2, 1], swaps: 3}
    ];

    _.each(examples, function(example) {
        var result = utils._bubbleSortCount(example.list);
        equal(example.swaps, result.swaps, "The number of swaps to sort " +
                                           "is returned.");
        example.list.sort();
        deepEqual(result.list, example.list, "The resulting list is " +
                                         "sorted: " + result.list);
    });
});


test("Removes adjacent identical integers.", function() {
    var examples = [
        {in: [1, 2, 2, 3], out: [1, 3]},
        {in: [1, 2, 1, 3], out: [1, 2, 1, 3]},
        {in: [1, 2, 1, 3, 3], out: [1, 2, 1]},
        {in: [1, 2, 2, 2, 3], out: [1, 2, 3]}
    ];

    _.each(examples, function(example) {
        var result = utils._removeIdentities(example.in);
        deepEqual(result, example.out, "Adjacent identical ints are removed.");
    });

});

});

