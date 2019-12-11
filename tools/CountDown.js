/**
 * @author sky
 * @email 854323752@qq.com
 * @create date 2018-08-27 02:45:53
 * @modify date 2018-08-27 02:45:53
 * @desc 倒计时 内部以 “毫秒” 为单位，对外抛出以 “秒” 为单位
 * @param {Boolean} needRemainFormat 非不填，是否需要格式化时间 默认是 true
 * @param {Date | String} startTime 非必填，开始时间 用于计算 remain 时间 默认是 Date.now()
 * @param {Date | String} endTime 非必填，结束时间 用于计算 remain 时间 默认是 Date.now()
 * @param {Number} remain 推荐，否则可以通过 startTime 和 endTime 计算出来
 * @param {Function} callback 倒计时的回调函数，有一个参数`remainTimeVos`和一个是否结束的参数`isFinished`
 * @key {Object} remainTimeVos
 * @sub-key {String} day 剩余天数
 * @sub-key {String} hours 剩余小时
 * @sub-key {String} minutes 剩余分钟
 * @sub-key {String} seconds 剩余秒
 * @sub-key {Number} remain 剩余时间（单位：秒）
 */

export default class CountDown {
  constructor (needRemainFormat) {
    this.init(needRemainFormat)
  }

  /* ##################### External methods ######################### */

  /**
   * @exports init
   *
   * 初始化
   * @param {boolean} needRemainFormat
   */
  init (needRemainFormat) {
    this._needRemainFormat = needRemainFormat !== false
    this._nowTime = this._startTime = this._endTime = null
    this._timer = null
    this._remain = 0
    this._callback = function () {}
  }

  /**
   * @exports setRemainTime
   *
   * 设置剩余时间
   * @param {number} remain
   */
  setRemainTime (remain) {
    if (remain < 0) {
      remain = 0
    }
    this._remain = typeof remain !== 'number' ? 0 : CountDown.formatTimestamp(remain)
    this.exit()

    return this
  }

  /**
   * @exports setTime
   *
   * 设置开始时间和结束时间
   * @param {date | number | string} startTime
   * @param {date | number | string} endTime
   * @param {date | number | string} nowTime
   */
  setTime (startTime, endTime, nowTime) {
    this._startTime = CountDown.formatTimestamp(startTime)
    this._endTime = CountDown.formatTimestamp(endTime)
    this._nowTime = CountDown.formatTimestamp(nowTime || new Date())
    const remainTime = this._endTime - Math.max(this._startTime, this._nowTime)
    this.setRemainTime(remainTime > 0 ? remainTime : 0)

    return this
  }

  /**
   * @exports setCallback
   *
   * 设置毁掉函数
   * @param {function} callback
   */
  setCallback (callback) {
    this._callback = callback
    this.exit()

    return this
  }

  /**
   * @exports start
   *
   * 启动计时器
   */
  start () {
    const isFinished = this._remain <= 0
    // 执行回调函数
    this._callback(this._getRemainTimeFormat(this._remain), isFinished)
    if (!isFinished) {
      this.play()
    }
  }

  /**
   * @exports play
   *
   * 重启计时器
   */
  play () {
    let timerStart = Date.now()

    if (this._startTime && this._startTime > this._nowTime) {
      return
    }

    function __callback__ () {
      const timerEnd = Date.now()
      const interval = Math.floor((timerEnd - timerStart) / 1000) * 1000
      const base = 1000
      let remain = this._remain
      let isFinished = false

      if (interval >= base) {
        // 确保时间是绝对精确的
        timerStart = Math.floor(timerEnd / base) * base + (timerStart % base)
        // 由于requestAnimationFrame在离开页面后会出现暂停的效果，顾返回页面时，要减去中间的差值
        remain -= interval
        // 更新当前时间
        this._nowTime += interval

        // BUGFIX 由于离开页面时间太久，已经过了剩余时间，导致展示内容是负值
        if (remain < 0) {
          remain = 0
        }

        if (remain <= 0) {
          isFinished = true
        }

        this._remain = remain
        // 格式化剩余时间
        const remainFormat = this._getRemainTimeFormat(remain)
        // 执行回调函数
        this._callback(remainFormat, isFinished)
      }

      if (!isFinished) {
        this._timer = requestAnimationFrame(__callback__)
      }
    }

    this._timer = requestAnimationFrame(__callback__)
  }

  /**
   * @exports pause
   *
   * 暂停计时器
   */
  pause () {
    cancelAnimationFrame(this._timer)
    this._timer = null
  }

  /**
   * @exports exit
   *
   * 关闭计时器
   */
  exit () {
    this.pause()
  }

  /* ##################### Internal methods ######################### */

  /**
   * 获取格式化后的剩余时间对象
   * @param {number} remain
   */
  _getRemainTimeFormat (remain) {
    if (!this._needRemainFormat) {
      return remain / 1000
    }

    const remainFormat = {}

    remainFormat.remain = remain / 1000

    const dayFormat = 86400000
    remainFormat.day = CountDown.formatTime(Math.floor(remain / dayFormat))
    remain = remain % dayFormat

    const hoursFormat = 3600000
    remainFormat.hours = CountDown.formatTime(Math.floor(remain / hoursFormat))
    remain = remain % hoursFormat

    const minutesFormat = 60000
    remainFormat.minutes = CountDown.formatTime(Math.floor(remain / minutesFormat))
    remain = remain % minutesFormat

    const secondsFormat = 1000
    remainFormat.seconds = CountDown.formatTime(Math.floor(remain / secondsFormat))

    return remainFormat
  }
}

/**
 * STATIC: 针对Safari进行字符串时间格式优化
 * @param {string} time
 */
CountDown.DateStringFixed = function (time) {
  let result = null

  if (typeof time !== 'string') {
    return time
  }

  // 针对safari浏览器做时间调整
  if (/safari/gi.test(navigator.userAgent)) {
    result = time.trim().replace(/\s+/, 'T')
  }

  if (isNaN(Date.parse(result))) {
    return time
  } else {
    result = time
  }

  return result
}

/**
 * STATIC: 将时间转换为毫秒（会将毫秒级别的值重置为0）
 * @param {date | number | string} time
 */
CountDown.formatTimestamp = function (time) {
  let result = null
  if (time instanceof Date) {
    result = time.getTime()
  } else if (!isNaN(time) && (typeof time === 'number' || typeof time === 'string')) {
    result = +time
  } else if (isNaN(time) && typeof time === 'string') {
    time = CountDown.DateStringFixed(time)
    result = new Date(time).getTime()
  } else {
    result = Date.now()
  }

  return Math.floor(result / 1000) * 1000
}

/**
 * STATIC: 格式化时间
 * @param {number} time
 */
CountDown.formatTime = function (time) {
  if (isNaN(time) || time === '' || typeof time === 'boolean') {
    time = 0
  }

  time = '0' + time

  return time.substring(time.length - 2)
}
