function parseProperty (context, property) {
  return new Promise((resolve) => {
    const properties = property.split('.')
    let target = null

    if (properties.length > 1) {
      property = properties.pop()
      // mounted之后才获取target，保证target属性已经在component中
      Promise.resolve().then(() => {
        target = properties.reduce((acc, value) => acc[value], context)
        resolve({ target, property })
      })
    }
  })
}

function setValue (context) {
  return function _setValue (target, property, value) {
    // 异步执行，保证属性值的修改能触发页面再次更新
    Promise.resolve().then(() => {
      if (target) {
        context.$set(target, property, value)
      } else {
        context[property] = value
      }
    })
  }
}

export const TriggerTypes = {
  blur: 'blur',
  change: 'change'
}

export function parseFunction (fn, ...args) {
  if (typeof fn === 'function') {
    return fn(...args)
  }
  return fn
}

export function completeSync (callback) {
  return new Promise((resolve, reject) => {
    const errors = callback()

    if (errors instanceof Error || (errors instanceof Array && errors.length)) {
      reject(errors)
    } else {
      resolve()
    }
  })
}

export class ValidatorOptions {
  constructor (defaultOption) {
    this._options = { default: defaultOption }
  }

  setItem (key, value) {
    if (key !== 'default') {
      this._options[key] = value
    }
  }

  getItem (key, ...rest) {
    let option
    if (key) {
      option = this._option[key] || this._option.default
    } else {
      option = this._option.default
    }

    return parseFunction(option, ...rest)
  }
}

export class ValidatorErrors {
  constructor (defaultError) {
    this._errors = { default: defaultError }
  }

  setItem (key, value) {
    if (key !== 'default') {
      this._errors[key] = value
    }
  }

  getItem (key, ...rest) {
    let error
    if (key) {
      error = this._errors[key] || this._errors.default
    } else {
      error = this._errors.default
    }

    const err = parseFunction(error, ...rest)

    if (err instanceof Error) {
      return err
    }

    return new Error(err)
  }
}

export default class ValidatorToolbox {
  constructor (context) {
    this.$context = context
    this.$options = null
    this.$errors = null
    this._target = null
    this._property = null
    this._setValue = setValue(context)
  }

  initProperty (property) {
    return parseProperty(this.$context, property).then(({ target, property: prop }) => {
      this._target = target
      this._property = prop
    })
  }

  initOptions (defaultValue, defaultOptions, customOptions) {
    const options = Object.assign({}, defaultOptions, customOptions)

    this.$options = new ValidatorOptions(defaultValue)
    Object.keys(options).forEach((key) => {
      const value = options[key]
      this.$options.setItem(key, value)
    })
  }

  initErrors (defaultValue, defaultErrors, customErrors) {
    const errors = Object.assign({}, defaultErrors, customErrors)

    this.$errors = new ValidatorErrors(defaultValue)
    Object.keys(errors).forEach(key => {
      const value = errors[key]
      this.$errors.setItem(key, value)
    })
  }

  setValue (value) {
    const { _target, _property } = this
    this._setValue(_target, _property, value)
  }
}
