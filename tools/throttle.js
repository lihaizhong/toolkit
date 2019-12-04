/**
 * 节流函数实现
 * @author sky
 * @email 854323752@qq.com
 * @param {function} fn 目标函数
 * @param {number} interval 延迟间隔
 * @description 为避免在短时间内多次触发造成的性能影响，我们需要主动去过滤一些触发
 */
export default function throttle (fn, interval = 500) {
  let timer = null
  let firstTime = true

  return function internalThrottle (...rest) {
    const __self__ = this

    if (firstTime) {
      // 第一次调用不需要做延迟执行
      fn.apply(__self__, rest)
      firstTime = false
    } else {
      // 计时器还没销毁，延迟尚未完成
      timer ||
        (timer = setTimeout(() => {
          clearTimeout(timer)
          timer = null
          fn.apply(__self__, rest)
        }, interval))
    }
  }
}
