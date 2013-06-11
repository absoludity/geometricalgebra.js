define(['underscore', 'multivectorterm'], function(_, mvt) {

var MultiVector = function(terms) {

    terms = convertNumbersToTerms(terms);
    terms = aggregateCommonBasis(terms);
    this.terms = sortByGradeThenBasis(terms);
};


var convertNumbersToTerms = function(terms) {
    return _.map(terms, function(term) {
        return _.isNumber(term) ? new mvt.MultiVectorTerm(term, []) : term;
    });
};


var aggregateCommonBasis = function(terms) {
    var terms_by_basis = _.groupBy(terms, 'basis');
    return _.map(_.values(terms_by_basis), function(terms_for_basis) {
        var factor = _.reduce(terms_for_basis, function(memo, term) {
            return memo + term.factor;
        }, 0);
        return new mvt.MultiVectorTerm(factor, terms_for_basis[0].basis);
    });
};


var sortByGradeThenBasis = function(terms) {
    return _.sortBy(terms, function(term) {
        return [term.basis.length, term.basis];
    });
};


return {
    MultiVector: MultiVector,
    MultiVectorTerm: mvt.MultiVectorTerm
};

});
