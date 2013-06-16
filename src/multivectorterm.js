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


var multivectorterm_re = /^(-|\+)?\s*(\d*\.?\d*)([xyz]*|(?:e\d+)*)\s*$/;


MultiVectorTerm.parse = function(string) {
    var matches = string.match(multivectorterm_re);
    if (_.isNull(matches)) {
        throw new TypeError(
            "Cannot parse '" + string + "' as a multivector term.");
    }
    var factor = parseFactor(matches);
    var basis = parseBasis(matches);

    return new MultiVectorTerm(factor, basis);
};


var parseFactor = function(matches) {
    var sign = matches[1];
    var factor = matches[2];
    factor = (factor.length === 0) ? 1 : parseFloat(factor, 10);
    return (sign === '-') ? factor * -1 : factor;
};


var parseBasis = function(matches) {
    var basis = matches[3];
    if (basis.length === 0) {
        basis = [];
    } else if (basis[0] === 'e') {
        basis = basis.slice(1).split('e');
        basis = _.map(basis, function(base) {
            return parseFloat(base, 10);
        });
    } else {
        basis = _.map(basis, function(base) {
            var dimension = MultiVectorTerm.THREE_DIMENSION_LABELS.indexOf(
            base);
            if (dimension === -1) {
                throw new TypeError(
                    "Cannot parse '" + basis + "' as the multivector basis.");
            }
            return dimension;
        });
    }
    return basis;
};


return {
    MultiVectorTerm: MultiVectorTerm
};

});
