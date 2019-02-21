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
// const withName = state => ({ name: Symbol.keyFor(state.type) })
// const withRecipes = state => ({ recipes: CraftingRecipes.filter(recipe => recipe.converter === state.type) })

//TODO: This is not concrete
// const ConverterFactory = (type, recipes) => {
//   const formatItemQuantity = ({ type, quantity }) => `${Symbol.keyFor(type)} X ${quantity}`

//   class Converter {
//     constructor() {
//       this.type = type
//       this.displayName = Symbol.keyFor(type)
//       this.recipes = recipes.filter(recipe => recipe.converter === type)
//       this.displayRecipes = {}
//     }

//     displayRecipe(type) {
//       if (this.displayRecipes.hasOwnProperty(type)) {
//         return this.displayRecipes[type]
//       }
//       const recipe = this.recipes.find(recipe => recipe.output.type === type)

//       if (recipe === undefined) {
//         return recipe
//       }

//       const inputs = recipe.inputs.map(input => formatItemQuantity(input))
//       const output = formatItemQuantity(recipe.output)
//       const time = `${recipe.time}s`

//       this.displayRecipes[type] = { inputs, output, time }

//       return this.displayRecipe(type)
//     }
//   }
//   return new Converter()
// }

// //TODO: We now have `compose` from `./utils`

//TODO: Do I gain any real benefit out of this? _real_ classes consume less memory...
// export const Alchemist = ConverterFactory(Converters.ALCHEMIST)
// export const Carpenter = ConverterFactory(Converters.CARPENTER)
// export const Blacksmith = ConverterFactory(Converters.BLACKSMITH)
// export const Alchemist = ConverterFactory(Converters.ALCHEMIST, CraftingRecipes)
// export const Carpenter = ConverterFactory(Converters.CARPENTER, CraftingRecipes)
// export const Blacksmith = ConverterFactory(Converters.BLACKSMITH, CraftingRecipes)

// Alchemist.displayRecipe(Items.HEALTH_POTION)

// console.dir(Alchemist, { depth: null })
// console.dir(Carpenter, { depth: null })
// console.dir(Blacksmith, { depth: null })
