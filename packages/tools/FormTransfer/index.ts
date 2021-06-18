import { isReservedProperty, hasOwnProperty, isSameType } from './utils/tools'
import { getValue } from './utils/parser'
import { IStore } from './typings'

export default class FormTransfer {
  private __bean_source__: IStore = null
  private __bean_target__: IStore = null
  private __bean_raw_target: string = ''

  constructor (data = {}) {
    this.__bean_source__ = data
  }

  init () {
    const keys = Object.keys(this).filter(
      key => isReservedProperty(key)
    )
    const data = this.__bean_source__

    this.__bean_target__ = {}
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const config = this[key] || {}
      if (typeof config === 'object') {
        this.__bean_target__[key] = getValue(config, data, key)
      }
    }

    this.__bean_raw_target = JSON.stringify(this.__bean_target__)
    Object.preventExtensions(this.__bean_target__)
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

  restoreValueOf () {}

  reset () {
    const bean = JSON.parse(this.__bean_raw_target)
    this.__bean_target__ = Object.preventExtensions(bean)
  }
}
