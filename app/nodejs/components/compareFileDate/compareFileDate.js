/**
 * Created by sky on 16/12/1.
 * 比较文件路径，特定时间的文件列表
 */

var $$fs = require('fs');
var $$path = require('path');

function CompareDate(basePathList, compareTime) {
    var filterFiles = [];

    if (typeof basePathList == 'string') {
        basePathList = [].push(basePathList);
    }

    basePathList.forEach(function (basePath) {
        var files,
            stat = fs.statSync(basePath);

        if (stat.isDirectory()) {
            files = fs.readdirSync(basePath);
            files.forEach(function (file) {
                var result,
                    filePath = path.join(basePath, file);

                result = compareModifyTime(filePath, compareTime);
                filterFiles.concat(result);
            });
        } else if (stat.isFile() && new Date(stat.mtime).getTime() > new Date(compareTime).getTime()) {
            filterFiles.push(basePath);
        }
    });

    return filterFiles;
}


