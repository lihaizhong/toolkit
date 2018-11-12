import CountDown from '@/countdown/CountDown'

describe('【CountDown】init', function () {
  it('#init no setup', function () {
    const cd = new CountDown()
    expect(cd._needRemainFormat).to.equal(true)
  })

  it('#init setup true', function () {
    const cd = new CountDown(true)
    expect(cd._needRemainFormat).to.equal(true)
  })

  it('#init setup false', function () {
    const cd = new CountDown(false)
    expect(cd._needRemainFormat).to.equal(false)
  })
})

describe('【CountDown】remain time format', function () {
  it('#_getRemainTimeFormat not format(输入的单位为ms，输出的单位为s)', function () {
    const cd = new CountDown(false)
    const remain = 500000

    let remainVos = cd._getRemainTimeFormat(remain)
    console.log(remainVos)
    expect(remainVos).to.be.equal(remain / 1000)
  })

  it('#_getRemainTimeFormat format(输出为一个对象，包含天数、小时、分钟、秒钟以及以秒为单位的剩余时间)', function () {
    const cd = new CountDown(true)
    const remain = 500000
    let remainVos = cd._getRemainTimeFormat(remain)

    console.log(JSON.stringify(remainVos))
    expect(remainVos).to.be.a('object', '返回值不是一个对象')
    expect(remainVos.day).to.be.equal('00')
    expect(remainVos.hours).to.be.equal('00')
    expect(remainVos.minutes).to.be.equal('08')
    expect(remainVos.seconds).to.be.equal('20')
    expect(remainVos.remain).to.be.equal(remain / 1000)
  })
})

describe('【CountDown】standard date string format', function () {
  const cd = new CountDown()

  afterEach(function () {
    cd.init()
  })

  it('#formatStandardDate number', function () {
    let now = new Date()

    let format = CountDown.formatStandardDate(now.getTime())

    let year = now.getFullYear()
    let month = CountDown.formatTime(now.getMonth() + 1)
    let day = CountDown.formatTime(now.getDate())
    let hour = CountDown.formatTime(now.getHours())
    let minute = CountDown.formatTime(now.getMinutes())
    let second = CountDown.formatTime(now.getSeconds())
    let dateStr = `${ year }-${ month }-${ day } ${ hour }:${ minute }:${ second }`
    expect(format).to.equal(CountDown.DateStringFixed(dateStr))
  })

  it('#formatStandardDate string', function () {
    let dateStr = '2018-10-08 16:00'

    let format = CountDown.formatStandardDate(dateStr)

    expect(format).to.equal(CountDown.DateStringFixed(dateStr))
  })

  it('#formatStandardDate date', function () {
    let now = new Date()

    let format = CountDown.formatStandardDate(now)

    let year = now.getFullYear()
    let month = CountDown.formatTime(now.getMonth() + 1)
    let day = CountDown.formatTime(now.getDate())
    let hour = CountDown.formatTime(now.getHours())
    let minute = CountDown.formatTime(now.getMinutes())
    let second = CountDown.formatTime(now.getSeconds())
    let dateStr = `${ year }-${ month }-${ day } ${ hour }:${ minute }:${ second }`
    expect(format).to.equal(CountDown.DateStringFixed(dateStr))
  })
})

describe('【CountDown】formatTimestamp', function () {
  it('#static:formatTimestamp NaN', function () {
    const timestamp = CountDown.formatTimestamp()
    expect(timestamp).to.be.equal(parseInt(Date.now() / 1000) * 1000)
  })

  it('#static:formatTimestamp Date', function () {
    const date = new Date('2018-09-26T08:00')
    const timestamp = CountDown.formatTimestamp(date)
    expect(timestamp).to.be.equal(date.getTime())
  })

  it('#static:formatTimestamp Number', function () {
    const time = '500000'
    const timestamp = CountDown.formatTimestamp(time)
    expect(timestamp).to.be.equal(Number(time))
  })

  it('#static:formatTimestamp String', function () {
    const dateStr = '2018-09-27 12:00'
    const time = new Date('2018-09-27T12:00').getTime()
    const timestamp = CountDown.formatTimestamp(dateStr)
    expect(timestamp).to.be.equal(time)
  })
})

describe('【CountDown】set datetime', function () {
  const cd = new CountDown()

  afterEach(() => {
    cd.init()
  })

  it('#setRemainTime < 0', function () {
    const remain = -2000
    cd.setRemainTime(remain)
    expect(cd._remain).to.equal(0)
  })

  it('#setRemainTime', function () {
    const remain = 40000
    cd.setRemainTime(remain)
    expect(cd._remain).to.equal(remain)
  })

  it('#setTime Timestamp', function () {
    const now = Date.now()
    const start = now
    const delay = 40000
    const end = start + delay

    cd.setTime(start, end)
    expect(cd._remain).to.equal(delay)
  })

  it('#setTime Date', function () {
    const now = Date.now()
    const start = new Date(now)
    const delay = 40000
    const end = new Date(now + delay)

    cd.setTime(start, end)
    expect(cd._remain).to.equal(delay)
  })
})

