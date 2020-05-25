import Toolbox, { TriggerTypes, completeSync } from './toolbox'

export default function rangeValidator (property, customErrors, options) {
  const toolbox = new Toolbox(this)

  toolbox.initProperty(property)
  toolbox.initOptions('', { min: 0, max: 999999999 }, options)
  toolbox.initErrors(`请输入${toolbox.options.min}-${toolbox.options.max}之间的数字`, customErrors)

  return [
    {
      trigger: TriggerTypes.blur,
      validator (rule, value) {
        return completeSync(() => {
          const errors = []

          if (value < toolbox.options.min) {
            errors.push(toolbox.getErrorItem('min'))
          } else if (value > toolbox.options.max) {
            errors.push(toolbox.getErrorItem('max'))
          }

          return errors
        })
      }
    }
  ]
}
