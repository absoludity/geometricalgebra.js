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
