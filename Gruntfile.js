// grunt pre --app=[acl|swish] --environment=[production|staging]
// grunt build --app=[acl|swish] --environment=[production|staging]
// grunt upload --app=[acl|swish] --environment=[production|staging]
// grunt deploy --app=[acl|swish]   --environment=[production|staging]  #builds and deploys

module.exports = function (grunt) {

    //  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);


    var app = grunt.option('app');


    function getBucket(){

        var bucket = 'podium-sears-' + app
          if (grunt.option('environment') == 'staging') {
              bucket += '-staging';
          }
        return bucket;
    }


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: grunt.file.readJSON('.bowerrc'),
        aws: grunt.file.readJSON('grunt-aws.json'),

        config: {
            acl: {
                options: {
                    variables: {
                        "app": "clients/acl",
                        "dist": "dist/acl",
                        "s3Bucket":  getBucket()
                    }
                }
            },
            swish: {
                options: {
                    variables: {
                        "app": "clients/swish",
                        "dist": "dist/swish",
                        "s3Bucket": getBucket()
                    }
                }
            }
        },

        replace: {
            setLocal: {
                options: {
                    usePrefix: false,
                    patterns: [
                        {
                            match: 'http://sears.elasticbeanstalk.com',
                            replacement: 'http://rawtest.podiumresellersearsapi.com'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= grunt.config.get('dist') %>",
                        dest: "<%= grunt.config.get('dist') %>",
                        src: ['js/podiumApp.js']
                    }
                ]
            },
            setProduction: {
                options: {

                    usePrefix: false,
                    patterns: [
                        {
                            match: 'http://rawtest.podiumresellersearsapi.com',
                            replacement: 'http://sears.elasticbeanstalk.com'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= grunt.config.get('dist') %>",
                        dest: "<%= grunt.config.get('dist') %>",
                        src: ['js/podiumApp.js']
                    }
                ]
            }
        },

        less: {
            development: {
                options: {
                },
                files: {
                    "<%= grunt.config.get('app') %>/css/bootstrap.css": "<%= bower.directory %>/bootstrap/less/bootstrap.less"
                }
            },
            acl: {
                options: {
                    modifyVars: {
                        "brand-primary": '#005596',
                        "headings-color": '@brand-primary',
                        "jumbotron-heading-color": '@brand-primary',
                        "jumbotron-bg": 'transparent',
                        "navbar-default-bg": '@brand-primary',
                        "navbar-default-border": 'none',
                        "navbar-default-link-color": '#fff',
                        "navbar-default-link-active-bg": '#4d88b6',
                        "navbar-default-link-active-color": '#fff',
                        "navbar-default-link-hover-bg": '#4d88b6',
                        "navbar-default-link-hover-color": '#fff'
                        //"navbar-default-link-active-bg": 'lighten(@navbar-default-bg, 30%)'
                    }
                },
                files: {
                    "<%= grunt.config.get('app') %>/css/bootstrap.css": "<%= bower.directory %>/bootstrap/less/bootstrap.less"
                }
            },
            swish: {
                options: {
                    modifyVars: {
                        "brand-primary": '#E01837',
                        "headings-color": '@brand-primary',
                        "jumbotron-heading-color": '@brand-primary',
                        "jumbotron-bg": 'transparent',
                        "navbar-default-bg": '@brand-primary',
                        "navbar-default-border": 'none',
                        "navbar-default-link-color": '#fff',
                        "navbar-default-link-active-bg": '#E95D73',
                        "navbar-default-link-active-color": '#fff',
                        "navbar-default-link-hover-bg": '#E95D73',
                        "navbar-default-link-hover-color": '#fff'
                        //"navbar-default-link-active-bg": 'lighten(@navbar-default-bg, 30%)'
                    }
                },
                files: {
                    "<%= grunt.config.get('app') %>/css/bootstrap.css": "<%= bower.directory %>/bootstrap/less/bootstrap.less"
                }
            },
            production: {
                options: {
                    paths: ["assets/css"],
                    cleancss: true,
                    modifyVars: {
                        imgPath: '"http://mycdn.com/path/to/images"',
                        bgColor: 'red'
                    }
                },
                files: {
                    "path/to/result.css": "path/to/source.less"
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        },

        copy: {
            pre: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= bower.directory  %>/bootstrap/fonts/",
                        dest: "<%= grunt.config.get('app') %>/fonts/",
                        src: ["**/*.*"]
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= grunt.config.get('app') %>",
                        dest: "<%= grunt.config.get('dist') %>",
                        src: ['index.html',  'app/**/*.*',   '!app/bower_components/**',   'img/**/*.*',  'partials/**/*.html', 'fonts/**/*.*'] //'js/**/*.*', No JS as is already included with usemin
                    }
                ]
            }
        },

        useminPrepare: {
            html: "<%= grunt.config.get('app') %>/index.html",
            options: {
                dest: "<%= grunt.config.get('dist') %>"
            }
        },

        usemin: {
            html: ["<%= grunt.config.get('dist') %>/**/*.html", "!<%= grunt.config.get('dist') %>/bower_components/**"],
            options: {
                dirs: ["<%= grunt.config.get('dist') %>"]
            }
        },

        html2js: {
            options: {
                // custom options, see below
            },
            main: {
                src: ['app/partials/**/*.html'],
                dest: 'tmp/templates.js'
            }
        },



        aws_s3: {
            options: {
                accessKeyId: '<%= aws.key %>', // Use the variables
                secretAccessKey: '<%= aws.secret %>', // You can also use env variables
                region: 'us-east-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5, // 5 simultaneous downloads
                differential: true, // Only uploads the files that have changed
                displayChangesOnly: true, // Only uploads the files that have changed
                access:'public-read',
                params: {
                    CacheControl: 'max-age=630720000, public' // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
                }

//                params: {
//                    "CacheControl": "max-age=630720000, public",
//                    "Expires": new Date(Date.now() + 63072000000),
//                    "ContentEncoding": 'gzip' // applies to all the files!
//                }
            },
            dev: {
                options: {
                    bucket: "<%= grunt.config.get('s3Bucket') %>"
                },
                files: [
                    {
                        cwd: "<%= grunt.config.get('dist') %>",  //Start in this folder
                        dest: "/",
                        action: 'delete'
                    },
                    {
                        expand: true,
                        cwd: "<%= grunt.config.get('dist') %>",  // Start in this folder
                        src: ["**/*.*"],                         // Read these files inside cwd
                        dest: ""
                    }
                ]
            }
        }



    });


    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-config');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-aws-s3');
//    grunt.loadNpmTasks('grunt-contrib-watch');



    grunt.registerTask('pre',       ['config:' + app, 'less:' + app, 'copy:pre']);
    grunt.registerTask('build',      ['config:' + app, 'useminPrepare',  'copy:dist', 'concat', 'uglify', 'cssmin', 'usemin']);
    grunt.registerTask('upload',     ['config:' + app, 'replace:setProduction', 'aws_s3:dev', 'replace:setLocal']);
    grunt.registerTask('deploy',     ['build', 'upload']);



    grunt.registerTask('test', ['jshint']);

};