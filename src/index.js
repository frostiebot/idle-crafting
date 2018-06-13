/**
 * Mathjax:
 *  Upgrade Cost: $$cost_{next} = cost_{base} \times (rate_{growth})^{owned}$$
 *  Production Rate: $$production_{total} = (production_{base} \times owned) \times multipliers$$
 *
 * - Primary Currency: This is the main number that is being
 *   incremented, generally the goal of the game. Usually it’s some
 *   form of money.
 *
 * - Generator: The items in the game that produce primary currency.
 *   The rate of production, or income, is measured as currency per second.
 *
 * - Primary Exchange Currency: In some cases generators produce a
 *   different currency that is exchanged for primary currency.
 *   For example, in Clicker Heroes the generators produce DPS, which
 *   is then converted into gold by killing monsters.
 *
 *   That layer of separation can give you a bit more control over
 *   the growth of the primary currency in the game, since you can
 *   modify the "exchange rate" over time.
 *
 * - Multiplier: Any of a variety of upgrades that multiplies your
 *   generator power.
 *
 *   These can be explicit upgrades, based on number of generators
 *   owned, etc.
 *
 *   Their purpose is to (temporarily) get production closer to,
 *   or ahead of, costs.
 *
 * - Prestige: A reset of most elements of the game (especially
 *   generators and multipliers), but gaining currency (prestige currency)
 *   and/or persistent multipliers to accelerate the next time
 *   through. Similar to a “New Game+”.
 */

import { compose } from './utils'

/**
 * Returns the production rate of a give item derived from its base productivity, how many of the item are currently owned and any multipliers that are in effect.
 *
 * Result is unitless, but broadly you would expect it to mean 'per second' or 'per tick'.
 *
 * @param {Number} baseProductivity
 * @param {Number} owned
 * @param {Number} multiplier
 */
export const productionRate = (baseProductivity, owned, multiplier) => (baseProductivity * owned) * multiplier

/**
 * Returns the cost of a given item derived from its base cost, growth rate and the amount of the item currently owned.
 *
 * Return value is capped to two decimal places for the sake of sanity.
 *
 * @param {Number} baseCost
 * @param {Number} growthRate
 * @param {Number} owned
 */
export const nextCost = (baseCost, growthRate, owned) => Math.round(baseCost * (Math.pow(growthRate, owned) * 100)) / 100

//TODO: The next two functions are centered around an instance of Inventory and a single crafting recipe data structure
//TODO: It seems more logical to place them into the Inventory class as methods (possibly staticmethods...)
//TODO: Since the reliance on the Inventory instance containing the correct quantities of a given item
//TODO: adds complexity to "simple" functions.
//TODO: HOWEVER... Trying to keep Inventory as clean as possible, since it may become a common class
//TODO: To represent the inventory of literally anything, and not just the player
//TODO: For Example, the World could have an inventory so that if an item drops "into" the world, we
//TODO: Just add these "dropped" items to the World Inventory until the player picks them up and places
//TODO: them into _their_ inventory.

/**
 * Returns true if given the list of prerequisite input item types and quantities can be found in the given inventory
 * Otherwise returns false
 * @param {Array<Object>} inputs
 * @param {Inventory} inventory
 */
export const canCraftRecipe = (inputs, inventory) => inputs.every((input) => inventory.hasItemQuantity(input.type, input.quantity))

/**
 *
 * @param {Object} recipe a recipe object
 * @param {Array<Object>} recipe.inputs an array of recipe input types + quantities
 * @param {Object} recipe.output the output item type + quantity of the recipe
 * @param {Inventory} inventory
 */
export const craftRecipe = ({ inputs, output/*, converter, time*/ }, inventory) => {
  if (canCraftRecipe(inputs, inventory)) {
    //TODO: Once we have Converters going, we need to pass the `time` parameter
    //TODO: to it, "start" it and make it consume the inputs and add the outputs
    //TODO: to the inventory rather than just consume + add the items immediately
    inputs.forEach(input => inventory.consumeItem(input.type, input.quantity))
    inventory.addItem(output.type, output.quantity)
    return true
  }
  return false
}

/**
 * Returns the number as it was passed in.
 * Yeah. Pretty dumb, but meh.
 * @param {Number} amount
 */
export const Fixed = amount => amount

/**
 * Returns an integer between 0 and `max`
 * @param {Number} max
 */
