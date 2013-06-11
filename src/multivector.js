define(['underscore', 'multivectorterm'], function(_, mvt) {


var MultiVector = function(terms) {

    // Handle numbers being passed as terms.
    terms = _.map(terms, function(term) {
        return _.isNumber(term) ? new mvt.MultiVectorTerm(term, []) : term;
    });

    // Group the terms by their basis, then aggregate the factors for each
    // basis, returning a single term per basis.
    var terms_by_basis = _.groupBy(terms, 'basis');
    terms = _.map(_.values(terms_by_basis), function(terms_for_basis) {
        var factor = _.reduce(terms_for_basis, function(memo, term) {
            return memo + term.factor;
        }, 0);
        return new mvt.MultiVectorTerm(factor, terms_for_basis[0].basis);
    });

    // Sort the terms by the grade (ie. e1 befor e1e2),
    // then the (sorted) basis.
    this.terms = _.sortBy(terms, function(term) {
        return [term.basis.length, term.basis];
    });
};


return {
    MultiVector: MultiVector,
    MultiVectorTerm: mvt.MultiVectorTerm
};

});
