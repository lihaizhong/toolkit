import ValidatorToolbox, { completeSync } from './toolbox'

/**
 * @param {string} property
 * @param {object} customErrors
 * @property {string|function} landlineCodeError 座机区号错误信息
 * @property {string|function} landlineNoError 座机号错误信息
 * @property {string|function} mobileError 手机号错误信息
 * @param {object} options
 * @property {string} trigger 触发条件
 * @default {string} blur
 * @value {string} blur
 * @value {string} change
 * @property {string} type 支持的类型
 * @default {string} null 全部支持
 * @value {string} mobile
 * @value {string} landline
 * 注：需要使用call或者apply调用，将当前的组件实例绑定到验证器中
 */
export default function phoneValidator (property, customErrors, options) {
  const toolbox = new ValidatorToolbox(this)

  toolbox.initProperty(property)
  toolbox.initOptions('', { trigger: 'blur', type: null, required: false }, options)
  toolbox.initErrors(
    '格式不正确，请重新输入',
    {
      required: '必须填写！',
      landlineCode: '区号不正确，请重新输入！',
      landlineNo: '座机号码不正确，请重新输入！',
      mobile: '手机号码格式不正确，请重新输入！'
    },
    customErrors
  )
  const types = {
    mobile: 'mobile',
    landline: 'landline'
  }

  const codeReg = /^\d{3,4}$/
  const noReg = /^\d{7,11}$/
  const mobileReg = /^\d{11}$/

  function requiredValidator (rule, value) {
    const errors = []
    return completeSync(() => {
      if (value === '') {
        errors.push(toolbox.$errors.getItem('required'))
      } else if (/-/.test(value)) {
        const [code = '', no = ''] = value.split('-')
        if (code === '') {
          errors.push(toolbox.$errors.getItem('required'))
        } else if (no === '') {
          errors.push(toolbox.$errors.getItem('required'))
        }
      }

      return errors
    })
  }

  function landlineValidator (rule, value) {
    const errors = []
    const [code = '', no = ''] = value.split('-')
    return completeSync(() => {
      if (code !== '' && !codeReg.test(code)) {
        errors.push(toolbox.$errors.getItem('landlineCode'))
      } else if (no !== '' && !noReg.test(no)) {
        errors.push(toolbox.$errors.getItem('landlineNo'))
      }

      return errors
    })
  }

  function mobileValidator (rule, value) {
    const errors = []
    return completeSync(() => {
      if (value !== '' && !mobileReg.test(value)) {
        errors.push(toolbox.$errors.getItem('mobile'))
      }

      return errors
    })
  }

  const requiredValidate = []

  if (toolbox.$options.getItem('required')) {
    requiredValidate.push({
      trigger: toolbox.$options.getItem('trigger'),
      validator: requiredValidator
    })
  }

  if (toolbox.$options.getItem('type') === types.mobile) {
    return [
      ...requiredValidate,
      {
        trigger: toolbox.$options.getItem('trigger'),
        validator: landlineValidator
      }
    ]
  }

  if (toolbox.$options.getItem('type') === types.landline) {
    return [
      ...requiredValidate,
      {
        trigger: toolbox.$options.getItem('trigger'),
        validator: mobileValidator
      }
    ]
  }

  return [
    ...requiredValidate,
    {
      trigger: toolbox.$options.getItem('trigger'),
      validator (...args) {
        const value = args[1]
        if (/-/.test(value)) {
          return landlineValidator(...args)
        }

        return mobileValidator(...args)
      }
    }
  ]
}
