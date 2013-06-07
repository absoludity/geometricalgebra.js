var isArrayOfInts = function(obj) {
    if (_.isUndefined(obj) || !_.isArray(obj) || _.isEmpty(obj)) {
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

function MultiVectorTerm(factor, basis) {
    if (isNaN(factor)) {
        throw new TypeError(
            "The factor for a MultiVectorTerm must be a number.");
    }
    if (!isArrayOfInts(basis)) {
        throw new TypeError(
            "The basis for a MultiVectorTerm must be an array " +
            "of integers.");
    }

    this.factor = factor;
    this.basis = basis;
}
