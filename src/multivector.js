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
define(['underscore', 'multivectorterm'], function(_, mvt) {

var MultiVector = function(terms) {
    if (_.isString(terms)) {
        terms = MultiVector.parseTerms(terms);
    }
    terms = convertNumbersToTerms(terms);
    terms = aggregateCommonBasis(terms);
    this.terms = sortByGradeThenBasis(terms);
};


MultiVector.prototype.toString = function(options) {
    options = _.isUndefined(options) ? {xyz: true} : options;
    options.xyz = (maxDimensionForMultiVector(this) > 3) ? false : options.xyz;
    var terms = _.map(this.terms, function(term) { return term.toString(options);});
    return terms.join(" + ").replace("+ -", "- ");
};


MultiVector.parseTerms = function(string) {
    var terms = [];
    var current_term = "";
    var sign = '';
    _.each(string.trim(), function(c) {
        if (c === '+') {
            if (current_term.length > 0) {
                terms.push(sign + current_term);
                current_term = '';
                sign = '';
            }
        } else if (c === '-') {
            if (current_term.length > 0) {
                terms.push(sign + current_term);
                current_term = '';
                sign = '-';
            } else {
                if (sign === '') {
                    sign = '-';
                } else {
                    sign = '';
                }
            }
        } else if (c !== ' ') {
            current_term += c;
        }
    });
    terms.push(sign + current_term);
    return _.map(terms, mvt.MultiVectorTerm.parse);
};


MultiVector.parse = function(string) {
    return new MultiVector(MultiVector.parseTerms(string));
};


MultiVector.prototype.mul = function(that) {
    var terms = [];
    _.each(this.terms, function(this_term) {
        _.each(that.terms, function(that_term) {
            terms.push(new mvt.MultiVectorTerm(
                this_term.factor * that_term.factor,
                this_term.basis.concat(that_term.basis)));
        });
    });
    return new MultiVector(terms);
};


MultiVector.prototype.add = function(that) {
    return new MultiVector(this.terms.concat(that.terms));
};


MultiVector.prototype.sub = function(that) {
    return new MultiVector(this.terms.concat(
        _.map(that.terms, function(term) {
            return new mvt.MultiVectorTerm(-1 * term.factor, term.basis);
        })));
};


// private helper functions.
var convertNumbersToTerms = function(terms) {
    return _.map(terms, function(term) {
        return _.isNumber(term) ? new mvt.MultiVectorTerm(term, []) : term;
    });
};


var aggregateCommonBasis = function(terms) {
    var terms_by_basis = _.groupBy(terms, 'basis');
    terms = _.map(_.values(terms_by_basis), function(terms_for_basis) {
        var factor = _.reduce(terms_for_basis, function(memo, term) {
            return memo + term.factor;
        }, 0);
        return new mvt.MultiVectorTerm(factor, terms_for_basis[0].basis);
    });

    return _.filter(terms, function(term) {
        return term.factor !== 0;
    });

};


var sortByGradeThenBasis = function(terms) {
    return _.sortBy(terms, function(term) {
        return [term.basis.length, term.basis];
    });
};


var maxDimensionForMultiVector = function(multivector) {
    return _.reduce(multivector.terms, function(memo, term) {
        return _.max(term.basis.concat([memo]));
    }, 0);
};


return {
    MultiVector: MultiVector,
    MultiVectorTerm: mvt.MultiVectorTerm
};

});
