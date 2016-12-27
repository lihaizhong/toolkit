/**
 * Created by sky on 2016/12/20.
 */

(function () {
    var loadingImageUrl = 'data:image/png;base64,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',
        dialogMask = '<section class="yunui-dialog-mask"></section>',
        dialogLoading = '<section class="yunui-dialog-loading"><img class="yunui-dialog-loading-icon" src="#0#"></section>',
        dialogToast = '<section class="yunui-dialog-toast dgZoomIn">#0#</section>',
        dialogPanel = '<section class="yunui-dialog-panel dgZoomIn"><section class="yunui-dialog-panel-inner">#0#</section></section>';

    var isTypeData = function (seed, type) {
        return Object.prototype.toString.call(seed) === '[object ' + type + ']';
    };

    function createDialog(option) {
        var dialog = new Dialog(option),
            dialogId = dialog.id;
        Dialog.manage[dialogId] = dialog;
        return dialog;
    }

    function Dialog(option) {
        this.opts = Dialog.extend({}, Dialog.default, Dialog.global, option);
        this.init();
    }

    Dialog.global = {};

    Dialog.default = {
        scope: document.body,
        hasMask: true,
        msg: '',
        icon: loadingImageUrl,
        template: '',
        timeout: 3000
    };

    // 弹窗管理工具
    Dialog.manage = {};

    Dialog.extend = function () {
        var len = arguments.length,
            property,
            target,
            extend,
            extendItem;

        // 有效形参最多为两个
        if (len == 1) {
            target = Dialog.prototype;
            extend = arguments[0];
        } else {
            target = arguments[0];
            extend = Array.prototype.slice.call(arguments, 1);
            len--;
        }

        // target 必须是Object
        if (!isTypeData(target, 'Object')) {
            return {};
        }

        for (var i = 0; i < len; i++) {
            extendItem = extend[i];
            // 合并对象
            if (isTypeData(extendItem, 'Object')) {
                for (property in extendItem) {

                    if (extendItem[property] === undefined || extendItem[property] === target) {
                        continue;
                    }

                    if (extendItem.hasOwnProperty(property)) {
                        target[property] = extendItem[property];
                    }
                }
            }
        }

        return target;
    };

    Dialog.formatString = function (context) {
        var args = Array.prototype.slice.call(arguments, 1);

        if (!isTypeData(context, 'String')) {
            return '';
        }

        return context.replace(/#(\d+)#/g, function ($0, $1) {
            return args[$1];
        });
    };

    Dialog.prototype = {
        constructor: Dialog,
        init: function () {
            this.id = 'yunui-dialog-' + new Date().getTime() + parseInt(Math.random() * 100);
            this.msg == null && (this.msg = '');
            this.opts.scope == null && (this.opts.scope = document.body);
            this.wrapElem = document.createElement('section');
            this.wrapElem.className = 'yunui-dialog-wrap';
            this.wrapElem.id = this.id;
        },
        setHTMLFragment: function (htmlSource) {
            this.wrapElem.innerHTML = (this.opts.hasMask ? dialogMask : '') + htmlSource;
            this.opts.scope.appendChild(this.wrapElem);
            return this.id;
        },
        loading: function () {
            return this.setHTMLFragment(Dialog.formatString(dialogLoading, this.opts.icon));
        },
        toast: function () {
            var that = this,
                timer;

            if (that.opts.timeout > 0) {
                setTimeout(function () {
                    that.destroy();
                    clearTimeout(timer);
                }, that.opts.timeout);
            }

            return this.setHTMLFragment(Dialog.formatString(dialogToast, this.opts.msg));
        },
        open: function () {
            var that = this,
                id = this.setHTMLFragment(Dialog.formatString(dialogPanel, this.opts.template));
            this.wrapElem.querySelector('.yunui-dialog-mask').addEventListener('click', function () {
                that.destroy();
            }, false);
            return id;
        },
        destroy: function () {
            this.opts.scope.removeChild(this.wrapElem);
            delete Dialog.manage[this.id];
        }
    };

    window.dialog = {
        config: function (option) {
            Dialog.global = Dialog.extend({}, Dialog.global, option);
        },
        loading: function (option) {
            return createDialog(option).loading();
        },
        toast: function (msg, option) {
            if (!isTypeData(option, 'Object')) {
                option = {};
            }
            option.msg = msg;
            option.hasMask == null && (option.hasMask = false);
            return createDialog(option).toast();
        },
        open: function (template, option) {
            if (!isTypeData(option, 'Object')) {
                option = {};
            }
            option.template = template;
            return createDialog(option).open();
        },
        close: function (id) {
            var dialog = Dialog.manage[id];
            if (dialog) {
                dialog.destroy();
            }
        }
    }
})();
