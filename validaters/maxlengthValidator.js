import ValidatorToolbox, { TriggerTypes, completeSync } from './toolbox'

/**
 * @param {string} property
 * @param {object} customErrors
 * @property {string} min
 * @default {string} 不得少于${utils.options.min}字
 * @property {string} max
 * @default {string} 不得超过${utils.options.max}字
 * @param {object} options
 * @property {number|function} min
 * @default {number} 0
 * @property {number|function} max
 * @default {number} 50
 * @property {boolean} fixed 是否纠正错误
 * 注：如果fixed为true，customErrors可以为null
 */
export default function maxlengthValidator (property, customErrors, options) {
  const toolbox = new ValidatorToolbox(this)

  toolbox.initProperty(property)
  toolbox.initOptions('', { max: 50, min: 0, fixed: true }, options)
  toolbox.initErrors(
    '',
    {
      max (maxValue) {
        return `不得超过${maxValue}字`
      },
      min (minValue) {
        return `不得少于${minValue}字`
      }
    },
    customErrors
  )

  if (toolbox.$options.getItem('fixed')) {
    return [
      {
        trigger: TriggerTypes.change,
        validator (rule, value) {
          return completeSync(() => {
            const max = toolbox.$options.getItem('max')
            if (value.length > max) {
              const propertyValue = value.slice(0, max)
              toolbox.setValue(propertyValue)
            }
          })
        }
      }
    ]
  }

  return [
    {
      trigger: TriggerTypes.blur,
      validator (rule, value) {
        return completeSync(() => {
          const { length } = value
          const errors = []
          const min = toolbox.$options.getItem('min')
          const max = toolbox.$options.getItem('max')

          if (length < min) {
            errors.push(toolbox.$errors.getItem('min', min))
          } else if (length > max) {
            errors.push(toolbox.$errors.getItem('max', max))
          }

          return errors
        })
      }
    }
  ]
}