describe('【CountDown】add symbol', function () {
  const cd = new CountDown()

  afterEach(function () {
    cd.init()
  })

  it('#registerFinishedSymbol', function () {
    const COUNTDOWN_FINISHED_SYMBOL = cd.registerFinishedSymbol()
    const breakpoint = cd._breakpoint['finished']

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('finished')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_FINISHED_SYMBOL)
    expect(breakpoint.value).to.equal(null)
  })

  it('#registerUnstartSymbol', function () {
    const COUNTDOWN_UNSTART_SYMBOL = cd.registerUnstartSymbol()
    const breakpoint = cd._breakpoint['unstart']

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('unstart')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_UNSTART_SYMBOL)
    expect(breakpoint.value).to.equal(null)
  })

  it('#registerSymbol remain:1000', function () {
    const point = 'remain:1000'
    const COUNTDOWN_REMAIN_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('remain')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_REMAIN_SYMBOL)
    expect(breakpoint.value).to.equal(1000)
  })

  it('#registerSymbol remain:1000!', function () {
    const point = 'remain:1000!'
    const COUNTDOWN_REMAIN_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('remain')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_REMAIN_SYMBOL)
    expect(breakpoint.value).to.equal(1000)
    expect(breakpoint.expires).to.equal(Infinity)
  })

  it('#registerSymbol remain:10000!R5000', function () {
    const point = 'remain:10000!R5000'
    const COUNTDOWN_REMAIN_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('remain')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_REMAIN_SYMBOL)
    expect(breakpoint.value).to.equal(10000)
    expect(breakpoint.ET).to.equal('R')
    expect(breakpoint.expires).to.equal(5000)
  })

  it('#registerSymbol time:2018-09-26 08:00', function () {
    const point = 'time:2018-09-26 08:00'
    const COUNTDOWN_TIME_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('time')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_TIME_SYMBOL)
    expect(breakpoint.value).to.equal(new Date('2018-09-26T08:00').getTime())
  })

  it('#registerSymbol time:2018-09-26 08:00!', function () {
    const point = 'time:2018-09-26 08:00!'
    const COUNTDOWN_TIME_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('time')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_TIME_SYMBOL)
    expect(breakpoint.value).to.equal(new Date('2018-09-26T08:00').getTime())
    expect(breakpoint.expires).to.equal(Infinity)
  })

  it('#registerSymbol time:2018-09-26 08:00!T2018-09-28 08:00', function () {
    const point = 'time:2018-09-26 08:00!T2018-09-28 08:00'
    const COUNTDOWN_TIME_SYMBOL = cd.registerSymbol(point)
    const breakpoint = cd._breakpoint[point]

    console.log(JSON.stringify(breakpoint))
    expect(breakpoint.type).to.equal('time')
    expect(breakpoint.symbol).to.equal(COUNTDOWN_TIME_SYMBOL)
    expect(breakpoint.value).to.equal(new Date('2018-09-26T08:00').getTime())
    expect(breakpoint.ET).to.equal('T')
    expect(breakpoint.expires).to.equal(new Date('2018-09-28T08:00').getTime())
  })
})

