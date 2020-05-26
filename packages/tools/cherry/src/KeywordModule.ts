export default class KeywordModule implements IKeywordModule {
  keywords: Array<IKeyword>

  constructor() {
    this.keywords = [];
  }

  append(keyword: IKeyword) {
    this.keywords.push(keyword);
  }

  remove(keyword: IKeyword) {
    const keywordIndex = this.keywords.findIndex(item => item === keyword);

    if (keywordIndex !== -1) {
      this.keywords.splice(keywordIndex, 1);
    }
  }

  keep() {
    this.keywords.forEach(keyword => {
      keyword.keep()
    })
  }

  lift() {
    this.keywords.forEach(keyword => {
      keyword.lift()
    })
  }

  disable() {
    this.keywords.forEach(keyword => {
      keyword.disable()
    })
  }

  enable() {
    this.keywords.forEach(keyword => {
      keyword.enable()
    })
  }
}
