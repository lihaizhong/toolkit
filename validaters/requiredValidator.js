/**
 * 必填校验
 * @param {string} error
 * @param {object | string} options
 * @property {string} trigger defaultValue: blur
 * @property {string} type
 * @property {object} defaultField
 * @property {object} fields
 *
 * @property type
 * type: 'string', //iview默认校验数据类型为String
 * type: 'array',
 * type: 'number'
 * type: 'integer'  //Must be of type number and an integer.
 * type: 'float'    //Must be of type number and a floating point number.
 * type: 'boolean'
 * type: 'object'   //Must be of type object and not Array.isArray.
 * type: 'array'    //Must be an array as determined by Array.isArray.
 * type: 'regexp'   //正则
 * type: 'email',
 * type: 'date',
 * type: 'url'      //Must be of type url.
 * type: 'enum' // Value must exist in the enum.
 * type: 'hex' // Must be of type hex.
 * type: 'any'
 * @url https://github.com/yiminghe/async-validator#type
 */
export default function requiredValidator (error, options) {
  const typeOfOptions = typeof options
  const defaultError = '必须填写！'
  let trigger = 'blur'
  let type = null

  if (typeOfOptions === 'string') {
    trigger = options
  } else if (typeOfOptions === 'undefined' || options === null) {
    options = {}
  }

  if (typeof options.type === 'string' && options.type !== '') {
    const { type: dataType } = options
    type = dataType
  }

  const { compType, defaultField, fields } = options

  // 对于组件的处理
  switch (compType) {
    // 由于[DatePicker type=daterange]的数据类型无法类似普通的方式检验，所以这里做特殊处理
    case 'daterange':
      trigger = 'change'

      return [
        {
          required: true,
          type: 'array',
          fields: {
            0: { required: true, type: 'date', message: defaultError, trigger },
            1: { required: true, type: 'date', message: defaultError, trigger }
          }
        }
      ]
    case 'date':
      trigger = 'change'
      type = 'date'
      break
    default:
  }

  if (type === 'array' || type === 'object') {
    return [
      {
        required: true,
        type,
        trigger,
        message: error || defaultError,
        defaultField,
        fields
      }
    ]
  }

  if (type) {
    return [
      {
        required: true,
        type,
        trigger,
        message: error || defaultError
      }
    ]
  }

  return [
    {
      required: true,
      message: error || defaultError,
      trigger
    }
  ]
}
