/**
 * Created by sky on 16/4/22.
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var url = require('url');
var path = require('path');
var fs = require('fs');


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
            middleware: function (req, res, next) {
                var urlObj = url.parse(req.url, true),
                    method = req.method;

                // 过滤调所有不是以api开头的数据
                if (!urlObj.pathname.match(/^\/api/)) {
                    next();
                    return;
                }

                console.log('==================== request start =====================');
                console.log('url: ' + req.originalUrl);
                console.log('method: ' + req.method);
                console.log(new Date());
                console.log('===================== request end ======================');

                var mockDataFile = path.join(__dirname, urlObj.pathname);

                fs.access(mockDataFile, fs.constants.R_OK, function (err) {
                    if (err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({
                            'status': '404',
                            'statusText': '没有找到此文件',
                            'notFound': mockDataFile
                        }));
                        return;
                    }

                    var data = fs.readFileSync(mockDataFile, 'utf-8');
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                });

                next();
            },
            proxies: []
        }));
});

gulp.task('default', ['webserver']);

