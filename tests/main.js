require.config({
    baseUrl: "..",
    paths: {
        "underscore": "src/lib/underscore-min",
        "multivectorterm": "src/multivectorterm",
        "multivector": "src/multivector",
        "utils": "src/utils"
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});


require([
    "tests/test_multivectorterm",
    "tests/test_multivector",
    "tests/test_utils",
], function() {
    QUnit.start();
});
