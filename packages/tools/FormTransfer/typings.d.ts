export interface IStore {
  [key: string]: any
}

export interface IConfig {
  type: any
  itemType?: any
  defaultValue?: any
  field?: string | ((data: any) => string)
  reverseField?: ((data: any) => string)
}
