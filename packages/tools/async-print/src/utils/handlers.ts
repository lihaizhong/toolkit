interface IHTMLStyleElement extends HTMLStyleElement {
  styleSheet: any
}

interface IPrintHandle {
  insertStyle(cssText: string): void,
  close(): void,
  print(): void
}

interface IWindow extends Window {
  _handle: IPrintHandle
}

function getCommonHandles(opener: IWindow): IPrintHandle {
  return {
    insertStyle(cssText: string) {
      if (cssText) {
        const $styleElem: IHTMLStyleElement = <IHTMLStyleElement>document.createElement('style')
        if ($styleElem.styleSheet) {
          // IE
          $styleElem.type = 'text/css'
          const func: () => void = function () {
            // 防止IE中stylesheet数量超过限制而发生错误
            $styleElem.styleSheet.cssText = cssText
          }
          // 如果当前styleSheet还不能用，则放到异步中则行
          if ($styleElem.styleSheet.disabled) {
            setTimeout(func, 0)
          } else {
            func()
          }
        } else {
          // w3c浏览器中只要创建文本节点插入到style元素中就行了
          const $textNode = document.createTextNode(cssText)
          $styleElem.appendChild($textNode)
        }
        opener.document.head.appendChild($styleElem)
      }
    },
    close() {
      if (!opener.closed) {
        opener.close()
      }
    },
    print() {
      if (!opener.closed) {
        opener.print()
      }
    }
  }
}

export const HANDLER_MINOR = {
  win: 'window',
  frame: 'iframe'
}

export default {
  createNewPrintWindow() {
    // 打印页窗口句柄
    const opener: IWindow = <IWindow>window.open('', '_blank')
    // 提示等待信息
    opener.document.body.innerHTML =
      '<div style="text-align: center; margin: 40px 0;">正在调取打印数据，请稍等...</div>'

    opener._handle = getCommonHandles(opener)

    return opener
  },

  createNewPrintFrame() {
    // 打印页iframe
    const $iframe: HTMLIFrameElement = document.createElement('iframe')
    // 设置iframe的链接
    $iframe.setAttribute('src', 'about:blank')
    // 调整frame样式
    $iframe.setAttribute(
      'style',
      'position: absolute; left: -100000px; top: -100000px; z-index: -999999; width: 200px; height: 200px;'
    )
    // 将iframe插入到document中
    document.body.appendChild($iframe)
    // 获取窗口句柄
    const opener: IWindow = <IWindow>$iframe.contentWindow
    opener._handle = Object.assign(getCommonHandles(opener), {
      close() {
        document.body.removeChild($iframe)
      }
    })

    return opener
  }
}
