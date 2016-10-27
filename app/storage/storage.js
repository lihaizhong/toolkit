/**
 * Created by sky on 16/10/26.
 * storage检测和封装
 */

;(function () {
    var type = {
        isObj: function (o) {
            return Object.prototype.toString.call(o).slice(8, -1).toLowerCase() === 'object';
        },
        isArr: function (o) {
            return o instanceof Array;
        },
        isStr: function (o) {
            return typeof o === 'string';
        },
        isFunc: function (o) {
            return typeof o === 'function';
        }
    };

    function parseJSON(data) {
        try {
            return type.isObj(data) || type.isArr(data) ? JSON.parse(data) : data;
        } catch (ex) {
            return data;
        }
    }

    function stringify(data) {
        try {
            return type.isFunc(data) ? data : JSON.stringify(data);
        } catch (ex) {
            return data;
        }
    }

    function DataBase(store) {
        this.store = store;
    }

    DataBase.prototype = {
        get: function () {
            var i = 0, len, key = arguments[0], arr, result = '';
            if (type.isStr(key)) {
                result = parseJSON(this.store.getItem(key));
            } else if (type.isArr(key)) {
                arr = key;
                key = null;
                len = arr.length;
                result = {};
                for (; i < len; i++) {
                    key = arr[i];
                    if (type.isStr(key)) {
                        result[key] = parseJSON(this.store.getItem(key));
                    }
                }
            }
            return result;
        },
        set: function () {
            var key, value, obj;
            if (type.isStr(arguments[0])) {
                key = arguments[0];
                value = arguments[1];
                this.store.setItem(key, stringify(value));
            } else if (type.isObj(arguments[0])) {
                obj = arguments[0];
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        value = stringify(obj[key]);
                        this.store.setItem(key, value);
                    }
                }
            }
        },
        remove: function () {
            var i = 0, key, len = arguments.length;
            if (len === 0) {
                this.store.clear();
            } else if (len === 1) {
                key = arguments[0];
                this.store.removeItem(key);
            } else {
                for (; i < len; i++) {
                    key = arguments[i];
                    this.store.removeItem(key);
                }
            }
        },
        clear: function () {
            this.store.clear();
        }
    };

    window.db = function (isForeverStore) {
        var store = isForeverStore ? window.localStorage : window.sessionStorage,
            storageTest = 'storage_' + new Date().getTime();

        if (store) {
            try {
                store.setItem(storageTest, storageTest);
                store.removeItem(storageTest);
            } catch (ex) {
                console.log(ex);
                alert('关闭浏览器的无痕模式再试试哦~~');
            }
        } else {
            alert('浏览器不支持' + (isForeverStore ? 'localStorage' : 'sessionStorage') + '呢!\n跟换浏览器试试~~');
        }

        return new DataBase(store);
    };

})();