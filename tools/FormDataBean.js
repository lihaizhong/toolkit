/**
 * config
 *  - type {any} 必填，表示类型  可以是String、Number、Boolean、Array、泛型
 *  - itemType {any} 必填（数组），表示数组子集类型
 *  - defaultValue {string} 选填，表示默认值，如果不指定，Bean类会根据类型指定字符串
 *  - field {string|function} 选填，表示后台对应的字段，如果不指定，就是当前的key。field可以是一个方法，参数为data，主要用于自定义数据
 *  - reverseField {function} 选填，只有在field为function时，需要将当前的值返还给field字段，用于后台提交，参数为data
 */

/**
 * 判断数值类型是否为指定类型
 * @param {any} value 数值
 * @param {any} type 数据类型
 */
function isSameType (value, type) {
  if (value === null || value === undefined) {
    return false
  } else {
    return value.constructor.toString() === type.toString()
  }
}

function hasOwnProperty (target, key) {
  return Object.prototype.hasOwnProperty.call(target, key)
}

function isReservedProperty (name) {
  return !/^__bean_/.test(name)
}

/**
 * 设置默认值
 * @param {any} type 数据类型
 * @param {any} defaultValue 用户定义的默认数值
 * @param {any} placeholderValue 系统定义的默认数值
 */
function getDefaultValue (type, defaultValue, placeholderValue) {
  if (isSameType(defaultValue, type)) {
    return defaultValue
  }

  return placeholderValue
}

/**
 * 解析field对应的值
 * @param {object} target
 * @param {string|function} field
 * @param {string} key
 */
function parseFieldValue (target, field, key) {
  if (field) {
    const typeOfField = typeof field

    if (typeOfField === 'string') {
      return target[field]
    }

    if (typeOfField === 'function') {
      return field(target)
    }
  }

  if (key) {
    return target[key]
  }

  return target
}

/**
 * 各种类型值的解析器
 */
const valueParser = {
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
  typeOfDefault (CustomBean, data) {
    return new CustomBean(data).toBean()
  }
}

/**
 * 设置各种类型的值
 * @param {object} config 配置信息
 * @property {any} type 字段类型。必传
 * @property {any} itemType 数组项的字段类型。如果是数组，必传
 * @param {any} data 数据
 * @param {string} key 数据的key值
 */
function getValue (config, data, key) {
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
      return valueParser.typeOfDefault(type, fieldValue)
  }
}

export class Any {}

export default class FormDataBean {
  constructor (data = {}) {
    const target = this.__bean_target__ = {}
    const keys = Object
      .keys(this)
      .filter(
        key => isReservedProperty(key)
      )

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const config = this[key] || {}
      if (typeof config === 'object') {
        target[key] = getValue(config, data, key)
      }
    }

    Object.preventExtensions(target)
  }

  setItem (key, value) {
    if (
      isReservedProperty(key) &&
      hasOwnProperty(this.__bean_target__, key) &&
      isSameType(value, this[key].type)
    ) {
      this.__bean_target__[key] = value
    }
  }

  getItem (key) {
    return this.__bean_target__[key]
  }

  valueOf () {
    return this.__bean_target__
  }
}
