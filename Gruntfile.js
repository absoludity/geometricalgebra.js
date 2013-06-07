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
            "unused": true,
            "eqeqeq": true
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('test', ['qunit']);
};
