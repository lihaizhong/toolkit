/**
 * 判断数值类型是否为指定类型
 * @param {any} value 数值
 * @param {any} type 数据类型
 */
export const isSameType = (value: any, type: any) =>
  value === null || value === undefined ?
    value === type :
    value.constructor.toString() === type.toString()

export const hasOwnProperty = (
  target: { [key: string]: any },
  key: string
) => Object.prototype.hasOwnProperty.call(target, key)

export const isReservedProperty = (name: string) => !/^__bean_/.test(name)
