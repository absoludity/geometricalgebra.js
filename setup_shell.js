// Load this file to simplify setting up an REPL with MultiVector loaded:
// .load setup_shell.js

var requirejs = require('requirejs');
requirejs.config({
    baseUrl: ".",
    // We omit underscore here as we need to use node's version
    // while in the repl.
    paths: {
        "multivectorterm": "src/multivectorterm",
        "multivector": "src/multivector",
        "utils": "src/utils"
    }
});

var mv = requirejs('multivector')
