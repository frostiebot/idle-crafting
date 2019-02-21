
Upgrade Cost: $$cost_{next} = cost_{base} \times (rate_{growth})^{owned}$$
Production Rate: $$production_{total} = (production_{base} \times owned) \times multipliers$$

- Primary Currency: This is the main number that is being
incremented, generally the goal of the game. Usually it’s some
form of money.

- Generator: The items in the game that produce primary currency.
The rate of production, or income, is measured as currency per second.

- Primary Exchange Currency: In some cases generators produce a
different currency that is exchanged for primary currency.
For example, in Clicker Heroes the generators produce DPS, which
is then converted into gold by killing monsters.
That layer of separation can give you a bit more control over
the growth of the primary currency in the game, since you can
modify the "exchange rate" over time.

- Multiplier: Any of a variety of upgrades that multiplies your
generator power.
These can be explicit upgrades, based on number of generators
owned, etc.
Their purpose is to (temporarily) get production closer to,
or ahead of, costs.

- Prestige: A reset of most elements of the game (especially
generators and multipliers), but gaining currency (prestige currency)
and/or persistent multipliers to accelerate the next time
through. Similar to a “New Game+”.

//TODO: The next two functions are centered around an instance of Inventory and a single crafting recipe data structure
//TODO: It seems more logical to place them into the Inventory class as methods (possibly staticmethods...)
//TODO: Since the reliance on the Inventory instance containing the correct quantities of a given item
//TODO: adds complexity to "simple" functions.
//TODO: HOWEVER... Trying to keep Inventory as clean as possible, since it may become a common class
//TODO: To represent the inventory of literally anything, and not just the player
//TODO: For Example, the World could have an inventory so that if an item drops "into" the world, we
//TODO: Just add these "dropped" items to the World Inventory until the player picks them up and places
//TODO: them into _their_ inventory.