describe('【CountDown】get breakpoint symbol list', function () {
  const cd = new CountDown()

  afterEach(function () {
    cd.init()
  })

  it('#_getBreakPointSymbols not symbols', function () {
    expect(cd._getBreakPointSymbols()).to.be.empty
    expect(cd._getBreakPointSymbols()).to.eql([])

    expect(cd._getBreakPointSymbols(true)).to.be.empty
    expect(cd._getBreakPointSymbols(true)).to.eql([])
  })

  it('#_getBreakPointSymbols finished symbol', function (done) {
    let CountDownFinishedSymbol = cd.registerFinishedSymbol()

    cd.setRemainTime(1000)

    cd.setCallback((remainVo, includeSymbol) => {
      if (remainVo.remain === 0) {
        console.log('倒计时完成')
        expect(includeSymbol(CountDownFinishedSymbol)).to.be.true
        done()
      } else {
        console.log('倒计时正在继续')
        expect(includeSymbol(CountDownFinishedSymbol)).to.be.false
      }
    })

    cd.start()
  })

  it('#_getBreakPointSymbols unstart symbol', function (done) {
    let CountDownUnstartSymbol = cd.registerUnstartSymbol()

    let now = Date.now()
    cd.setTime(new Date(now + 86400000), new Date(now + 691200000), now)

    cd.setCallback((remainVo, includeSymbol) => {
      if (remainVo.remain >= 604800) {
        console.log('倒计时未开始')
        expect(includeSymbol(CountDownUnstartSymbol)).to.be.true
        done()
      }
    })

    cd.start()
  })

  it('#_getBreakPointSymbols custom symbol 0', function (done) {
    let CountDownRemain10Symbol = cd.registerSymbol('remain:10000')

    cd.setRemainTime(12000)

    cd.setCallback((remainVo, includeSymbol) => {
      if (remainVo.remain === 10) {
        expect(includeSymbol(CountDownRemain10Symbol)).to.be.true
      } else {
        expect(includeSymbol(CountDownRemain10Symbol)).to.be.false
      }

      if (remainVo.remain <= 0) {
        done()
      }
    })

    cd.start()
  })

  it('#_getBreakPointSymbols custom symbol 1', function (done) {
    let CountDownRemain10Symbol = cd.registerSymbol('remain:10000!')

    cd.setRemainTime(12000)

    cd.setCallback((remainVo, includeSymbol) => {
      if (remainVo.remain <= 10) {
        expect(includeSymbol(CountDownRemain10Symbol)).to.be.true
      } else {
        expect(includeSymbol(CountDownRemain10Symbol)).to.be.false
      }

      if (remainVo.remain <= 0) {
        done()
      }
    })

    cd.start()
  })

  it('#_getBreakPointSymbols custom symbol 2', function (done) {
    let CountDownRemain10_5Symbol = cd.registerSymbol('remain:10000!R5000')

    cd.setRemainTime(12000)

    cd.setCallback((remainVo, includeSymbol) => {
      // console.log(JSON.stringify(remainVo))
      // console.log(JSON.stringify(cd._breakpoint))
      if (remainVo.remain <= 10 && remainVo.remain >= 5) {
        expect(includeSymbol(CountDownRemain10_5Symbol)).to.be.true
      } else {
        expect(includeSymbol(CountDownRemain10_5Symbol)).to.be.false
      }

      if (remainVo.remain <= 0) {
        done()
      }
    })

    cd.start()
  })

  it('#_getBreakPointSymbols custom symbol 3', function (done) {
    let now = new Date()
    let time = new Date(now.getTime() + 2000)

    let CountDownTimeSymbol = cd.registerSymbol(`time:${ CountDown.formatStandardDate(time) }`)

    cd.setTime(now, new Date(now.getTime() + 12000), now)
    console.log(JSON.stringify(cd._breakpoint))

    cd.setCallback((remainVo, includeSymbol) => {
      if (parseInt(Date.now() / 1000) === parseInt(time.getTime() / 1000)) {
        expect(includeSymbol(CountDownTimeSymbol)).to.be.true
      } else {
        expect(includeSymbol(CountDownTimeSymbol)).to.be.false
      }

      if (remainVo.remain <= 0) {
        done()
      }
    })

    cd.start()
  })

  it('#_getBreakPointSymbols custom symbol 4', function (done) {
    let now = new Date()
    let time = new Date(now.getTime() + 2000)

    let point = `time:${ CountDown.formatStandardDate(time) }!`
    let CountDownTimeSymbol = cd.registerSymbol(point)

    cd.setTime(now, new Date(now.getTime() + 12000), now)
    // console.log(JSON.stringify(cd._breakpoint))

    cd.setCallback((remainVo, includeSymbol) => {
      console.log(JSON.stringify(cd._breakpoint[point]))
      console.log(JSON.stringify({ now: parseInt(Date.now() / 1000), time: parseInt(time.getTime() / 1000) }))
      if (parseInt(Date.now() / 1000) >= parseInt(time.getTime() / 1000)) {
        expect(includeSymbol(CountDownTimeSymbol)).to.be.true
      } else {
        expect(includeSymbol(CountDownTimeSymbol)).to.be.false
      }

      if (remainVo.remain <= 0) {
        done()
      }
    })

    cd.start()
  })

  it('#_getBreakPointSymbols custom symbol 5', function (done) {
    let now = new Date()
    let time = new Date(now.getTime() + 2000)
    let expire = new Date(now.getTime() + 7000)

    let point = `time:${ CountDown.formatStandardDate(time) }!T${ CountDown.formatStandardDate(expire) }`
    let CountDownTimeSymbol = cd.registerSymbol(point)

    cd.setTime(now, new Date(now.getTime() + 12000), now)
    console.log(JSON.stringify(cd._breakpoint[point]))

    cd.setCallback((remainVo, includeSymbol) => {
      console.log(JSON.stringify({ now: parseInt(Date.now() / 1000), time: parseInt(time.getTime() / 1000), expire: parseInt(expire.getTime() / 1000), _now: cd._nowTime }))
      if (parseInt(Date.now() / 1000) >= parseInt(time.getTime() / 1000) && parseInt(Date.now() / 1000) <= parseInt(expire.getTime() / 1000)) {
        expect(includeSymbol(CountDownTimeSymbol)).to.be.true
      } else {
        expect(includeSymbol(CountDownTimeSymbol)).to.be.false
      }

      if (remainVo.remain <= 0) {
        done()
      }
    })

    cd.start()
  })
})
