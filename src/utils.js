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

return {
    isArrayOfInts: isArrayOfInts,
    bubbleSortCount: bubbleSortCount
};

});
