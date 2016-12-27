/**
 * Created by sky on 16/4/22.
 */

var url = require('url');
var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');

var middleware = require('./gulp-middleware')();


gulp.task('webserver', function () {
    gulp.src('app')
        .pipe($.webserver({
            host: 'localhost',
            port: 3000,
            path: '/',
            livereload: {
                enable: true,
                filter: function (fileName) {
                    return !fileName.match(/\.(txt|md)$/);
                }
            },
            directoryListing: {
                enable: true,
                path: './app'
            },
            fallback: 'error.html',
            open: true,
            https: false,
            middleware: middleware,
            proxies: []
        }));
});

gulp.task('js-compress', function () {
    gulp.src(['app/**/*.js', '!app/**/*.min.js', '!app/**/*.test.js'])
        .pipe($.minify({
            ext: {
                src: '.js',
                min: '.min.js'
            },
            exclude: ['test', 'nodejs'],
            ignoreFiles: ['.min.js', '.test.js']
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('css-compress', function () {
    gulp.src(['app/**/*.scss'])
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.csscomb())
        .pipe($.postcss([
            autoprefixer({
                browsers: ['Chrome > 20'],
                cascade: false,
                add: true,
                remove: true
            })
        ]))
        .pipe($.cleanCss({debug: true}, function (details) {
            console.log('==================================================== ' + details.name + ' ====================================================');
            console.log(details.name + '\'s original size:' + (details.stats.originalSize / 1024).toFixed(2) + 'KB');
            console.log(details.name + '\'s minify size:' + (details.stats.minifiedSize / 1024).toFixed(2) + 'KB');
            console.log(details.name + '\'s efficiency:' + Math.round(details.stats.efficiency * 100) + '%');
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('app/'));
});

gulp.task('compress', ['css-compress', 'js-compress']);


gulp.task('default', ['webserver']);


