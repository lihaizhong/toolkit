import ValidatorToolbox, { TriggerTypes, completeSync } from './toolbox'

/**
 * @param {string} property
 * @param {object} customErrors
 * @property {string|function} length
 * @default {string} 卡号输入不正确，请仔细检查！
 * @param {object} options
 * @property {number} length
 * @default {number} 25
 */
export default function cardValidator (property, customErrors, options) {
  const toolbox = new ValidatorToolbox(this)

  toolbox.initProperty(property)
  toolbox.initOptions(25, options)
  toolbox.initErrors('卡号输入不正确，请仔细检查！', customErrors)

  return [
    {
      trigger: TriggerTypes.change,
      validator (rule, value) {
        return completeSync(() => {
          let propertyValue = value.replace(/[^\d]/, '')

          // 判断卡号长度是否超出
          if (propertyValue.length > toolbox.$options.getItem('default')) {
            propertyValue = propertyValue.slice(0, toolbox.$options.getItem('default'))
          }

          toolbox.setValue(propertyValue)
        })
      }
    },
    {
      trigger: TriggerTypes.blur,
      validator (rule, value) {
        return completeSync(() => {
          const errors = []

          if (value.length < toolbox.$options.getItem('default')) {
            errors.push(toolbox.$errors.getItem('default'))
          }

          return errors
        })
      }
    }
  ]
}
