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
    _.each(string.trim(), function(c) {
        if ((c === '-' || c === '+') && current_term.length > 0) {
            terms.push(current_term);
            current_term = c;
        } else {
            current_term += c;
        }
    });
    terms.push(current_term);
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
