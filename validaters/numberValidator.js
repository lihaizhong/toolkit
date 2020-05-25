import ValidatorToolbox, { TriggerTypes, completeSync } from './toolbox'

function validValue (value, integer) {
  if (integer) {
    return /^[0-9]+$/.test(value)
  }

  return !Number.isNaN(+value)
}

export default function numberValidator (property, customErrors, options) {
  const toolbox = new ValidatorToolbox(this)

  toolbox.initProperty(property)
  toolbox.initErrors('请输入正确的数字', customErrors)
  toolbox.initOptions({ trigger: TriggerTypes.change, integer: false }, options)

  if (toolbox.$options.getItem('trigger') === TriggerTypes.blur) {
    return [
      {
        trigger: TriggerTypes.blur,
        validator (rule, value) {
          return completeSync(() => {
            const errors = []

            if (!validValue(value, toolbox.$options.getItem('integer'))) {
              errors.push(toolbox.$errors.getItem('default'))
            }

            return errors
          })
        }
      }
    ]
  }

  return [
    {
      trigger: TriggerTypes.change,
      validator (rule, value) {
        return completeSync(() => {
          if (!validValue(value, toolbox.$options.getItem('integer'))) {
            if (toolbox.$options.getItem('integer')) {
              toolbox.setValue(value.replace(/[^0-9]/g, ''))
            } else {
              toolbox.setValue(value.replace(/[^0-9.]/g, ''))
            }
          }
        })
      }
    }
  ]
}
