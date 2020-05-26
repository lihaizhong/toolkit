import ValidatorToolbox, { TriggerTypes, completeSync } from './toolbox'

export default function qqValidator (property) {
  const toolbox = new ValidatorToolbox(this)

  toolbox.initProperty(property)
  toolbox.initOptions(/^[1-9]\d{4,10}$/)
  toolbox.initErrors('无效的QQ账号！')

  return [
    {
      trigger: TriggerTypes.blur,
      validator (rule, value) {
        const errors = []
        return completeSync(() => {
          if (toolbox.$options.getItem('default').test(value)) {
            errors.push(toolbox.$errors.getItem('default'))
          }

          return errors
        })
      }
    }
  ]
}
