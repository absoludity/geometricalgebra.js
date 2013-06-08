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

QUnit.config.autostart = false;

require(["tests.js"], function() {
    //QUnit.start();
});
