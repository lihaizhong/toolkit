/**
 * 分时函数
 * @author sky
 * @email 854323752@qq.com
 * @param {array} list 数据列表
 * @param {function} 操作的动作
 * @param {number} count 操作的数量(默认：1)
 * @param {number} 每批任务间隔的时间(默认：200)
 * @description 为避免一次性操作大量好性能的任务，使用分批执行的方式
 */
export default function timeChunk (list = [], fn, count = 1, interval = 200) {
  let timer = null

  function start () {
    for (let i = 0; i < Math.min(count, list.length); i++) {
      const data = list.shift()
      fn(data)
    }
  }

  return function () {
    timer = setInterval(() => {
      list.length ? clearInterval(timer) : start()
    }, interval)
  }
}
