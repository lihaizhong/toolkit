export default class InfiniteLoading {
  constructor (options = {}) {
    this.wrapper = null
    this.scroller = null
    this.offset = options.offset || 100
    this.delay = options.delay || 100
    this.lastScrollTop = 0

    this.domProps = {
      scrollAreaHeight: 0,
      viewAreaHeight: 0,
      scrollTop: 0
    }

    this.EventHandlers = {
      resizeHandler: {
        target: null,
        type: 'resize',
        handler () {}
      },
      scrollHandler: {
        type: 'scroll',
        handler () {}
      }
    }

    this.timers = {
      target: null,
      resizeTimer: null,
      scrollTimer: null
    }
  }

  _resizeInit () {
    if (this.wrapper === window) {
      this.domProps.viewAreaHeight = this.wrapper.screen.availHeight
    } else {
      this.domProps.viewAreaHeight = this.wrapper.clientHeight
    }
  }

  _calcScrollVariable () {
    this.lastScrollTop = this.domProps.scrollTop
    if (this.wrapper === window) {
      this.domProps.scrollAreaHeight = this.scroller.scrollHeight
      this.domProps.scrollTop = this.scroller.scrollTop
    } else {
      this.domProps.scrollAreaHeight = this.scroller.scrollHeight
      this.domProps.scrollTop = this.scroller.offset().top
    }
  }

  init (root) {
    if (root === window) {
      this.wrapper = window

      const testValue = document.documentElement.scrollTop
      if (testValue === null || testValue === undefined) {
        this.scroller = document.body
      } else {
        this.scroller = document.documentElement
      }
    } else {
      const isHTMLElement =
        typeof HTMLElement === 'object'
          ? root instanceof HTMLElement
          : root &&
            typeof root === 'object' &&
            root.nodeType === 1 &&
            typeof root.nodeName === 'string'

      if (isHTMLElement) {
        this.wrapper = this.scroller = root
      } else {
        throw new Error('invalid HTMLElement')
      }
    }
    this._resizeInit()
  }

  resize (fn) {
    const { resizeHandler } = this.EventHandlers
    resizeHandler.target = this.wrapper
    resizeHandler.handler = () => {
      clearTimeout(this.timers.resizeTimer)
      this.timers.resizeTimer = setTimeout(() => {
        this._resizeInit()
        typeof fn === 'function' && fn()
      }, 300)
    }
    const { target, type, handler } = resizeHandler
    target.addEventListener(type, handler)
  }

  scroll (fn) {
    const { scrollHandler } = this.EventHandlers
    const { timers, delay, lastScrollTop, offset } = this
    scrollHandler.target = this.wrapper
    scrollHandler.handler = () => {
      if (timers.scrollTimer) {
        return null
      }

      timers.scrollTimer = setTimeout(() => {
        this._calcScrollVariable()
        const { scrollTop, scrollAreaHeight, viewAreaHeight } = this.domProps

        if (
          typeof fn === 'function' &&
          lastScrollTop < scrollTop &&
          scrollTop + viewAreaHeight + offset >= scrollAreaHeight
        ) {
          const result = fn()

          if (result instanceof Promise) {
            result
              .then(data => {
                timers.scrollTimer = null
                return data
              })
              .catch(error => {
                timers.scrollTimer = null
                throw error
              })
          } else {
            timers.scrollTimer = null
          }
        } else {
          timers.scrollTimer = null
        }
      }, delay)
    }
    const { target, type, handler } = scrollHandler
    target.addEventListener(type, handler)
  }

  destroy () {
    Object.keys(this.EventHandlers).forEach(key => {
      const { target, type, handler } = this.EventHandlers[key]
      target.removeEventListener(type, handler)
    })
    Object.keys(this.timers).forEach(key => {
      this.timers[key] = null
    })
    this.wrapper = null
    this.scroller = null
  }
}
