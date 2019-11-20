/**
 * @author Sky
 * @email lihaizh_cn@foxmail.com
 * @create date 2018-01-02 05:17:38
 * @modify date 2018-01-02 05:17:38
 * @desc 适配手机屏幕
 *  注：标签的尺寸单位请使用 rem(根据html的font-size定义宽度)
 *     页面按照750px宽度定义，如果想要得到750px的宽度，只要修改成7.5rem即可，以此类推！(rem = px/100)
 *     data-mw = '750' default
 */

/* eslint no-var: "off" */
/* eslint func-names: "off" */
/* eslint prefer-template: "off" */
/* eslint-env es5 */
;(function (doc, win) {
  var docEl = doc.documentElement
  var maxWidth = docEl.dataset.mw || 750
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  var readyRE = /complete|loaded|interactive/

  function recalc () {
    // 获取设备的宽度
    var clientWidth = window.screen.width
    if (!clientWidth) return
    docEl.style.fontSize = 100 * (clientWidth / maxWidth) + 'px'
    // window.devicePixelRatio是设备上物理像素和设备独立像素(device-independent pixels (dips))的比例。
    // 公式就是: window.devicePixelRatio = 物理像素 / dips (非视网膜屏为1， 视网膜屏为2)
    docEl.setAttribute('dpr', window.devicePixelRatio || 1)
    doc.removeEventListener('DOMContentLoaded', recalc, false)
  }

  // Abort if browser does not support addEventListener
  if (!doc.addEventListener) return

  win.addEventListener(resizeEvt, recalc, false)
  if (readyRE.test(document.readyState) && document.body) {
    recalc()
  } else {
    doc.addEventListener('DOMContentLoaded', recalc, false)
  }
})(document, window)
