import { Inventory } from '../inventory'

const Items = {
  LUMBER: Symbol.for('Lumber'),
  BERRY: Symbol.for('Berry'),
}

describe('#Inventory(...items: Item[])', () => {
  it('deduplicates items and sums the quantities of items from the constructor', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 }, { type: Items.LUMBER, quantity: 5 })

    expect(inventory.filter(Items.LUMBER)).toHaveLength(1)
    expect(inventory.get(Items.LUMBER).quantity).toEqual(10)
  })

  it('adds a quantity of items of a given type', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 })

    inventory.add({ type: Items.LUMBER, quantity: 5 })
    expect(inventory.get(Items.LUMBER).quantity).toEqual(10)
  })

  it('silently discards items with zero quantity passed to add', () => {
    const inventory = new Inventory()

    inventory.add({ type: Items.LUMBER, quantity: -1 })
    expect(inventory.get(Items.LUMBER)).toBeUndefined()
  })

  it('consumes a quantity of a given item type', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 })

    expect(inventory.consume({ type: Items.LUMBER, quantity: 1 })).toBeTruthy()
    expect(inventory.get(Items.LUMBER).quantity).toEqual(4)
  })

  it('will return false when attempting to consume more of a given item type than is currently available', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 })

    expect(inventory.consume({ type: Items.LUMBER, quantity: 10 })).toBeFalsy()
  })

  it('will remove an item from the inventory if there is zero quantity of it after calling #consumeItem', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 })

    expect(inventory.consume({ type: Items.LUMBER, quantity: 5 })).toBeTruthy()
    expect(inventory.get(Items.LUMBER)).toBeUndefined()
  })

  it('will return an array of items from a list of item types', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 })

    inventory.add({ type: Items.BERRY, quantity: 22 })
    expect(inventory.filter(Items.LUMBER, Items.BERRY)).toHaveLength(2)
  })

  it('will return true if inventory has enough quantity of a requested item', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 })

    expect(inventory.has({ type: Items.LUMBER, quantity: 4 })).toBeTruthy()
    expect(inventory.has({ type: Items.LUMBER, quantity: 5 })).toBeTruthy()
  })

  it('will return false if inventory does not have enough quantity of a requested item', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 })

    expect(inventory.has({ type: Items.LUMBER, quantity: 6 })).toBeFalsy()
  })

  it('will return truthy if the inventory at least contains an item of a given type', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 })
    expect(inventory.has(Items.LUMBER)).toBeTruthy()
  })

  it('clears all items from the inventory', () => {
    const inventory = new Inventory({ type: Items.LUMBER, quantity: 5 }, { type: Items.BERRY, quantity: 5 })

    expect(inventory.filter(Items.LUMBER, Items.BERRY)).toHaveLength(2)
    inventory.clear()
    expect(inventory.filter(Items.LUMBER, Items.BERRY)).toHaveLength(0)
  })
})