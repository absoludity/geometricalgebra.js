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


MultiVectorTerm.prototype.mul = function(value) {
    if (_.isNumber(value)) {
        return new MultiVectorTerm(value * this.factor, this.basis);
    } else if (value instanceof MultiVectorTerm) {
        return new MultiVectorTerm(this.factor * value.factor,
                                   this.basis.concat(value.basis));
    } else {
        throw new TypeError(
            "A MultiVectorTerm can only be multiplied by another " +
            "MultiVectorTerm or a number.");
    }
};


MultiVectorTerm.THREE_DIMENSION_LABELS = ['', 'x', 'y', 'z'];


MultiVectorTerm.prototype.toString = function(options) {
    var basis_str;
    if ((_.isObject(options) && _.has(options, 'xyz') && !options.xyz) ||
        (_.max(this.basis) > 3)) {
        basis_str = _.map(this.basis, function(dimension) {
            return "e" + dimension;
        }).join("");
    } else {
        basis_str = _.map(this.basis, function(dimension) {
            return MultiVectorTerm.THREE_DIMENSION_LABELS[dimension];
        }).join("");
    }
    return this.factor + basis_str;
};


return {
    MultiVectorTerm: MultiVectorTerm
};

});
