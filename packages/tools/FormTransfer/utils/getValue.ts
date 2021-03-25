import { IStore } from '../typings'
import valueParser, { getDefaultValue, parseFieldValue } from './parser'
import Any from '../declare/Any'

/**
 * 设置各种类型的值
 * @param {object} config 配置信息
 * @property {any} type 字段类型。必传
 * @property {any} itemType 数组项的字段类型。如果是数组，必传
 * @param {any} data 数据
 * @param {string} key 数据的key值
 */
export default (config: any, data: IStore, key?: string) => {
  const { type, itemType, field, defaultValue } = config
  const fieldValue = parseFieldValue(data, field, key)

  switch (type) {
    case Any:
      return fieldValue
    case String:
      return valueParser.typeOfString(
        fieldValue,
        getDefaultValue(type, defaultValue, '')
      )
    case Number:
      return valueParser.typeOfNumber(
        fieldValue,
        getDefaultValue(type, defaultValue, null)
      )
    case Boolean:
      return valueParser.typeOfBoolean(
        fieldValue,
        getDefaultValue(type, defaultValue, null)
      )
    case Array:
      return valueParser.typeOfArray(
        itemType,
        fieldValue,
        getDefaultValue(type, defaultValue, [])
      )
    case Object:
      return valueParser.typeOfObject(
        fieldValue,
        getDefaultValue(type, defaultValue, {})
      )
    default:
      return valueParser.typeOfCustom(type, fieldValue)
  }
}
