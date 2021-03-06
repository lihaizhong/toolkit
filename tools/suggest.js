/**
 * 根据关键字信息排序列表，主要用于前端模糊匹配
 * @author sky
 * @email 854323752@qq.com
 */

class ResultWrapper {
  constructor (continuous, count, position, distance) {
    this._options = {
      // 最大的匹配词长度
      continuous,
      // 匹配词总个数
      count,
      // 首个匹配字符的位置
      position,
      // 最短编辑路径
      distance
    }
  }

  get () {
    return Object.assign({}, this._options)
  }

  setContinuous (continuous) {
    if (this._options.continuous < continuous) {
      this._options.continuous = continuous
    }
  }

  getContinuous () {
    return this._options.continuous
  }

  setCount (count) {
    this._options.count = count
  }

  getCount () {
    return this._options.count
  }

  setPosition (position) {
    this._options.position = position
  }

  getPosition () {
    return this._options.position
  }

  setDistance (distance) {
    this._options.distance = distance
  }

  getDistance () {
    return this._options.distance
  }
}

/**
 * 编辑距离算法(Edit Distance Algorithm)
 * @param {string} source 输入的内容
 * @param {string} target 匹配的目标
 * @return {object}
 * @property {number} continuous 匹配到的最大长度
 * @property {number} count 匹配到的个数
 * @property {number} position 匹配到的位置
 * @property {number} distance 编辑文本的距离
 */
function levenshteinDistance (source, target) {
  const sourceLength = source.length
  const targetLength = target.length
  const space = new Array(targetLength)
  const result = new ResultWrapper(0, 0, targetLength, -1)

  // 过滤目标或者比较值为空字符串的情况
  if (sourceLength === 0) {
    result.setDistance(targetLength)
  } else if (targetLength === 0) {
    result.setDistance(sourceLength)
  } else {
    // 保存所有匹配到的字符的index
    const matchPositionList = []
    // 连续字符长度
    let continuous = 0
    // 0 为不需要做增删改的操作，1 为需要做增删改操作
    let modifyNum = 0

    for (let i = 0; i < sourceLength; i++) {
      const sourceChar = source[i]
      let temp = i
      let matchIndex = -1

      for (let j = 0; j < targetLength; j++) {
        const targetChar = target[j]
        // 前一个编辑距离
        const prevDistance = j === 0 ? i + 1 : space[j - 1]
        // 上一个编辑距离
        const topDistance = space[j] === undefined ? j + 1 : space[j]

        if (sourceChar === targetChar) {
          modifyNum = 0

          // 解决重复匹配的问题
          if (matchIndex === -1 && !matchPositionList.includes(j)) {
            matchIndex = j
          }

          // 设置首位匹配到的字符
          if (result.getPosition() === targetLength) {
            result.setPosition(j)
          }
        } else {
          modifyNum = 1
        }

        // 获取增，删，改和不变得到的最小值
        const min = Math.min(prevDistance + 1, topDistance + 1, temp + modifyNum)

        // 保存左上角的数据，计算最小值时需要用到
        temp = topDistance
        space[j] = min
      }

      // 如果匹配到了结果
      if (matchIndex !== -1) {
        if (i > 0 && matchIndex > 0 && source[i - 1] === target[matchIndex - 1]) {
          if (continuous === 0) {
            continuous = 2
          } else {
            continuous++
          }
        } else if (continuous === 0) {
          continuous++
        } else {
          // 设置最长的连续字符
          result.setContinuous(continuous)
          continuous = 1
        }

        matchPositionList.push(matchIndex)
      } else {
        // 设置最长的连续字符
        result.setContinuous(continuous)
        continuous = 0
      }
    }

    // 设置最长的连续字符
    result.setContinuous(continuous)
    // 设置匹配到的数量
    result.setCount(matchPositionList.length)
    // 设置编辑距离
    result.setDistance(space[targetLength - 1])
  }

  return result.get()
}

export class YouNeedSuggest {
  /**
   * 编辑距离算法排序
   * @param {array} rowList 待排序的数组
   * @param {string} match 排序的目标
   * @param {object} options
   * @property {string|array} keyNameList 如果数组的每一个value为对象，keyNameList为读取对象的属性
   * @property {boolean} filterNoMatch 返回结果是否过滤未匹配到的数据
   * @property {boolean} caseSensitive 区分大小写
   * @property {object} weight 权重配置
   * @returns {array} sortList 排完序的数组
   */
  constructor (rowList, match, options) {
    this.rowList = rowList
    this.match = match
    this.defaults = this._setDefaults()
    this.options = Object.assign({}, this.defaults, options)

    const { keyNameList, weight } = this.options

    this.options.keyNameList = this._parseKeyNameList(keyNameList)
    this.options.weight = this._parseWeight(weight)

    Object.freeze(this.options)
  }

