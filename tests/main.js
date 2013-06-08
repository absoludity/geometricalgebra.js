require.config({
    //baseUrl: "./..",
    paths: {
        "underscore": "../lib/underscore-min",
        "multivectorterm": "../src/multivectorterm",
        "utils": "../src/utils"
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});


require(["test_multivectorterm", "test_utils"], function() {
    QUnit.start();
});
