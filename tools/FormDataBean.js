/**
 * config
 *  - type {any} 必填，表示类型  可以是String、Number、Boolean、Array、泛型
 *  - itemType {any} 必填（数组），表示数组子集类型
 *  - defaultValue {string} 选填，表示默认值，如果不指定，Bean类会根据类型指定字符串
 *  - field {string|function} 选填，表示后台对应的字段，如果不指定，就是当前的key。field可以是一个方法，参数为data，主要用于自定义数据
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

function deepClone (target) {
  // 通过原型对象获取对象类型
  const type = Object.prototype.toString.call(target)
  let source
  if (type === '[object Array]') {
    // 数组
    source = []
    if (target.length > 0) {
      for (let i = 0; i < target.length; i++) {
        source.push(deepClone(target[i]))
      }
    }
  } else if (type === '[object Object]') {
    // 对象
    source = {}
    for (const i in target) {
      if (Object.prototype.hasOwnProperty.call(target, i)) {
        source[i] = deepClone(target[i])
      }
    }
  } else {
    // 基本类型和方法可以直接赋值
    source = target
  }
  return source
}

/**
 * 设置默认值
 * @param {any} type 数据类型
 * @param {any} defaultValue 用户定义的默认数值
 * @param {any} placeholderValue 默认数值
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

    if (isSameType(fieldValue, String) && /^\d+$/(fieldValue)) {
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
      return valueParser.typeOfString(fieldValue, getDefaultValue(type, defaultValue, ''))
    case Number:
      return valueParser.typeOfNumber(fieldValue, getDefaultValue(type, defaultValue, null))
    case Boolean:
      return valueParser.typeOfBoolean(fieldValue, getDefaultValue(type, defaultValue, null))
    case Array:
      return valueParser.typeOfArray(itemType, fieldValue, getDefaultValue(type, defaultValue, []))
    case Object:
      return valueParser.typeOfObject(fieldValue, getDefaultValue(type, defaultValue, {}))
    default:
      return valueParser.typeOfDefault(type, fieldValue)
  }
}

export class Any {}

export default class FormDataBean {
  constructor (data = {}, transfer = true) {
    this.__bean_source__ = data
    this.__bean_target__ = null
    this.__bean_raw_target = ''
    this.__bean_keys__ = []
    this.__bean_transfer__ = transfer
  }

  _init () {
    if (!this.__bean_target__) {
      const keys = (this.__bean_keys__ = Object.keys(this).filter(key => !/^__bean_/.test(key)))
      const data = this.__bean_source__

      this.__bean_target__ = {}
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const config = this[key] || {}
        this.__bean_target__[key] = getValue(config, data, key)
      }

      this.__bean_raw_target = JSON.stringify(this.__bean_target__)
      Object.preventExtensions(this.__bean_target__)
    }
  }

  setItem (key, value) {
    if (this.__bean_target__[key] !== undefined) {
      this.__bean_target__[key] = value
    }
  }

  getItem (key) {
    return this.__bean_target__[key]
  }

  toBean () {
    this._init()
    return this.__bean_target__
  }

  reset () {
    this._init()
    const bean = JSON.parse(this.__bean_raw_target)
    this.__bean_target__ = Object.preventExtensions(bean)
  }
}
