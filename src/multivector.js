define(['underscore', 'multivectorterm'], function(_, mvt) {


var MultiVector = function(terms) {

    this.terms = _.map(terms, function(term) {
        return new mvt.MultiVectorTerm(term.factor, term.basis);
    });
};


return {
    MultiVector: MultiVector,
    MultiVectorTerm: mvt.MultiVectorTerm
};

});