export const Random = max => Math.floor(Math.random() * max) + 1

/**
 * Returns a random selection from a list of "prizes"
 * The higher the weight value for a prize, the more likely it is that
 * it will be selected.
 * @param {Array<any>} prizes
 * @param {Array<Number>} weights
 */
export const Weighted = (prizes, weights) => {
  let choice = Math.random() * weights.reduce((sum, value) => sum += value, 0.0)
  return prizes.find((prize, index) => (choice -= weights[index]) <= 0)
}

// calculate cost spread for each successive item, starting at an initial baseline cost x and multiplying by y for each iteration upto count a
// AdCap uses a multiplier of 12, but only after the second tier item - possibly this is due to tweaking costs based on player analytics
// export const composeBaseCosts = (initialCost, multiplier, count) = map()

/**
* Product (or Resource?)
*
* Recipe (Quantity of Products Required, applicable Converter + parameters for conversion, Resulting Product)
*
* Source (ie. MiningSource, etc. Needs to specify output products, how often to emit outputs and either a fixed #, random range, or percent chance as a multiplier of how much to output per time)
*
* Converter (ie. Smelter, Blacksmith, Carpenter, etc. For in-place crafting, create a "Self" Converter)
*
* IronOreProduct, IronBarProduct
* MiningSource
* SmelterConverter
*
* MiningSource
*  - products: [ IronOreProduct ]
*  - quantities: [ Fixed(1) | Random(5), Weighted([5, 4, 3, 2, 1], [1, 4, 10, 10, 75]) ]
*  - time: 5 seconds
*
* IronOreRecipe
*  - input
*
* IronBarRecipe
*  - input: 1 x IronOreProduct
*  - output: 1 x IronBarProduct
*  - converter: SmelterConverter
*    - time: 5 seconds
*
*/

//---- ENUMS/LOOKUPS ----//

export const Items = {
  WATER: Symbol.for('Water'),
  BERRY: Symbol.for('Berry'),
  HEALTH_POTION: Symbol.for('Health Potion'),
  LUMBER: Symbol.for('Lumber'),
  PLANKS: Symbol.for('Planks'),
  SWORD: Symbol.for('Sword'),
  MAGIC_STONE: Symbol.for('Magic Stone'),
  MAGIC_SWORD: Symbol.for('Magic Sword')
}

export const Sources = {
  TREE: Symbol.for('Tree'),
  WELL: Symbol.for('Well'),
  SHRUB: Symbol.for('Shrub'),
  MINE: Symbol.for('Mine')
}

export const Converters = {
  SELF: Symbol.for('Self'),
  ALCHEMIST: Symbol.for('Alchemist'),
  CARPENTER: Symbol.for('Carpenter'),
  BLACKSMITH: Symbol.for('Blacksmith')
}

//---- DATA DESCRIPTORS ----//

// Possibly convert output to a single Item wrapped in a Weighted
// function, with (in most cases) a 100% chance of receiving 1 Item
// after crafting time has elapsed.
export const CraftingRecipes = [
  {
    inputs: [
      { type: Items.WATER, quantity: 1 },
      { type: Items.BERRY, quantity: 2 }
    ],
    output: { type: Items.HEALTH_POTION, quantity: 1 },
    converter: Converters.ALCHEMIST,
    time: 4.0
  },
  {
    inputs: [
      { type: Items.LUMBER, quantity: 1 }
    ],
    output: { type: Items.PLANKS, quantity: 4 },
    converter: Converters.CARPENTER,
    time: 2.0
  },
  {
    inputs: [
      { type: Items.SWORD, quantity: 1  },
      { type: Items.MAGIC_STONE, quantity: 1  }
    ],
    output: { type: Items.MAGIC_SWORD, quantity: 1 },
    converter: Converters.BLACKSMITH,
    time: 5.0
  }
]

// output could (should?) be a list of Weighted Items followed by a
// Weighted quantity, possibly based on the rarity of the Item.
// This requires adding a rarity property to items.
// Additionally... Think about addition of some sort of required tool
// that allows mining of the specified source.
// But first, just get the damn concept working.
export const SourceRecipes = [
  {
    output: { type: Items.LUMBER, quantity: 1 },
    source: Sources.TREE,
    time: 2.0
  },
  {
    output: { type: Items.WATER, quantity: 1 },
    source: Sources.WELL,
    time: 1.5,
  },
  {
    output: { type: Items.BERRY, quantity: 4 },  // quantity Weighted?
    source: Sources.SHRUB,
    time: 1.0
  },
  {
    output: { type: Items.MAGIC_STONE, quantity: 1 },  // quantity Weighted?
    source: Sources.MINE,
    time: 5.0
  }
]

