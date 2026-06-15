import { Numa, NumaClass, EvolutionStage } from "../types";

export interface CompanionState {
  numaId: string;
  bond: number;
  level?: number;
  exp?: number;
  currentHp?: number;
  stats: {
    memory: number;
    current: number;
    resonance: number;
  };
}

export interface EvolutionRequirement {
  type: 'level' | 'bond' | 'item' | 'stone';
  threshold: number | string;
  met: boolean;
  description: string;
}

export interface EvolutionResult {
  canEvolve: boolean;
  targetId?: string;
  requirements: EvolutionRequirement[];
  description: string;
}

/**
 * Centralized Evolution Service for Mascarene Numa Companions.
 * Governs and evaluates evolution states across level thresholds, bond scores, and item/stone integrations.
 */
export class NumaEvolutionService {

  /**
   * Helper to fetch class emoji symbol
   */
  public static getClassEmoji(numaClass: string): string {
    switch (numaClass) {
      case "Forest": return "🌱";
      case "Reef": return "🪸";
      case "Ocean": return "🐬";
      case "Volcano": return "🔥";
      case "Wind": return "🦅";
      case "Cave": return "💎";
      case "Marsh": return "🐊";
      case "Night": return "🌌";
      case "Ancient": return "🏺";
      case "Spirit": return "👻";
      default: return "🐾";
    }
  }

  /**
   * Mapping of Numa Classes to their compatible evolutionary Stone Name.
   */
  public static getCompatibleStoneName(numaClass: NumaClass): string {
    switch (numaClass) {
      case NumaClass.FOREST: return "Lovi Moss Stone";
      case NumaClass.VOLCANO: return "Koru Fire Stone";
      case NumaClass.REEF:
      case NumaClass.OCEAN: return "Mase Sound Stone";
      case NumaClass.WIND: return "Wesa Gale Stone";
      default: return "";
    }
  }

  /**
   * Checks if a foodId or item is a high-grade catalyst that triggers evolution for a specific Numa.
   */
  public static isEvolutionCatalystFood(numaClass: NumaClass, foodId: string): boolean {
    const fid = foodId.toLowerCase();
    
    // Omni-catalyst food (Divine Sacramental Bun) works on all Numa
    if (fid === "fest-09") return true;

    switch (numaClass) {
      case NumaClass.FOREST:
        // Forest special catalysts: Suna Honey-Spire, Sweet Moss Jelly, Moss-apple
        return ["fest-01", "prep-13", "fora-17"].includes(fid);
      case NumaClass.VOLCANO:
        // Volcano special catalysts: Volcano-Spark Loaf, Fire-Roasted Tuber Mash, Flame-well Sap
        return ["fest-02", "prep-02", "drin-06"].includes(fid);
      case NumaClass.REEF:
      case NumaClass.OCEAN:
        // Reef/Ocean catalysts: Sunset Lagoon-Shell, Tidepool Lagoon Pot, Blue Pearl-shell
        return ["fest-03", "prep-07", "fora-07"].includes(fid);
      case NumaClass.WIND:
        // Wind catalysts: Great Flight Wind-Roll, Barley-Plum Porridge, Mountain Grass-stalk
        return ["fest-04", "prep-04", "fora-08"].includes(fid);
      default:
        // For other classes, generic high-quality festival/prepared items can spark growth
        return fid.startsWith("fest-") || fid.startsWith("prep-1");
    }
  }

