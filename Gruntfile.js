// grunt build
// grunt karma:unit:start watch
// grunt karma:once


module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/*.js'],
                dest: "dist/ngCart.js"
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n <%= pkg.url %>'
            },
            dist: {
                src: 'dist/ngCart.js',
                dest: "dist/ngCart.min.js"
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                background: true
            },
            once: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            },
            travis: {
                configFile: 'test/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },

        watch: {
            karma: {
                files: ['src/**/*.js', 'test/unit/**/*.js'],
                tasks: ['karma:unit:run']
            }
        }

    });


    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');


    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('devmode', ['karma:unit', 'watch']);
    grunt.registerTask('testunit', ['karma:unit']);
    grunt.registerTask('test', ['karma:travis']);


};