export default class Keyword implements IKeyword {
  key: string | number
  value: string | number
  lock: boolean
  disabled: boolean

  constructor(key: string | number, value: string | number, options: IKeywordOptions) {
    this.key = key;
    this.value = value;
    this.lock = options.lock;
    this.disabled = options.disabled;
  }

  get() {
    return this.value;
  }

  keep() {
    this.lock = true
  }

  lift() {
    this.lock = false
  }

  disable() {
    this.disabled = true
  }

  enable() {
    this.disabled = false
  }
}
