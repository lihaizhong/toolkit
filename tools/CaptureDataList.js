/**
 * 数据去重
 * @param {array<any>} target
 * @param {array<any>} source
 * @param {function} onCompare
 */
function removeDuplicates (target = [], source = [], onCompare) {
  const targetLength = target.length
  const sourceLength = source.length

  if (targetLength && sourceLength) {
    const list = []
    target.forEach(targetItem => {
      let match = false
      for (let i = 0; i < source.length; i++) {
        const sourceItem = source[i]

        if (onCompare(targetItem, sourceItem)) {
          match = true
          break
        }
      }

      // 如果没有重复数据，就插入
      if (!match) {
        list.push(targetItem)
      }
    })

    return list
  }

  return [...target]
}

export default class CaptureDataList {
  constructor (options) {
    this.options = Object.assign(
      {
        preSize: 50,
        onCompare: function (target, source) {
          return target === source
        },
        transform: null
      },
      options
    )

    this.init()
  }

  init () {
    this.usedDataList = []
    this.datalist = []
  }

  set (list = []) {
    if (list instanceof Array && list.length) {
      const { onCompare } = this.options
      const uniqueList1 = removeDuplicates(list, this.usedDataList, onCompare)
      const uniqueList2 = removeDuplicates(uniqueList1, this.datalist, onCompare)
      this.datalist.push(...uniqueList2)
    }
  }

  get () {
    const list = this.datalist.splice(0, this.options.preSize)
    const { transform } = this.options

    if (typeof transform === 'function') {
      return transform(list).then(columns => {
        this.usedDataList.push(...columns)
        return columns
      })
    }

    this.usedDataList.push(...list)
    return list
  }

  hasUnused () {
    return !!this.datalist.length
  }
}
