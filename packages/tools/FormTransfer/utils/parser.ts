import getValue from './getValue'
import { isSameType } from './tools'
import { IStore } from '../typings'

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

export default {
  typeOfString (fieldValue, defaultValue) {
    if (isSameType(fieldValue, String)) {
      return fieldValue
    }

    if (isSameType(fieldValue, Number)) {
      return fieldValue.toString()
    }

    return defaultValue
  },
  typeOfNumber (fieldValue, defaultValue) {
    if (isSameType(fieldValue, Number)) {
      return fieldValue
    }

    if (isSameType(fieldValue, String) && /^\d+$/.test(fieldValue)) {
      return Number(fieldValue)
    }

    return defaultValue
  },
  typeOfBoolean (fieldValue, defaultValue) {
    if (isSameType(fieldValue, Boolean)) {
      return fieldValue
    }

    return defaultValue
  },
  typeOfObject (fieldValue, defaultValue) {
    if (isSameType(fieldValue, Object)) {
      return fieldValue
    }

    return defaultValue
  },
  typeOfArray (type, fieldValue, defaultValue) {
    return (fieldValue || defaultValue).map(value => getValue({ type }, value))
  },
  typeOfCustom (CustomBean, data) {
    return new CustomBean(data).toBean()
  }
}
