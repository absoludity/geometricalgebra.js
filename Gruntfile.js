module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    qunit: {
        all: ['tests/*.html']
    },
    watch: {
        files: ['tests/*.js', 'tests/*.html', 'src/*.js'],
        tasks: ['qunit', 'jshint']
    },
    jshint: {
        all: ['Gruntfile.js', 'src/*.js', 'tests/*.js'],
        options: {
            "curly": true,
            "eqnull": true,
            "eqeqeq": true,
            "unused": true,
            "undef": true,
            "globals": {
                "module": true,
                "define": true,
                "require": true,
                // QUnit and it's assertions.
                "QUnit": true,
                "test": true,
                "ok": true,
                "throws": true,
                "equal": true,
                "deepEqual": true
            }
        }
    },
    requirejs: {
        compile: {
            options: {
                paths: {
                    "underscore": "src/lib/lodash.min",
                    "multivectorterm": "src/multivectorterm",
                    "multivector": "src/multivector",
                    "geometricalgebra": "src/geometricalgebra",
                    "utils": "src/utils"
                },
                name: 'geometricalgebra',
                out: 'geometricalgebra.js'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['jshint', 'qunit', 'build']);
  grunt.registerTask('test', ['qunit']);
  grunt.registerTask('build', ['requirejs']);
};
