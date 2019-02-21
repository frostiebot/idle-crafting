import { SymbolItem, IInventory } from './types'

export class Inventory implements IInventory<symbol> {
  private items: SymbolItem[] = []

  constructor(...items: SymbolItem[]) {
    this.add(...items)
  }
  
  /**
   * Adds or updates the Item in the inventory with the specified
   * amount.
   * If the item does not exist, it is added to the inventory with the
   * specified amount.
   * @param items
   */
  add(...items: SymbolItem[]): void {
    items.forEach(({ type, quantity }) => {
      const item = this.get(type)
      if (item === undefined) {
        if (quantity > 0) {
          this.items.push({ type, quantity })
        }
      } else {
        item.quantity += quantity
      }
    })
  }

  /**
   * Clears the items in this inventory
   *
   */
  clear() {
    this.items = []
  }

  /**
   * Consumes the requested quantity of an item, providing the item is
   * in the inventory and has enough quantity to cover the quantity to
   * consume
   * @param item 
   */
  consume({ type, quantity }: SymbolItem): boolean {
    const item = this.get(type)
    if (item !== undefined) {
      if ((item.quantity - quantity) >= 0) {
        item.quantity -= quantity
        this.items = this.items.filter(item => item.quantity > 0) // this._syncItems()
        return true
      }
    }
    return false
  }
  
  /**
   * Returns an array of items whose type is included as an argument to the method call.
   * @param types
   */
  filter(...types: symbol[]): SymbolItem[] {
    return this.items.filter(({ type }) => types.includes(type))
  }

  /**
   * Returns an item in the inventory if it exists, or undefined if not
   * @param type
   */
  get(type: symbol): SymbolItem | undefined {
    return this.items.find(item => item.type === type)
  }

  /**
   * Returns a true if this inventory has both the item type and the quantity requested
   * @param item
   */
  has(itemOrType: SymbolItem | symbol): boolean {
    if (typeof itemOrType === 'symbol') {
      const item = this.get(itemOrType)
      return item !== undefined
    }
    const item  = this.get(itemOrType.type)
    return item && item.quantity >= itemOrType.quantity
  }

  // _syncItems() {
  //   this.items = this.items.filter(item => item.quantity > 0)
  // }
}

// /**
//  * Returns true if given the list of prerequisite input item types and quantities can be found in the given inventory
//  * Otherwise returns false
//  * @param {Array<Object>} inputs
//  * @param {Inventory} inventory
//  */
// export const canCraftRecipe = (inputs, inventory) => inputs.every((input) => inventory.hasItemQuantity(input.type, input.quantity))

// /**
//  *
//  * @param {Object} recipe a recipe object
//  * @param {Array<Object>} recipe.inputs an array of recipe input types + quantities
//  * @param {Object} recipe.output the output item type + quantity of the recipe
//  * @param {Inventory} inventory
//  */
// export const craftRecipe = ({ inputs, output/*, converter, time*/ }, inventory) => {
//   if (canCraftRecipe(inputs, inventory)) {
//     //TODO: Once we have Converters going, we need to pass the `time` parameter
//     //TODO: to it, "start" it and make it consume the inputs and add the outputs
//     //TODO: to the inventory rather than just consume + add the items immediately
//     inputs.forEach(input => inventory.consumeItem(input.type, input.quantity))
//     inventory.addItem(output.type, output.quantity)
//     return true
//   }
//   return false
// }
