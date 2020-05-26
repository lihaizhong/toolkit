class ResultWrapper implements IFuzzyResultWrapper {
  private continuous
  private count
  private position
  private distance

  constructor(continuous, count, position, distance) {
    // 最大的匹配词长度
    this.continuous = continuous
    // 匹配词总个数
    this.count = count
    // 首个匹配字符的位置
    this.position = position
    // 最短编辑路径
    this.distance = distance
  }

  get() {
    const { continuous, count, position, distance } = this
    return { continuous, count, position, distance }
  }

  setContinuous(continuous) {
    if (this.continuous < continuous) {
      this.continuous = continuous
    }
  }

  getContinuous() {
    return this.continuous
  }

  setCount(count) {
    this.count = count
  }

  getCount() {
    return this.count
  }

  setPosition(position) {
    this.position = position
  }

  getPosition() {
    return this.position
  }

  setDistance(distance) {
    this.distance = distance
  }

  getDistance() {
    return this.distance
  }
}

export default class Fuzzy implements IFuzzy {

}
