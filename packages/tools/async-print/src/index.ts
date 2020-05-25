import DEFAULT_TEMPLATE from './template'
import DEFAULT_STYLE from './style'
import getPrintTemplate from './utils/getPrintTemplate'
import handlers, { HANDLER_MINOR } from './utils/handlers'

export default class AsyncPrint {
  opener: IWindow,

  _options: IAsyncPrintOptions

  /**
   * options参数见底部print方法
   * @param {object} options
   */
  constructor(options = {}) {
    this.opener = null
    this._options = Object.assign(
      { title: '打印页', width: '210mm', delay: 50, handler: HANDLER_MINOR.frame, beforeprint() {}, afterprint() },
      options
    )

    if (this._options.debug) {
      this._options = Object.assign(this._options, { handler: HANDLER_MINOR.win })
    }

    this._create()

    if (this._options.body) {
      this.exec()
    }
  }

  _create() {
    const handlerType = this._options.handler

    switch (handlerType) {
      case HANDLER_MINOR.win:
        this.opener = handlers.createNewPrintWindow()
        break
      case HANDLER_MINOR.frame:
        this.opener = handlers.createNewPrintFrame()
        break
      default:
        throw new Error(`未知句柄类型： ${handlerType}`)
    }
  }

  exec(body = '') {
    const self = this
    const { opener, _options: options } = self

    if (body) {
      options.body = body
    }

    if (!options.body) {
      self.close()
      return
    }

    // 生成HTML字符串模板
    const html = getPrintTemplate(DEFAULT_TEMPLATE, options.body, options)
    // 将字符串模板渲染到新窗口中
    opener.document.write(html)

    // 触发打印前的回调函数
    opener.onbeforeprint = function () {
      opener.focus()
      options.beforeprint(opener)
    }

    // 触发打印后的回调函数（默认是关闭新窗口）
    opener.onafterprint = function () {
      let autoClose = true

      autoClose = options.afterprint(opener)

      // 判断是否自动关闭
      if (autoClose !== false) {
        self.close()
      }
    }

    // 插入额外的样式
    opener.$handle.insertStyle(options.extraCSS)

    // 调试模式下，不执行浏览器打印操作
    if (!options.debug) {
      // 延迟调用打印接口
      window.setTimeout(opener._handle.print, options.delay)
    }
  }

  /**
   * 关闭打印页面
   */
  close() {
    if (!this.opener.closed) {
      this.opener._handle.close()
    }
  }
}
