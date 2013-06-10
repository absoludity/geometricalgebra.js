require.config({
    //baseUrl: "./..",
    paths: {
        "underscore": "../lib/underscore-min",
        "multivectorterm": "../src/multivectorterm",
        "multivector": "../src/multivector",
        "utils": "../src/utils"
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});


require(["test_multivectorterm", "test_multivector", "test_utils"], function() {
    QUnit.start();
});
