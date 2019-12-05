/**
 * @author Sangbaipi
 * @email sangbaipi@2dfire.com
 * @create date 2018-08-27 05:39:18
 * @modify date 2018-08-27 05:39:18
 * @desc RequestAnimationFrame兼容
 */

;(function (win) {
  let lastTime = 0
  const vendors = ['webkit', 'moz']
  let requestAnimationFrame = win.requestAnimationFrame
  let cancelAnimationFrame = win.cancelAnimationFrame

  for (let i = 0; !requestAnimationFrame && i < vendors.length; i++) {
    requestAnimationFrame = win[vendors[i] + 'RequestAnimationFrame']
    // Webkit中此取消方法的名字变了
    cancelAnimationFrame =
      win[vendors[i] + 'CancelAnimationFrame'] || win[vendors[i] + 'CancelRequestAnimationFrame']
  }

  // 模拟requestAnimationFrame
  if (!requestAnimationFrame) {
    requestAnimationFrame = callback => {
      const currTime = new Date().getTime()
      const timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
      const id = win.setTimeout(function () {
        callback()
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }

  // 模拟cancelAnimationFrame
  if (!cancelAnimationFrame) {
    cancelAnimationFrame = id => {
      clearTimeout(id)
    }
  }

  win.requestAnimationFrame = requestAnimationFrame
  win.cancelAnimationFrame = cancelAnimationFrame
})(window)
