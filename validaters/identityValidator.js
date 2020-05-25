import ValidatorToolbox, { TriggerTypes, completeSync } from './toolbox'

function IdentityCodeValid (code) {
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
  let pass = true
  const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/i
  if (!code || !reg.test(code)) {
    pass = false
  } else if (!city[code.substr(0, 2)]) {
    pass = false
  }
  if (code.length === 18) {
    code = code.toUpperCase()
    code = code.split('')
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    let ai = 0
    let wi = 0
    for (let i = 0; i < 17; i++) {
      ai = code[i]
      wi = factor[i]
      sum += ai * wi
    }
    /* eslint-disable */
    const a = parity[sum % 11]
    if (parity[sum % 11] != code[17]) {
      pass = false
    }
  }
  return pass
}

/**
 * @param {string} property
 * @param {object} customErrors
 * @property {string|function} message 错误信息
 * @default {string} 请输入正确的身份证号码！
 * 注：需要使用call或者apply调用，将当前的组件实例绑定到验证器中
 */
export default function identityValidator(property, customErrors) {
  const toolbox = new ValidatorToolbox(this)

  toolbox.initProperty(property)
  toolbox.initErrors('请输入正确的身份证号码！', customErrors)

  return [
    {
      trigger: TriggerTypes.change,
      validator(rule, value) {
        const reg = /[^\dxX]/
        return completeSync(() => {
          if (reg.test(value)) {
            value = value.replace(reg, '')
            toolbox.setValue(value)
          }
        })
      },
    },
    {
      trigger: TriggerTypes.blur,
      validator(rule, value) {
        const errors = []

        return completeSync(() => {
          if (!IdentityCodeValid(value)) {
            errors.push(toolbox.$errors.getItem('default'))
          }

          return errors
        })
      },
    },
  ]
}
