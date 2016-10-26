/**
 * Created by sky on 16/10/26.
 */

var fns = [];

var util = {
    getBaseType: function (o) {
        return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    },
    isObject: function (o) {
        return this.getBaseType(o) === 'object';
    },
    isFunction: function (o) {
        return this.getBaseType(o) === 'function';
    },
    isArray: function (o) {
        return this.getBaseType(o) === 'array';
    }
}

var extend = function () {
    var args = Array.prototype.slice.call(arguments),
        len = args.length, i = 0, params, subLen, j, fn;

    for (;i < len; i++) {
        params = args[i];
        subLen = params.length;

        if (!util.isArray(params)) {
            continue;
        }

        for (j = 0; j < subLen; j++) {
            fn = prams[j];
            if (!util.isFunction(fn)) {
                continue;
            }

            fns.push(fn);
        }
    }
}

var middleware = function () {
    return fns;
};


/* middleware extend start */

extend(function (req, res, next) {
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
});



/* middleware extend end */


module.exports = middleware;