//---- MAPPINGS ----//

// Runtime mappings of Sources to Items, CraftingRecipes to Converters, etc.
// Will add as and when needed.

//---- CONCRETE CLASSES ----//

//TODO: This is not concrete
const withName = state => ({ name: Symbol.keyFor(state.type) })
const withRecipes = state => ({ recipes: CraftingRecipes.filter(recipe => recipe.converter === state.type) })

//TODO: This is not concrete
const ConverterFactory = (type, recipes) => {
  const formatItemQuantity = ({ type, quantity }) => `${Symbol.keyFor(type)} X ${quantity}`

  class Converter {
    constructor() {
      this.type = type
      this.displayName = Symbol.keyFor(type)
      this.recipes = recipes.filter(recipe => recipe.converter === type)
      this.displayRecipes = {}
    }

    displayRecipe(type) {
      if (this.displayRecipes.hasOwnProperty(type)) {
        return this.displayRecipes[type]
      }
      const recipe = this.recipes.find(recipe => recipe.output.type === type)

      if (recipe === undefined) {
        return recipe
      }

      const inputs = recipe.inputs.map(input => formatItemQuantity(input))
      const output = formatItemQuantity(recipe.output)
      const time = `${recipe.time}s`

      this.displayRecipes[type] = { inputs, output, time }

      return this.displayRecipe(type)
    }
  }
  return new Converter()
}

//TODO: We now have `compose` from `./utils`

//TODO: Do I gain any real benefit out of this? _real_ classes consume less memory...
// export const Alchemist = ConverterFactory(Converters.ALCHEMIST)
// export const Carpenter = ConverterFactory(Converters.CARPENTER)
// export const Blacksmith = ConverterFactory(Converters.BLACKSMITH)
export const Alchemist = ConverterFactory(Converters.ALCHEMIST, CraftingRecipes)
export const Carpenter = ConverterFactory(Converters.CARPENTER, CraftingRecipes)
export const Blacksmith = ConverterFactory(Converters.BLACKSMITH, CraftingRecipes)

Alchemist.displayRecipe(Items.HEALTH_POTION)

console.dir(Alchemist, { depth: null })
console.dir(Carpenter, { depth: null })
console.dir(Blacksmith, { depth: null })

export class Inventory {
  constructor(items = []) {
    this.items = items
  }

  /**
   * Adds or updates the Item in the inventory with the specified
   * amount.
   * If the item does not exist, it is added to the inventory with the
   * specified amount.
   * @param {Items} type
   * @param {Number} quantity
   */
  addItem(type, quantity) {
    const item = this.getItem(type)
    if (item === undefined) {
      this.items.push({ type, quantity })
    } else {
      item.quantity += quantity
    }
  }

  /**
   * Consumes the requested quantity of an item, providing the item is
   * in the inventory and has enough quantity to cover the quantity to
   * consume
   * @param {Items} type
   * @param {Number} quantity
   */
  consumeItem(type, quantity) {
    const item = this.getItem(type)
    /* istanbul ignore else */
    if (item !== undefined) {
      if ((item.quantity - quantity) >= 0) {
        item.quantity -= quantity
        this._syncItems()
        return true
      }
    }
    return false
  }

  /**
   * Returns an item in the inventory if it exists, or undefined if not
   * @param {Items} type
   */
  getItem(type) {
    return this.items.find(item => item.type === type)
  }

  /**
   * Returns an array of items whose type is included as an argument to the method call.
   * @param {Items} types
   */
  getItems(...types) {
    return this.items.filter(({ type }) => types.includes(type))
  }

  /**
   * Returns true if the items in this Inventory instance has the specified type and quantity available
   * @param {Items} type
   * @param {Number} quantity
   */
  hasItemQuantity(type, quantity) {
    const item  = this.getItem(type)
    if (item === undefined) {
      return false
    }
    return item.quantity >= quantity
  }

  /**
   * Cleans up the inventory by purging any Items that have a quantity
   * of zero or less.
   */
  _syncItems() {
    this.items = this.items.filter(item => item.quantity > 0)
  }

}
