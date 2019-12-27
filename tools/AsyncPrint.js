/**
 * 创建模板
 * @param {string} body
 * @param {object} options
 *
 * # 公共CSS class #
 * text-left
 * text-right
 * text-center
 * text-right
 * font-bold
 * font-normal
 * border
 * no-border
 * border-top
 * border-right
 * border-bottom
 * border-left
 *
 * 注：
 * 1. section是关键标签，用来表示A4纸张，请谨慎使用
 * 2. table，caption都做过处理，可以直接使用而不去设置额外样式
 * 3. 请使用pt作为单位，因为打印设备真正识别的单位为pt
 */
function getPrintTemplate (body = '', options = {}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>${options.title || '打印页'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
          }

          html, body {
            font-size: 12pt;
            color: #000;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            caption-side: top;
            empty-cells: show;
          }

          table th,
          table td {
            padding: 8pt 0;
            text-align: left;
          }

          caption {
            width: 100%;
            padding: 8pt 0;
            text-align: left;
            border: none;
            border-bottom: 1pt solid #000;
          }
          @media screen {
            section {
              border: 1pt dashed #666;
              padding: 14mm 12mm 10mm;
            }
          }

          @media print {
            @page A4 {
              size: 210mm 290mm;
              margin: 20mm 15mm;
            }

            section {
              page: A4;
              page-break-after: always;
            }
          }

          .print-wrapper {
            margin: 20pt auto;
          }
          .card-time {
            display: flex;
            justify-content: space-between;
            margin-bottom: 13px;
          }
          .purchase .title {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(60, 65, 68, 1);
            line-height: 20px;
            margin: 20px 0 10px;
          }
          .purchase  .member-information  span {
            display: inline-block;
            min-width: 100px;
            margin: 0 20px 8px 0;
          }
          .total {
            margin-top: 12px;
            height: 20px;
          }
          .total  span {
            float: right;
            font-size: 14px;
          }
          .payment {
            margin-top: 10px;
          }

          /******** 公共CSS工具 START ********/

          .text-left {
            text-align: left;
          }

          .text-center {
            text-align: center;
          }

          .text-right {
            text-align: right;
          }

          .text-middle {
            vertical-align: middle;
          }

          .text-baseline {
            vertical-align: baseline;
          }

          .font-bold {
            font-weight: bold;
          }

          .font-normal {
            font-weight: normal;
          }

          .border {
            border: 1pt solid #000;
          }

          .no-border {
            border: none;
          }

          .border-top {
            border-top: 1pt solid #000;
          }

          .border-right {
            border-right: 1pt solid #000;
          }

          .border-bottom {
            border-bottom: 1pt solid #000;
          }

          .border-left {
            border-left: 1pt solid #000;
          }
          .new-generation-date {
            text-align: right;
            padding-bottom: 20pt;
          }
          .new-b-wrap div {
              float: left;
              width: 50%;
              padding-bottom: 10pt;
            }
            .new-b-wrap div:nth-child(2n) {
              text-align: right;
            }

            .clearfix::after {
              content: '';
              clear: both;
              display: block;
              overflow: hidden;
              font-size: 0;
              height: 0;
            }

            .clearfix {
              zoom: 1;
            }

          /******** 公共CSS工具 END ********/
        </style>
      </head>
      <body>
          <article class="print-wrapper" style="width: ${options.width || '210mm'};">
            ${body}
          </article>
      </body>
    </html>
  `
}

class AsyncPrint {
  constructor (opener, options = {}) {
    // 打印页窗口句柄
    this.opener = opener
    this._options = Object.assign({}, options)
  }

  exec (body = '') {
    const self = this
    const { opener, _options: options } = self

    if (body) {
      options.body = body
    } else if (!options.body) {
      if (typeof opener.close === 'function') {
        opener.close()
      }
    }

    // 生成HTML字符串模板
    const html = getPrintTemplate(options.body, options)
    // 将字符串模板渲染到新窗口中
    opener.document.write(html)

    // 触发打印前的回调函数
    opener.onbeforeprint = function () {
      opener.focus()
      if (typeof options.beforeprint === 'function') {
        options.beforeprint(opener)
      }
    }

    // 触发打印后的回调函数（默认是关闭新窗口）
    opener.onafterprint = function () {
      let autoClose = true

      if (typeof opener.afterprint === 'function') {
        autoClose = opener.afterprint(opener)
      }

      if (autoClose !== false) {
        self.close()
      }
    }

    // 插入额外的样式
    if (options.extraCSS) {
      const $style = document.createElement('style')
      $style.innerText = options.extraCSS
      opener.document.head.appendChild($style)
    }

    // 延迟调用打印接口
    setTimeout(() => {
      if (!options.debug && !opener.closed) {
        opener.print()
      }
    }, options.delay || 50)
  }

  /**
   * 关闭打印页面
   */
  close () {
    const { opener } = this
    if (!opener.closed) {
      opener.close()
    }
  }
}

/**
 * 同步打印工具方法
 * @param {object} options 打印配置项
 * @property {string} title 标签标题(默认是打印页)
 * @property {string} body 打印内容
 * @property {string} extraCSS 额外的样式信息
 * @property {string} width 内容宽度（默认是210mm）
 * @property {string} delay 延迟打印（默认是50ms）
 * @property {boolean} debug 调试模式（默认是false）
 * @property {function} beforeprint 打印前调用的函数 参数 opener 窗口对象
 * @property {function} afterprint 打印后调用的函数 参数 opener 窗口对象
 * @returns {instance} AsyncPrint 执行打印操作 参数 body 打印内容
 */
export default function print (options = {}) {
  // 打开新窗口
  const opener = window.open('', '_blank')
  // 提示等待信息
  opener.document.body.innerHTML =
    '<div style="text-align: center; margin: 40px 0;">正在调取打印数据，请稍等...</div>'

  return new AsyncPrint(opener, options)
}
