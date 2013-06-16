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
define(['underscore'], function(_) {

var isArrayOfInts = function(obj) {
    if (_.isUndefined(obj) || !_.isArray(obj)) {
        return false;
    }
    var all_ints = true;
    _.each(obj, function(basis) {
        if (!_.isNumber(basis) || basis % 1 !== 0) {
            all_ints = false;
        }
    });
    return all_ints;
};


var bubbleSortCount = function(list) {
    var new_list = list.slice(0);
    var swaps = 0, swapped = false, size = _.size(new_list);
    for(var i = 0; i < size - 1; i++) {
        swapped = false;
        for(var j = 0; j < size - 1 - i; j++) {
            if (new_list[j] > new_list[j+1]) {
                var tmp = new_list[j];
                new_list[j] = new_list[j+1];
                new_list[j+1] = tmp;
                swapped = true;
                swaps++;
            }
        }
        if (!swapped) {
            break;
        }
    }
    return {list: new_list, swaps: swaps};
};


/*
 * If two identical basis vectors are adjacent then by definition
 * the result is identity.
 */
var removeIdentities = function(list) {
    var results = [];
    var i, size = _.size(list);
    for(i = 0; i < size - 1; i++) {
        if (list[i] === list[i+1]) {
            i++;
        } else {
            results[results.length] = list[i];
        }
    }
    if (i === size - 1) {
        results[results.length] = list[size - 1];
    }
    return results;
};


/*
 * orderBasisVectors - simplify the term by ordering basis vectors.
 *
 * After ordering, any identical adjacent basis vectors are
 * removed as xx == yy == zz == 1.
 */
var orderBasisVectors = function(list) {

    var list_swaps = bubbleSortCount(list);
    return {
        sign: list_swaps.swaps % 2 === 0 ? 1 : -1,
        list: removeIdentities(list_swaps.list)
    };

};


return {
    isArrayOfInts: isArrayOfInts,
    orderBasisVectors: orderBasisVectors,
    // Exported only for testing.
    _bubbleSortCount: bubbleSortCount,
    _removeIdentities: removeIdentities
};

});
