/**
 * 编辑距离算法(LD algorithm)
 * @param {string} source 输入的内容
 * @param {string} target 匹配的目标
 * @return {number} distance
 */
function levennsheinDistance (source, target) {
  const sourceLength = source.length
  const targetLength = target.length
  const space = new Array(targetLength)
  const result = {
    // 最大的匹配词长度
    continuous: 0,
    // 匹配词总个数
    count: 0,
    // 首个匹配字符的位置
    position: targetLength,
    // 最短编辑路径
    distance: -1
  }

  // 过滤目标或者比较值为空字符串的情况
  if (sourceLength === 0) {
    result.distance = targetLength
  } else if (targetLength === 0) {
    result.distance = sourceLength
  } else {
    const matchPositionList = []
    let continuous = 0
    let modifyNum = 0

    for (let i = 0; i < sourceLength; i++) {
      const sourceChar = source[i]
      let temp = i

      for (let j = 0; j < targetLength; j++) {
        const targetChar = target[j]
        const prevDistance = j === 0 ? i + 1 : space[j - 1]
        const topDistance = space[j] === undefined ? j + 1 : space[j]

        if (sourceChar === targetChar) {
          modifyNum = 0
          continuous++

          if (!matchPositionList.includes(j)) {
            matchPositionList.push(j)
          }

          // 设置首位匹配到的字符
          if (result.position === targetLength) {
            result.position = j
          }
        } else {
          // 设置最长的连续字符
          if (result.continuous < continuous) {
            result.continuous = continuous
          }
          modifyNum = 1
          continuous = 0
        }

        const min = Math.min(prevDistance + 1, topDistance + 1, temp + modifyNum)

        temp = topDistance
        space[j] = min
      }
    }

    // 设置最长的连续字符
    if (result.continuous < continuous) {
      result.continuous = continuous
    }
    // 设置匹配到的数量
    result.count = matchPositionList.length
    // 设置编辑距离
    result.distance = space[targetLength - 1]
  }

  // console.log(source || '【空】', target || '【空】', space, result.distance)

  return result
}

/**
 * 计算数据相似度（根据权值调整）
 * @param {object} data
 * @property {number} maxLength
 * @property {number} count
 * @property {number} position
 * @property {number} distance
 * @return {number} similarity 相似度
 */
function calcSimilarity (data = {}, sourceLength, targetLength) {
  const WEIGHT_CONFIG = {
    // 匹配到的最大长度
    continuous: 35,
    // 匹配到的个数
    count: 25,
    // 匹配到的位置
    position: 5,
    // 编辑文本的距离
    distance: 35
  }

  return (
    (1 - data.distance / Math.max(sourceLength, targetLength)) * WEIGHT_CONFIG.distance +
    (data.continuous / targetLength) * WEIGHT_CONFIG.continuous +
    (data.count / targetLength) * WEIGHT_CONFIG.count +
    (1 - data.position / targetLength) * WEIGHT_CONFIG.position
  )
}

/**
 * 获取待比较的值
 * @param {string} source 待比较的原始值
 * @param {boolean} caseSensitive 是否区分大小写
 * @return {string} result 转换后的待比较值
 */
function getCompareValue (source, caseSensitive) {
  return caseSensitive ? source : source.toLowerCase()
}

/**
 * 获取最大的相似度
 * @param {object} target
 * @param {string} match
 * @param {object} options
 * @return {number} similarity 最大相似度
 */
function getMaxSimilarity (target, match, options) {
  const { keyNameList, caseSensitive } = options
  return keyNameList.reduce((accumulator, currentValue) => {
    const value = getValue(target, currentValue)

    const result = levennsheinDistance(
      getCompareValue(match, caseSensitive),
      getCompareValue(value, caseSensitive)
    )

    const similarity = calcSimilarity(result, match.length, value.length)
    // console.log(match, value, similarity, JSON.stringify(result))

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

/**
 * 获取值
 * @param {object} target
 * @param {string} key
 * @return {string} value
 */
function getValue (target, key) {
  const keyType = typeof key
  if (
    target !== null &&
    typeof target === 'object' &&
    (keyType === 'string' || keyType === 'number') &&
    key !== ''
  ) {
    return target[key]
  } else if (typeof target === 'string') {
    return target
  }

  return JSON.stringify(target)
}

/**
 * 解析keyNameList
 * @param {string|array} keyNameList
 * @return {array} keyNameList
 */
function parseKeyNameList (keyNameList) {
  if (typeof keyNameList === 'string') {
    return keyNameList.split(',')
  } else if (keyNameList instanceof Array) {
    return keyNameList
  }

  throw new Error('keyNameList 必须是字符串类型或者数组类型')
}

/**
 * 编辑距离算法排序
 * @param {array} rowList 待排序的数组
 * @param {string} match 排序的目标
 * @param {object} options
 * @property {string|array} keyNameList 如果数组的每一个value为对象，keyNameList为读取对象的属性
 * @property {boolean} filterNoMatch 返回结果是否过滤未匹配到的数据
 * @property {boolean} caseSensitive 区分大小写
 * @returns {array} sortList 排完序的数组
 */
export default function suggest (rowList, match, options) {
  options = Object.assign(
    {
      keyNameList: ['value'],
      filterNoMatch: true,
      caseSensitive: false
    },
    options
  )
  const { filterNoMatch } = options
  const len = rowList.length
  const result = []

  const keyNameList = parseKeyNameList(options.keyNameList)
  const opts = Object.assign({}, options, { keyNameList })

  // 遍历每一个数据，获得数据的编辑距离以及其它关键属性
  for (let i = 0; i < len; i++) {
    const data = rowList[i]

    // 获取相似度
    const similarity = getMaxSimilarity(data, match, opts)

    // 过滤完全没有匹配到的数据
    if (filterNoMatch && !isFinite(similarity)) {
      continue
    }

    result.push({ similarity, data })
  }

  return (
    result
      // 根据数据的相似度进行排序
      .sort((a, b) => {
        if (!isFinite(b.similarity)) {
          return -1
        } else if (!isFinite(a.similarity)) {
          return 1
        } else {
          return b.similarity - a.similarity
        }
      })
      // 还原数据结构
      .map(({ data, similarity }) => ({ ...data, __similarity__: similarity }))
  )
}
