/**
 * 通用单例模式
 * @author sky
 * @email 854323752@qq.com
 * @param {function} fn
 */

export default function getSingleton (fn) {
  let singleton = null

  return function () {
    if (singleton) {
      return singleton
    }

    if (typeof fn === 'function') {
      return (singleton = fn.apply(this, arguments))
    }

    return (singleton = fn)
  }
}
