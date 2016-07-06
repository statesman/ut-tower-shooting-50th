var ENV_STAGE = process.env.ENV_STAGE || 's:/projects/';
var fs = require("fs");
var request = require("request");

module.exports = function(grunt) {
  'use strict';

  // this is the directory path to your project on the stage/prod servers
  var site_path = "ut-tower-shooting-50th-anniversary";

  // Project configuration.
  grunt.initConfig({

    // Clean files from dist/ before build
    clean: {
      css: ["public/dist/*.css", "public/dist/*.css.map"],
      js: ["public/dist/*.js", "public/dist/*.js.map"],
      fonts: ["public/fonts/**"],
      pages: ["public/**.html"]
    },

    // Copy FontAwesome/slick files to the fonts/ directory
    copy: {
       fonts: {
        src: [
          'node_modules/font-awesome/fonts/**',
          'node_modules/slick-carousel/slick-carousel/fonts/**'
        ],
        dest: 'public/fonts/',
        flatten: true,
        expand: true
    },
    scripts: {
     src: [
       'src/js/front.js',
       'src/js/shootingdata.js',
       'src/js/interviews.js'
     ],
     dest: 'public/dist/js/',
     flatten: true,
     expand: true
   }
    },

    // Transpile LESS
    less: {
      options: {
        sourceMap: true,
        sourceMapFilename: 'public/dist/style.css.map',
        sourceMapURL: 'style.css.map',
        sourceMapRootpath: '../',
        paths: ['node_modules/bootstrap/less']
      },
      prod: {
        options: {
          compress: true,
          yuicompress: true
        },
        files: {
          "public/dist/style.css": [
              "node_modules/slick-carousel/slick/slick.less",
              "src/css/style.less"
          ]
        }
      }
    },

    // Run our JavaScript through JSHint
    jshint: {
      js: {
        src: ['src/js/**.js']
      }
    },

    // Lint our Bootstrap usage
    bootlint: {
      options: {
        relaxerror: ['W005']
      },
      files: 'public/**.html',
    },

    // Use Uglify to bundle up a pym file for the home page
    uglify: {
      options: {
        sourceMap: true
      },
      prod: {
        files: {
          'public/dist/scripts.js': [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/underscore/underscore.js',
            'node_modules/imagesloaded/imagesloaded.pkgd.js',
            'node_modules/slick-carousel/slick/slick.js',
            'node_modules/d3/d3.js',
            'node_modules/d3-queue/build/d3-queue.js',
            'node_modules/topojson/build/topojson.js',
            'node_modules/masonry-layout/dist/masonry.pkgd.js',
            'src/js/slider.js',
            'src/js/main.js'
          ]
        }
      }
    },

    // Watch for changes in LESS and JavaScript files,
    // relint/retranspile when a file changes
    watch: {
      options: {
        livereload: true,
      },
      templates: {
        files: ['pages/**/*', 'layouts/*', 'helpers/**', 'partials/*'],
        tasks: ['build:html']
      },
      scripts: {
        files: ['src/js/**.js'],
        tasks: ['copy:scripts', 'build:js']
      },
      styles: {
        files: ['src/css/**.less', 'src/css/**/**.less'],
        tasks: ['build:css']
      }
    },

    // A simple little development server
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          base: 'public',
          keepalive: true,
          livereload: true,
          open: true
        }
      }
    },

    // A tool to run the webserver and livereloader simultaneously
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: ['connect', 'watch']
    },

    // Bake out static HTML of our pages
    generator: {
      prod: {
        files: [{
          cwd: 'pages',
          src: ['**/*'],
          dest: 'public'
        }],
        options: {
          partialsGlob: 'partials/*.hbs',
          templates: 'layouts',
          templateExt: 'hbs',
          helpers: require('./helpers'),
          base: 'http://projects.statesman.com/news/' + site_path,
          nav: [
            {
              title: "Introduction",
              subtitle: "A new kind of madness",
              file: "index"
            },
            {
              title: "Mass shootings",
              subtitle: "Explore U.S. data",
              file: "shootingdata"
            },
            {
              title: "Interviews",
              subtitle: "Watch the videos",
              file: "interviews"
          },
            {
              title: "Coverage and documents",
              subtitle: "Browse the archives",
              file: "archives"
            }
          ]
        }
      }
    },

    // stage path needs to be set
    ftpush: {
      stage: {
        auth: {
          host: 'host.coxmediagroup.com',
          port: 21,
          authKey: 'cmg'
        },
        src: 'public',
        dest: '/stage_aas/projects/news/' + site_path,
        exclusions: ['dist/tmp','Thumbs.db','.DS_Store'],
        simple: false,
        useList: false
      },
      // prod path will need to change
      prod: {
        auth: {
          host: 'host.coxmediagroup.com',
          port: 21,
          authKey: 'cmg'
        },
        src: 'public',
        dest: '/prod_aas/projects/news/' + site_path,
        exclusions: ['dist/tmp','Thumbs.db','.DS_Store'],
        simple: false,
        useList: false
      }
    },

  });

  // Load the task plugins
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-generator');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-bootlint');
  grunt.loadNpmTasks('grunt-ftpush');

// register a custom task to hit slack
grunt.registerTask('slack', function(where_dis_go) {

    // first, check to see if there's a .slack file
    // (this file has the webhook endpoint)
    if(grunt.file.isFile('.slack')) {

        // homeboy here runs async, so
        var done = this.async();

        // prod or stage?
        var ftp_path = where_dis_go === "prod" ? "http://projects.statesman.com/news/" + site_path : "http://stage.host.coxmediagroup.com/aas/projects/news/" + site_path;

        // do whatever makes you feel happy here
        var payload = {
            "text": "yo dawg i heard you like pushing code to *ut-tower-shooting*: " + ftp_path,
            "channel": "#bakery",
            "username": "Xzibit",
            "icon_url": "http://projects.statesman.com/slack/icon_img/xzibit.jpg"
        };

        // send the request
        request.post(
            {
                url: fs.readFileSync('.slack', {encoding: 'utf8'}),
                json: payload
            },
            function callback(err, res, body) {
                done();
                if (body !== "ok") {
                    return console.error('upload failed:', body);
                }
            console.log('we slacked it up just fine people, good work');
        });
    }
    // if no .slack file, log it
    else {
        grunt.log.warn('No .slack file exists. Skipping Slack notification.');
    }
});

  // Assorted build tasks
  grunt.registerTask('build:html', ['clean:pages', 'generator', 'bootlint']);
  grunt.registerTask('build:css', ['clean:css', 'clean:fonts', 'copy', 'less']);
  grunt.registerTask('build:js', ['clean:js', 'jshint', 'uglify']);
  grunt.registerTask('build', ['build:html', 'build:js', 'build:css']);

  // Publishing tasks
  grunt.registerTask('stage', ['build', 'ftpush:stage','slack:stage']);

  // A dev task that runs a build then launches a dev server w/ livereload
  grunt.registerTask('default', ['build', 'concurrent']);
};
