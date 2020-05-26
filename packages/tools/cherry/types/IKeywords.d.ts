interface IKeyword {
  get(): string | number

  keep(): void

  lift(): void

  disable(): void

  enable(): void
}

interface IKeywordModule {
  append(keyword: IKeyword): void

  remove(keyword: IKeyword): void

  keep(): void

  lift(): void

  disable(): void

  enable(): void
}
