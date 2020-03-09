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
        const result = onCompare(targetItem, sourceItem)

        if (result) {
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
        preloadImage: null
      },
      options
    )

    this.init()
  }

  init () {
    this.usedDataList = []
    this.datalist = []
  }

  preloadImage (src) {
    if (!src) {
      return Promise.reject(new Error('invalid url'))
    }

    const image = new Image()
    image.src = src

    // 图片已加载完成
    if (image.complete) {
      return Promise.resolve(src)
    }

    // 图片未加载完成
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(src)
      image.onerror = reject
    })
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
    if (this.datalist.length) {
      const list = this.datalist.splice(0, this.options.preSize)
      const { preloadImage: preloadImageForCaptureData } = this.options

      if (typeof this.options.preloadImage === 'function') {
        return Promise.all(
          list.map(item => {
            const imagePath = preloadImageForCaptureData(item)
            return this.preloadImage(imagePath)
          })
        )
          .catch(() => {})
          .then(() => {
            this.usedDataList.push(...list)
            return list
          })
      }

      this.usedDataList.push(...list)
      return list
    }

    return []
  }

  hasUnused () {
    return !!this.datalist.length
  }
}
