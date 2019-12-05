/**
 * @author Sky
 * @email lihaizh_cn@foxmail.com
 * @create date 2018-01-09 01:14:05
 * @modify date 2018-01-09 01:14:05
 * @desc Storage封装
 */

/* eslint no-var: "off" */
/* eslint func-names: "off" */
/* eslint object-shorthand: "off" */
/* eslint comma-dangle: "off" */
/* eslint prefer-rest-params: "off" */
/* eslint no-plusplus: "off" */
/* eslint no-restricted-syntax: "off" */
/* eslint prefer-template: "off" */
/* eslint-env es5 */
;(function (win) {
  var type = {
    isObj: function (o) {
      return (
        Object.prototype.toString
          .call(o)
          .slice(8, -1)
          .toLowerCase() === 'object'
      )
    },
    isArr: function (o) {
      return o instanceof Array
    },
    isStr: function (o) {
      return typeof o === 'string'
    },
    isFunc: function (o) {
      return typeof o === 'function'
    }
  }

  function parseJSON (data) {
    try {
      return type.isObj(data) || type.isArr(data) ? JSON.parse(data) : data
    } catch (ex) {
      return data
    }
  }

  function stringify (data) {
    try {
      return type.isFunc(data) ? data : JSON.stringify(data)
    } catch (ex) {
      return data
    }
  }

  function DataBase (store) {
    this.store = store
  }

  DataBase.prototype = {
    get: function () {
      var i = 0
      var len
      var key = arguments[0]
      var arr
      var result = ''
      if (type.isStr(key)) {
        result = parseJSON(this.store.getItem(key))
      } else if (type.isArr(key)) {
        arr = key
        key = null
        len = arr.length
        result = {}
        for (; i < len; i++) {
          key = arr[i]
          if (type.isStr(key)) {
            result[key] = parseJSON(this.store.getItem(key))
          }
        }
      }
      return result
    },
    set: function (arg1, arg2) {
      var key
      var value
      var obj
      if (type.isStr(arg1)) {
        key = arg1
        value = arg2
        this.store.setItem(key, stringify(value))
      } else if (type.isObj(arg1)) {
        obj = arg1
        for (key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            value = stringify(obj[key])
            this.store.setItem(key, value)
          }
        }
      }
    },
    remove: function (arg1) {
      var i = 0
      var key
      var len = arguments.length
      if (len === 0) {
        this.store.clear()
      } else if (len === 1) {
        key = arg1
        this.store.removeItem(key)
      } else {
        for (; i < len; i++) {
          key = arguments[i]
          this.store.removeItem(key)
        }
      }
    },
    clear: function () {
      this.store.clear()
    }
  }

  win.db = function (isForeverStore) {
    var store = isForeverStore ? win.localStorage : win.sessionStorage
    var storageTest = 'storageTest_' + new Date().getTime()

    if (store) {
      try {
        store.setItem(storageTest, storageTest)
        store.removeItem(storageTest)
      } catch (ex) {
        console.error(ex)
        alert('关闭浏览器的无痕模式试试吧~~')
      }
    } else {
      alert(
        '浏览器不支持' +
          (isForeverStore ? 'localStorage' : 'sessionStorage') +
          '哦!\n换个浏览器试试~~'
      )
    }

    return new DataBase(store)
  }
})(window)
