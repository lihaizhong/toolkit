import { IStore } from '../typings.d'
import { isSameType } from './tools'
import Any from '../declare/Any'

/**
 * 设置默认值
 * @param {any} type 数据类型
 * @param {any} defaultValue 用户定义的默认数值
 * @param {any} placeholderValue 系统定义的默认数值
 */
export const getDefaultValue = (
  type: any,
  defaultValue: any,
  placeholderValue: any
) => isSameType(defaultValue, type) ? defaultValue : placeholderValue



/**
 * 设置各种类型的值
 * @param {object} config 配置信息
 * @property {any} type 字段类型。必传
 * @property {any} itemType 数组项的字段类型。如果是数组，必传
 * @param {any} data 数据
 * @param {string} key 数据的key值
 */
 export const getValue = (config: any, data: IStore, key?: string) => {
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

/**
 * 解析field对应的值
 * @param {object} target
 * @param {string|function} field
 * @param {string} key
 */
export const parseFieldValue = (
  target: IStore,
  field: string | ((data: IStore) => void) | ((data: IStore) => () => void),
  key?: string
) => {
  if (typeof field === 'string') {
    return target[field]
  }

  if (typeof field === 'function') {
    return field(target)
  }

  if (key) {
    return target[key]
  }

  return target
}

export const valueParser = {
  /**
   * 解析字符串类型的数据
   * @param fieldValue
   * @param defaultValue
   * @returns
   */
  typeOfString (fieldValue: any, defaultValue: string): string {
    if (isSameType(fieldValue, String)) {
      return fieldValue
    }

    if (isSameType(fieldValue, Number)) {
      return fieldValue.toString()
    }

    return defaultValue
  },
  /**
   * 解析数字类型的数据
   * @param fieldValue
   * @param defaultValue
   * @returns
   */
  typeOfNumber (fieldValue: any, defaultValue: number): number {
    if (isSameType(fieldValue, Number)) {
      return fieldValue
    }

    if (isSameType(fieldValue, String) && /^\d+$/.test(fieldValue)) {
      return Number(fieldValue)
    }

    return defaultValue
  },
  /**
   * 解析布尔类型的数据
   * @param fieldValue
   * @param defaultValue
   * @returns
   */
  typeOfBoolean (fieldValue: any, defaultValue: boolean): boolean {
    if (isSameType(fieldValue, Boolean)) {
      return fieldValue
    }

    return defaultValue
  },
  /**
   * 解析对象类型的数据
   * @param fieldValue
   * @param defaultValue
   * @returns
   */
  typeOfObject (fieldValue: any, defaultValue: object): object {
    if (isSameType(fieldValue, Object)) {
      return fieldValue
    }

    return defaultValue
  },
  /**
   * 解析数组类型的数据
   * @param type
   * @param fieldValue
   * @param defaultValue
   * @returns
   */
  typeOfArray<T> (type: string, fieldValue: any, defaultValue: Array<T>): Array<T> {
    return (fieldValue || defaultValue).map(value => getValue({ type }, value))
  },
  /**
   * 解析自定义类型的数据
   * @param CustomBean
   * @param data
   * @returns
   */
  typeOfCustom (CustomBean, data) {
    if ('valueOf' in CustomBean.prototype) {
      return new CustomBean(data).valueOf()
    }

    return null
  }
}
