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

return {
    isArrayOfInts: isArrayOfInts
};

});
