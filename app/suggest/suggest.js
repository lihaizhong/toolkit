/**
 * Created by sky on 16/11/4.
 * dependence jQuery
 */

Suggest.default = {
    /**
     * 请求的路径
     */
    url: '',
    /**
     * 是否只请求一次
     */
    once: false,
    /**
     * 当前下拉的作用域
     */
    scope: '',
    /**
     * 请求的参数
     * data: scope作用域中的元素数据{selector: requestKey}
     *  - selector: 当前元素。如果以`#`开头，则为id；如果以`.`开头，则为class；其他情况都默认是name
     *  - requestKey: 当前元素对应的后台接收字段的key值（可以按层级下推，xxx.xxx）
     * global: 全局作用域中的元素数据{selector: requestKey}
     *  - selector: 同上
     *  - requestKey: 同上
     */
    request: {
        data: null,
        global: null
    },
    /**
     * 请求的参数
     * data: scope作用域中的元素数据{selector: responseKey}
     *  - selector: 当前元素。如果以`#`开头，则为id；如果以`.`开头，则为class；其他情况都默认是name
     *  - responseKey: 当前元素对应的后台返回字段的key值（可以按层级下推，xxx.xxx）
     * global: 全局作用域中的元素数据{selector: responseKey}
     *  - selector: 同上
     *  - responseKey: 同上
     */
    response: {
        data: null,
        global: null
    },
    /**
     * 自定义模板
     */
    tpl: '',
    /**
     * 列表显示的条数，默认全显示
     */
    size: 0,
    /**
     * ajax请求延迟时间
     */
    delay: 300,
    /**
     * 点击完成后的回调函数，如果return false，将阻止关闭下拉列表
     * @param res
     */
    callback: function (res) {}
};

Suggest.extend = function () {

};

function Suggest(option) {

}

Suggest.prototype = {

};