  /**
   * 获取建议的结果
   */
  get () {
    const { filterNoMatch, minSimilarity } = this.options
    const len = this.rowList.length
    const result = []

    // 遍历每一个数据，获得数据的编辑距离以及其它关键属性
    for (let i = 0; i < len; i++) {
      const data = this.rowList[i]

      // 获取相似度
      const similarity = this._getMaxSimilarity(data, this.match)

      // 过滤完全没有匹配到的数据
      if (filterNoMatch && (!isFinite(similarity) || similarity <= minSimilarity)) {
        continue
      }

      result.push({ ...data, __similarity__: similarity })
    }

    return (
      result
        // 根据数据的相似度进行排序
        .sort((a, b) => {
          if (!isFinite(b.__similarity__)) {
            return -1
          } else if (!isFinite(a.__similarity__)) {
            return 1
          } else {
            return b.__similarity__ - a.__similarity__
          }
        })
    )
  }

  /**
   * 设置默认值
   */
  _setDefaults () {
    return {
      // 进行匹配的字段
      keyNameList: ['value'],
      // 是否过滤相似度为0的数据
      filterNoMatch: true,
      // 是否区分大小写
      caseSensitive: false,
      // 最小相似度
      minSimilarity: 0,
      // 设置权重
      weight: {
        // 最大的匹配词长度权重
        continuous: 40,
        // 匹配词总个数权重
        count: 20,
        // 首个匹配字符的位置权重
        position: 5,
        // 最短编辑路径权重
        distance: 35
      }
    }
  }

  /**
   * 解析权重配置
   * @param {object} weight 权重配置
   */
  _parseWeight (weight) {
    // 检查权重属性是否为对象
    if (Object.prototype.toString.call(weight) !== '[object Object]') {
      console.warn('weight 必须是一个对象')
      return this.defaults.weight
    }

    const keywords = ['continuous', 'count', 'position', 'distance']

    // 检查权重是否都为数字
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i]

      if (typeof weight[keyword] !== 'number') {
        console.warn(`【weight】${keyword}必须是一个数字`)
        return this.defaults.weight
      }
    }

    // 检查权重相加是否等于100
    if (keywords.reduce((acc, keyword) => acc + weight[keyword], 0) !== 100) {
      console.warn('【weight】关键字continuous, count, position, distance的值相加必须等于100')
      const { continuous, count, position, distance } = weight
      const rate = 100 / (continuous + count + position + distance)
      return {
        // 最大的匹配词长度权重
        continuous: continuous * rate,
        // 匹配词总个数权重
        count: count * rate,
        // 首个匹配字符的位置权重
        position: position * rate,
        // 最短编辑路径权重
        distance: distance * rate
      }
    }

    return weight
  }

  /**
   * 解析keyNameList
   * @param {string|array} keyNameList
   * @return {array} keyNameList
   */
  _parseKeyNameList (keyNameList) {
    if (typeof keyNameList === 'string') {
      return keyNameList.split(',')
    } else if (keyNameList instanceof Array) {
      return keyNameList
    }

    throw new Error('keyNameList 必须是字符串类型或者数组类型')
  }

  /**
   * 计算数据相似度（根据权值调整）
   * @param {object} data
   * @property {number} maxLength
   * @property {number} count
   * @property {number} position
   * @property {number} distance
   * @param {string} source
   * @param {string} target
   * @return {number} similarity 相似度
   */
  _calcSimilarity (data = {}, source, target) {
    const sourceLength = source.length
    const targetLength = target.length
    const { weight: WEIGHT_CONFIG } = this.options
    const similarity =
      (1 - data.distance / Math.max(sourceLength, targetLength)) * WEIGHT_CONFIG.distance +
      (1 - data.position / targetLength) * WEIGHT_CONFIG.position +
      (data.continuous / targetLength) * WEIGHT_CONFIG.continuous +
      (data.count / targetLength) * WEIGHT_CONFIG.count

    return similarity
  }

  /**
   * 获取值
   * @param {object} target
   * @param {string} key
   * @return {string} value
   */
  _getValue (target, key) {
    const keyType = typeof key
    if (
      target !== null &&
      typeof target === 'object' &&
      (keyType === 'string' || keyType === 'number') &&
      key !== ''
    ) {
      const value = target[key]
      if (typeof value !== 'string') {
        console.warn(`${key}的值必须是一个字符串`)
        return ''
      }

      return value
    } else if (typeof target === 'string') {
      return target
    }

    const value = JSON.stringify(target)
    console.warn(`${value}不符合数据结构要求`)
    return value
  }

  /**
   * 获取待比较的值
   * @param {string} source 待比较的原始值
   * @return {string} result 转换后的待比较值
   */
  _getCompareValue (source) {
    const { caseSensitive } = this.options
    return caseSensitive ? source : source.toLowerCase()
  }

  /**
   * 获取最大的相似度
   * @param {object} target
   * @param {string} match
   * @return {number} 最大相似度
   */
  _getMaxSimilarity (target, match) {
    const { keyNameList } = this.options
    return keyNameList.reduce((accumulator, currentValue) => {
      const value = this._getValue(target, currentValue)
      // 获得变量因子
      const result = levenshteinDistance(this._getCompareValue(match), this._getCompareValue(value))
      // 计算相似度
      const similarity = this._calcSimilarity(result, match, value)

      if (!isFinite(similarity)) {
        return accumulator
      } else if (!isFinite(accumulator)) {
        return similarity
      } else if (accumulator > similarity) {
        return accumulator
      }

      return similarity
    }, -Infinity)
  }
}

export default function suggest (rowList, match, options) {
  return new YouNeedSuggest(rowList, match, options).get()
}
