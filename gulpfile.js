/**
 * Created by sky on 16/4/22.
 */

var url = require('url');
var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var middleware = require('./middleware')();


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
            fallback: './index.html',
            open: true,
            https: false,
            middleware: middleware,
            proxies: []
        }));
});

gulp.task('default', ['webserver']);

