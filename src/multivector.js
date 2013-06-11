define(['underscore', 'multivectorterm'], function(_, mvt) {


var MultiVector = function(terms) {

    var factors = {};
    _.each(terms, function(term){
        var basis, factor;
        if (_.isNumber(term)) {
            basis = '';
            factor = term;
        } else {
            basis = term.basis.toString();
            factor = term.factor;
        }
        factors[basis] = _.has(factors, basis) ? factors[basis] + factor : factor;
    });
    this.terms = _.map(_.pairs(factors), function(basis_factor) {
        var basis = basis_factor[0];
        basis = basis ? basis.split(',') : [];
        basis = _.map(basis, function(base) {
            return parseInt(base, 10);
        });
        return new mvt.MultiVectorTerm(basis_factor[1], basis);
    });
};


return {
    MultiVector: MultiVector,
    MultiVectorTerm: mvt.MultiVectorTerm
};

});
