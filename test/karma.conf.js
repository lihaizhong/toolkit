// Karma configuration
// Generated on Tue Sep 25 2018 11:07:02 GMT+0800 (CST)

const path = require('path')
const webpackConfig = require('./webpack.test.conf')

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'test/unit/**/*.spec.js',
      'tools/**/*.js'
    ],


    // list of files / patterns to exclude
    exclude: [
      'test/karma.conf.js',
      'test/webpack.test.conf.js',
      'tools/ajax/**/*.js',
      'tools/adapter.js',
      'tools/storage.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/unit/**/*.js': ['webpack', 'sourcemap'],
      'tools/**/*.js': ['webpack', 'sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-istanbul'],


    coverageIstanbulReporter: {
      // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
      reports: ['html', 'text-summary'],

      // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
      dir: path.join(__dirname, '../coverage'),

      // Combines coverage information from multiple browsers into one report rather than outputting a report
      // for each browser.
      combineBrowserReports: true,

      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,

      // Omit files with no statements, no functions and no branches from the report
      skipFilesWithNoCoverage: true,

      // Most reporters accept additional config options. You can pass these through the `report-config` option
      'report-config': {
        // all options available at: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib/html/index.js#L135-L137
        html: {
          // outputs the report in ./coverage/html
          subdir: 'html'
        }
      },

      // enforce percentage thresholds
      // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
      // thresholds: {
      //   emitWarning: true, // set to `true` to not fail the test command when thresholds are not met
      //   // thresholds for all files
      //   global: {
      //     statements: 30,
      //     lines: 30,
      //     branches: 30,
      //     functions: 30
      //   },
      //   // thresholds per file
      //   each: {
      //     statements: 30,
      //     lines: 30,
      //     branches: 30,
      //     functions: 30,
      //     overrides: {
      //       'tools/**/*.js': {
      //         statements: 30
      //       }
      //     }
      //   }
      // },

      // verbose: true // output config used by istanbul for debugging
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,


    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // webpack config for test config
    webpack: webpackConfig,


    client: {
      clearContext: false,
      // mocha config info
      mocha: {
        // have to set timeout if there are async tasks
        timeout: 60000,
        require: path.resolve(__dirname, 'unit/setup.js')
      }
    }
  })
}
