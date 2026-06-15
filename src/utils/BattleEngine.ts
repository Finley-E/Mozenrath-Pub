import { Numa, NumaClass, Move, MoveCategory, AbilityName } from '../types';

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

  // Calculate damage using Physical/Special split
  calculateDamage: (
    attackerLevel: number,
    move: Move,
    attacker: Numa,
    defender: Numa,
    typeMultiplier: number
  ): number => {
    // Determine which stats to use based on move category
    const attackStat = move.category === 'physical' ? attacker.baseStats.current : attacker.baseStats.spirit;
    const defenseStat = move.category === 'physical' ? defender.baseStats.resonance : defender.baseStats.ward;
    
    // Apply ability modifiers (simplified)
    let attackPower = move.power;
    if (move.category !== 'status') {
      // Check for ability boosts (e.g., Overgrow, Blaze, Torrent when HP is low)
      const hpPercent = attacker.baseStats.memory > 0 ? 1 : 0; // Simplified - would need current HP
      if (hpPercent < 0.33) {
        if ((attacker.ability === 'overgrow' && move.type === NumaClass.FOREST) ||
            (attacker.ability === 'blaze' && move.type === NumaClass.VOLCANO) ||
            (attacker.ability === 'torrent' && move.type === NumaClass.OCEAN) ||
            (attacker.ability === 'resonance' && move.category === 'special')) {
          attackPower = Math.floor(attackPower * 1.5);
        }
      }
    }
    
    // Status moves don't deal damage
    if (move.category === 'status') {
      return 0;
    }

    // Pokémon-style damage formula
    const base = ((2 * attackerLevel) / 5 + 2) * attackPower;
    const withStats = (base * attackStat) / defenseStat;
    const withRNG = withStats / 50 + 2;
    const variance = withRNG * (0.85 + Math.random() * 0.15);
    const final = variance * typeMultiplier;
    return Math.max(1, Math.floor(final));
  },

  // Apply ability effects (simplified)
  applyAbilityEffect: (
    ability: AbilityName | undefined,
    trigger: 'onEnter' | 'onHit' | 'passive' | 'onLowHp',
    attacker: Numa,
    defender: Numa
  ): { message: string; statChanges?: Record<string, number> } | null => {
    if (!ability || ability === 'none') return null;
    
    switch (ability) {
      case 'intimidate':
        if (trigger === 'onEnter') {
          return { message: `${attacker.name}'s Intimidate lowers ${defender.name}'s Attack!`, statChanges: { current: -1 } };
        }
        break;
      case 'levitate':
        if (trigger === 'passive') {
          return { message: `${attacker.name} floats above ground attacks!` };
        }
        break;
      case 'static':
        if (trigger === 'onHit') {
          return { message: `${attacker.name}'s Static may paralyze the attacker!` };
        }
        break;
      default:
        break;
    }
    return null;
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
