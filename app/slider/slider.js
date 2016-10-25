/**
 * Created by sky on 16/10/1.
 */

!function (global) {
    'use strict';

    /**
     * class 正则匹配
     * @type {RegExp}
     */
    var clsReg = function (cls) {
        return new RegExp('(^|\\s)(' + cls + ')(\\s|$)');
    };
    var util = {
        /**
         * 判断参数是否在数组中
         * @param o
         * @param arr
         * @return {boolean}
         */
        inArray: function (o, arr) {
            return arr.indexOf(o) > -1;
        },
        /**
         * 判断基本类型
         * @param o
         * @return {string}
         */
        getBaseType: function (o) {
            return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
        },
        /**
         * 判断是否是对象
         * @param o
         * @return {boolean}
         */
        isObject: function (o) {
            return this.getBaseType(o) === 'object';
        },
        /**
         * 判断是否是数组
         * @param o
         * @return {boolean}
         */
        isArray: function (o) {
            return this.getBaseType(o) === 'array';
        },
        /**
         * 判断是否是布尔
         * @param o
         * @return {boolean}
         */
        isBoolean: function (o) {
            return this.getBaseType(o) === 'boolean';
        },
        /**
         * 判断是否是字符串
         * @param o
         * @return {boolean}
         */
        isString: function (o) {
            return this.getBaseType(o) === 'string';
        },
        /**
         * 是否有class
         * @param el
         * @param cls
         * @return {boolean}
         */
        hasClass: function (el, cls) {
            return clsReg(cls).test(el.className);
        },
        /**
         * 添加class
         * @param el
         * @param cls
         */
        addClass: function (el, cls) {
            if (!this.hasClass(el, cls)) {
                el.className += ' ' + cls;
            }
        },
        /**
         * 删除class
         * @param el
         * @param cls
         */
        removeClass: function (el, cls) {
            if (this.hasClass(el, cls)) {
                el.className = el.className.replace(clsReg(cls), '$3');
            }
        },
        /**
         * 检查是否是URL
         * @param url
         * @return {boolean}
         */
        isURL: function (url) {
            if (/<\/[^>]*>/.test(url)) return;
            return /^(?:(https|http|ftp|rtsp|mms):)?(\/\/)?(\w+:{0,1}\w*@)?([^\?#:\/]+\.[a-z]+|\d+\.\d+\.\d+\.\d+)?(:[0-9]+)?((?:\.?\/)?([^\?#]*)?(\?[^#]+)?(#.+)?)?$/.test(url);
        },
        /**
         * 检查是否是DOM元素
         * @param obj
         * @return {boolean}
         */
        isDOM: function (el) {
            try {
                return el instanceof HTMLElement;
            } catch (ex) {
                return typeof el === 'object' && el.nodeType === 1 && el.ownerDocument === 'object';
            }
        },
        /**
         * 创建新数组
         * @param arr
         * @return {*}
         */
        makeArray: function (arr) {
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.slice.apply(arr, args);
        }
    };

    /**
     * 空函数
     */
    function noop() {
    }

    /**
     * Slider构造函数
     * 注：* 为必填
     * @param el *
     * @param dl *
     * @param opts
     * @constructor
     * this._opts.dom => el
     * this._opts.data => dl
     */
    function Slider(el, dl, opts) {
        if (el == null || dl == null) {
            throw new Error('请传入必要的参数');
        }

        if (!util.isObject(opts)) {
            opts = {};
        }

        if (el && !util.isDOM(el)) {
            throw new Error(el + '必须是DOM元素');
        }
        opts.dom = el;

        if (!util.isArray(dl)) {
            throw new Error(dl + '必须是数组');
        } else if (dl.length) {
            throw new Error(dl + '不能为空数组');
        }
        opts.data = dl;

        this._opts = opts;
        el = dl = opts = null;
    }

    /**
     * 插件版本号
     * @type {string}
     */
    Slider.VERSION = '1.0.0';

    Slider.EVENT = [];

    Slider.EASING = [];

    /**
     * 处理设备支持的事件类型
     * @type {{hasTouch, startEvt, moveEvt, endEvt, cancelEvt, resizeEvt}}
     */
    Slider.DEVICE_EVENTS = (function () {

        var hasTouch = !!('ontouchstart' in global && /Mac OS X /.test(global.navigator.userAgent));

        return {
            hasTouch: hasTouch,
            startEvt: hasTouch ? 'touchstart' : 'mousedown',
            moveEvt: hasTouch ? 'touchmove' : 'mousemove',
            endEvt: hasTouch ? 'touchend' : 'mouseup',
            cancelEvt: hasTouch ? 'touchcancel' : 'mouseout',
            resizeEvt: 'onorientationchange' in global ? 'orientationchange' : 'resize'
        };
    })();

    /**
     * 动画结束事件
     * @type {null}
     */
    Slider.TRANSATION_END_EVENT = null;

    /**
     * 浏览器前缀
     * @type {null}
     */
    Slider.BROWSER_PREFIX = null;

    /**
     * 初始化函数
     */
    (function initialize() {
        var el = document.createElement('fakeElement');
        [
            ['WebkitTransition', 'webkittransitionend', 'webkit'],
            ['MozTransition', 'moztransitionend', 'moz'],
            ['OTransition', 'otransitionend', 'o'],
            ['transition', 'transitionend', null]
        ].some(function (t) {
            if (el.style[t[0]] !== undefined) {
                Slider.TRANSATION_END_EVENT = t[1];
                Slider.BROWSER_PREFIX = t[2];
                return true;
            }
        });
    })();

    /**
     * 插件扩展（支持浅复制）
     * @return {*}
     */
    Slider.extend = function () {
        var len = arguments.length,
            property,
            target,
            extend;

        // 有效形参最多为两个
        if (len == 1) {
            target = Slider.prototype;
            extend = arguments[0];
        } else {
            target = arguments[0];
            extend = arguments[1];
        }

        // target 必须是Object
        if (!util.isObject(target)) {
            return {};
        }

        // 合并对象
        if (util.isObject(extend)) {
            for (property in extend) {

                if (extend[property] === target) {
                    continue;
                }

                if (target[property] !== undefined) {
                    global.console.log(property + '已经被覆盖！');
                }

                if (extend.hasOwnProperty(property)) {
                    target[property] = extend[property];
                }
            }
        }

        return target;
    };

    /**
     * 私有方法/变量扩展
     */
    Slider.extend({
        _setting: function () {
            var self = this;

            // 首屏展示索引
            self.initIndex = 0;
            // 阻止原生事件
            self.preventDdefault = true;
            // 是否垂直滑动
            self.isVertical = false;
            // 是否自动播放动画
            self.isAutoPaly = false;
            // 切换停留时间
            self.duration = 1000;
            // 是否循环播放
            self.isLooping = false;

            //*是否开启调试模式
            self.isDebug = false;
        },
        _renderItem: function () {

        },
        _bindHandler: function () {

        }
    });

    // 开启调试模式
    Slider.extend({
        log: function (/* msg */) {
            if (this.isDebug) {
                global.console.log.apply(global, arguments);
            }
        }
    });

    // 基本方法扩展
    Slider.extend({});

    /** ==
     * 抛出全局对象
     * @type {Slider}
     */
    global.Slider = Slider;

}(window || this);

