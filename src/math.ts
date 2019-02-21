/**
 * Returns a unitless production rate.
 * 
 * Given a base productivity, how many of the object are currently owned and any multipliers that are in effect.
 */
export const productionRate = (baseProductivity: number, owned: number, multiplier: number): number => (baseProductivity * owned) * multiplier

/**
 * Returns a unitless cost of an object.
 * 
 * Given a base cost, growth rate and the count of currently owned objects.
 */
export const nextCost = (baseCost: number, growthRate: number, owned: number): number => Math.round(baseCost * (Math.pow(growthRate, owned) * 100)) / 100

/**
 * calculate cost spread for each successive item, starting at an initial baseline cost x and multiplying by y for each iteration upto count a
 * AdCap uses a multiplier of 12, but only after the second tier item - possibly this is due to tweaking costs based on player analytics
*/
// export const composeBaseCosts = (initialCost, multiplier, count) = map()

/**
 * Returns a fixed number (basically an identity function).
 */
export const fixedNumber = (amount: number): number => amount

/**
 * Returns a number between 0 and max
 */
export const randomNumber = (max: number): number => Math.floor(Math.random() * max) + 1

/**
 * Returns a random selection from a list of "prizes"
 * The higher the weight value for a prize, the more likely it is that
 * it will be selected.
 */
export const weightedRandomChoice = <Prize>(prizes: Prize[], weights: number[]): Prize => {
  let choice = Math.random() * weights.reduce((sum, value) => sum += value, 0.0)
  return prizes.find((_, index) => (choice -= weights[index]) <= 0)
}