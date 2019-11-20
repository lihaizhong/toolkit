/**
 * 编辑距离算法
 * @param {string} target
 * @param {string} compare
 * @return {number} distance
 */
function editDistance(target, compare) {
  const lenA = target.length;
  const lenB = compare.length;
  const space = new Array(lenB);
  const result = {
    // 最大的匹配词长度
    maxLength: -1,
    // 匹配词总个数
    count: 0,
    // 首个匹配字符的位置
    position: lenA,
    // 最短编辑路径
    distance: -1
  };

  function modifyResult(conj, pos) {
    const len = conj.length;
    if (len) {
      // 设置最大匹配字符串长度
      if (len > result.maxLength) {
        result.maxLength = len;
      }
      // 设置所有匹配字符的数量
      result.count += len;
      // 设置首个匹配字符位置
      if (pos != -1 && result.position > pos) {
        result.position = pos;
      }
    }
  }

  // 过滤目标或者比较值为空字符串的情况
  if (target === "" || compare === "") {
    return result;
  }

  for (let i = 1; i <= lenA; i++) {
    let old = space[0] === undefined ? 0 : space[0];
    space[0] = i;
    const curA = target[i - 1];
    // 是否连续匹配到字符
    let isContinue = false;
    // 是否匹配到字符
    let isMatched = false;
    // 匹配到的连续字符
    let continuousChar = "";
    // 匹配到的最终位置
    let finalPos = -1;

    for (let j = 1; j <= lenB; j++) {
      const tmp = space[j] === undefined ? 0 : space[j];
      const curPos = j - 1;
      const curB = compare[curPos];

      // 是否匹配到字符
      if (curA == curB) {
        space[j] = old;

        if (finalPos === -1 || finalPos > curPos) {
          finalPos = curPos;
        }

        // 确保只匹配成功一次
        if (!isContinue) {
          isMatched = true;
          // 是否已经匹配到字符串，并且保证匹配的字符串可查询
          isContinue =
            target[i - 2] == compare[j - 2] &&
            compare.indexOf(continuousChar + curA) != -1;
        }
      } else {
        // 获得最小编辑距离路径
        space[j] = Math.min(tmp + 1, space[curPos] + 1, old + 1);
      }
      old = tmp;
    }

    // 如果是最后一个字符，无论字符串是否连续都执行设置结果集
    if (lenA == i) {
      // 如果是连续的字符串，就拼接最后一个字符
      if (isContinue) {
        continuousChar += curA;
        isContinue = isMatched = false;
      } else if (isMatched) {
        continuousChar += curA;
        isMatched = false;
      }
    }

    // 如果是连续的字符串，就拼接这个字符；否则去设置结果集
    if (isContinue || isMatched) {
      continuousChar += curA;
    } else {
      modifyResult(continuousChar, finalPos);
    }
  }

  // 设置编辑距离
  result.distance = space[lenB];

  return result;
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
function calcSimilarity(data = {}) {
  if (!data.count) {
    return -Infinity;
  }

  const WEIGHT_CONFIG = {
    // 匹配到的最大长度
    maxLength: 40,
    // 匹配到的个数
    count: 25,
    // 匹配到的位置
    position: 5,
    // 编辑文本的距离
    distance: 30
  };

  return (
    data.maxLength * WEIGHT_CONFIG.maxLength +
    data.count * WEIGHT_CONFIG.count -
    data.position * WEIGHT_CONFIG.position -
    data.distance * WEIGHT_CONFIG.distance
  );
}

/**
 * 获取待比较的值
 * @param {string} value 待比较的原始值
 * @param {boolean} caseSensitive 是否区分大小写
 * @return {string} result 转换后的待比较值
 */
function getCompareValue(value, caseSensitive) {
  return caseSensitive ? value : value.toLowerCase();
}

/**
 * 获取最大的相似度
 * @param {object} target
 * @param {string} match
 * @param {object} options
 * @return {number} similarity 最大相似度
 */
function getMaxSimilarity(target, match, options) {
  const { keyNameList, caseSensitive } = options;
  return keyNameList.reduce((accumulator, currentValue) => {
    const value = getValue(target, currentValue);

    const result = editDistance(
      getCompareValue(match, caseSensitive),
      getCompareValue(value, canSensitive)
    );

    const similarity = calcSimilarity(result);
    // console.log(match, value, similarity, JSON.stringify(result))

    if (isFinite(similarity)) {
      return accumulator;
    } else if (isFinite(accumulator)) {
      return similarity;
    } else if (accumulator > similarity) {
      return accumulator;
    }

    return similarity;
  }, -Infinity);
}

/**
 * 获取值
 * @param {object} target
 * @param {string} key
 * @return {string} value
 */
function getValue(target, key) {
  const keyType = typeof key;
  if (
    target !== null &&
    typeof target === "object" &&
    (keyType === "string" || keyType === "number") &&
    key !== ""
  ) {
    return target[key];
  } else if (typeof target === "string") {
    return target;
  }

  return JSON.stringify(target);
}

/**
 * 解析keyNameList
 * @param {string|array} keyNameList
 * @return {array} keyNameList
 */
function parseKeyNameList(keyNameList) {
  if (typeof keyNameList === "string") {
    return keyNameList.split(",");
  } else if (!(keyNameList instanceof Array)) {
    throw new Error("keyNameList 必须是字符串类型或者数组类型");
  }
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
export default function suggest(
  rowList,
  match,
  options = {
    keyNameList: ["value"],
    filterNoMatch: true,
    caseSensitive: false
  }
) {
  const { filterNoMatch } = options;
  const len = rowList.length;
  const result = [];

  const keyNameList = parseKeyNameList(options.keyNameList);
  const opts = Object.assign({}, options, { keyNameList });

  // 遍历每一个数据，获得数据的编辑距离以及其它关键属性
  for (let i = 0; i < len; i++) {
    const data = rowList[i];

    // 获取相似度
    const similarity = getMaxSimilarity(data, match, opts);

    // 过滤完全没有匹配到的数据
    if (filterNoMatch && !isFinite(similarity)) {
      continue;
    }

    result.push({ similarity, data });
  }

  return (
    result
      // 根据数据的相似度进行排序
      .sort((a, b) => {
        if (isFinite(b.similarity)) {
          return -1;
        } else if (isFinite(a.similarity)) {
          return 1;
        } else {
          return b.similarity - a.similarity;
        }
      })
      // 还原数据结构
      .map(({ data }) => data)
  );
}
