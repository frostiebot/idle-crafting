import { productionRate, nextCost, fixedNumber, randomNumber, weightedRandomChoice } from '../math'

describe('#productionRate(baseProductivity: number, owned: number, multiplier: number)', () => {
  it('calculates production rate given good values', () => {
    const expected = 16.7

    const bP = 1.67
    const o = 10
    const m = 1

    expect(productionRate(bP, o, m)).toEqual(expected)
  })  
})

describe('#nextCost(baseCost: number, growthRate: number, owned: number)', () => {
  it('calculates cost of the next generator given good values', () => {
    const expected = 7.87

    const bC = 4
    const gR = 1.07
    const o = 10

    expect(nextCost(bC, gR, o)).toEqual(expected)
  })
})

describe('#fixedNumber(amount: number)', () => {
  it('returns the same number as it was called with', () => {
    expect(fixedNumber(10)).toEqual(10)
  })
})

describe('#randomNumber(max: number)', () => {
  it('returns a random number between 1 and max', () => {
    expect(randomNumber(1)).toEqual(1)
  })
})

describe('#weightedRandomChoice(prizes: Prize[], weights: number[])', () => {
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
      const prize = weightedRandomChoice(prizes, weights)
      counts[prize]++
    }

    for (const prize in counts) {
      expect(Math.round(100 * counts[prize] / attempts)).toEqual(50)
    }
  })
})
