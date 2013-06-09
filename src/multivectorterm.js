define(['underscore', 'utils'], function(_, utils) {

var MultiVectorTerm = function(factor, basis) {
    if (isNaN(factor)) {
        throw new TypeError(
            "The factor for a MultiVectorTerm must be a number.");
    }
    if (!utils.isArrayOfInts(basis)) {
        throw new TypeError(
            "The basis for a MultiVectorTerm must be an array " +
            "of integers.");
    }

    var simplified = utils.orderBasisVectors(basis);

    this.factor = simplified.sign * factor;
    this.basis = simplified.list;
};

return {
    MultiVectorTerm: MultiVectorTerm
};

});
