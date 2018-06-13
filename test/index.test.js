import {
  productionRate,
  nextCost,
  Fixed,
  Random,
  Weighted,
  craftRecipe,
  Items,
  Converters,
  Inventory
} from '../src/index'

describe('index', () => {

  describe('#productionRate(baseProductivity, owned, multiplier', () => {
    it('calculates production rate given good values', () => {
      const expected = 16.7

      const bP = 1.67
      const o = 10
      const m = 1

      expect(productionRate(bP, o, m)).to.equal(expected)
    })
  })

  describe('#nextCost(baseCost, growthRate, owned)', () => {
    it('calculates cost of the next generator given good values', () => {
      const expected = 7.87

      const bC = 4
      const gR = 1.07
      const o = 10

      // console.log(nextCost(3.738, 1.07, 1)) // if given an item "for free"
      // the "real" base cost is the result of calling nextCost(oBC, gR, 1)

      expect(nextCost(bC, gR, o)).to.equal(expected)
    })
  })

  describe('#craftRecipe(recipe, inventory)', () => {
    let inventory, fillInventory

    const recipe = {
      inputs: [{ type: Items.LUMBER, quantity: 1 }],
      output: { type: Items.PLANKS, quantity: 4 },
      converter: Converters.CARPENTER,
      time: 2.0
    }

    beforeEach(() => {
      inventory = new Inventory
      fillInventory = ({ inputs }) => inputs.forEach(input => inventory.addItem(input.type, input.quantity))
    })

    it('crafts a recipe only if the inventory contains the inputs defined in the recipe', () => {
      fillInventory(recipe)

      expect(craftRecipe(recipe, inventory)).to.be.true

      const expected = inventory.getItem(recipe.output.type)

      expect(inventory.getItem(Items.LUMBER)).to.be.undefined
      expect(expected).to.not.be.undefined
      expect(expected.quantity).to.equal(recipe.output.quantity)
    })

    it('does not craft a recipe when there are insufficient items in inventory', () => {
      fillInventory(recipe)

      inventory.consumeItem(Items.LUMBER, 1)

      expect(craftRecipe(recipe, inventory)).to.be.false
    })
  })

  describe('#Fixed(amount)', () => {
    it('returns the same number as it was called with', () => {
      expect(Fixed(10)).to.equal(10)
    })
  })

  describe('#Random(max)', () => {
    it('returns a random number between 1 and max', () => {
      expect(Random(1)).to.equal(1)
    })
  })

  describe('#Weighted(prizes, weights)', () => {
    it('returns weighted random chance of a prize', () => {
      // const prizes = ['PS4', 'DVD Player', 'Kit-Kat Bar', 'Nothing']
      // const weights = [0.1, 2, 2, 94]
      const prizes = ['Something', 'Nothing']
      const weights = [50, 50]

      const attempts = 100000

      const counts = prizes.reduce((obj, prize) => {
        obj[prize] = 0
        return obj
      }, {})

      for (let i = 0; i < attempts; i++) {
        const prize = Weighted(prizes, weights)
        counts[prize]++
      }

      for (const prize in counts) {
        expect(Math.round(100 * counts[prize] / attempts)).to.equal(50)
        // console.log(`${prize} was given out ${Math.round(100 * counts[prize] / attempts)}% of the time (${counts[prize]} / ${attempts})`)
      }
    })
  })

  describe('#Inventory(items = [])', () => {
    let inventory

    beforeEach(() => {
      inventory = new Inventory([ { type: Items.LUMBER, quantity: 5 } ])
    })

    it('adds a quantity of items of a given type', () => {
      inventory.addItem(Items.LUMBER, 5)
      expect(inventory.getItem(Items.LUMBER).quantity).to.equal(10)
    })

    it('consumes a quantity of a given item type', () => {
      expect(inventory.consumeItem(Items.LUMBER, 1)).to.be.true
      expect(inventory.getItem(Items.LUMBER).quantity).to.equal(4)
    })

    it('will return false when attempting to consume more of a given item type than is currently available', () => {
      expect(inventory.consumeItem(Items.LUMBER, 10)).to.be.false
    })

    it('will remove an item from the inventory if there is zero quantity of it after calling #consumeItem', () => {
      expect(inventory.consumeItem(Items.LUMBER, 5)).to.be.true
      expect(inventory.getItem(Items.LUMBER)).to.be.undefined
    })

    it('will return an array of items from a list of item types', () => {
      inventory.addItem(Items.BERRY, 22)
      expect(inventory.getItems(Items.LUMBER, Items.BERRY)).to.have.lengthOf(2)
    })
  })

})
