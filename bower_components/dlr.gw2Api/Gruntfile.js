var semver = require('semver'),
    f = require('util').format,
    files = {
      gw2Api: [
      'src/gw2Api.js',
      'src/Error.js',
      'src/ajax.js',
      'src/utils.js',
      'src/config.js',
      'src/ResponseHeader.js',
      'src/Parameters.js',
      'src/Endpoint.js',
      'src/Endpoints.js'
      ]
    };

module.exports = function(grunt) {
  grunt.initConfig({
    version: grunt.file.readJSON('package.json').version,

    tempDir: 'dist_temp',
    buildDir: 'dist',

    banner: [
      '/*!',
      ' * gw2Api.js <%= version %>',
      ' * https://github.com/dyanarose/gw2Api.js',
      ' * Copyright 2015-<%= grunt.template.today("yyyy") %> Dyana Rose; Licensed MIT',
      ' */\n\n'
    ].join('\n'),
    karma: {
      dist: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      offline:{
        configFile: 'karma.offline.conf.js',
        singleRun: true
      },
      unit:{
        configFile: 'karma.unit.conf.js',
        singleRun: true
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },

      concatgw2Api: {
        options: {
          mangle: false,
          beautify: true,
          compress: false,
          banner: ''
        },
        src: files.gw2Api,
        dest: '<%= tempDir %>/gw2Api.js'
      },
      gw2Api: {
        options: {
          mangle: false,
          beautify: true,
          compress: false
        },
        src: '<%= tempDir %>/gw2Api.js',
        dest: '<%= buildDir %>/gw2Api.js'
      },
      gw2ApiMin: {
        options: {
          mangle: true,
          compress: {}
        },
        src: '<%= tempDir %>/gw2Api.js',
        dest: '<%= buildDir %>/gw2Api.min.js'
      }
    },

    umd: {
      gw2Api: {
        src: '<%= tempDir %>/gw2Api.js',
        objectToExport: 'gw2Api',
        amdModuleId: 'gw2Api',
        deps: {
          default: ['Q'],
          amd: ['Q'],
          cjs: ['Q'],
          global: ['Q']
        }
      }
    },

    sed: {
      version: {
        pattern: '%VERSION%',
        replacement: '<%= version %>',
        recursive: true,
        path: '<%= buildDir %>'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: 'src/**/*.js',
      test: ['test/**/*_spec.js', 'test/integration/test.js'],
      gruntfile: ['Gruntfile.js']
    },

    watch: {
      js: {
        files: 'src/**/*',
        tasks: 'build'
      }
    },

    clean: {
      dist: 'dist'
    },

    connect: {
      server: {
        options: { port: 8888, keepalive: true }
      }
    },

    concurrent: {
      options: { logConcurrentOutput: true },
      dev: ['server', 'watch']
    },

    step: {
      options: {
        option: false
      }
    }
  });

  grunt.registerTask('release', '#shipit', function(version) {
    var curVersion = grunt.config.get('version');

    version = semver.inc(curVersion, version) || version;

    if (!semver.valid(version) || semver.lte(version, curVersion)) {
      grunt.fatal(':( version fail');
    }

    grunt.config.set('version', version);

    grunt.task.run([
      'exec:git_on_master',
      'exec:git_is_clean',
      f('step:Update to version %s?', version),
      f('manifests:%s', version),
      'build',
      'exec:git_add',
      f('exec:git_commit:%s', version),
      f('exec:git_tag:%s', version)
    ]);
  });

  grunt.registerTask('manifests', 'Update manifests.', function(version) {
    var _ = grunt.util._,
        pkg = grunt.file.readJSON('package.json'),
        bower = grunt.file.readJSON('bower.json');

    bower = JSON.stringify(_.extend(bower, {
      name: pkg.name,
      version: version
    }), null, 2);


    pkg = JSON.stringify(_.extend(pkg, {
      version: version
    }), null, 2);

    grunt.file.write('package.json', pkg);
    grunt.file.write('bower.json', bower);
  });

  // aliases
  // -------

  grunt.registerTask('default', 'build');
  grunt.registerTask('server', 'connect:server');
  grunt.registerTask('lint', 'jshint');
  grunt.registerTask('dev', ['build', 'concurrent:dev']);
  grunt.registerTask('build', [
    'uglify:concatgw2Api',
    'umd:gw2Api',
    'uglify:gw2Api',
    'uglify:gw2ApiMin',
    'sed:version'
  ]);

  // load tasks
  // ----------

  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-step');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
};
