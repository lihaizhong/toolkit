/**
 * Created by sky on 16/4/22.
 */

var url = require('url');
var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

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

gulp.task('compress', function () {
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



gulp.task('default', ['webserver']);


