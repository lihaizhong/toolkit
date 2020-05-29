import compare from './src/levenshteinDistance'

interface IOptions {
  keyNameList?: string | string[]
  filterNoMatch?: boolean
  caseSensitive?: boolean
  minSimilarity?: number
  compare: (source: string, target: string) => number
}

interface IYouNeedSuggest {
  value: string
  list: string[] | object[]
  options: IOptions
  get(value: string): any[]
}

export default class YouNeedSuggest implements IYouNeedSuggest {
  value
  list
  options = {
    // 进行匹配的字段
    keyNameList: ['value'],
    // 是否过滤相似度为0的数据
    filterNoMatch: true,
    // 是否区分大小写
    caseSensitive: false,
    // 最小相似度
    minSimilarity: 0,
    // 计算算法
    compare: compare({
      // 最大的匹配词长度权重
      continuous: 40,
      // 匹配词总个数权重
      count: 20,
      // 首个匹配字符的位置权重
      position: 5,
      // 最短编辑路径权重
      distance: 35,
    }),
  }

  constructor(list: string[] | object[], options: IOptions) {
    this.list = list
    this.options = Object.assign(this.options, options)
    this.options.keyNameList = this.parseKeyNameList(this.options.keyNameList)
  }

  get(value): any[] {
    const result = []
    value = this.parseValue(value)

    for (let i = 0; i < this.list.length; i++) {
      const match = this.list[i]
      const similarity = this.getMaxSimilarity(value, match)
      if (similarity >= this.options.minSimilarity) {
        result.push({ data: match, similarity })
      }
    }

    return result.sort((a, b) => b.similarity - a.similarity)
  }

  private parseValue(value: string): string {
    const { caseSensitive } = this.options

    if (typeof value !== 'string') {
      return ''
    }

    if (caseSensitive) {
      value = value.toUpperCase()
    }

    return value
  }

  private parseKeyNameList(keyNameList: string | string[]): string[] {
    if (typeof keyNameList === 'string') {
      return keyNameList.split(',')
    } else if (keyNameList instanceof Array) {
      return keyNameList
    }

    return ['value']
  }

  private getMaxSimilarity(value: string, match: any): number {
    if (typeof match === 'string') {
      return this.options.compare(this.parseValue(match), value)
    }

    return this.options.keyNameList.reduce((lastSimilarity, key) => {
      const source = this.parseValue(match[key])
      const currentSimilarity = this.options.compare(source, value)

      return Math.max(lastSimilarity, currentSimilarity)
    }, -Infinity)
  }
}
