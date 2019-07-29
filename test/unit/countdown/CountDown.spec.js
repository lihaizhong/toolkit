import CountDown from '@/countdown/CountDown'

describe('【CountDown】init', function() {
  it('#init no setup', function() {
    const cd = new CountDown()
    expect(cd._needRemainFormat).to.equal(true)
  })

  it('#init setup true', function() {
    const cd = new CountDown(true)
    expect(cd._needRemainFormat).to.equal(true)
  })

  it('#init setup false', function() {
    const cd = new CountDown(false)
    expect(cd._needRemainFormat).to.equal(false)
  })
})

describe('【CountDown】remain time format', function() {
  it('#_getRemainTimeFormat not format(输入的单位为ms，输出的单位为s)', function() {
    const cd = new CountDown(false)
    const remain = 500000

    let remainVos = cd._getRemainTimeFormat(remain)
    console.log(remainVos)
    expect(remainVos).to.be.equal(remain / 1000)
  })

  it('#_getRemainTimeFormat format(输出为一个对象，包含天数、小时、分钟、秒钟以及以秒为单位的剩余时间)', function() {
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

describe('【CountDown】formatTimestamp', function() {
  it('#static:formatTimestamp NaN', function() {
    const timestamp = CountDown.formatTimestamp()
    expect(timestamp).to.be.equal(parseInt(Date.now() / 1000) * 1000)
  })

  it('#static:formatTimestamp Date', function() {
    const date = new Date('2018-09-26T08:00')
    const timestamp = CountDown.formatTimestamp(date)
    expect(timestamp).to.be.equal(date.getTime())
  })

  it('#static:formatTimestamp Number', function() {
    const time = '500000'
    const timestamp = CountDown.formatTimestamp(time)
    expect(timestamp).to.be.equal(Number(time))
  })

  it('#static:formatTimestamp String', function() {
    const dateStr = '2018-09-27 12:00'
    const time = new Date('2018-09-27T12:00').getTime()
    const timestamp = CountDown.formatTimestamp(dateStr)
    expect(timestamp).to.be.equal(time)
  })
})

describe('【CountDown】set datetime', function() {
  const cd = new CountDown()

  afterEach(() => {
    cd.init()
  })

  it('#setRemainTime < 0', function() {
    const remain = -2000
    cd.setRemainTime(remain)
    expect(cd._remain).to.equal(0)
  })

  it('#setRemainTime', function() {
    const remain = 40000
    cd.setRemainTime(remain)
    expect(cd._remain).to.equal(remain)
  })

  it('#setTime Timestamp', function() {
    const now = Date.now()
    const start = now
    const delay = 40000
    const end = start + delay

    cd.setTime(start, end)
    expect(cd._remain).to.equal(delay)
  })

  it('#setTime Date', function() {
    const now = Date.now()
    const start = new Date(now)
    const delay = 40000
    const end = new Date(now + delay)

    cd.setTime(start, end)
    expect(cd._remain).to.equal(delay)
  })
})
