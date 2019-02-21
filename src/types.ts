export type Item<T> = {
  type: T
  quantity: number
}

export type SymbolItem = Item<symbol>

export type Recipe<T> = {
  inputs: Item<T>[]
  output: Item<T>
  converter: string
  time: number
}

export interface IRecipe<T> {
  inputs: Item<T>[]
  outputs: Item<T>[]
}

export interface IInventory<T> {
  add(...items: Item<T>[]): void // Should really be `update`?
  clear(): void
  consume(item: Item<T>): boolean // Should really be `remove` (if `add` is not `update`)
  filter(...types: T[]): Item<T>[]
  get(type: T): Item<T> | undefined
  has(item: T): boolean
  has(item: Item<T>): boolean
}
