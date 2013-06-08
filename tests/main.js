require.config({
    //baseUrl: "./..",
    paths: {
        "underscore": "../lib/underscore-min"
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});


require(["tests.js"], function() {
    QUnit.start();
});
