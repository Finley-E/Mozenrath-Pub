import { Numa, NumaClass } from '../types';

export const BattleEngine = {
  // Type advantage multipliers (Rock-Paper-Scissors style)
  getTypeMultiplier: (attacker: NumaClass, defender: NumaClass): number => {
    const advantages: Record<string, string[]> = {
      [NumaClass.FOREST]: [NumaClass.MARSH, NumaClass.REEF],
      [NumaClass.VOLCANO]: [NumaClass.FOREST, NumaClass.CAVE],
      [NumaClass.OCEAN]: [NumaClass.VOLCANO, NumaClass.WIND],
      [NumaClass.WIND]: [NumaClass.OCEAN, NumaClass.CAVE],
      [NumaClass.CAVE]: [NumaClass.WIND, NumaClass.VOLCANO],
      [NumaClass.REEF]: [NumaClass.CAVE, NumaClass.FOREST],
      [NumaClass.MARSH]: [NumaClass.REEF, NumaClass.OCEAN],
      [NumaClass.NIGHT]: [NumaClass.ANCIENT, NumaClass.SPIRIT],
      [NumaClass.ANCIENT]: [NumaClass.SPIRIT, NumaClass.NIGHT],
      [NumaClass.SPIRIT]: [NumaClass.NIGHT, NumaClass.ANCIENT]
    };

    if (advantages[attacker]?.includes(defender)) return 1.5;
    if (advantages[defender]?.includes(attacker)) return 0.67;
    return 1.0;
  },

  // Calculate damage using simplified Pokémon formula
  calculateDamage: (
    attackerLevel: number,
    attackPower: number,
    attackerStat: number,
    defenderStat: number,
    typeMultiplier: number
  ): number => {
    const base = ((2 * attackerLevel) / 5 + 2) * attackPower;
    const withStats = (base * attackerStat) / defenderStat;
    const withRNG = withStats / 50 + 2;
    const variance = withRNG * (0.85 + Math.random() * 0.15);
    const final = variance * typeMultiplier;
    return Math.max(1, Math.floor(final));
  },

  // Capture rate calculation
  getCaptureProbability: (
    targetMaxHp: number,
    targetCurrentHp: number,
    baseRate: number = 0.35
  ): number => {
    const healthFactor = 1 - (targetCurrentHp / targetMaxHp);
    return Math.min(0.99, baseRate + healthFactor * 0.5);
  },

  // Experience calculation
  calculateExp: (defenderLevel: number, defenderBaseExp: number = 100): number => {
    return Math.floor((defenderLevel * defenderBaseExp) / 7);
  },

  // Level up check
  checkLevelUp: (currentExp: number, level: number): number => {
    const nextLevelExp = level * 100; // Simple scaling
    return currentExp >= nextLevelExp ? level + 1 : level;
  }
};
