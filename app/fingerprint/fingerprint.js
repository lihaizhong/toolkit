/**
 * Created by sky on 16/4/22.
 * 生成文件指纹
 */
var fs = require("fs");
var crypto = require("crypto");
var path = require("path");

var _ = require("underscore");

require("colors");

var print = {
    log: function (msg) {
        console.log(msg);
    },
    info: function (msg) {
        console.info(msg.green);
    },
    assert: function (condition, msg) {
        console.assert(condition, msg.red);
    },
    error: function (err) {
        if (err) throw new Error(err);
    }
}

var type = {
    base : function(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    },
    isArray: function(arr) {
        return this.base(arr) === 'array';
    },
    isString: function(str) {
        return this.base(str) === 'string';
    }
}

/* 迭代目录 */
var iterateFile = function (base, src) {
    var result = [],
    // 目录文件的绝对路径
        srcPath = path.join(base, src),
        subResult, stat, files;

    try {
        stat = fs.statSync(srcPath);
        if ( stat.isDirectory() ) {
            files = fs.readdirSync(srcPath);
            files.forEach(function(filePath) {
                // 目录的相对路径
                srcPath = path.join(src, filePath);
                // 递归目录
                subResult = iterateFile(base, srcPath);
                result = result.concat(subResult);

            })
        } else if ( stat.isFile() ) {
            result.push(src);
        }
    } catch (ex) {
        print.error(ex);
    }

    return result;
}



var Fingerprint  = function (options) {
    this.opts = _.extend({}, Fingerprint.default, options);
}

// 其他路径是基于base路径进行的扩展
Fingerprint.default = {
    base: '',   // 必选
    src: '',    // 可选
    dist:'',    // 可选
    mapping: '' // 可选
}

Fingerprint.prototype = {
    /**** ?初始化 ****/
    init: function(status) {
        var self = this,
            srcFiles, distFiles, mapping;

        //- 基础参数设置 start
        if (this.opts.base == '')
            print.error('base不能为空!');
        else if ( !type.isString(this.opts.base) )
            print.error('base必须是url字符串!');

        if ( !type.isString(this.opts.mapping) )
            print.error('mapping必须是url字符串!');

        if ( type.isString(this.opts.src) )
            this.opts.src = [this.opts.src];
        else if ( !type.isArray(this.opts.src) )
            print.error('src必须是url字符串或者url数组');

        if ( type.isString(this.opts.dist) )
            this.opts.dist = [this.opts.dist];
        else if ( !type.isArray(this.opts.dist) )
            print.error('dist必须是url字符串或者url数组');

        //- 基础参数设置 end

        srcFiles = self.findFiles(this.opts.base, this.opts.src);
        distFiles = self.findFiles(this.opts.base, this.opts.dist);
        if (srcFiles.length && distFiles.length) {
            if (status) {
                mapping = self.clearFingerprint(srcFiles);
            } else {
                mapping = self.genFingerprint(srcFiles, this.opts.base);
            }
            self.createMapping(mapping, this.opts.base, this.opts.mapping);
            self.alterFingerprint(mapping, this.opts.base, distFiles);
        }
    },
    findFiles: function(basePath, handlerPath) {
        var self = this,
            filePathList = [],
            _filePathList, filterFiles = [], index;

        handlerPath.forEach(function(_handlerPath) {
            if ( /^!/.test(_handlerPath) ) {
                filterFiles.push(_handlerPath.substring(1));
                return true;
            }
            _filePathList = iterateFile(basePath, _handlerPath);
            filePathList = filePathList.concat(_filePathList);
        });

        // 过滤
        filterFiles.forEach(function(filterFile) {
            filePathList.forEach(function(filePath) {
                index = filePath.indexOf(filterFile);
                if(index == 0) delete filePathList[index];
            });
        });

        filePathList = filePathList.filter(function(val) {return val != undefined;});

        print.info('目标路径: ' + handlerPath + '\n查找文件完成, 共有文件数：' + filePathList.length);
        print.assert(filePathList.length, '目标路径: ' + handlerPath + '\n没有遍历到任何文件!');

        return filePathList;
    },
    /**** ?清除文件指纹 ****/
    clearFingerprint: function(files) {
        var self = this,
            mapping = {};

        files.forEach(function(file) {
            mapping[file] = '';
        });

        print.info('清除文件指纹完成!');

        return mapping;
    },
    /**** ?生成文件指纹 ****/
    genFingerprint: function (files, basePath) {
        var self = this,
            mapping = {};

        files.forEach(function(file) {
            // 当前文件的绝对路径
            var srcFilePath = path.join(basePath, file);
            var hash = crypto.createHash('md5');
            var fileContent = fs.readFileSync(srcFilePath);
            hash.update(fileContent);
            // 保存文件的相对路径
            mapping[file] = hash.digest('hex');
        })
        print.info('生成文件指纹完成!');

        return mapping;
    },
    /**** ?更新mapping ****/
    createMapping: function (mapping, basePath, mappingPath) {
        var self = this,
        // mapping.json的绝对路径
            _mappingPath = path.join(basePath, mappingPath, 'mapping.json'),
            stat, _mapping, buff, key;

        try {
            // 如果文件不存在将报错
            stat = fs.statSync(_mappingPath);
            if ( stat.isFile() ) {
                _mapping = fs.readFileSync(_mappingPath, {encoding: 'utf8'});
                _mapping = JSON.parse(_mapping);

                if (_mapping == mapping) {
                    print.info(_mappingPath + '无更新!');
                    return;
                } else {
                    print.info(_mappingPath + '已更新!');
                }
            }
        } catch (ex) {
            print.info(_mappingPath + '已创建!');
        } finally {
            // 将数据异步写入mapping.json
            buff = new Buffer( JSON.stringify(mapping, null, 4) );
            fs.writeFile(_mappingPath, buff);
            print.info(_mappingPath + '更新完成!');
        }
    },
    /**** ?遍历并修改文件指纹 ****/
    alterFingerprint: function (mapping, basePath, distFilePathList) {
        var self = this, updateFileCount = 0;

        distFilePathList.forEach(function(distFilePath) {
            print.log(distFilePath + '更新中...');
            var isChange = false;
            // 获得待更新文件的绝对路径
            var _distPath = path.join(basePath, distFilePath);
            // 读取文件内容
            var fileContent = fs.readFileSync(_distPath, {encoding: 'utf8'});

            Object.keys(mapping).forEach(function(mappingFilePath) {
                // 获得文件内容中匹配的开始位置
                var startIndex = fileContent.indexOf(mappingFilePath);
                if (startIndex != -1) {
                    // 获得文件内容中匹配的结束位置
                    var endIndex = fileContent.indexOf('\"', startIndex);
                    // 源替换内容
                    var srcContent = fileContent.substring(startIndex, endIndex);
                    // 目标替换内容
                    var distContent = mappingFilePath + (mapping[mappingFilePath] ? ("?" + mapping[mappingFilePath]) : '');
                    if (srcContent !== distContent) {
                        // 文件替换结果
                        fileContent = fileContent.replace(srcContent, distContent);
                        isChange = true;
                    }
                }
            });

            if (isChange) {
                // 更新文件
                fs.writeFileSync(_distPath, fileContent);
                print.log(distFilePath + '更新完成!');
                updateFileCount++;
            } else {
                print.log(distFilePath + '未更新!');
            }
        });

        print.info('文件更新完成!\n共更新文件数：' + updateFileCount);
    }
}

module.exports = function(options) {
    return new Fingerprint(options);
};