  /**
   * Core evaluator that returns a full evaluation report for a companion on a potential evolution path.
   */
  public static evaluateEvolution(
    companion: CompanionState,
    numaList: Numa[],
    unlockedPathStones: string[] = [],
    usedFoodId?: string
  ): EvolutionResult {
    const numaInfo = numaList.find(n => n.id === companion.numaId);
    if (!numaInfo || !numaInfo.evolutionTargetId) {
      return {
        canEvolve: false,
        requirements: [],
        description: "This companion is in their final elder or primordial stage and cannot evolve further."
      };
    }

    const targetInfo = numaList.find(n => n.id === numaInfo.evolutionTargetId);
    if (!targetInfo) {
      return {
        canEvolve: false,
        requirements: [],
        description: "Pre-requisite evolution metadata is missing or target ID is invalid."
      };
    }

    const currentLevel = companion.level || 5;
    const requirements: EvolutionRequirement[] = [];

    // 1. Level threshold check
    let requiredLevel = 15;
    if (numaInfo.stage === EvolutionStage.MATURE) {
      requiredLevel = 30;
    } else if (numaInfo.stage === EvolutionStage.ELDER) {
      requiredLevel = 50; // default for extra stages if configured
    }
    const levelMet = currentLevel >= requiredLevel;
    requirements.push({
      type: 'level',
      threshold: requiredLevel,
      met: levelMet,
      description: `Reach Level ${requiredLevel} (Current: ${currentLevel})`
    });

    // 2. Bond score check
    // Usually standard evolve requires a high bond (e.g. 100 for manual click trigger), but let's make it 80+ for natural evolution
    const requiredBond = 80;
    const bondMet = companion.bond >= requiredBond;
    requirements.push({
      type: 'bond',
      threshold: requiredBond,
      met: bondMet,
      description: `Obtain ${requiredBond}+ Bond Thread (Current: ${companion.bond})`
    });

    // 3. Item/Stone Catalyst checks (can accelerate or allow evolution even if other criteria aren't fully met!)
    const compatibleStone = this.getCompatibleStoneName(numaInfo.class);
    let stoneMet = false;
    if (compatibleStone) {
      stoneMet = unlockedPathStones.includes(compatibleStone);
      requirements.push({
        type: 'stone',
        threshold: compatibleStone,
        met: stoneMet,
        description: `Attune with ${compatibleStone} (${stoneMet ? 'Ready' : 'Not yet unlocked'})`
      });
    }

    let itemMet = false;
    if (usedFoodId) {
      itemMet = this.isEvolutionCatalystFood(numaInfo.class, usedFoodId);
      requirements.push({
        type: 'item',
        threshold: usedFoodId,
        met: itemMet,
        description: `Catalyze using item treatment [${usedFoodId}]`
      });
    }

    // --- DECISION MATRIX ---
    // A companion can evolve under these conditions:
    // A) LEVEL && BOND met (standard spontaneous level-up evolution during battle or manual trigger)
    // B) STONE met (stone catalyst bypasses Level requirement but requires standard level >= 10 and Bond >= 50)
    // C) ITEM usage catalyst is actively fed (bypasses level requirement, requires Bond >= 60)
    let canEvolve = false;
    let description = "";

    const standardMet = levelMet && bondMet;
    const stoneCatalystMet = stoneMet && currentLevel >= 10 && companion.bond >= 50;
    const itemCatalystMet = itemMet && companion.bond >= 60;

    if (standardMet) {
      canEvolve = true;
      description = `The threads of Suna are fully woven! ${numaInfo.name} is ready for natural Level-Up Evolution into ${targetInfo.name}.`;
    } else if (stoneCatalystMet) {
      canEvolve = true;
      description = `The resonance with ${compatibleStone} is glowing! ${numaInfo.name} is ready to perform Ancient Stone Evolution into ${targetInfo.name}.`;
    } else if (itemCatalystMet) {
      canEvolve = true;
      description = `An explosive genetic catalyst has been absorbed! ${numaInfo.name} is ready for Food Catalyst Evolution into ${targetInfo.name}.`;
    } else {
      // Provide detailed feedback on why they can't evolve
      const missingParts: string[] = [];
      if (!levelMet) missingParts.push(`Level ${requiredLevel}`);
      if (!bondMet) missingParts.push(`Bond ${requiredBond}`);
      description = `${numaInfo.name} is not ready to evolve. Requires: ${missingParts.join(", ")}.`;
    }

    return {
      canEvolve,
      targetId: canEvolve ? targetInfo.id : undefined,
      requirements,
      description
    };
  }

  /**
   * Generates the updated stats and parameters of a companion after evolution, preserving experience and scaling power.
   */
  public static calculateEvolvedCompanion(
    companion: CompanionState,
    targetNuma: Numa
  ): CompanionState {
    const healedHp = targetNuma.baseStats.memory; // Reset current HP to full on evolution
    
    return {
      ...companion,
      numaId: targetNuma.id,
      bond: Math.max(20, Math.floor(companion.bond * 0.5)), // resets bond slightly due to form shift, maintaining minimum of 20
      currentHp: healedHp,
      stats: {
        memory: targetNuma.baseStats.memory,
        current: targetNuma.baseStats.current,
        resonance: targetNuma.baseStats.resonance
      }
    };
  }
}
