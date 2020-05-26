interface IFuzzyResult {
  continuous: number,
  count: number,
  position: number,
  distance: number,
}

interface IFuzzyResultWrapper {
  get(): IFuzzyResult
  setContinuous(continuous: number): void
  getContinuous(): number
  setCount(count: number): void
  getCount(): number
  setPosition(position: number): void
  getPosition(): number
  setDistance(distance: number): void
  getDistance(): number
}

interface IFuzzy {
  calc(): number
}
