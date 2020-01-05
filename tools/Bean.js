/**
 * config
 *  - type 必填，表示类型  可以是String、Number、Boolean、Array、泛型
 *  - itemType 必填（数组），表示数组子集类型
 *  - defaultValue 选填，表示默认值，如果不指定，Bean类会根据类型指定字符串
 *  - field 选填，表示后台对应的字段，如果不指定，就是当前的key。field可以是一个方法，参数为data，主要用于自定义数据
 */

/**
 * 判断数值类型是否为指定类型
 */
function isSameType (value, type) {
  if (value === null || value === undefined) {
    return false
  } else {
    return value.constructor.toString() === type.toString()
  }
}

/**
  * 设置默认值
  */
function getDefaultValue (type, defaultValue, placeholderValue) {
  if (isSameType(defaultValue, type)) {
    return defaultValue
  } else {
    return placeholderValue
  }
}

/**
 * 各种类型值的解析器
 */
const valueParser = {
  typeOfString (fieldValue, defaultValue) {
    if (isSameType(fieldValue, String)) {
      return fieldValue
    } else if (isSameType(fieldValue, Number)) {
      return fieldValue.toString()
    }

    return defaultValue
  },
  typeOfNumber (fieldValue, defaultValue) {
    if (isSameType(fieldValue, Number)) {
      return fieldValue
    } else if (isSameType(fieldValue, String) && !Number.isNaN(fieldValue)) {
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
  typeOfArray (type, fieldValue, defaultValue) {
    return (fieldValue || defaultValue).map(values => getValue({ type }, values))
  },
  typeOfDefault (CustomBean, data) {
    return new CustomBean.constructor(data)
  }
}

/**
 * 设置各种类型的值
 */
function getValue (config, data, key) {
  const { name, type, itemType, field, defaultValue } = config

  if (type === undefined || type === null) {
    throw new Error(`[${name}] `)
  }

  let fieldValue
  if (field || key) {
    fieldValue = data[field || key]
  }

  switch (type) {
    case String:
      return valueParser.typeOfString(fieldValue, getDefaultValue(type, defaultValue, ''))
    case Number:
      return valueParser.typeOfNumber(fieldValue, getDefaultValue(type, defaultValue, null))
    case Boolean:
      return valueParser.typeOfBoolean(fieldValue, getDefaultValue(type, defaultValue, null))
    case Array:
      return valueParser.typeOfArray(itemType, fieldValue, getDefaultValue(type, defaultValue, []))
    default:
      return valueParser.typeOfDefault(type, data)
  }
}

const filterReg = /^__bean_/

export default class Bean {
  constructor (data = {}) {
    this.__bean_source__ = data
    this.__bean_target__ = null
    this.__bean_keys__ = []
  }

  _init () {
    if (!this.__bean_target__) {
      const keys = this.__bean_keys__ = Object.keys(this).filter(key => !filterReg.test(key))
      const data = this.__bean_source__

      this.__bean_target__ = {}
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const config = this[key] || {}
        config.name = this.constructor.name
        config.key = key
        const value = getValue(config, data, key)

        if (['Array', 'Object'].includes(Object.prototype.toString.call(value).slice(8, -1))) {
          this.__bean_target__[key] = JSON.parse(JSON.stringify(value))
        } else {
          this.__bean_target__[key] = value
        }
      }
    }
  }

  toBean () {
    this._init()
    return this.__bean_target__
  }

  toSource () {
    return JSON.parse(JSON.stringify(this.__bean_source__))
  }
}
