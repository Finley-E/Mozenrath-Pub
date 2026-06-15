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

// Five Currents that flow through the archipelago
export enum CurrentType {
  WIND = "Wind",      // Wera
  TIDE = "Tide",      // Raza
  FLAME = "Flame",    // Kora
  MEMORY = "Memory",  // Sana
  LIFE = "Life"       // Muna
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
  // Harmony system: 0-100 bond raised through discovery, festivals, helping settlements, restoring routes
  harmony?: number;
  // Ecological relationships
  ecologicalLinks?: string[]; // IDs of related Numa or environmental effects
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
  activeCompanions: { numaId: string; nickname?: string; bond: number; harmony?: number }[];
  completedQuests: string[];
  // Memory Routes restoration progress
  restoredRoutes: string[]; // IDs of restored Memory Routes
  // Story Circles visited and stories heard
  storyCirclesVisited: string[];
  // Family Home Ledger progression
  homeLedgerLevel: number; // 1=tiny stall, 2=expanded counter, 3=major gathering place
  // Wayfarer Loop visions unlocked
  loopVisions: string[]; // IDs of ancient memories/vision fragments
  // Five Currents balance
  currentsBalance: {
    wind: number;   // Wera
    tide: number;   // Raza
    flame: number;  // Kora
    memory: number; // Sana
    life: number;   // Muna
  };
}

export interface VocabWord {
  munuWord: string;
  englishTranslation: string;
  exampleSentence: string;
  context: string;
}

// Memory Route system - ancient pathways connecting settlements
export interface MemoryRoute {
  id: string;
  name: string;
  description: string;
  fromSettlement: string;
  toSettlement: string;
  requiredCurrentType?: CurrentType; // Which Current this route strengthens
  rewards: {
    vala?: number;
    items?: string[]; // Food or item IDs
    unlocksFestival?: string; // Festival ID that returns
    spawnsNpc?: string[]; // NPC types that arrive
  };
  isRestored: boolean;
}

// Story Circle entries for settlements
export interface StoryCircleEntry {
  id: string;
  settlementName: string;
  elderName: string;
  stories: {
    id: string;
    title: string;
    content: string;
    isTrue: boolean; // Some stories are false, some true
    category: 'myth' | 'migration' | 'food' | 'clue';
    revealedClue?: string; // If it's a clue, what does it reveal?
  }[];
}

// Family Tabaji Home Ledger progression
export interface HomeLedger {
  level: number; // 1-3
  description: string;
  unlockedFeatures: string[];
  tabajiStallUpgrades: string[];
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
