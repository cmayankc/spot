module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    
    //concat task definition
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: '\n\n;'
      },
      dist: {
        // the files to concatenate
        options: {},
        files: {
          'dist/js/app.js': ['js/app.js', 'js/modules/**/*.js'],
          'dist/js/vendor.js': ['lib/angular.js']
        }
      }
    },

    //uglify task definition
    uglify: {
      options: {
        mangle: false,
      },
      dist: {
        files: {
          'dist/js/app.min.js': ['dist/js/app.js'],
          'dist/js/templates.min.js': ['dist/js/templates.js'],
          'dist/js/vendor.min.js': ['dist/js/vendor.js']
        }
      }
    },

    //'jshint' task definition
    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'js/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        jshintrc: 'jshintrc.json',
        
        // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },

    // Sass task definition
    sass: {
        options: {
            sourceMap: true,
            outputStyle: 'compact'//'compressed'
        },
        dist: {
            files: {
              'dist/css/vendor.css': 'sass/vendor.scss',
              'dist/css/app.css': 'sass/app.scss'
            }
        }
    },

    //clean task definition
    clean: {
      dist: {
        options: {
            force: true
        },
        src: ['dist']
      }
    },

    //copy task definition
    copy: {
        dist: {
            files: [
                {
                    expand: true,
                    // cwd: "/",
                    src: ["img/**", "config/*.json", "*.html"],
                    dest: "dist/"
                }
            ]
        }
    },

    //ngtemplates task definition
    ngtemplates: {
      'spot-app': {
        // cwd: '',
        src: 'partials/*.html',
        dest: 'dist/js/templates.js'
      }
    }
  });

  // Load the plugin that provides the "Sass" task.
  grunt.loadNpmTasks('grunt-sass');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load the plugin that provides the "clean" task.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Load the plugin that provides the "copy" task.
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Load the plugin that provides the "ngtemplates" task.
  grunt.loadNpmTasks('grunt-angular-templates');

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('default', ['jshint', 'clean', 'ngtemplates', 'concat', 'sass', 'uglify', 'copy']);

};