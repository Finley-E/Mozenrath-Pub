export enum NumaClass {
  FOREST = "Forest",
  REEF = "Reef",
  OCEAN = "Ocean",
  VOLCANO = "Volcano",
  WIND = "Wind",
  CAVE = "Cave",
  MARSH = "Marsh",
  NIGHT = "Night",
  ANCIENT = "Ancient",
  SPIRIT = "Spirit"
}

export enum EvolutionStage {
  JUVENILE = "juvenile", // suffix: -i
  MATURE = "mature",    // suffix: -ku
  ELDER = "elder",      // suffix: -ma
  PRIMORDIAL = "primordial" // suffix: -ra
}

export interface NumaEvolution {
  nextId: string;
  level: number;
}

export interface Numa {
  id: string; // "001", "002" etc.
  name: string;
  class: NumaClass;
  stage: EvolutionStage;
  evolutionOriginId?: string; // id of the predecessor
  evolutionTargetId?: string; // id of what they evolve into
  habitat: string;
  behavior: string;
  ecologicalRole: string;
  primaryIsland: string;
  favoriteFoodIds: string[];
  baseStats: {
    memory: number; // HP/MP equivalent
    current: number; // Attack
    resonance: number; // Defense
  };
}

export enum FoodCategory {
  STAPLE = "Staple",
  FORAGED = "Foraged",
  DRINK = "Drink",
  PREPARED = "Prepared",
  FESTIVAL = "Festival"
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  originIsland: string;
  description: string;
  valaValue: number;
  effect: string;
}

export interface Island {
  id: string;
  name: string;
  motto: string;
  ecosystem: string;
  architecture: string;
  foodCulture: string;
  festival: string;
  profession: string;
  guardian: string;
  pathStoneName: string;
  difficulty: number;
}

export interface SanuLedger {
  discoveredNumaIds: string[];
  discoveredFoodIds: string[];
  discoveredIslandIds: string[];
  completedWords: string[]; // local vocabulary discovered
  valaCount: number;
  activeCompanions: { numaId: string; nickname?: string; bond: number }[];
  completedQuests: string[];
}

export interface VocabWord {
  munuWord: string;
  englishTranslation: string;
  exampleSentence: string;
  context: string;
}

export interface GameState {
  playerX: number;
  playerY: number;
  currentIslandId: string;
  koraVessels: number;
  vala: number;
  activeQuestId: string | null;
  ledger: SanuLedger;
}
