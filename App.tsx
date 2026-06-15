import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Compass, 
  BookOpen, 
  Coffee, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Coins, 
  Database, 
  Info, 
  HelpCircle, 
  Check, 
  ChevronRight, 
  MapPin, 
  Compass as CompassIcon,
  Search,
  Flame,
  Droplet,
  Wind,
  Heart,
  BookMarked,
  Scroll,
  Dna,
  RefreshCw
} from 'lucide-react';
import { Numa, NumaClass, EvolutionStage, FoodItem, FoodCategory, Island, VocabWord, GameState, SanuLedger } from './types';
import { ISLANDS, VOCABULARY, FOOD_ITEMS, NUMA_ROSTER, PRIMORDIALS, validateMunuWord } from './services/mascareneData';
import { MunuGameEngine, GbcTileType } from './lib/gameEngine';

// GBC 4-Color Selective Palettes
const PALETTES = {
  lovi: {
    bg: '#eff6ee',
    primary: '#4c6c4c',
    accent: '#d8a45c',
    dark: '#1e2d1e',
    name: "Lovi Moss"
  },
  koru: {
    bg: '#fcf3eb',
    primary: '#b03a2e',
    accent: '#d4ac0d',
    dark: '#2c1e1c',
    name: "Koru Volcanic"
  },
  mase: {
    bg: '#f0fbfc',
    primary: '#2471a3',
    accent: '#f5b041',
    dark: '#1b2a32',
    name: "Mase Aqua"
  },
  wesa: {
    bg: '#f4f6f7',
    primary: '#566573',
    accent: '#85929e',
    dark: '#1c2833',
    name: "Wesa High Gale"
  }
};

// 16x11 Interactive Maps for GBC Viewport (rendered inside 160x110 tile area, leaving 160x34 bottom for UI bar)
// Legends: 0: Path, 1: Trees/Obstacles, 2: Water/Tide, 3: Lava/Volcanics, 4: Windmill, 5: Numa grass spot, 6: Staple/Forage spawn node, 7: Guardian Shrine
const MAP_LOVI = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,7,0,0,0,1,1,0,0,0,0,1,1,1,1,1],
  [1,0,5,0,0,0,0,0,5,0,0,0,0,0,6,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1],
  [1,0,1,6,0,0,0,1,0,1,5,0,0,1,0,1],
  [1,0,0,0,0,5,0,0,0,0,0,5,0,0,0,1],
  [1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1],
  [1,6,0,0,0,1,0,0,0,1,0,0,0,1,5,1],
  [1,0,5,1,0,0,0,5,0,0,0,5,0,0,0,1],
  [1,0,0,1,1,1,1,1,1,1,1,1,0,1,6,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const MAP_KORU = [
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,7,0,0,3,3,0,0,0,0,0,0,0,0,6,3],
  [3,0,5,0,0,0,0,3,3,0,5,0,3,3,0,3],
  [3,0,3,3,0,3,0,3,3,0,3,0,3,3,0,3],
  [3,0,3,6,0,3,0,0,0,0,3,5,0,3,0,3],
  [3,0,0,0,0,5,0,3,3,0,0,0,0,0,0,3],
  [3,3,3,0,3,3,0,3,3,3,0,3,3,3,0,3],
  [3,6,0,0,0,3,0,0,0,3,0,0,0,3,5,3],
  [3,0,5,3,0,0,0,5,0,0,0,5,0,0,0,3],
  [3,0,0,3,3,3,3,3,3,3,3,3,0,3,6,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
];

const MAP_MASE = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,7,0,0,0,2,2,0,0,0,0,2,2,2,2,2],
  [2,0,5,0,0,0,0,0,5,0,0,0,0,0,6,2],
  [2,0,2,2,0,2,2,2,0,2,2,0,2,2,0,2],
  [2,0,2,6,0,0,0,2,0,2,5,0,0,2,0,2],
  [2,0,0,0,0,5,0,0,0,0,0,5,0,0,0,2],
  [2,2,2,0,2,2,0,2,2,2,0,2,2,2,0,2],
  [2,6,0,0,0,2,0,0,0,2,0,0,0,2,5,2],
  [2,0,5,2,0,0,0,5,0,0,0,5,0,0,0,2],
  [2,0,0,2,2,2,2,2,2,2,2,2,0,2,6,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const MAP_WESA = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,7,0,0,0,4,4,0,0,0,0,4,4,4,4,4],
  [4,0,5,0,0,0,0,0,5,0,0,0,0,0,6,4],
  [4,0,4,4,0,4,4,4,0,4,4,0,4,4,0,4],
  [4,0,4,6,0,0,0,4,0,4,5,0,0,4,0,4],
  [4,0,0,0,0,5,0,0,0,0,0,5,0,0,0,4],
  [4,4,4,0,4,4,0,4,4,4,0,4,4,4,0,4],
  [4,6,0,0,0,4,0,0,0,4,0,0,0,4,5,4],
  [4,0,5,4,0,0,0,5,0,0,0,5,0,0,0,4],
  [4,0,0,4,4,4,4,4,4,4,4,4,0,4,6,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
];

export default function App() {
  // Main Interface and Database state
  const [activeTab, setActiveTab] = useState<'play' | 'registry' | 'forge' | 'palette'>('play');
  const [sfxEnabled, setSfxEnabled] = useState(() => {
    const saved = localStorage.getItem('mascarene_sfx_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [currentPaletteId, setCurrentPaletteId] = useState<'lovi' | 'koru' | 'mase' | 'wesa'>(() => {
    const saved = localStorage.getItem('mascarene_current_palette_id');
    return (saved as any) || 'lovi';
  });
  
  // Game Database collections
  const [numaList, setNumaList] = useState<Numa[]>(() => {
    const saved = localStorage.getItem('mascarene_numa_list');
    return saved !== null ? JSON.parse(saved) : NUMA_ROSTER;
  });
  const [primordialList] = useState<Numa[]>(PRIMORDIALS);
  const [foodItems] = useState<FoodItem[]>(FOOD_ITEMS);
  const [vocabularyWords, setVocabularyWords] = useState<VocabWord[]>(VOCABULARY);
  const [myLegends, setMyLegends] = useState<{island: string, title: string, text: string}[]>(() => {
    const saved = localStorage.getItem('mascarene_my_legends');
    return saved !== null ? JSON.parse(saved) : [
      {
        island: "Lovi Canopy",
        title: "First Current Song",
        text: "Far back in the currents of Munu, when the roots of Lovi were but tiny sprouts (ki), there was a giant Taki that listened to the water currents. It sang a soft melody (nulu) that called all of the land together. Suna members weave roots to honor this song."
      }
    ];
  });

  // Player Saved Game state (Sanu Ledger & Progress)
  const [prologueComplete, setPrologueComplete] = useState<boolean>(() => {
    const saved = localStorage.getItem('mascarene_prologue_complete');
    return saved !== null ? saved === 'true' : false;
  });
  const [prologueStep, setPrologueStep] = useState<number>(() => {
    const saved = localStorage.getItem('mascarene_prologue_step');
    return saved !== null ? Number(saved) : 0;
  });
  const [playerName, setPlayerName] = useState<string>(() => {
    const saved = localStorage.getItem('mascarene_player_name');
    return saved !== null ? saved : 'Blas';
  });
  const [collectedFragments, setCollectedFragments] = useState<number>(() => {
    const saved = localStorage.getItem('mascarene_collected_fragments');
    return saved !== null ? Number(saved) : 0;
  });
  
  // Tabaji interaction tasks status
  const [tabajiQuestDeliveredWeya, setTabajiQuestDeliveredWeya] = useState<boolean>(() => {
    return localStorage.getItem('mascarene_tq_weya') === 'true';
  });
  const [tabajiQuestTradedVala, setTabajiQuestTradedVala] = useState<boolean>(() => {
    return localStorage.getItem('mascarene_tq_vala') === 'true';
  });
  const [tabajiQuestOrganizedYuma, setTabajiQuestOrganizedYuma] = useState<boolean>(() => {
    return localStorage.getItem('mascarene_tq_yuma') === 'true';
  });

  // Selected starter numa index (for starter selection step 4 preview)
  const [selectedStarterId, setSelectedStarterId] = useState<string>("001");

  const [vala, setVala] = useState<number>(() => {
    const saved = localStorage.getItem('mascarene_vala');
    if (saved !== null) return Number(saved);
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? 35 : 0; // Blas starts with 0 vala
  });
  const [koraVessels, setKoraVessels] = useState<number>(() => {
    const saved = localStorage.getItem('mascarene_kora_vessels');
    if (saved !== null) return Number(saved);
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? 3 : 0; // 0 clay vessels initially during tutorial
  });
  const [discoveredNuma, setDiscoveredNuma] = useState<string[]>(() => {
    const saved = localStorage.getItem('mascarene_discovered_numa');
    if (saved !== null) return JSON.parse(saved);
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? ["001", "004", "007"] : []; // empty until starter selected
  });
  const [discoveredFoods, setDiscoveredFoods] = useState<string[]>(() => {
    const saved = localStorage.getItem('mascarene_discovered_foods');
    if (saved !== null) return JSON.parse(saved);
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? ["stap-01", "stap-02", "stap-03", "fora-01", "drin-01"] : [];
  });
  const [activeCompanions, setActiveCompanions] = useState<{ numaId: string, bond: number, stats: any }[]>(() => {
    const saved = localStorage.getItem('mascarene_active_companions');
    if (saved !== null) return JSON.parse(saved);
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? [
      { numaId: "001", bond: 30, stats: { memory: 40, current: 8, resonance: 6 } }
    ] : []; // empty companion space
  });
  const [unlockedPathStones, setUnlockedPathStones] = useState<string[]>(() => {
    const saved = localStorage.getItem('mascarene_unlocked_path_stones');
    return saved !== null ? JSON.parse(saved) : [];
  });
  const [currentIslandIndex, setCurrentIslandIndex] = useState(() => {
    const saved = localStorage.getItem('mascarene_current_island_index');
    return saved !== null ? Number(saved) : 0;
  });
  const [pantryInventory, setPantryInventory] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('mascarene_pantry_inventory');
    if (saved !== null) return JSON.parse(saved);
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? {
      "stap-01": 3,
      "stap-02": 2,
      "stap-03": 5,
      "fora-01": 1,
      "drin-01": 2
    } : {};
  });

  // Dynamic Weather and Time of Day
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'gale' | 'volcanic' | 'aurora' | 'foggy'>(() => {
    const saved = localStorage.getItem('mascarene_weather');
    return (saved as any) || 'sunny';
  });
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'noon' | 'twilight' | 'night'>(() => {
    const saved = localStorage.getItem('mascarene_time_of_day');
    return (saved as any) || 'noon';
  });

  // Generative music loop state
  const [ambientMusicOn, setAmbientMusicOn] = useState(false);
  const ambientIntervalRef = useRef<any>(null);

  // Friendly iFrame toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // State Persistence Listeners
  useEffect(() => {
    localStorage.setItem('mascarene_vala', String(vala));
  }, [vala]);

  useEffect(() => {
    localStorage.setItem('mascarene_kora_vessels', String(koraVessels));
  }, [koraVessels]);

  useEffect(() => {
    localStorage.setItem('mascarene_discovered_numa', JSON.stringify(discoveredNuma));
  }, [discoveredNuma]);

  useEffect(() => {
    localStorage.setItem('mascarene_discovered_foods', JSON.stringify(discoveredFoods));
  }, [discoveredFoods]);

  useEffect(() => {
    localStorage.setItem('mascarene_active_companions', JSON.stringify(activeCompanions));
  }, [activeCompanions]);

  useEffect(() => {
    localStorage.setItem('mascarene_unlocked_path_stones', JSON.stringify(unlockedPathStones));
  }, [unlockedPathStones]);

  useEffect(() => {
    localStorage.setItem('mascarene_current_island_index', String(currentIslandIndex));
  }, [currentIslandIndex]);

  useEffect(() => {
    localStorage.setItem('mascarene_pantry_inventory', JSON.stringify(pantryInventory));
  }, [pantryInventory]);

  useEffect(() => {
    localStorage.setItem('mascarene_numa_list', JSON.stringify(numaList));
  }, [numaList]);

  useEffect(() => {
    localStorage.setItem('mascarene_my_legends', JSON.stringify(myLegends));
  }, [myLegends]);

  useEffect(() => {
    localStorage.setItem('mascarene_sfx_enabled', String(sfxEnabled));
  }, [sfxEnabled]);

  useEffect(() => {
    localStorage.setItem('mascarene_current_palette_id', currentPaletteId);
  }, [currentPaletteId]);

  useEffect(() => {
    localStorage.setItem('mascarene_weather', weather);
  }, [weather]);

  useEffect(() => {
    localStorage.setItem('mascarene_time_of_day', timeOfDay);
  }, [timeOfDay]);

  useEffect(() => {
    localStorage.setItem('mascarene_prologue_complete', String(prologueComplete));
  }, [prologueComplete]);

  useEffect(() => {
    localStorage.setItem('mascarene_prologue_step', String(prologueStep));
  }, [prologueStep]);

  useEffect(() => {
    localStorage.setItem('mascarene_player_name', playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem('mascarene_collected_fragments', String(collectedFragments));
  }, [collectedFragments]);

  useEffect(() => {
    localStorage.setItem('mascarene_tq_weya', String(tabajiQuestDeliveredWeya));
  }, [tabajiQuestDeliveredWeya]);

  useEffect(() => {
    localStorage.setItem('mascarene_tq_vala', String(tabajiQuestTradedVala));
  }, [tabajiQuestTradedVala]);

  useEffect(() => {
    localStorage.setItem('mascarene_tq_yuma', String(tabajiQuestOrganizedYuma));
  }, [tabajiQuestOrganizedYuma]);

  // Ravali Quarter map for the tutorial
  const MAP_RAVALI = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1],
    [1,0,8,0,0,0,0,0,8,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,8,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,1,1,1,1,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  // Game Boy RPG walkabout character position
  const [charX, setCharX] = useState(() => {
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? 3 : 1;
  });
  const [charY, setCharY] = useState(() => {
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? 2 : 1;
  });
  const [prevCharX, setPrevCharX] = useState(() => {
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? 3 : 1;
  });
  const [prevCharY, setPrevCharY] = useState(() => {
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? 2 : 1;
  });

  const [gbMessage, setGbMessage] = useState<string>(() => {
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? "MUNU EXP: Walk to explore!" : "Your necklace Sana Loop sparkles! Step to collect the 3 Memory Fragments (📜)";
  });
  const [encounterNuma, setEncounterNuma] = useState<Numa | null>(null);
  const [currentMap, setCurrentMap] = useState<number[][]>(() => {
    const isPro = localStorage.getItem('mascarene_prologue_complete') === 'true';
    return isPro ? MAP_LOVI : MAP_RAVALI;
  });

  // --- PREMIUM POKÉMON RED RETRO BATTLE ENGINE STATES & HELPERS ---
  const MOVES_BY_CLASS: Record<string, { name: string; power: number }[]> = {
    "Forest": [
      { name: "Sprout Slap", power: 12 },
      { name: "Leaf Cutter", power: 18 },
      { name: "Lullaby Song", power: 8 },
      { name: "Root Tackle", power: 15 }
    ],
    "Reef": [
      { name: "Coral Jab", power: 13 },
      { name: "Tide Spray", power: 16 },
      { name: "Shell Strike", power: 18 },
      { name: "Salt Squeeze", power: 10 }
    ],
    "Ocean": [
      { name: "Sea Jet", power: 14 },
      { name: "Current Pulse", power: 20 },
      { name: "Lagoon Waves", power: 12 },
      { name: "Tidal Surf", power: 25 }
    ],
    "Volcano": [
      { name: "Spark Ember", power: 15 },
      { name: "Lava Spit", power: 18 },
      { name: "Basalt Slam", power: 22 },
      { name: "Hearth Flame", power: 10 }
    ],
    "Wind": [
      { name: "Gust Song", power: 12 },
      { name: "Glider Dive", power: 16 },
      { name: "Gale Burst", power: 24 },
      { name: "Zephyr Gale", power: 14 }
    ],
    "Cave": [
      { name: "Rock Smash", power: 16 },
      { name: "Obsidian Dart", power: 20 },
      { name: "Echo Howl", power: 10 },
      { name: "Cave Tackle", power: 22 }
    ],
    "Marsh": [
      { name: "Mud Spill", power: 12 },
      { name: "Slime Tackle", power: 16 },
      { name: "Bog Sinkhole", power: 18 },
      { name: "Whiplash Root", power: 15 }
    ],
    "Night": [
      { name: "Stardust Kiss", power: 15 },
      { name: "Eclipse Bite", power: 17 },
      { name: "Shadow Blast", power: 22 },
      { name: "Dream Whisper", power: 20 }
    ],
    "Ancient": [
      { name: "Relic Strike", power: 16 },
      { name: "Epoch Rift", power: 22 },
      { name: "Scribe Laser", power: 18 },
      { name: "Munu Crash", power: 24 }
    ],
    "Spirit": [
      { name: "Aura Ribbon", power: 14 },
      { name: "Spectral Beat", power: 18 },
      { name: "Grave Mist", power: 12 },
      { name: "Vital Whistle", power: 20 }
    ]
  };

  const [battleOpponentHp, setBattleOpponentHp] = useState(0);
  const [battleOpponentMaxHp, setBattleOpponentMaxHp] = useState(0);
  const [battleOpponentLevel, setBattleOpponentLevel] = useState(1);
  const [battleActiveIndex, setBattleActiveIndex] = useState(0);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [battleMode, setBattleMode] = useState<'menu' | 'fight' | 'bag' | 'switch'>('menu');
  const [isBattleTurn, setIsBattleTurn] = useState(true);
  const [isScreenFlashing, setIsScreenFlashing] = useState(false);
  const [isThrowingVessel, setIsThrowingVessel] = useState(false);
  const [fedFavoriteBonus, setFedFavoriteBonus] = useState(false);

  // Master helper to get level-scaled stats for any companion
  const getScaledStats = (comp: { numaId: string; bond: number; level?: number; exp?: number; currentHp?: number; stats: any }) => {
    const info = numaList.find(n => n.id === comp.numaId);
    if (!info) return { maxHp: 10, currentHp: 10, attack: 5, defense: 5, level: 5, exp: 0, info: null };
    
    const level = comp.level !== undefined ? comp.level : 5;
    const exp = comp.exp !== undefined ? comp.exp : 0;
    
    // Leverage the custom 16x11 RPG Game Engine scaling calculations
    const scaled = MunuGameEngine.getScaledCompanionStats(
      info.baseStats.memory,
      info.baseStats.current,
      info.baseStats.resonance,
      level
    );
    const currentHp = comp.currentHp !== undefined ? comp.currentHp : scaled.maxHp;
    
    return {
      maxHp: scaled.maxHp,
      currentHp,
      attack: scaled.attack,
      defense: scaled.defense,
      level,
      exp,
      info
    };
  };

  // Vocabulary Flashcard Practice Game state
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabAnswer, setVocabAnswer] = useState("");
  const [vocabFeedback, setVocabFeedback] = useState<string | null>(null);

  // AI Generation State values
  const [customNumaIdea, setCustomNumaIdea] = useState("");
  const [customNumaClass, setCustomNumaClass] = useState<NumaClass>(NumaClass.FOREST);
  const [customNumaStage, setCustomNumaStage] = useState<EvolutionStage>(EvolutionStage.JUVENILE);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  const [legendTheme, setLegendTheme] = useState("");
  const [isScribing, setIsScribing] = useState(false);
  const [scribingError, setScribingError] = useState<string | null>(null);

  // Cooking station state
  const [cookStapleId, setCookStapleId] = useState("");
  const [cookForageId, setCookForageId] = useState("");
  const [cookDrinkId, setCookDrinkId] = useState("");
  const [cookingResult, setCookingResult] = useState<string | null>(null);

  // Search filter inside Sanu Ledger
  const [codexSearch, setCodexSearch] = useState("");
  const [codexClassFilter, setCodexClassFilter] = useState<string>("All");
  const [selectedCodexNuma, setSelectedCodexNuma] = useState<Numa | null>(null);

  const activePalette = PALETTES[currentPaletteId];

  // Map choices
  const currentIsland = ISLANDS[currentIslandIndex];
  useEffect(() => {
    if (currentIsland.id === 'lovi') {
      setCurrentMap(MAP_LOVI);
      setCurrentPaletteId('lovi');
    } else if (currentIsland.id === 'koru') {
      setCurrentMap(MAP_KORU);
      setCurrentPaletteId('koru');
    } else if (currentIsland.id === 'mase') {
      setCurrentMap(MAP_MASE);
      setCurrentPaletteId('mase');
    } else {
      setCurrentMap(MAP_WESA);
      setCurrentPaletteId('wesa');
    }
  }, [currentIslandIndex]);

  // Generative music 8-bit synthesizer chord progression frequencies
  const CHORDS_LOVI = [261.63, 329.63, 392.00, 523.25]; // C major
  const CHORDS_KORU = [220.00, 261.63, 329.63, 440.00]; // A minor
  const CHORDS_MASE = [293.66, 349.23, 440.00, 587.33]; // D minor
  const CHORDS_WESA = [349.23, 440.00, 523.25, 698.46]; // F major

  // Web Audio generative music loop scheduler
  useEffect(() => {
    if (!ambientMusicOn || !sfxEnabled) {
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current);
        ambientIntervalRef.current = null;
      }
      return;
    }

    let noteIndex = 0;
    let audioCtx: AudioContext | null = null;

    const playAmbientStep = () => {
      try {
        const notes = currentIslandIndex === 0 ? CHORDS_LOVI :
                      currentIslandIndex === 1 ? CHORDS_KORU :
                      currentIslandIndex === 2 ? CHORDS_MASE : CHORDS_WESA;

        if (!audioCtx) {
          audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'triangle';
        const now = audioCtx.currentTime;
        const baseFreq = notes[noteIndex % notes.length];
        
        const freqOffset = (noteIndex % 3 === 0) ? 1.5 : (noteIndex % 4 === 1) ? 2 : 1;
        osc.frequency.setValueAtTime(baseFreq * freqOffset, now);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        osc.start(now);
        osc.stop(now + 0.42);

        noteIndex++;
      } catch (e) {
        console.warn("Generative music error:", e);
      }
    };

    ambientIntervalRef.current = setInterval(playAmbientStep, 450);

    return () => {
      if (ambientIntervalRef.current) {
        clearInterval(ambientIntervalRef.current);
        ambientIntervalRef.current = null;
      }
    };
  }, [ambientMusicOn, sfxEnabled, currentIslandIndex]);

  // Audio Synthesizer using Web Audio API
  const playSound = (type: 'beep' | 'success' | 'levelUp' | 'click' | 'water' | 'spark' | 'evolve') => {
    if (!sfxEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'beep') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'water') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === 'spark') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'evolve') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1500, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      } else if (type === 'levelUp') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.16);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.24);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn("Audio Synthesis not loaded yet.");
    }
  };

  // Keyboard controls for game walking
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (activeTab !== 'play' || encounterNuma) return;
      
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
      }
      
      if (e.key === 'ArrowUp' || key === 'w') handleWalk(0, -1);
      if (e.key === 'ArrowDown' || key === 's') handleWalk(0, 1);
      if (e.key === 'ArrowLeft' || key === 'a') handleWalk(-1, 0);
      if (e.key === 'ArrowRight' || key === 'd') handleWalk(1, 0);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab, charX, charY, currentIslandIndex, encounterNuma]);

  // RPG walk logic
  const handleWalk = (dx: number, dy: number) => {
    const moveRes = MunuGameEngine.solveMove({ x: charX, y: charY }, dx, dy, currentMap);
    
    if (!moveRes.success) {
      playSound('click');
      if (moveRes.tile !== -1 && MunuGameEngine.isSolidObstacle(moveRes.tile)) {
        setGbMessage("Ouch! Obstacle block.");
      } else {
        setGbMessage(moveRes.message);
      }
      return;
    }

    const nextX = moveRes.x;
    const nextY = moveRes.y;
    const tile = moveRes.tile as number;

    // Move player and update companion Trail tracker
    setPrevCharX(charX);
    setPrevCharY(charY);
    setCharX(nextX);
    setCharY(nextY);
    playSound('beep');

    // Trigger walk outcomes based on tile type
    if (!prologueComplete) {
      if (tile === 8) {
        const nextCount = collectedFragments + 1;
        setCollectedFragments(nextCount);
        playSound('success');

        let fragmentMsg = "";
        if (nextCount === 1) {
          fragmentMsg = "📜 '...ancient forest canopies once sang with the Taki currents...'";
        } else if (nextCount === 2) {
          fragmentMsg = "📜 '...shrine keepers left warm volcanic rice to favor Kozui...'";
        } else if (nextCount === 3) {
          fragmentMsg = "📜 '...Reef partners of Vanui swam side-by-side with young of Mase...'";
        }
        setGbMessage(fragmentMsg);
        showToast(`Memory restoring! Collected Fragment ${nextCount}/3.`);

        // Clear fragment from tile
        const updatedMap = [...currentMap.map(row => [...row])];
        updatedMap[nextY][nextX] = 0;
        setCurrentMap(updatedMap);

        if (nextCount === 3) {
          setTimeout(() => {
            setPrologueStep(6);
          }, 3500);
        }
      } else {
        setGbMessage("Sana Loop sparks! Collect the 3 Memory Fragments (📜) on the ground!");
      }
      return;
    }

    if (tile === 5) {
      // Grass encounter! Trigger wild Numa
      const islandNumas = numaList.filter(n => n.primaryIsland === currentIsland.name && n.stage === EvolutionStage.JUVENILE);
      const selected = islandNumas.length > 0 ? islandNumas[Math.floor(Math.random() * islandNumas.length)] : numaList[0];
      
      setEncounterNuma(selected);
      playSound('spark');

      // Setup Pokémon Red relative battle settings
      const diff = currentIsland.difficulty || 1;
      const baseLevel = diff === 1 ? 3 : diff === 2 ? 8 : diff === 3 ? 15 : 24;
      const randomLvl = baseLevel + Math.floor(Math.random() * 4);
      setBattleOpponentLevel(randomLvl);

      const scaledHp = Math.floor(selected.baseStats.memory * (1 + 0.12 * (randomLvl - 1)));
      setBattleOpponentHp(scaledHp);
      setBattleOpponentMaxHp(scaledHp);

      // Select first alive companion
      let firstAliveIdx = activeCompanions.findIndex(c => {
        const stats = getScaledStats(c);
        return stats.currentHp > 0;
      });
      if (firstAliveIdx === -1) firstAliveIdx = 0;
      setBattleActiveIndex(firstAliveIdx);

      const partnerName = activeCompanions[firstAliveIdx] 
        ? (numaList.find(n => n.id === activeCompanions[firstAliveIdx].numaId)?.name || "Partner")
        : "Partner";

      setBattleLogs([
        `Wild ${selected.name} (Lvl ${randomLvl}) appeared in the currents!`,
        `Go! ${partnerName}! Engage with peaceful resonance!`
      ]);
      setBattleMode('menu');
      setIsBattleTurn(true);
      setFedFavoriteBonus(false);
      setGbMessage(`Wild ${selected.name} appeared!`);
    } else if (tile === 6) {
      // Harvest Food node!
      const islandFoods = foodItems.filter(f => f.originIsland === currentIsland.name);
      const foodFound = islandFoods[Math.floor(Math.random() * islandFoods.length)];
      
      // Update inventory and ledger
      setPantryInventory(prev => ({
        ...prev,
        [foodFound.id]: (prev[foodFound.id] || 0) + 1
      }));
      if (!discoveredFoods.includes(foodFound.id)) {
        setDiscoveredFoods(prev => [...prev, foodFound.id]);
      }
      
      setGbMessage(`Picked delicious ${foodFound.name}!`);
      playSound('success');

      // Temporarily mark tile as walked path on local clone so user doesn't double harvest instantly
      const updatedMap = [...currentMap.map(row => [...row])];
      updatedMap[nextY][nextX] = 0;
      setCurrentMap(updatedMap);
    } else if (tile === 7) {
      // Guardian shrine!
      const currentGuardian = currentIsland.guardian;
      const stoneName = currentIsland.pathStoneName;
      if (unlockedPathStones.includes(stoneName)) {
        setGbMessage(`${currentGuardian}: 'Safeguard the path of Munu!'`);
      } else {
        setGbMessage(`${currentGuardian}: 'Acquired the ${stoneName}!'`);
        setUnlockedPathStones(prev => [...prev, stoneName]);
        setVala(prev => prev + 15); // reward Vala
        playSound('levelUp');
        showToast(`⛩️ Guardian Shrine: Acquired ${stoneName}! +15 Vala earned.`);
      }
    } else {
      setGbMessage("Walk to find Numa or plants!");
    }
  };

  // Render Prologue screens inside the Game Boy screen
  const renderPrologueViewport = () => {
    // Step 0: GBC Name Choosing Screen
    if (prologueStep === 0) {
      return (
        <div className="flex-grow flex flex-col justify-between items-center p-4 bg-[#e0ffd1] text-stone-900 border border-black/20 rounded-md select-none min-h-[300px] font-mono text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
          <div className="space-y-3 w-full mt-2">
            <h2 className="text-sm font-black tracking-wider uppercase text-emerald-950 border-b border-black/10 pb-1.5 animate-pulse">
              MASCARENE CIVILIZATION
            </h2>
            <p className="text-[10px] text-stone-700 leading-tight">
              A GBC-Styled Retro Exploration RPG of the Munu Archipelago
            </p>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-black/10 shadow-sm w-full max-w-[240px] space-y-2">
            <label className="text-[10px] font-black uppercase text-stone-700 block">
              Choose character Name (Age 9):
            </label>
            <input
              type="text"
              id="player_name_prologue_input"
              value={playerName}
              maxLength={12}
              onChange={(e) => setPlayerName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
              className="w-full text-center py-1 px-2 bg-stone-50 border-2 border-stone-800 rounded font-bold uppercase tracking-widest text-[#161e17] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <p className="text-[8px] text-stone-500 italic">
              Blas is the authentic default protagonist name.
            </p>
          </div>

          <button
            onClick={() => {
              if (!playerName.trim()) {
                setPlayerName("Blas");
              }
              playSound('success');
              setPrologueStep(1);
            }}
            className="w-full max-w-[200px] py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold rounded-lg shadow border border-emerald-950 text-[10px] uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
          >
            START ADVENTURE ▶
          </button>
          
          <div className="text-[8px] text-stone-500 border-t border-black/10 pt-1 w-full uppercase tracking-widest">
            Retro Spec 1999 • Google AI Studio Built
          </div>
        </div>
      );
    }

    // Step 1: Ravali Quarter Introduction
    if (prologueStep === 1) {
      return (
        <div className="flex-grow flex flex-col justify-between p-4 bg-[#e0ffd1] text-stone-900 border border-black/20 rounded-md select-none min-h-[300px] font-mono relative overflow-hidden">
          <div className="space-y-2.5">
            <span className="text-[8px] font-extrabold bg-stone-800 text-white px-2 py-0.5 rounded uppercase tracking-widest">
              District: Ravali Quarter
            </span>
            <h3 className="text-xs font-black text-emerald-950 uppercase">🏡 The Everyday Hustle</h3>
            <div className="text-[10px] text-stone-800 space-y-2 leading-relaxed">
              <p>
                You play as <strong>{playerName}</strong>, age 9, living in the <strong>Ravali Quarter</strong>: a dense, colorful neighborhood with stacked homes, shared courtyards, and laundry fluttering overhead.
              </p>
              <p>
                To support your family’s small corner stall, the <strong>Tabaji</strong>—a community meeting place to exchange food, weather news, and stories—you start helping out local neighbors today.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 w-full">
            <button
              onClick={() => {
                playSound('beep');
                setPrologueStep(2);
              }}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg border border-emerald-950 text-[10px] uppercase tracking-wider text-center"
            >
              🚪 Open the Tabaji Stall
            </button>
          </div>
        </div>
      );
    }

    // Step 2: Tabaji helper simulation (interactive tutorial)
    if (prologueStep === 2) {
      const allDone = tabajiQuestDeliveredWeya && tabajiQuestTradedVala && tabajiQuestOrganizedYuma;
      return (
        <div className="flex-grow flex flex-col justify-between p-3 bg-[#e0ffd1] text-stone-900 border border-black/20 rounded-md select-none min-h-[300px] font-mono relative overflow-hidden">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center border-b border-black/10 pb-1">
              <span className="text-[8px] font-bold uppercase tracking-widest text-stone-600">Family Hustle: Tabaji</span>
              <span className="text-[10px] font-bold bg-amber-200 px-1.5 rounded">💰 {vala} Vala</span>
            </div>
            <p className="text-[9.5px] text-stone-750 font-bold">
              Help these 3 neighborhood customers waiting at your corner counter:
            </p>
          </div>

          <div className="space-y-2 py-2">
            {/* Customer 1 */}
            <div className="bg-white/70 p-1.5 rounded border border-black/15 flex justify-between items-center text-[9px]">
              <div>
                <span className="font-extrabold text-stone-900 block">👵 Auntie Sylvain:</span>
                <span className="text-stone-600 block italic">"My joints sting. Hand me dry Weya Brew leaves..."</span>
              </div>
              <button
                disabled={tabajiQuestDeliveredWeya}
                onClick={() => {
                  playSound('success');
                  setTabajiQuestDeliveredWeya(true);
                  setVala(v => v + 5);
                  showToast("Delivered Weya Brew! +5 Vala earned.");
                }}
                className={`py-1 px-2.5 rounded text-[8.5px] font-extrabold ${tabajiQuestDeliveredWeya ? 'bg-stone-300 text-stone-500 cursor-default' : 'bg-rose-800 text-white border border-rose-950 hover:bg-rose-700'}`}
              >
                {tabajiQuestDeliveredWeya ? "✔ DELIVERED" : "🍶 DELIVER BREW"}
              </button>
            </div>

            {/* Customer 2 */}
            <div className="bg-white/70 p-1.5 rounded border border-black/15 flex justify-between items-center text-[9px]">
              <div>
                <span className="font-extrabold text-stone-900 block">👨 Uncle Marie:</span>
                <span className="text-stone-600 block italic">"Want to deposit some savings in our ledger."</span>
              </div>
              <button
                disabled={tabajiQuestTradedVala}
                onClick={() => {
                  playSound('success');
                  setTabajiQuestTradedVala(true);
                  setVala(v => v + 15);
                  showToast("Exchanged ledger trade! +15 Vala earned.");
                }}
                className={`py-1 px-2.5 rounded text-[8.5px] font-extrabold ${tabajiQuestTradedVala ? 'bg-stone-300 text-stone-500 cursor-default' : 'bg-amber-700 text-white border border-amber-950  hover:bg-amber-600'}`}
              >
                {tabajiQuestTradedVala ? "✔ TRADED" : "💹 RECORD VALA"}
              </button>
            </div>

            {/* Customer 3 */}
            <div className="bg-white/70 p-1.5 rounded border border-black/15 flex justify-between items-center text-[9px]">
              <div>
                <span className="font-extrabold text-stone-900 block">🧒 Cousin Dev:</span>
                <span className="text-stone-600 block italic">"The Yuma seeds are messy. Let's arrange them."</span>
              </div>
              <button
                disabled={tabajiQuestOrganizedYuma}
                onClick={() => {
                  playSound('success');
                  setTabajiQuestOrganizedYuma(true);
                  setVala(v => v + 5);
                  showToast("Organized seeds tray! +5 Vala earned.");
                }}
                className={`py-1 px-2.5 rounded text-[8.5px] font-extrabold ${tabajiQuestOrganizedYuma ? 'bg-stone-300 text-stone-500 cursor-default' : 'bg-emerald-800 text-white border border-emerald-950 hover:bg-emerald-700'}`}
              >
                {tabajiQuestOrganizedYuma ? "✔ ORGANIZED" : "📦 SORT TRAY"}
              </button>
            </div>
          </div>

          <div className="w-full">
            {allDone ? (
              <button
                onClick={() => {
                  playSound('levelUp');
                  setPrologueStep(3);
                }}
                className="w-full py-2 bg-gradient-to-r from-teal-800 to-emerald-800 text-white font-black rounded-lg border border-teal-950 text-[10px] uppercase tracking-widest text-center animate-bounce shadow-inner"
              >
                ⚡ Close Counter & Rest
              </button>
            ) : (
              <div className="text-[8px] text-stone-500 text-center italic uppercase py-1">
                Help all 3 customers to finish your business day...
              </div>
            )}
          </div>
        </div>
      );
    }

    // Step 3: Inciting Incident (The Wayfarer & Sana Loop)
    if (prologueStep === 3) {
      return (
        <div className="flex-grow flex flex-col justify-between p-4 bg-gradient-to-b from-[#1b261d] to-[#0d160e] text-[#eff6ee] border border-emerald-800/20 rounded-md select-none min-h-[300px] font-mono relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-950/20 mix-blend-color-burn pointer-events-none" />
          <div className="space-y-3">
            <div className="flex justify-between items-center border-[#2d392e] border-b pb-1">
              <span className="text-[8.5px] text-amber-500 font-extrabold uppercase tracking-widest">INCITING INCIDENT</span>
              <span className="text-[8.5px] text-stone-500 font-mono">1999 Retro GBC</span>
            </div>
            
            <p className="text-[9.5px] leading-relaxed text-stone-300">
              Late that evening, a powerful coastal storm washes over the district. Winds howl through the stacked homes.
            </p>
            <p className="text-[9.5px] leading-relaxed text-stone-300 border-l-2 border-amber-500 pl-2 py-0.5 bg-amber-500/5">
              An elderly traveler wrapped in wet woven seaweed blankets joins the Tabaji counter. Carrying a warm energy, he smiles, leaving a sea-beaded necklace on the ledger:
              <br />
              <strong className="text-amber-400 block mt-1 text-[10px]">
                “Some things are remembered by books. Some things are remembered by people. Some things remember themselves.”
              </strong>
            </p>
            <p className="text-[9.5px] leading-relaxed text-[#86a188] italic">
              He vanishes into the wind, leaving behind the legendary ancient necklace of polished basalt and memory weave.
            </p>
          </div>

          <button
            onClick={() => {
              playSound('evolve');
              setPrologueStep(4);
            }}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black rounded-lg border border-amber-850 text-[10px] uppercase tracking-wider text-center"
          >
            📿 Touch & Wear Sana Loop
          </button>
        </div>
      );
    }

    // Step 4: Companion Starter Selection
    if (prologueStep === 4) {
      const starters = [
        { id: "001", name: "Taki", class: "Forest", desc: "🌱 Curiosity & Adaptability. Follows paths of moss-woven canopy. Balanced stats.", emoji: "🌱" },
        { id: "004", name: "Kozui", class: "Volcano", desc: "🔥 Determination & Strength. Rooted in hot basalt currents. Heavy attack power.", emoji: "🔥" },
        { id: "007", name: "Vanui", class: "Reef", desc: "🪸 Cooperation & Community. Connected to element wave-tides. High defense bond.", emoji: "🪸" }
      ];
      const selectedStarterObj = starters.find(s => s.id === selectedStarterId) || starters[0];

      const handleChooseStarter = () => {
        playSound('success');
        const initCompanion = {
          numaId: selectedStarterObj.id,
          bond: 30,
          stats: {
            memory: selectedStarterObj.id === "001" ? 42 : selectedStarterObj.id === "004" ? 38 : 46,
            current: selectedStarterObj.id === "001" ? 8 : selectedStarterObj.id === "004" ? 11 : 6,
            resonance: selectedStarterObj.id === "001" ? 7 : selectedStarterObj.id === "004" ? 5 : 9
          }
        };
        setActiveCompanions([initCompanion]);
        setDiscoveredNuma([selectedStarterObj.id]);
        setDiscoveredFoods(["stap-01", "fora-01"]);
        setPantryInventory({
          "stap-01": 2,
          "fora-01": 2
        });
        setKoraVessels(3);
        setVala(35);
        setCollectedFragments(0);
        setCharX(1);
        setCharY(1);
        setPrevCharX(1);
        setPrevCharY(1);
        setGbMessage(`Selected ${selectedStarterObj.name} as partner! Use WASD/Arrows to find 3 scroll fragments.`);
        showToast(`Chosen Partner: ${selectedStarterObj.name}! Unlocked Sana Loop!`);
        setPrologueStep(5);
      };

      return (
        <div className="flex-grow flex flex-col justify-between p-3 bg-gradient-to-b from-[#1b261d] to-[#0c130d] text-[#eff6ee] border border-emerald-800/20 rounded-md select-none min-h-[300px] font-mono relative overflow-hidden">
          <div className="space-y-1.5">
            <span className="text-[8px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded uppercase tracking-widest block w-max">
              SANA LOOP RESONANCE
            </span>
            <p className="text-[10px] text-stone-300 leading-tight">
              The necklace glows! Three wild Numa spirits materialize from the air. Choose your path companion:
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 mt-1">
            {starters.map(st => (
              <button
                key={st.id}
                onClick={() => {
                  playSound('beep');
                  setSelectedStarterId(st.id);
                }}
                className={`py-2 px-1 rounded-lg border text-center transition-all ${selectedStarterId === st.id ? 'bg-[#4c6c4c] text-white border-white' : 'bg-[#121913] text-[#86a188] border-[#2d392e] hover:text-[#eff6ee]'}`}
              >
                <div className="text-lg">{st.emoji}</div>
                <div className="text-[9.5px] font-bold mt-0.5">{st.name}</div>
              </button>
            ))}
          </div>

          <div className="bg-white/10 p-2 rounded-lg border border-white/10 text-left space-y-1 min-h-[84px] flex flex-col justify-center">
            <div className="flex justify-between items-center border-b border-white/5 pb-0.5">
              <span className="font-bold text-[10.5px] uppercase tracking-wide text-white">{selectedStarterObj.name}</span>
              <span className="text-[8px] bg-emerald-800 text-stone-100 font-mono px-1 rounded">Lvl 3 Starter</span>
            </div>
            <p className="text-[9px] text-[#86a188] leading-snug">{selectedStarterObj.desc}</p>
            <div className="text-[7.5px] text-amber-300">
              Class: {selectedStarterObj.class} | Bond: +30 start bond
            </div>
          </div>

          <button
            onClick={handleChooseStarter}
            className="w-full py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-extrabold rounded-lg shadow-md border border-emerald-950 text-[10px] uppercase tracking-wider text-center"
          >
            🤝 Awake {selectedStarterObj.name} & Bind Loop
          </button>
        </div>
      );
    }

    // Step 6: Prologue finish & Real Plot Begins
    if (prologueStep === 6) {
      return (
        <div className="flex-grow flex flex-col justify-between p-4 bg-[#1b261d] text-[#eff6ee] border border-emerald-850 rounded-md select-none min-h-[300px] font-mono relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
          <div className="space-y-3">
            <div className="flex justify-between items-center border-[#2d392e] border-b pb-1">
              <span className="text-[8.5px] text-amber-500 font-bold uppercase tracking-wider">📜 DISCOVERY / RESTORED PAGE</span>
              <span className="text-[8.5px] text-emerald-400 font-bold uppercase">Success</span>
            </div>

            <h3 className="text-xs font-black uppercase text-emerald-300">
              The Gathering of Ravali Quarter
            </h3>
            
            <div className="text-[9.5px] text-stone-200 space-y-2 leading-relaxed max-h-[170px] overflow-y-auto pr-1">
              <p>
                By stitching the memory nodes together, your first page of the local ledger is fully restored!
              </p>
              <p className="border-l-2 border-emerald-500 pl-2 bg-emerald-500/5 py-0.5">
                The texts reveal that 100 years ago, Ravali Quarter hosted a seasonal <strong>Migration Gathering</strong> where people and elements united in shared songs.
              </p>
              <p>
                You are becoming the first new <strong>Wayfarer of Munu</strong> in generations!
              </p>
              <p>
                By traveling Lovi, Koru, Mase, and Wesa, you will restore forgotten pathways, food species, and ancient stories.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPrologueComplete(true);
              playSound('levelUp');
              setCurrentIslandIndex(0);
              setCurrentMap(MAP_LOVI);
              setCharX(3);
              setCharY(2);
              setPrevCharX(3);
              setPrevCharY(2);
              setGbMessage("Sana Loop active! Walk to explore Munu with companion!");
              showToast("Congratulations! Welcome to Munu Archipelago.");
            }}
            className="w-full py-2 bg-gradient-to-r from-[#4c6c4c] to-emerald-700 text-white font-black rounded-lg border border-emerald-900 text-[10.5px] uppercase tracking-widest text-center animate-pulse"
          >
            ⛵ SET SAIL - BEGIN FULL VOYAGE
          </button>
        </div>
      );
    }

    return null;
  };

  // --- PREMIUM RETRO TURN-BASED COMBAT LOOP ACTIONS ---

  // Trigger custom 8-bit screen flash block
  const triggerScreenFlash = () => {
    setIsScreenFlashing(true);
    setTimeout(() => {
      setIsScreenFlashing(false);
    }, 150);
  };

  // 1. Choose battle ability
  const handleBattleFightMove = (move: { name: string; power: number }) => {
    if (!encounterNuma || !isBattleTurn) return;

    const comp = activeCompanions[battleActiveIndex];
    if (!comp) return;

    const compStats = getScaledStats(comp);
    if (compStats.currentHp <= 0) {
      playSound('click');
      setBattleLogs([`Your partner is fainted! Please swap companions or run!`]);
      return;
    }

    // Spend player turn
    setIsBattleTurn(false);
    playSound('beep');
    triggerScreenFlash();

    // Damage calculations (standard GBC mechanics)
    const wildDefense = Math.floor(encounterNuma.baseStats.resonance * (1 + 0.12 * (battleOpponentLevel - 1)));
    const damage = MunuGameEngine.calculateGbcDamage(compStats.level, move.power, compStats.attack, wildDefense);
    const nextWildHp = Math.max(0, battleOpponentHp - damage);

    // Setup action logs
    const actionLogs = [
      `${compStats.info?.name} used ${move.name}!`,
      `It resonated and calmed wild ${encounterNuma.name} for ${damage} points!`
    ];
    setBattleLogs(actionLogs);
    setBattleOpponentHp(nextWildHp);

    // Turn resolution
    setTimeout(() => {
      if (nextWildHp <= 0) {
        // Opponent Pacified (Defeated successfully)
        playSound('success');

        const expGained = Math.floor(25 * battleOpponentLevel * (1 + Math.random() * 0.35));
        const updatedCompanions = [...activeCompanions];
        const activeComp = updatedCompanions[battleActiveIndex];

        let compLvl = activeComp.level !== undefined ? activeComp.level : 5;
        let compExp = (activeComp.exp !== undefined ? activeComp.exp : 0) + expGained;
        let didLvlUp = false;

        const xpThreshold = compLvl * 80;
        if (compExp >= xpThreshold) {
          compExp = Math.max(0, compExp - xpThreshold);
          compLvl += 1;
          didLvlUp = true;
        }

        const newMaxHp = Math.floor((compStats.info?.baseStats.memory || 30) * (1 + 0.15 * (compLvl - 1)));
        
        updatedCompanions[battleActiveIndex] = {
          ...activeComp,
          level: compLvl,
          exp: compExp,
          currentHp: didLvlUp ? newMaxHp : compStats.currentHp
        };
        setActiveCompanions(updatedCompanions);

        const winLogs = [
          `Wild ${encounterNuma.name} was fully pacified and calmed down!`,
          `${compStats.info?.name} earned ${expGained} energy EXP!`
        ];
        if (didLvlUp) {
          playSound('levelUp');
          winLogs.push(`✨ LEVEL UP! Grown to Lvl ${compLvl}! Stats improved!`);
        }

        setBattleLogs(winLogs);
        
        // Reward glowing shells (Vala)
        const valaGained = 4 + Math.floor(Math.random() * 4 * (currentIsland.difficulty || 1));
        setVala(prev => prev + valaGained);

        setTimeout(() => {
          setEncounterNuma(null);
          setGbMessage(`Calmed wild ${encounterNuma.name}! +${valaGained} Vala.`);
        }, 2500);

      } else {
        // Enemy Counterattack turn
        const wildMoves = MOVES_BY_CLASS[encounterNuma.class] || MOVES_BY_CLASS["Forest"];
        const wildMove = wildMoves[Math.floor(Math.random() * wildMoves.length)];
        const wildAttack = Math.floor(encounterNuma.baseStats.current * (1 + 0.1 * (battleOpponentLevel - 1)));

        // Calculate standard retro GBC counter damage using game engine
        const counterDamage = MunuGameEngine.calculateGbcDamage(battleOpponentLevel, wildMove.power, wildAttack, compStats.defense);
        const nextCompHp = Math.max(0, compStats.currentHp - counterDamage);

        // Update active comp state in state tree
        const updatedCompanions = [...activeCompanions];
        updatedCompanions[battleActiveIndex] = {
          ...updatedCompanions[battleActiveIndex],
          currentHp: nextCompHp
        };
        setActiveCompanions(updatedCompanions);

        setBattleLogs([
          ...actionLogs,
          `Wild ${encounterNuma.name} counters with ${wildMove.name}!`,
          `${compStats.info?.name} absorbed ${counterDamage} impact!`
        ]);

        triggerScreenFlash();

        setTimeout(() => {
          if (nextCompHp <= 0) {
            playSound('click');
            setBattleLogs(prev => [
              ...prev,
              `⚠️ ${compStats.info?.name} has fainted! Switch companion or run!`
            ]);
          }
          setIsBattleTurn(true);
          setBattleMode('menu');
        }, 1200);
      }
    }, 1400);
  };

  // 2. Capture Numa with Kora Vessel
  const handleBattleThrowVessel = () => {
    if (!encounterNuma || koraVessels <= 0 || !isBattleTurn) {
      playSound('click');
      if (koraVessels <= 0) {
        setBattleLogs(prev => [...prev, "No Kora Vessels left in your inventory!"]);
      }
      return;
    }

    setIsBattleTurn(false);
    playSound('water'); // throwing sound
    setIsThrowingVessel(true);

    // Deduct vessel
    setKoraVessels(prev => Math.max(0, prev - 1));

    const rollLogs = [
      `Threw a sacred clay vessel gently high currents!`,
      `Wiggle... wiggle... containing elements...`
    ];
    setBattleLogs(rollLogs);

    setTimeout(() => {
      // Core retro capture rate formulas (Lower HP and favorite food bonuses)
      const baseChance = 0.35;
      const hpBonusRate = 0.50 * (1 - (battleOpponentHp / battleOpponentMaxHp)); // up to 50% extra when HP is critical
      const favTreatBonus = fedFavoriteBonus ? 0.30 : 0.05;
      const finalChance = baseChance + hpBonusRate + favTreatBonus;
      
      const isCaught = Math.random() < finalChance;

      setIsThrowingVessel(false);

      if (isCaught) {
        playSound('success');
        
        // Log in discovery index
        if (!discoveredNuma.includes(encounterNuma.id)) {
          setDiscoveredNuma(prev => [...prev, encounterNuma.id]);
        }

        // Add to active pack
        const updatedComps = [...activeCompanions];
        if (updatedComps.length < 6) {
          updatedComps.push({
            numaId: encounterNuma.id,
            bond: 55,
            level: battleOpponentLevel,
            exp: 0,
            currentHp: battleOpponentMaxHp,
            stats: { ...encounterNuma.baseStats }
          });
          setActiveCompanions(updatedComps);
        }

        setBattleLogs([
          `Gotcha! Wild ${encounterNuma.name} accepted the bond!`,
          `Suna threads established safely. Saved to Sanu Ledger.`
        ]);
        
        // Recycling vessel logic from Mascarene Culture
        setKoraVessels(prev => prev + 1);
        setVala(prev => prev + 5);

        setTimeout(() => {
          setEncounterNuma(null);
          setGbMessage(`Befriended ${encounterNuma.name}! Saved in vessel.`);
        }, 2500);

      } else {
        playSound('click'); // break free thud
        const failLogs = [
          `Oh no! ${encounterNuma.name} slipped out from the clay vessel!`,
          `Wild Numa is still defensive!`
        ];
        setBattleLogs(failLogs);

        // Counterattack turn from wild Numa
        setTimeout(() => {
          const wildMoves = MOVES_BY_CLASS[encounterNuma.class] || MOVES_BY_CLASS["Forest"];
          const wildMove = wildMoves[Math.floor(Math.random() * wildMoves.length)];
          const wildAttack = Math.floor(encounterNuma.baseStats.current * (1 + 0.1 * (battleOpponentLevel - 1)));

          const comp = activeCompanions[battleActiveIndex];
          const compStats = getScaledStats(comp);

          const counterDamage = Math.max(2, Math.floor((wildAttack / Math.max(1, compStats.defense)) * wildMove.power * (0.8 + Math.random() * 0.2)));
          const nextCompHp = Math.max(0, compStats.currentHp - counterDamage);

          // Update active comp state
          const updatedCompanions = [...activeCompanions];
          updatedCompanions[battleActiveIndex] = {
            ...updatedCompanions[battleActiveIndex],
            currentHp: nextCompHp
          };
          setActiveCompanions(updatedCompanions);

          setBattleLogs([
            ...failLogs,
            `Wild ${encounterNuma.name} retaliates with ${wildMove.name}!`,
            `${compStats.info?.name} took ${counterDamage} damage!`
          ]);

          triggerScreenFlash();

          setTimeout(() => {
            if (nextCompHp <= 0) {
              playSound('click');
              setBattleLogs(prev => [
                ...prev,
                `⚠️ ${compStats.info?.name} has fainted! Please swap companions!`
              ]);
            }
            setIsBattleTurn(true);
            setBattleMode('menu');
          }, 1200);

        }, 1400);
      }
    }, 1800);
  };

  // 3. Feed Treat inside Battle
  const handleBattleFeedTreat = (foodId: string) => {
    if (!encounterNuma || !isBattleTurn || (pantryInventory[foodId] || 0) <= 0) {
      playSound('click');
      return;
    }

    setIsBattleTurn(false);
    playSound('success');

    // Deduct treat
    setPantryInventory(prev => ({
      ...prev,
      [foodId]: Math.max(0, (prev[foodId] || 1) - 1)
    }));

    const isFav = encounterNuma.favoriteFoodIds.includes(foodId);
    setFedFavoriteBonus(isFav);

    const treatLogs = isFav 
      ? [`Fed their favorite sweet nutrient: ${foodId}!`, `Wild ${encounterNuma.name} is extremely happy and pacified (+30% Catch Chance!)`]
      : [`Fed standard nursery treat: ${foodId}!`, `Wild ${encounterNuma.name} enjoys the bites (+10% Catch Chance!)`];

    setBattleLogs(treatLogs);

    setTimeout(() => {
      // Opponent gets a lazy counter turn
      const wildMoves = MOVES_BY_CLASS[encounterNuma.class] || MOVES_BY_CLASS["Forest"];
      const wildMove = wildMoves[Math.floor(Math.random() * wildMoves.length)];
      // Lower opponent attack capability due to fullness
      const wildAttack = Math.floor(encounterNuma.baseStats.current * (1 + 0.1 * (battleOpponentLevel - 1)) * (isFav ? 0.6 : 0.85));

      const comp = activeCompanions[battleActiveIndex];
      const compStats = getScaledStats(comp);

      const counterDamage = Math.max(1, Math.floor((wildAttack / Math.max(1, compStats.defense)) * wildMove.power * (0.8 + Math.random() * 0.2)));
      const nextCompHp = Math.max(0, compStats.currentHp - counterDamage);

      const updatedCompanions = [...activeCompanions];
      updatedCompanions[battleActiveIndex] = {
        ...updatedCompanions[battleActiveIndex],
        currentHp: nextCompHp
      };
      setActiveCompanions(updatedCompanions);

      setBattleLogs([
        ...treatLogs,
        `Wild ${encounterNuma.name} does a lazy ${wildMove.name}!`,
        `${compStats.info?.name} absorbed ${counterDamage} damage!`
      ]);

      setTimeout(() => {
        setIsBattleTurn(true);
        setBattleMode('menu');
      }, 1200);
    }, 1400);
  };

  // 4. Switch partner in battle
  const handleBattleSwitchCompanion = (nextIdx: number) => {
    if (!encounterNuma || !isBattleTurn || nextIdx === battleActiveIndex) {
      playSound('click');
      return;
    }

    const nextComp = activeCompanions[nextIdx];
    if (!nextComp) return;

    const nextStats = getScaledStats(nextComp);
    if (nextStats.currentHp <= 0) {
      playSound('click');
      setBattleLogs(prev => [...prev, "That companion is too fatigued to resonate! Heal them first!"]);
      return;
    }

    setIsBattleTurn(false);
    playSound('beep');

    const switchLogs = [
      `Called back current companion!`,
      `Go, ${nextStats.info?.name}! Ignite the currents!`
    ];
    setBattleLogs(switchLogs);
    setBattleActiveIndex(nextIdx);

    // Opponent gets a free strike as player swaps!
    setTimeout(() => {
      const wildMoves = MOVES_BY_CLASS[encounterNuma.class] || MOVES_BY_CLASS["Forest"];
      const wildMove = wildMoves[Math.floor(Math.random() * wildMoves.length)];
      const wildAttack = Math.floor(encounterNuma.baseStats.current * (1 + 0.1 * (battleOpponentLevel - 1)));

      const counterDamage = Math.max(2, Math.floor((wildAttack / Math.max(1, nextStats.defense)) * wildMove.power * (0.8 + Math.random() * 0.2)));
      const nextCompHp = Math.max(0, nextStats.currentHp - counterDamage);

      const updatedCompanions = [...activeCompanions];
      updatedCompanions[nextIdx] = {
        ...updatedCompanions[nextIdx],
        currentHp: nextCompHp
      };
      setActiveCompanions(updatedCompanions);

      setBattleLogs([
        ...switchLogs,
        `Wild ${encounterNuma.name} strikes incoming partner with ${wildMove.name}!`,
        `${nextStats.info?.name} took ${counterDamage} entry impact!`
      ]);

      triggerScreenFlash();

      setTimeout(() => {
        setIsBattleTurn(true);
        setBattleMode('menu');
      }, 1200);
    }, 1400);
  };

  // 5. Run from encounter
  const handleBattleRun = () => {
    if (!encounterNuma || !isBattleTurn) return;

    playSound('beep');
    const isEscaped = Math.random() < 0.65;

    if (isEscaped) {
      setBattleLogs([`Got away safely from wild ${encounterNuma.name}!`]);
      setIsBattleTurn(false);
      setTimeout(() => {
        setEncounterNuma(null);
        setGbMessage("Ran from the encounter.");
      }, 1400);
    } else {
      const failRunLogs = [
        `Tried to flee, but wild ${encounterNuma.name} blocked the exits!`,
        `Can't escape!`
      ];
      setBattleLogs(failRunLogs);
      setIsBattleTurn(false);

      // Free attack from wild Numa
      setTimeout(() => {
        const wildMoves = MOVES_BY_CLASS[encounterNuma.class] || MOVES_BY_CLASS["Forest"];
        const wildMove = wildMoves[Math.floor(Math.random() * wildMoves.length)];
        const wildAttack = Math.floor(encounterNuma.baseStats.current * (1 + 0.1 * (battleOpponentLevel - 1)));

        const comp = activeCompanions[battleActiveIndex];
        const compStats = getScaledStats(comp);

        const counterDamage = Math.max(2, Math.floor((wildAttack / Math.max(1, compStats.defense)) * wildMove.power * (0.8 + Math.random() * 0.2)));
        const nextCompHp = Math.max(0, compStats.currentHp - counterDamage);

        const updatedCompanions = [...activeCompanions];
        updatedCompanions[battleActiveIndex] = {
          ...updatedCompanions[battleActiveIndex],
          currentHp: nextCompHp
        };
        setActiveCompanions(updatedCompanions);

        setBattleLogs([
          ...failRunLogs,
          `Wild ${encounterNuma.name} punishes escape with ${wildMove.name}!`,
          `${compStats.info?.name} took ${counterDamage} damage!`
        ]);

        triggerScreenFlash();

        setTimeout(() => {
          setIsBattleTurn(true);
          setBattleMode('menu');
        }, 1200);
      }, 1400);
    }
  };

  // Language Flashcards Practice Game Logic
  const handleVocabCheck = (word: VocabWord) => {
    if (vocabAnswer.trim().toLowerCase() === word.englishTranslation.split('/')[0].trim().toLowerCase() ||
        word.englishTranslation.toLowerCase().includes(vocabAnswer.trim().toLowerCase()) && vocabAnswer.length > 2) {
      playSound('levelUp');
      setVala(prev => prev + 10);
      setVocabFeedback(`Correct! "+10 Vala earned. ${word.exampleSentence}"`);
    } else {
      playSound('click');
      setVocabFeedback(`Almost! It means: "${word.englishTranslation}".`);
    }
  };

  const handleNextVocab = () => {
    setVocabAnswer("");
    setVocabFeedback(null);
    setVocabIndex((vocabIndex + 1) % vocabularyWords.length);
    playSound('beep');
  };

  // Evolution trigger room logic
  const handleEvolutionTrigger = (companionIndex: number) => {
    const companion = activeCompanions[companionIndex];
    const n = numaList.find(num => num.id === companion.numaId);
    if (!n || !n.evolutionTargetId) return;

    if (companion.bond < 100) {
      playSound('click');
      showToast(`⚠️ Evolution: ${n.name} needs 100 Bond to evolve (currently ${companion.bond}). Feed them dishes!`);
      return;
    }

    const evolvedNuma = numaList.find(num => num.id === n.evolutionTargetId);
    if (!evolvedNuma) return;

    playSound('evolve');
    
    // Update companions
    const updated = [...activeCompanions];
    updated[companionIndex] = {
      ...companion,
      numaId: evolvedNuma.id,
      bond: 20, // resets bond slightly
      stats: {
        memory: evolvedNuma.baseStats.memory,
        current: evolvedNuma.baseStats.current,
        resonance: evolvedNuma.baseStats.resonance
      }
    };
    setActiveCompanions(updated);
    
    if (!discoveredNuma.includes(evolvedNuma.id)) {
      setDiscoveredNuma(prev => [...prev, evolvedNuma.id]);
    }

    showToast(`✨ Spark of Growth! Your ${n.name} has evolved into ${evolvedNuma.name}!`);
  };

  // Companion Feed block
  const handleFeedCompanion = (companionIndex: number, foodId: string) => {
    if ((pantryInventory[foodId] || 0) <= 0) return;

    const companion = activeCompanions[companionIndex];
    if (!companion) return;
    const n = numaList.find(num => num.id === companion.numaId);
    if (!n) return;

    // Deduct food
    setPantryInventory(prev => ({ ...prev, [foodId]: prev[foodId] - 1 }));
    playSound('success');

    // Increase bond and stats based on favorites
    const isFavorite = n.favoriteFoodIds.includes(foodId);
    const bondGain = isFavorite ? 25 : 10;
    
    // Healing calculations
    const statsObj = getScaledStats(companion);
    const healAmount = isFavorite ? statsObj.maxHp : 15;
    const currentHpVal = companion.currentHp !== undefined ? companion.currentHp : statsObj.maxHp;

    const updated = [...activeCompanions];
    updated[companionIndex] = {
      ...companion,
      bond: Math.min(100, companion.bond + bondGain),
      currentHp: Math.min(statsObj.maxHp, currentHpVal + healAmount),
      stats: {
        ...companion.stats,
        memory: companion.stats.memory + (isFavorite ? 3 : 1)
      }
    };
    setActiveCompanions(updated);
    showToast(`Fed ${n.name} ${foodId.replace('stap-', '').replace('fora-', '')}! Bond +${bondGain}, healed +${healAmount} HP.`);
  };

  // Cooking station
  const handleCook = () => {
    if (!cookStapleId || !cookForageId || !cookDrinkId) {
      playSound('click');
      return;
    }

    if ((pantryInventory[cookStapleId] || 0) <= 0 || 
        (pantryInventory[cookForageId] || 0) <= 0 || 
        (pantryInventory[cookDrinkId] || 0) <= 0) {
      playSound('click');
      setCookingResult("Insufficient ingredients in Pantry!");
      return;
    }

    // Deduct
    setPantryInventory(prev => ({
      ...prev,
      [cookStapleId]: prev[cookStapleId] - 1,
      [cookForageId]: prev[cookForageId] - 1,
      [cookDrinkId]: prev[cookDrinkId] - 1
    }));

    // Generate a matching prepared dish from the region of the staple
    const stapleItem = foodItems.find(f => f.id === cookStapleId);
    const primaryRegion = stapleItem?.originIsland || "Lovi Canopy";
    
    const preparedMatches = foodItems.filter(f => f.category === FoodCategory.PREPARED && f.originIsland === primaryRegion);
    const finalPrepared = preparedMatches.length > 0 ? preparedMatches[Math.floor(Math.random() * preparedMatches.length)] : foodItems[40]; // fallback index

    playSound('success');
    
    setPantryInventory(prev => ({
      ...prev,
      [finalPrepared.id]: (prev[finalPrepared.id] || 0) + 1
    }));

    if (!discoveredFoods.includes(finalPrepared.id)) {
      setDiscoveredFoods(prev => [...prev, finalPrepared.id]);
    }

    setCookingResult(`Success! Cooked high-quality ${finalPrepared.name} and added it to Pantry.`);
  };

  // call server.ts server-side API to generate new custom Numa using Gemini 3.5 Flash
  const handleAIGenerateNuma = async () => {
    if (!customNumaIdea.trim()) {
      playSound('click');
      return;
    }
    setIsSynthesizing(true);
    setSynthesisError(null);
    playSound('spark');

    try {
      const response = await fetch('/api/gemini/generate-numa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIdea: customNumaIdea,
          chosenClass: customNumaClass,
          chosenStage: customNumaStage
        })
      });

      if (!response.ok) throw new Error("Munu server is congested. Attempting fallback...");

      const data = await response.json();
      
      // Add custom generated Numa to operational lists
      const formattedNuma: Numa = {
        id: data.id || "gen-" + (numaList.length + 1),
        name: data.name,
        class: data.class as NumaClass,
        stage: data.stage as EvolutionStage,
        habitat: data.habitat,
        behavior: data.behavior,
        ecologicalRole: data.ecologicalRole,
        primaryIsland: data.primaryIsland,
        favoriteFoodIds: data.favoriteFoodIds || ["stap-01"],
        baseStats: data.baseStats || { memory: 50, current: 10, resonance: 10 }
      };

      setNumaList(prev => [...prev, formattedNuma]);
      setDiscoveredNuma(prev => [...prev, formattedNuma.id]);
      playSound('levelUp');
      
      setCustomNumaIdea("");
      showToast(`🧬 Synthesis Complete! "${formattedNuma.name}" has emerged from island memory and has been permanently logged in your Sanu Ledger.`);
    } catch (err: any) {
      console.error(err);
      setSynthesisError("Gemini Server is initializing. Using local fallback creature.");
      // Apply safe offline fallback Numa
      const fallbackNuma: Numa = {
        id: "gen-" + Math.floor(Math.random() * 800 + 100),
        name: "Loziku",
        class: NumaClass.FOREST,
        stage: EvolutionStage.MATURE,
        habitat: "Misty forest floor and shaded mosses",
        behavior: "Rolls in circles around tree trunks, leaving behind glowing snail-like traces of mineralized gel.",
        ecologicalRole: "Moistens deep ironwood roots during dry seasons, protecting platform anchors.",
        primaryIsland: "Lovi Canopy",
        favoriteFoodIds: ["stap-01", "fora-01"],
        baseStats: { memory: 80, current: 16, resonance: 15 }
      };
      setNumaList(prev => [...prev, fallbackNuma]);
      setDiscoveredNuma(prev => [...prev, fallbackNuma.id]);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // call server.ts server-side API to generate high fidelity legends
  const handleAIGenerateLegend = async () => {
    if (!legendTheme.trim()) {
      playSound('click');
      return;
    }
    setIsScribing(true);
    setScribingError(null);
    playSound('water');

    try {
      const response = await fetch('/api/gemini/generate-legend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          islandName: currentIsland.name,
          titleContext: legendTheme
        })
      });

      if (!response.ok) throw new Error("Failed to scribe.");

      const data = await response.json();
      setMyLegends(prev => [
        ...prev,
        {
          island: currentIsland.name,
          title: legendTheme,
          text: data.legend
        }
      ]);
      playSound('success');
      setLegendTheme("");
    } catch (err: any) {
      setScribingError("Gemini offline. Applied legendary memory fallback.");
      setMyLegends(prev => [
        ...prev,
        {
          island: currentIsland.name,
          title: legendTheme,
          text: `A cozy regional fable about: "${legendTheme}". Whispered around wood fires by forest elders on Lovi platforms, keeping local spirits quiet.`
        }
      ]);
    } finally {
      setIsScribing(false);
    }
  };

  // Reset sanity progress
  const handleResetProgress = () => {
    playSound('evolve');
    localStorage.clear();
    setVala(35);
    setKoraVessels(3);
    setDiscoveredNuma(["001", "004", "007"]);
    setDiscoveredFoods(["stap-01", "stap-02", "stap-03", "fora-01", "drin-01"]);
    setActiveCompanions([
      { numaId: "001", bond: 30, stats: { memory: 40, current: 8, resonance: 6 } }
    ]);
    setUnlockedPathStones([]);
    setCurrentIslandIndex(0);
    setPantryInventory({
      "stap-01": 3,
      "stap-02": 2,
      "stap-03": 5,
      "fora-01": 1,
      "drin-01": 2
    });
    setWeather('sunny');
    setTimeOfDay('noon');
    setCharX(3);
    setCharY(3);
    setPrevCharX(3);
    setPrevCharY(3);
    setMyLegends([
      {
        island: "Lovi Canopy",
        title: "Taki Whispers",
        text: "Far back in the currents of Munu, when the roots of Lovi were but tiny sprouts (ki), there was a giant Taki that listened to the water currents. It sang a soft melody (nulu) that called all of the land together. Suna members weave roots to honor this song."
      }
    ]);
    
    showToast("Sanu Ledger progress returned to the ancient currents!");
  };

  // Replay prologue story reset
  const handleReplayPrologue = () => {
    playSound('evolve');
    
    localStorage.removeItem('mascarene_prologue_complete');
    localStorage.removeItem('mascarene_prologue_step');
    localStorage.removeItem('mascarene_player_name');
    localStorage.removeItem('mascarene_collected_fragments');
    localStorage.removeItem('mascarene_tq_weya');
    localStorage.removeItem('mascarene_tq_vala');
    localStorage.removeItem('mascarene_tq_yuma');
    
    setPrologueComplete(false);
    setPrologueStep(0);
    setPlayerName("Blas");
    setCollectedFragments(0);
    setTabajiQuestDeliveredWeya(false);
    setTabajiQuestTradedVala(false);
    setTabajiQuestOrganizedYuma(false);
    
    setVala(0);
    setKoraVessels(0);
    setDiscoveredNuma([]);
    setDiscoveredFoods([]);
    setActiveCompanions([]);
    setPantryInventory({});
    setUnlockedPathStones([]);
    
    setCurrentIslandIndex(0);
    setCurrentMap(MAP_RAVALI);
    setCharX(1);
    setCharY(1);
    setPrevCharX(1);
    setPrevCharY(1);
    setGbMessage("Choose your character's name to begin!");
    
    setActiveTab('play');
    showToast("🌌 Prologue initiated! Welcome to Ravali Quarter.");
  };

  // Filter codex
  const filteredNuma = useMemo(() => {
    return numaList.filter(n => {
      const matchSearch = n.name.toLowerCase().includes(codexSearch.toLowerCase()) || 
                          n.habitat.toLowerCase().includes(codexSearch.toLowerCase());
      const matchClass = codexClassFilter === "All" || n.class === codexClassFilter;
      return matchSearch && matchClass;
    });
  }, [numaList, codexSearch, codexClassFilter]);

  // Vala shopping block
  const handleBuyVessel = () => {
    if (vala >= 10) {
      setVala(prev => prev - 10);
      setKoraVessels(prev => prev + 1);
      playSound('success');
      setGbMessage("Purchased Kora Vessel! (-10 Vala)");
    } else {
      playSound('click');
      setGbMessage("Not enough Vala!");
    }
  };

  // Lu Healing Spring - All active companions HP full rejuvenation
  const handleHealAllCompanions = () => {
    if (activeCompanions.length === 0) {
      playSound('click');
      showToast("⚠️ No active companion Numa to heal!");
      return;
    }
    playSound('success');
    setActiveCompanions(prev => prev.map(c => {
      const stats = getScaledStats(c);
      return {
        ...c,
        currentHp: stats.maxHp
      };
    }));
    setGbMessage("🌸 Restored all companion Numa life force!");
    showToast("🌸 Lu Healing Spring: All companion Numa restored to full life force!");
  };

  return (
    <div className="min-h-screen bg-[#111612] text-[#e3e7e4] font-sans flex flex-col selection:bg-[#4c6c4c] selection:text-[#eff6ee]">
      {/* Top Navigation Console */}
      <header className="border-b border-[#2d392e] bg-[#161e17]/95 sticky top-0 z-[40] backdrop-blur-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4c6c4c] rounded-xl flex items-center justify-center text-[#eff6ee] font-mono font-black text-xl border-2 border-[#eff6ee]/30 shadow-[0_4px_10px_rgba(76,108,76,0.5)]">
              M
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-[#eff6ee]">Mascarene Civilization</h1>
              <p className="text-[11px] text-[#86a188] font-mono tracking-widest uppercase">Self-Generating Civilization Engine | GBC 1999 Spec</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1b261d] px-3.5 py-1.5 rounded-full border border-[#2d392e] text-sm">
              <Coins className="w-4 h-4 text-[#d8a45c]" />
              <span className="font-mono font-bold text-[#eff6ee]">{vala}</span>
              <span className="text-[10px] text-[#86a188] uppercase tracking-wider font-semibold">Vala</span>
            </div>

            <div className="flex items-center gap-2 bg-[#1b261d] px-3.5 py-1.5 rounded-full border border-[#2d392e] text-sm">
              <Database className="w-4 h-4 text-[#eff6ee]" />
              <span className="font-mono font-bold text-[#eff6ee]">{koraVessels}</span>
              <span className="text-[10px] text-[#86a188] uppercase tracking-wider font-semibold">Kora Vessels</span>
            </div>

            <button 
              onClick={() => {
                setSfxEnabled(!sfxEnabled);
                playSound('beep');
              }}
              className="p-2 bg-[#1b261d] hover:bg-[#263729] text-[#86a188] hover:text-[#eff6ee] rounded-full border border-[#2d392e] transition-colors"
              title="Toggle retro synthesis audio"
              id="audio_toggle_btn"
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Structural Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Immersive Overworld Explorer Deck */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Aesthetic Viewport card */}
          <div className="bg-[#161e17] rounded-3xl p-5 border border-[#2d392e] shadow-xl flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c6c4c]/5 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${sfxEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-[#213523]'} border border-emerald-400`} />
                <span className="text-[10px] font-mono tracking-widest text-[#86a188] uppercase font-bold">DOT MATRIX ACTIVE VIEWER</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] px-2 py-0.5 rounded bg-[#1f2a20] border border-[#2d392e] font-mono text-emerald-400 uppercase">
                  {weather}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-[#1f2a20] border border-[#2d392e] font-mono text-amber-400 uppercase">
                  {timeOfDay}
                </span>
              </div>
            </div>

            {/* MAIN MAP GAME SCREEN: borderless widescreen immersion */}
            <div 
              className="w-full rounded-2xl relative overflow-hidden flex flex-col justify-between p-3 shadow-2xl select-none transition-colors duration-300"
              style={{ 
                backgroundColor: activePalette.bg,
                borderColor: activePalette.primary,
                borderWidth: '2px',
                fontFamily: 'Courier New, monospace'
              }}
            >
              {!prologueComplete && prologueStep !== 5 ? (
                renderPrologueViewport()
              ) : encounterNuma ? (
                /* PREMIUM RETRO TURN-BASED COMBAT VIEWPORT (POKÉMON RED LEVEL) */
                <div 
                  className={`flex-grow flex flex-col justify-between p-2.5 relative z-10 select-none min-h-[340px] text-xs font-mono transition-all duration-150 ${isScreenFlashing ? 'bg-white invert' : ''}`}
                  style={{ color: activePalette.dark }}
                >
                  {/* TOP ROW: Opponent & Player Status Bars in Pokémon layout */}
                  <div className="space-y-2">
                    {/* 1. Wild Numa HP Status (Top Right Layout) */}
                    <div className="bg-white/85 p-2 rounded-xl border-2 shadow-sm border-stone-800/40 relative">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-1">
                          😈 {encounterNuma.name}
                        </span>
                        <span className="text-[10px] font-semibold bg-stone-800/20 text-stone-800 px-1 rounded">
                          Lvl {battleOpponentLevel}
                        </span>
                      </div>
                      
                      {/* HP Bar */}
                      <div className="flex items-center gap-1.5 flex-row">
                        <span className="text-[8px] font-extrabold text-stone-700">HP</span>
                        <div className="flex-grow h-2 bg-stone-200 border border-stone-400 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              (battleOpponentHp / battleOpponentMaxHp) > 0.5 ? 'bg-emerald-500' :
                              (battleOpponentHp / battleOpponentMaxHp) > 0.2 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
                            }`}
                            style={{ width: `${(battleOpponentHp / battleOpponentMaxHp) * 100}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-stone-700 min-w-[34px] text-right">
                          {battleOpponentHp}/{battleOpponentMaxHp}
                        </span>
                      </div>
                      
                      <div className="text-[8px] uppercase tracking-widest text-stone-500 font-bold mt-1 text-right">
                        Class: {encounterNuma.class} | {encounterNuma.stage}
                      </div>
                    </div>

                    {/* 2. Player Active Companion HP Status (Bottom Left Layout) */}
                    {activeCompanions[battleActiveIndex] ? (
                      (() => {
                        const stats = getScaledStats(activeCompanions[battleActiveIndex]);
                        return (
                          <div className="bg-white/85 p-2 rounded-xl border-2 shadow-sm border-stone-800/40">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-1">
                                ✊ {stats.info?.name}
                              </span>
                              <span className="text-[10px] font-semibold bg-emerald-800/20 text-emerald-800 px-1 rounded">
                                Lvl {stats.level}
                              </span>
                            </div>

                            {/* HP Bar */}
                            <div className="flex items-center gap-1.5 flex-row">
                              <span className="text-[8px] font-extrabold text-stone-700">HP</span>
                              <div className="flex-grow h-2 bg-stone-200 border border-stone-400 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    (stats.currentHp / stats.maxHp) > 0.5 ? 'bg-emerald-500' :
                                    (stats.currentHp / stats.maxHp) > 0.2 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
                                  }`}
                                  style={{ width: `${Math.min(100, (stats.currentHp / stats.maxHp) * 100)}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-bold text-stone-700 min-w-[34px] text-right">
                                {stats.currentHp}/{stats.maxHp}
                              </span>
                            </div>

                            {/* EXP Bar */}
                            <div className="flex items-center gap-1.5 flex-row mt-1 pt-1 border-t border-dashed border-stone-800/10">
                              <span className="text-[7.5px] font-bold text-stone-500 uppercase">EXP</span>
                              <div className="flex-grow h-1.5 bg-stone-100 border border-stone-300/60 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-cyan-500 transition-all duration-300"
                                  style={{ width: `${Math.min(100, (stats.exp / (stats.level * 80)) * 100)}%` }}
                                />
                              </div>
                              <span className="text-[7.5px] text-stone-500">
                                {stats.exp}/{stats.level * 80}
                              </span>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="p-2 text-center text-rose-500 bg-white/70 rounded-xl border border-dashed">
                        No companions in pack! Create a companion or walk to meet one!
                      </div>
                    )}
                  </div>

                  {/* VISUAL DUEL ZONE (RETRO GRAPHICS FIELD) */}
                  <div className="relative h-20 my-1 bg-white/30 rounded-xl flex items-center justify-between px-6 border border-stone-800/10 overflow-hidden">
                    <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
                    
                    {/* Player Companion (Left, facing right) */}
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full bg-stone-100/80 border border-stone-400/50 flex items-center justify-center text-2xl shadow-sm relative animate-pulse">
                        {(() => {
                          const companion = activeCompanions[battleActiveIndex];
                          const stats = companion ? getScaledStats(companion) : null;
                          if (!stats?.info) return "🐾";
                          
                          if (stats.info.class === NumaClass.FOREST) return "🌱";
                          if (stats.info.class === NumaClass.REEF) return "🪸";
                          if (stats.info.class === NumaClass.OCEAN) return "🐬";
                          if (stats.info.class === NumaClass.VOLCANO) return "🔥";
                          if (stats.info.class === NumaClass.WIND) return "🦅";
                          if (stats.info.class === NumaClass.CAVE) return "💎";
                          if (stats.info.class === NumaClass.MARSH) return "🐊";
                          if (stats.info.class === NumaClass.NIGHT) return "🌌";
                          if (stats.info.class === NumaClass.ANCIENT) return "🏺";
                          if (stats.info.class === NumaClass.SPIRIT) return "👻";
                          return "🐾";
                        })()}
                      </div>
                      <span className="text-[7px] font-bold text-stone-600 uppercase mt-0.5">Partner</span>
                    </div>

                    {/* Middle animation vector (Throws) */}
                    {isThrowingVessel && (
                      <span className="absolute left-1/4 text-xl animate-bounce text-stone-850 select-none">
                        🏺
                      </span>
                    )}

                    {/* Wild Opponent Numa (Right, facing left) */}
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full bg-stone-100/80 border border-stone-400/50 flex items-center justify-center text-2xl shadow-sm relative animate-bounce">
                        {encounterNuma.class === NumaClass.FOREST && "🌱"}
                        {encounterNuma.class === NumaClass.REEF && "🪸"}
                        {encounterNuma.class === NumaClass.OCEAN && "🐬"}
                        {encounterNuma.class === NumaClass.VOLCANO && "🔥"}
                        {encounterNuma.class === NumaClass.WIND && "🦅"}
                        {encounterNuma.class === NumaClass.CAVE && "💎"}
                        {encounterNuma.class === NumaClass.MARSH && "🐊"}
                        {encounterNuma.class === NumaClass.NIGHT && "🌌"}
                        {encounterNuma.class === NumaClass.ANCIENT && "🏺"}
                        {encounterNuma.class === NumaClass.SPIRIT && "👻"}
                      </div>
                      <span className="text-[7px] font-bold text-stone-600 uppercase mt-0.5">Wild</span>
                    </div>
                  </div>

                  {/* 2-LINE GBC TEXT DIALOGUE BOX */}
                  <div className="bg-white p-2 rounded-xl border-2 border-stone-800 text-left leading-tight shadow-md min-h-[46px] flex flex-col justify-center">
                    {battleLogs.slice(-2).map((log, lidx) => (
                      <p key={lidx} className="text-[10px] text-stone-800 font-bold font-mono tracking-tight">
                        ▶ {log}
                      </p>
                    ))}
                    {battleLogs.length === 0 && (
                      <p className="text-[10px] text-stone-500 italic">Initiating contact...</p>
                    )}
                  </div>

                  {/* DYNAMIC COMBAT CONTROL PANEL */}
                  <div className="space-y-1 mt-2">
                    {battleMode === 'menu' && (
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => { playSound('click'); setBattleMode('fight'); }}
                          className="py-2 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg border border-rose-900 shadow-sm text-[10px] uppercase tracking-wider transition-opacity active:opacity-80"
                        >
                          ⚔️ FIGHT
                        </button>
                        <button
                          onClick={() => { playSound('click'); setBattleMode('bag'); }}
                          className="py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg border border-emerald-800 shadow-sm text-[10px] uppercase tracking-wider transition-opacity active:opacity-80"
                        >
                          🎒 BAG
                        </button>
                        <button
                          onClick={() => { playSound('click'); setBattleMode('switch'); }}
                          className="py-2 bg-[#4c6c4c] hover:bg-[#5e835e] text-white font-bold rounded-lg border border-[#3e583e] shadow-sm text-[10px] uppercase tracking-wider transition-opacity active:opacity-80"
                        >
                          🔄 SWITCH
                        </button>
                        <button
                          onClick={handleBattleRun}
                          className="py-2 bg-stone-600 hover:bg-stone-500 text-white font-bold rounded-lg border border-stone-700 shadow-sm text-[10px] uppercase tracking-wider transition-opacity active:opacity-80"
                        >
                          🏃 RUN
                        </button>
                      </div>
                    )}

                    {battleMode === 'fight' && (
                      (() => {
                        const companion = activeCompanions[battleActiveIndex];
                        const stats = companion ? getScaledStats(companion) : null;
                        return (
                          <div className="space-y-1.5">
                            <div className="grid grid-cols-2 gap-1">
                              {(MOVES_BY_CLASS[stats?.info?.class || "Forest"] || MOVES_BY_CLASS["Forest"]).map((move) => (
                                <button
                                  key={move.name}
                                  disabled={!isBattleTurn}
                                  onClick={() => handleBattleFightMove(move)}
                                  className={`py-1.5 px-1 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-lg text-[9px] uppercase truncate border border-stone-900 shadow-sm text-center ${!isBattleTurn ? 'opacity-40 cursor-not-allowed' : ''}`}
                                >
                                  {move.name} <span className="text-rose-400 font-extrabold font-sans">({move.power})</span>
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => { playSound('click'); setBattleMode('menu'); }}
                              className="py-1 bg-stone-400 hover:bg-stone-300 text-stone-900 font-black rounded text-[9px] w-full uppercase border border-stone-500 text-center"
                            >
                              ◀ Back to Menu
                            </button>
                          </div>
                        );
                      })()
                    )}

                    {battleMode === 'bag' && (
                      <div className="space-y-1 bg-white/70 p-1.5 rounded-lg border border-stone-300">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[8.5px] uppercase font-bold text-stone-700">Item Inventory Pack:</span>
                          <span className="text-[9px] font-bold text-stone-800">
                            Vessels: {koraVessels}x 🏺
                          </span>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            disabled={!isBattleTurn || koraVessels <= 0}
                            onClick={handleBattleThrowVessel}
                            className="flex-1 py-1 px-2 bg-amber-600 hover:bg-amber-500 text-white text-[8.5px] font-bold rounded-md uppercase tracking-wider truncate flex justify-center items-center gap-1 border border-amber-700 shadow-inner"
                          >
                            🏺 Throw Clay Vessel ({koraVessels})
                          </button>
                        </div>

                        {Object.values(pantryInventory).some(q => q > 0) ? (
                          <div className="space-y-1 pt-1 border-t border-stone-300">
                            <span className="text-[7.5px] uppercase font-bold text-stone-500 block">Treat feeds:</span>
                            <div className="max-h-16 overflow-y-auto flex flex-wrap gap-1">
                              {Object.entries(pantryInventory).map(([foodId, qty]) => {
                                if (qty <= 0) return null;
                                const isFav = encounterNuma.favoriteFoodIds.includes(foodId);
                                return (
                                  <button
                                    key={foodId}
                                    disabled={!isBattleTurn}
                                    onClick={() => handleBattleFeedTreat(foodId)}
                                    className={`text-[8px] bg-white border border-stone-300 rounded px-1.5 py-0.5 font-bold shadow-sm flex items-center gap-1 hover:bg-stone-50 ${isFav ? 'text-rose-600 border-rose-400' : 'text-stone-700'}`}
                                  >
                                    {foodId.replace('stap-', 'Grain ').replace('fora-', 'Forage ')} x{qty} {isFav && '⭐'}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[7.5px] italic text-stone-550 text-center">No treat items inside active travel pantry.</p>
                        )}

                        <button
                          onClick={() => { playSound('click'); setBattleMode('menu'); }}
                          className="py-1 bg-stone-400 hover:bg-stone-300 text-stone-900 font-black rounded text-[8px] w-full uppercase border border-stone-500 text-center"
                        >
                          ◀ Back to Menu
                        </button>
                      </div>
                    )}

                    {battleMode === 'switch' && (
                      <div className="space-y-1.5 bg-white/70 p-1.5 rounded-lg border border-stone-300">
                        <span className="text-[8.5px] uppercase font-bold text-stone-700 block mb-1">Switch Partner Numa:</span>
                        <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto">
                          {activeCompanions.map((comp, cidx) => {
                            const stats = getScaledStats(comp);
                            const isActive = cidx === battleActiveIndex;
                            const isFainted = stats.currentHp <= 0;
                            return (
                              <button
                                key={cidx}
                                disabled={!isBattleTurn || isActive || isFainted}
                                onClick={() => handleBattleSwitchCompanion(cidx)}
                                className={`p-1 text-left rounded border ${
                                  isActive ? 'bg-indigo-100 border-indigo-400 font-bold cursor-default' :
                                  isFainted ? 'bg-stone-200 border-stone-300 opacity-40 cursor-not-allowed' : 'bg-white border-stone-300 hover:bg-stone-100'
                                }`}
                              >
                                <div className="flex justify-between font-bold truncate text-[8px]">
                                  <span>{stats.info?.name}</span>
                                  <span className="text-[7px]">Lvl {stats.level}</span>
                                </div>
                                <div className="text-[7px] text-stone-500 mt-0.5">
                                  HP: {stats.currentHp}/{stats.maxHp}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => { playSound('click'); setBattleMode('menu'); }}
                          className="py-1 bg-stone-400 hover:bg-stone-300 text-stone-900 font-black rounded text-[8px] w-full uppercase border border-stone-500 text-center"
                        >
                          ◀ Back to Menu
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* DYNAMIC 2D OVERWORLD with Weather and Time lighting */
                <div className="flex-grow flex flex-col justify-between relative min-h-[300px]">
                  
                  {/* Floating Weather Particle overlay layer */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
                    {Array.from({ length: 14 }).map((_, i) => {
                      let char = "🍃";
                      if (weather === 'rainy') char = "💧";
                      else if (weather === 'volcanic') char = "🔥";
                      else if (weather === 'gale') char = "🌀";
                      else if (weather === 'aurora') char = "✨";
                      else if (weather === 'foggy') char = "☁️";

                      const leftPercent = (i * 7.1) % 100;
                      const delay = i * 0.35;
                      const duration = 2.5 + (i % 3);

                      return (
                        <div
                          key={i}
                          className="absolute particle-anim text-xs select-none opacity-0"
                          style={{
                            left: `${leftPercent}%`,
                            bottom: '-20px',
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`,
                          }}
                        >
                          {char}
                        </div>
                      );
                    })}
                  </div>

                  {/* Atmosphere solar overlay tints */}
                  <div className="absolute inset-0 pointer-events-none z-[6] rounded-md overflow-hidden">
                    {timeOfDay === 'morning' && (
                      <div className="absolute inset-0 bg-amber-500/10 mix-blend-color-burn" />
                    )}
                    {timeOfDay === 'twilight' && (
                      <div className="absolute inset-0 bg-purple-600/15 mix-blend-normal" />
                    )}
                    {timeOfDay === 'night' && (
                      <div className="absolute inset-0 bg-blue-950/25 mix-blend-multiply" />
                    )}
                    {weather === 'foggy' && (
                      <div className="absolute inset-0 bg-slate-200/10 backdrop-blur-[1px]" />
                    )}
                  </div>

                  {/* Real Grid System, responsive aspect cells */}
                  <div className="grid grid-cols-16 grid-rows-11 gap-0.5 border border-black/20 rounded-md overflow-hidden bg-[#e0ffd1]/70 relative z-[4] p-1 shadow-inner flex-grow">
                    {currentMap.map((row, y) => 
                      row.map((tile, x) => {
                        const isPlayer = charX === x && charY === y;
                        
                        // Trailing companion logic
                        const isCompanionTrailing = activeCompanions.length > 0 && prevCharX === x && prevCharY === y && !isPlayer;
                        const firstCompanionClass = activeCompanions.length > 0 ? (numaList.find(n => n.id === activeCompanions[0].numaId)?.class) : null;

                        let tileChar = "";
                        let tileColor = "";
                        
                        if (isPlayer) {
                          tileChar = "🚶";
                          tileColor = "bg-white/40";
                        } else if (isCompanionTrailing) {
                          tileColor = "bg-sky-400/20";
                          if (firstCompanionClass === NumaClass.FOREST) tileChar = "🌱";
                          else if (firstCompanionClass === NumaClass.REEF) tileChar = "🪸";
                          else if (firstCompanionClass === NumaClass.OCEAN) tileChar = "🐬";
                          else if (firstCompanionClass === NumaClass.VOLCANO) tileChar = "🔥";
                          else if (firstCompanionClass === NumaClass.WIND) tileChar = "🦅";
                          else if (firstCompanionClass === NumaClass.CAVE) tileChar = "💎";
                          else if (firstCompanionClass === NumaClass.MARSH) tileChar = "🐊";
                          else if (firstCompanionClass === NumaClass.NIGHT) tileChar = "🌌";
                          else if (firstCompanionClass === NumaClass.ANCIENT) tileChar = "🏺";
                          else if (firstCompanionClass === NumaClass.SPIRIT) tileChar = "👻";
                          else tileChar = "🐾";
                        } else if (tile === 1) {
                          tileChar = "🌳"; // tree
                        } else if (tile === 2) {
                          tileChar = "🌊"; // water tide pools
                        } else if (tile === 3) {
                          tileChar = "🌋"; // active lava block
                        } else if (tile === 4) {
                          tileChar = "💨"; // windmill
                        } else if (tile === 5) {
                          tileChar = "🌿"; // tall grass
                        } else if (tile === 6) {
                          tileChar = "🍒"; // berry node
                        } else if (tile === 7) {
                          tileChar = "⛩️"; // shrine
                        }

                        return (
                          <div 
                            key={`${x}-${y}`} 
                            className={`aspect-square flex items-center justify-center text-[10px] md:text-sm leading-none rounded-md transition-all ${tileColor}`}
                            style={{ 
                              outline: '1px solid rgba(0,0,0,0.02)',
                            }}
                          >
                            {tileChar}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Inline micro status HUD info */}
                  <div className="border-t mt-2 pt-1.5 flex flex-col justify-between text-[11px] font-mono px-1 select-none z-10" style={{ color: activePalette.dark, borderColor: activePalette.primary }}>
                    <div className="flex justify-between font-bold">
                      <span className="uppercase tracking-wider">Map: {currentIsland.name}</span>
                      <span>Stones Held: {unlockedPathStones.length}/4</span>
                    </div>
                    <div className="mt-1 bg-white/70 p-1.5 rounded-lg font-sans text-[11px] tracking-wide leading-tight font-medium shadow-sm">
                      📍 {gbMessage}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generative Audio Ambient Loop Controller */}
            <div className="bg-[#1b261d] p-3 rounded-2xl border border-[#2d392e] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${ambientMusicOn && sfxEnabled ? 'bg-amber-500 animate-ping' : 'bg-stone-700'}`} />
                <span className="text-[#86a188] font-mono font-medium">Ambient Chiptune Engine:</span>
              </div>
              <button 
                onClick={() => {
                  setAmbientMusicOn(!ambientMusicOn);
                  playSound('beep');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider border transition-all ${
                  ambientMusicOn 
                  ? 'bg-[#4c6c4c] text-[#eff6ee] border-[#4c6c4c]' 
                  : 'bg-[#121913] text-[#86a188] hover:text-white border-[#2d392e]'
                }`}
              >
                {ambientMusicOn ? "⏸️ Mute Song" : "▶️ Play Loop"}
              </button>
            </div>

            {/* Immersive Obsidian Navigational Compass Dial */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              
              {/* Compass Directional Ring */}
              <div className="relative w-36 h-36 bg-[#121913] rounded-full border-2 border-[#2d392e] flex items-center justify-center shadow-xl">
                {/* Dial letters */}
                <span className="absolute top-1 text-[9px] font-mono text-stone-600 font-bold uppercase">N</span>
                <span className="absolute bottom-1 text-[9px] font-mono text-stone-600 font-bold uppercase">S</span>
                <span className="absolute left-1.5 text-[9px] font-mono text-stone-600 font-bold uppercase">W</span>
                <span className="absolute right-1.5 text-[9px] font-mono text-stone-600 font-bold uppercase">E</span>

                {/* Inner glass plate */}
                <div className="w-24 h-24 rounded-full bg-[#1b261d] border border-[#2d392e]/40 flex items-center justify-center shadow-inner relative">
                  
                  {/* Arrow movement triggers */}
                  <button 
                    onClick={() => handleWalk(0, -1)}
                    className="absolute top-1 w-8 h-8 bg-[#121913] hover:bg-[#2c3d2f] rounded-full flex items-center justify-center text-[#eff6ee] transition-colors focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                    title="Move North (W/Up)"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleWalk(0, 1)}
                    className="absolute bottom-1 w-8 h-8 bg-[#121913] hover:bg-[#2c3d2f] rounded-full flex items-center justify-center text-[#eff6ee] transition-colors focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                    title="Move South (S/Down)"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleWalk(-1, 0)}
                    className="absolute left-1 w-8 h-8 bg-[#121913] hover:bg-[#2c3d2f] rounded-full flex items-center justify-center text-[#eff6ee] transition-colors focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                    title="Move West (A/Left)"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleWalk(1, 0)}
                    className="absolute right-1 w-8 h-8 bg-[#121913] hover:bg-[#2c3d2f] rounded-full flex items-center justify-center text-[#eff6ee] transition-colors focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                    title="Move East (D/Right)"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Compass className="w-6 h-6 animate-pulse" style={{ color: activePalette.primary }} />
                </div>
              </div>

              {/* Deck actions shortcuts */}
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    if (!prologueComplete) {
                      playSound('click');
                      showToast("🔒 Locked! Finish Blas's Prologue first.");
                      return;
                    }
                    playSound('click');
                    setCurrentIslandIndex((prev) => (prev + 1) % ISLANDS.length);
                    setGbMessage(`Select: Changed island map!`);
                  }}
                  className="flex-1 py-2 px-4 bg-[#1b261d] hover:bg-[#253428] text-white border border-[#2d392e] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Switch map
                </button>
                <button 
                  onClick={() => {
                    if (!prologueComplete) {
                      playSound('click');
                      showToast("🔒 Locked! Finish Blas's Prologue first.");
                      return;
                    }
                    handleBuyVessel();
                  }}
                  className="flex-1 py-2 px-4 bg-[#1b261d] hover:bg-[#253428] text-white border border-[#2d392e] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5 text-yellow-500" /> Buy Clay Vessel (-10 Vala)
                </button>
              </div>

            </div>

            {/* SANDBOX ATOMOSPHERE CALIBRATION CONTROLS */}
            <div className="border-t border-[#2d392e] pt-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#eff6ee] font-bold">Atmosphere Calibration:</span>
                <span className="text-[#86a188]">Adjust living sandbox</span>
              </div>

              {/* Weather Climate selection button dials */}
              <div className="space-y-2 text-[10px] font-mono">
                <div>
                  <span className="text-slate-500">Climate Dial:</span>
                  <div className="grid grid-cols-6 gap-1 mt-1">
                    {[
                      { id: 'sunny', label: "Sunny ☀️" },
                      { id: 'rainy', label: "Rainy 🌧️" },
                      { id: 'gale', label: "Gales 🌀" },
                      { id: 'volcanic', label: "Volcano 🔥" },
                      { id: 'aurora', label: "Aurora ✨" },
                      { id: 'foggy', label: "Foggy 🌫️" }
                    ].map(w => (
                      <button
                        key={w.id}
                        onClick={() => {
                          setWeather(w.id as any);
                          playSound('beep');
                        }}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          weather === w.id 
                          ? 'bg-[#4c6c4c] text-white border-[#4c6c4c]' 
                          : 'bg-[#121913] text-[#86a188] border-[#2d392e] hover:text-white'
                        }`}
                      >
                        {w.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day phase selection dials */}
                <div>
                  <span className="text-slate-500">Solar Arc Day Phase:</span>
                  <div className="grid grid-cols-4 gap-1 mt-1">
                    {[
                      { id: 'morning', label: "Sunrise 🌅" },
                      { id: 'noon', label: "Noon ☀️" },
                      { id: 'twilight', label: "Twilight 🌆" },
                      { id: 'night', label: "Night 🌌" }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTimeOfDay(t.id as any);
                          playSound('beep');
                        }}
                        className={`py-1.5 rounded-lg border text-center transition-all ${
                          timeOfDay === t.id 
                          ? 'bg-[#4c6c4c] text-white border-[#4c6c4c]' 
                          : 'bg-[#121913] text-[#86a188] border-[#2d392e] hover:text-white'
                        }`}
                      >
                        {t.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Controls Quick Reference list */}
          <div className="bg-[#161e17] p-4 rounded-3xl border border-[#2d392e] text-xs space-y-2 text-[#86a188] select-none">
            <h3 className="text-[#eff6ee] font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#4c6c4c]" /> Exploration Guide:
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Move using your keyboard (**WASD** or **Arrows**) or the virtual compass dial.</li>
              <li>Wander in deep grasses (<span className="text-emerald-400 font-bold">🌿</span>) to trigger wild encounters.</li>
              <li>Pluck berries (<span className="text-rose-400">🍒</span>) to stock up recipe pantry ingredients.</li>
              <li>Seek shrines (<span className="text-amber-500 font-bold">⛩️</span>) to claim ancient protective Path Stones.</li>
              <li>Toggle elements above to instantly configure custom weather animations & Solar time overlays!</li>
            </ul>
          </div>
        </section>

        {/* Right Column: Interactive Digital Handbook & AI Forge */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Main Module Tabs selection */}
          <div className="flex bg-[#161e17] p-1 rounded-xl border border-[#2d392e]">
            {[
              { id: 'play', label: "Sanu Sandbox", icon: Compass },
              { id: 'registry', label: "Sanu Ledger (Codex)", icon: BookOpen },
              { id: 'forge', label: "AI Forge", icon: Sparkles },
              { id: 'palette', label: "Hardware Settings", icon: Dna }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound('click');
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex-1 py-3 px-2 rounded-lg flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${
                    activeTab === tab.id 
                    ? 'bg-[#4c6c4c] text-[#eff6ee] shadow-md border-b-2 border-[#eff6ee]/20' 
                    : 'text-[#86a188] hover:text-[#eff6ee] hover:bg-[#1f2a20]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SANU SANDBOX & COMPANION MANAGEMENT */}
          {activeTab === 'play' && (
            <div className="bg-[#161e17] p-6 rounded-3xl border border-[#2d392e] space-y-6 animate-in fade-in duration-300">
              
              {/* Regional Description Header */}
              <div className="p-5 bg-[#1b261d] rounded-2xl border border-[#2d392e] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4c6c4c]/5 rounded-full blur-2xl" />
                <span className="text-[10px] text-[#4c6c4c] font-black uppercase tracking-[0.2em] font-mono">Current Active Region</span>
                <h3 className="text-2xl font-black text-[#eff6ee] uppercase tracking-tighter mt-1">{currentIsland.name}</h3>
                <p className="text-xs text-[#86a188] italic mt-1 leading-relaxed">"{currentIsland.motto}"</p>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#2d392e] text-[11px] text-[#86a188]">
                  <div>
                    <span className="text-white font-bold block uppercase tracking-wider text-[10px] mb-1">Ecosystem:</span>
                    {currentIsland.ecosystem}
                  </div>
                  <div>
                    <span className="text-white font-bold block uppercase tracking-wider text-[10px] mb-1">Architecture:</span>
                    {currentIsland.architecture}
                  </div>
                </div>
              </div>

              {/* Active Companions Block with Bond-Feeding */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d392e] pb-2">
                  <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#eff6ee] flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 animate-pulse" /> Active Companions ({activeCompanions.length}/6)
                  </h4>
                  {activeCompanions.length > 0 && (
                    <button
                      onClick={handleHealAllCompanions}
                      className="py-1 px-3 bg-red-800/90 hover:bg-red-700 text-[#eff6ee] border border-red-900 rounded-xl font-bold font-mono text-[9.5px] uppercase flex items-center gap-1.5 transition-all shadow-sm active:translate-y-0.5"
                    >
                      🌸 Lu Healing Spring Clinic
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCompanions.map((comp, idx) => {
                    const info = numaList.find(n => n.id === comp.numaId);
                    if (!info) return null;
                    const canEvolve = info.evolutionTargetId && comp.bond >= 100;
                    const cStats = getScaledStats(comp);

                    return (
                      <div key={idx} className="bg-[#1b261d] p-4 rounded-2xl border border-[#2d392e] flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#86a188] font-mono">
                              ID {info.id} | {info.class} | Lvl {cStats.level}
                            </span>
                            <h5 className="text-base font-black text-[#eff6ee] uppercase mt-0.5">{info.name}</h5>
                            <span className="text-[10px] bg-[#4c6c4c]/20 text-[#eff6ee] px-2 py-0.5 rounded uppercase font-bold tracking-wider block w-max mt-1">
                              {info.stage}
                            </span>
                          </div>
                          <span className="text-xl">🐾</span>
                        </div>

                        {/* HP status */}
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-[10px] text-[#86a188] uppercase tracking-wider font-semibold">
                            <span>Life Force / HP</span>
                            <span className={`font-bold ${cStats.currentHp === 0 ? 'text-red-500 animate-pulse' : 'text-[#eff6ee]'}`}>
                              {cStats.currentHp}/{cStats.maxHp} {cStats.currentHp === 0 && '(Fainted!)'}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#121913] rounded-full overflow-hidden border border-[#2d392e]">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                (cStats.currentHp / cStats.maxHp) > 0.5 ? 'bg-emerald-500' :
                                (cStats.currentHp / cStats.maxHp) > 0.2 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
                              }`} 
                              style={{ width: `${Math.min(100, (cStats.currentHp / cStats.maxHp) * 100)}%` }} 
                            />
                          </div>
                        </div>

                        {/* Experience tracking */}
                        <div className="mt-2 space-y-1 border-b border-dashed border-[#2d392e] pb-2">
                          <div className="flex justify-between text-[9px] text-[#86a188] uppercase tracking-wider">
                            <span>Experience Points</span>
                            <span className="font-bold text-cyan-400">{cStats.exp}/{cStats.level * 80} XP</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#121913] rounded-full overflow-hidden border border-[#2d392e]">
                            <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${Math.min(100, (cStats.exp / (cStats.level * 80)) * 100)}%` }} />
                          </div>
                        </div>

                        {/* Bonding meter */}
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-[10px] text-[#86a188] uppercase tracking-wider font-semibold">
                            <span>Gentle Trust / Bond</span>
                            <span className="font-bold text-[#eff6ee]">{comp.bond}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#121913] rounded-full overflow-hidden border border-[#2d392e]">
                            <div className="h-full bg-red-400 transition-all duration-300" style={{ width: `${comp.bond}%` }} />
                          </div>
                        </div>

                        {/* Companion Skills Move Pool */}
                        <div className="mt-3 bg-[#121913] p-2 rounded-lg">
                          <span className="block text-slate-500 uppercase text-[8px] tracking-wider mb-1 font-mono">Resonant moves:</span>
                          <div className="flex flex-wrap gap-1">
                            {(MOVES_BY_CLASS[info.class] || MOVES_BY_CLASS["Forest"]).map(move => (
                              <span key={move.name} className="text-[8px] bg-[#1b261d] border border-[#2d392e] px-1.5 py-0.5 rounded text-stone-300 font-bold font-mono">
                                {move.name} <span className="text-rose-400 font-sans">({move.power})</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Scaled RPG Stats readout instead of base stats */}
                        <div className="mt-3 grid grid-cols-3 gap-2 bg-[#121913] p-2 rounded-lg text-center text-[10px] font-mono">
                          <div>
                            <span className="block text-slate-500 uppercase text-[8px]">Life/HP</span>
                            <span className="text-[#eff6ee] font-bold">{cStats.maxHp}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 uppercase text-[8px]">Attack</span>
                            <span className="text-[#eff6ee] font-bold">{cStats.attack}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 uppercase text-[8px]">Def/Res</span>
                            <span className="text-[#eff6ee] font-bold">{cStats.defense}</span>
                          </div>
                        </div>

                        {/* Evolutionary link bubble */}
                        {info.evolutionTargetId && (
                          <div className="mt-3 text-[10px] text-[#86a188] bg-black/20 p-2 rounded">
                            Evolves into: <span className="text-white font-bold uppercase">{numaList.find(n => n.id === info.evolutionTargetId)?.name}</span>
                          </div>
                        )}

                        {/* Quick action buttons */}
                        <div className="mt-4 flex gap-2">
                          {canEvolve ? (
                            <button
                              onClick={() => handleEvolutionTrigger(idx)}
                              className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                            >
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Evolve Now!
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full py-1.5 bg-[#253227] text-slate-500 font-bold rounded-lg text-[10px] uppercase tracking-wider cursor-not-allowed"
                            >
                              Locked (Need 100 Bond)
                            </button>
                          )}
                          
                          {/* Treat Feed selection dropdown if treats are held */}
                          <div className="relative group w-full">
                            <button className="w-full py-1.5 bg-[#4c6c4c] hover:bg-[#5e835e] text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors">
                              Feed Treat
                            </button>
                            {/* dropdown */}
                            <div className="absolute bottom-full left-0 w-full bg-[#1b261d] border border-[#2d392e] rounded-xl hidden group-hover:block p-1 z-10 max-h-40 overflow-y-auto">
                              <p className="text-[8px] uppercase font-bold text-slate-400 p-1">Choose Food:</p>
                              {Object.entries(pantryInventory).map(([foodId, qty]) => {
                                if (qty <= 0) return null;
                                const isFav = info.favoriteFoodIds.includes(foodId);
                                return (
                                  <button
                                    key={foodId}
                                    onClick={() => handleFeedCompanion(idx, foodId)}
                                    className="w-full text-left p-1 text-[9px] hover:bg-[#2c3d2f] text-[#eff6ee] rounded flex justify-between rounded-md"
                                  >
                                    <span className="truncate">{foodId.replace('stap-', 'Staple ').replace('fora-', 'Forage ')} {isFav && '⭐'}</span>
                                    <span className="font-bold">x{qty}</span>
                                  </button>
                                );
                              })}
                              {Object.values(pantryInventory).every(q => q <= 0) && (
                                <p className="text-[8.5px] italic text-[#86a188] p-1">Pantry is empty!</p>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}

                  {activeCompanions.length === 0 && (
                    <div className="col-span-full py-10 border-2 border-dashed border-[#2d392e] text-center rounded-3xl text-slate-600">
                      <p>Awaiting companion bonds. Go walk inside the overworld and welcome them!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Economic Station: Vala Mercenary Trader */}
              <div className="bg-[#1b261d] p-5 rounded-2xl border border-[#2d392e]">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#eff6ee] mb-3 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#d8a45c]" /> Vala Exchange Market
                </h4>
                <p className="text-[11px] text-[#86a188] leading-relaxed mb-4">
                  Exchange localized materials or buy volcanic clay vessels to extend Numa companionship. Crafting authentic Kora Vessels requires sacred ash and clay.
                </p>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-3 border-t border-[#2d392e]">
                  <div className="flex gap-2 items-center">
                    <span className="text-xl">🏺</span>
                    <div>
                      <span className="text-xs font-bold text-[#eff6ee] block">Purchase Kora Vessel</span>
                      <span className="text-[10px] text-[#86a188] font-mono">Cost: 10 Vala (Standard Clay)</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleBuyVessel}
                    className="py-2 px-5 bg-[#d8a45c] hover:bg-[#e4b574] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Buy Vessel
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SANU LEDGER (ENCYCLOPEDIA DICTIONARY, FOOD, AND PROGRESSION MATRIX) */}
          {activeTab === 'registry' && (
            <div className="bg-[#161e17] p-6 rounded-3xl border border-[#2d392e] space-y-6 animate-in fade-in duration-300">
              
              <div className="flex justify-between items-center border-b border-[#2d392e] pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#eff6ee] uppercase tracking-tight">Sanu Ledger Repository</h3>
                  <p className="text-xs text-[#86a188] font-mono">Discovered: {discoveredNuma.length}/35 Numa | {discoveredFoods.length}/90 Organic Foods</p>
                </div>
                <BookMarked className="w-6 h-6 text-[#4c6c4c]" />
              </div>

              {/* SECTION A: NUMA CODEX LIST OR FULL INSPECTION PANEL */}
              {selectedCodexNuma ? (
                <div className="space-y-6 bg-[#121913] p-5 rounded-2xl border border-[#2d392e] animate-in slide-in-from-bottom-2 duration-300">
                  {/* Inspection Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d392e]/60 pb-3">
                    <button
                      onClick={() => {
                        playSound('click');
                        setSelectedCodexNuma(null);
                      }}
                      className="px-3 py-1.5 bg-[#1b261d] hover:bg-[#202c22] border border-[#2d392e] rounded-xl text-xs font-mono font-bold flex items-center gap-1 text-[#86a188] hover:text-[#eff6ee] transition-all"
                    >
                      ← Back to Numa List
                    </button>
                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-900/30">
                        Classified Ledger Analyzer
                      </span>
                    </div>
                  </div>

                  {/* Top Stats Overview Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Visual Sprite Column */}
                    <div className="md:col-span-5 bg-[#1a251b] p-4 rounded-xl border border-[#2d392e]/70 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
                      
                      {/* Big Emoji Sprite with Animation */}
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#4c6c4c] flex items-center justify-center bg-black/30 shadow-inner relative animate-bounce mb-3">
                        <span className="text-4xl">
                          {selectedCodexNuma.class === NumaClass.FOREST && "🌱"}
                          {selectedCodexNuma.class === NumaClass.REEF && "🪸"}
                          {selectedCodexNuma.class === NumaClass.OCEAN && "🐬"}
                          {selectedCodexNuma.class === NumaClass.VOLCANO && "🔥"}
                          {selectedCodexNuma.class === NumaClass.WIND && "🦅"}
                          {selectedCodexNuma.class === NumaClass.CAVE && "💎"}
                          {selectedCodexNuma.class === NumaClass.MARSH && "🐊"}
                          {selectedCodexNuma.class === NumaClass.NIGHT && "🌌"}
                          {selectedCodexNuma.class === NumaClass.ANCIENT && "🏺"}
                          {selectedCodexNuma.class === NumaClass.SPIRIT && "👻"}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
                        Index No. {selectedCodexNuma.id}
                      </span>
                      <h4 className="text-xl font-black uppercase text-[#eff6ee] tracking-wider mt-1">
                        {selectedCodexNuma.name}
                      </h4>
                      <span className="text-[10px] bg-emerald-800/20 text-[#eff6ee] px-3 py-1 rounded-full uppercase font-bold tracking-wider mt-2 border border-emerald-800/40">
                        {selectedCodexNuma.stage} stage
                      </span>
                      <span className="text-[9px] text-[#86a188] uppercase font-mono mt-1 font-bold">
                        Element class: {selectedCodexNuma.class}
                      </span>
                    </div>

                    {/* Base Stats & Nutritional Favorites Column */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                      {/* RPG Base Stats Indicators */}
                      <div className="bg-[#161e17] p-3.5 rounded-xl border border-[#2e3b2f] space-y-2.5">
                        <h5 className="text-[10px] uppercase tracking-[0.15em] font-black text-rose-400">
                          Resonant Base Statistics
                        </h5>
                        
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-black/20 p-2 rounded border border-[#2d392e]/40">
                            <span className="block text-slate-500 uppercase text-[8px] font-mono">Memory max</span>
                            <span className="text-[#eff6ee] font-black text-sm">{selectedCodexNuma.baseStats.memory}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded border border-[#2d392e]/40">
                            <span className="block text-slate-500 uppercase text-[8px] font-mono">Attack power</span>
                            <span className="text-[#eff6ee] font-black text-sm">{selectedCodexNuma.baseStats.current}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded border border-[#2d392e]/40">
                            <span className="block text-slate-500 uppercase text-[8px] font-mono">Reson. defense</span>
                            <span className="text-[#eff6ee] font-black text-sm">{selectedCodexNuma.baseStats.resonance}</span>
                          </div>
                        </div>

                        {/* Spark Stat bars */}
                        <div className="space-y-1 pt-1.5">
                          <div className="flex justify-between text-[8px] font-mono text-[#86a188]">
                            <span>Life Force Reservoir</span>
                            <span>{selectedCodexNuma.baseStats.memory} Memory</span>
                          </div>
                          <div className="h-1 bg-[#121913] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (selectedCodexNuma.baseStats.memory / 140) * 100)}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Sweet Food Favorites Nutritionists */}
                      <div className="bg-[#161e17] p-3.5 rounded-xl border border-[#2e3b2f] space-y-2">
                        <h5 className="text-[10px] uppercase tracking-[0.15em] font-black text-amber-500 flex items-center gap-1">
                          🎁 Nutrient Food Favorites
                        </h5>
                        <p className="text-[10px] text-slate-400 italic">
                          Feeding these specific items in active companions menu boosts Bond by +25 and heals to full!
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {foodItems.filter(f => selectedCodexNuma.favoriteFoodIds.includes(f.id)).map(food => (
                            <div 
                              key={food.id} 
                              className="text-[9px] bg-amber-950/20 text-amber-300 px-2 py-0.5 rounded border border-amber-900/45 font-mono font-bold flex items-center gap-1"
                              title={`${food.effect} - Value ${food.valaValue}`}
                            >
                              🍎 {food.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ecological Habitation & Behavioral Patterns */}
                  <div className="bg-[#161e17]/60 p-4 rounded-xl border border-[#2d392e]/50 space-y-2">
                    <h5 className="text-[10px] uppercase tracking-[0.15em] font-black text-cyan-400">
                      Ethology & Ecological Observation
                    </h5>
                    <div className="text-[11px] text-[#86a188] leading-relaxed space-y-2">
                      <p>
                        <strong>🏠 Regional habitat:</strong> {selectedCodexNuma.habitat}
                      </p>
                      <p>
                        <strong>💤 Behavioral habits:</strong> {selectedCodexNuma.behavior}
                      </p>
                      <p className="text-[10.5px] bg-[#1a2d1e] text-emerald-450 text-emerald-400/90 p-2 rounded-lg border border-emerald-900/35 leading-tight">
                        <strong>🌳 Niche Role:</strong> {selectedCodexNuma.ecologicalRole}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Habitat Map block */}
                  {(() => {
                    const getIslandMapData = (islandName: string) => {
                      if (islandName === "Lovi Canopy") return { map: MAP_LOVI, id: "lovi", color: "#4c6c4c", name: "Lovi Canopy" };
                      if (islandName === "Koru Basalt") return { map: MAP_KORU, id: "koru", color: "#b91c1c", name: "Koru Basalt" };
                      if (islandName === "Mase Shallows") return { map: MAP_MASE, id: "mase", color: "#0d9488", name: "Mase Shallows" };
                      if (islandName === "Wesa High Lands") return { map: MAP_WESA, id: "wesa", color: "#0284c7", name: "Wesa High Lands" };
                      return { map: MAP_LOVI, id: "lovi", color: "#4c6c4c", name: "Lovi Canopy" };
                    };
                    
                    const islandData = getIslandMapData(selectedCodexNuma.primaryIsland);
                    return (
                      <div className="bg-[#121913] p-4 rounded-xl border border-[#2d392e] flex flex-col items-center">
                        <div className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-2.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 animate-bounce" /> Habitat Map Radar: {islandData.name} Region
                        </div>
                        <div className="grid gap-[1.5px] border-2 border-stone-800 p-1 bg-black/60 rounded-xl max-w-full overflow-x-auto" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                          {islandData.map.map((row, rIdx) => 
                            row.map((cell, cIdx) => {
                              let bgClass = "bg-[#181f19]";
                              let iconSymbol = null;
                              
                              if (cell === 1) bgClass = "bg-emerald-950 border border-emerald-900/35"; // Forest
                              if (cell === 2) bgClass = "bg-blue-950 border border-blue-900/35"; // Water
                              if (cell === 3) bgClass = "bg-orange-950 border border-orange-900/35"; // Lava
                              if (cell === 4) bgClass = "bg-sky-950 border border-sky-900/35"; // Wind
                              if (cell === 7) bgClass = "bg-amber-600/30 border border-amber-600/50"; // Shrine
                              if (cell === 6) bgClass = "bg-yellow-900/10"; // Food Node
                              
                              // Highlight grass spot (cell === 5) as spawn habitats
                              const isSpawnHabitat = cell === 5;
                              if (isSpawnHabitat) {
                                bgClass = "bg-emerald-500 ring-2 ring-yellow-400 animate-pulse scale-95 z-10 flex border border-emerald-400";
                                iconSymbol = "🌾";
                              }
                              if (cell === 7) iconSymbol = "⛩️";
                              
                              return (
                                <div 
                                  key={`${rIdx}-${cIdx}`} 
                                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm transition-all duration-300 ${bgClass} flex items-center justify-center text-[7px]`}
                                  title={isSpawnHabitat ? "Active Spawn Habitat Spot" : `Coordinates: X:${cIdx}, Y:${rIdx}`}
                                >
                                  {iconSymbol}
                                </div>
                              );
                            })
                          )}
                        </div>
                        
                        {/* Map Legend */}
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-3 text-[8px] font-mono text-[#86a188] max-w-md">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-sm bg-[#121913] border border-[#2d392e]" /> Path
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-sm bg-emerald-500 ring-1 ring-yellow-400 flex items-center justify-center text-[6px]">🌾</span> Active Spawn Spot
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-emerald-950" /> Forest Canopy
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-blue-950" /> Sea Lagoon
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-orange-950" /> Basalt Lava
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-sky-950" /> Flute Cliff
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-amber-600/30 flex items-center justify-center text-[6px]">⛩️</span> Shrine
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Evolution Line flow diagram with visual indicators for requirements */}
                  <div className="bg-[#121913] p-4 rounded-xl border border-[#2d392e] space-y-3.5">
                    <h5 className="text-[10px] uppercase tracking-[0.14em] font-black text-rose-400 text-center flex items-center justify-center gap-1 font-mono">
                      🧬 Complete Evolution Line & Requirements Tracer
                    </h5>

                    {(() => {
                      const getEvolutionLine = (num: Numa) => {
                        let current = num;
                        let safety = 0;
                        while (current.evolutionOriginId && safety < 10) {
                          const origin = numaList.find(n => n.id === current.evolutionOriginId);
                          if (!origin) break;
                          current = origin;
                          safety++;
                        }
                        const line: Numa[] = [current];
                        safety = 0;
                        while (current.evolutionTargetId && safety < 10) {
                          const target = numaList.find(n => n.id === current.evolutionTargetId);
                          if (!target) break;
                          line.push(target);
                          current = target;
                          safety++;
                        }
                        return line;
                      };

                      const evoLine = getEvolutionLine(selectedCodexNuma);
                      
                      return (
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 py-2">
                          {evoLine.map((item, idx) => {
                            const isItemDiscovered = discoveredNuma.includes(item.id);
                            const isCurrentSelected = selectedCodexNuma.id === item.id;
                            const activeCompOfItem = activeCompanions.find(c => c.numaId === item.id);
                            
                            return (
                              <React.Fragment key={item.id}>
                                {/* Evolution Card Node */}
                                <div 
                                  onClick={() => {
                                    if (isItemDiscovered) {
                                      playSound('click');
                                      setSelectedCodexNuma(item);
                                    } else {
                                      playSound('click');
                                      showToast("⚠️ Locked: This companion stage has not been discovered yet!");
                                    }
                                  }}
                                  className={`flex-1 p-3.5 rounded-xl border text-center transition-all min-w-[130px] w-full lg:w-auto ${
                                    isCurrentSelected 
                                      ? 'bg-rose-950/25 border-rose-500 ring-2 ring-rose-500/30' 
                                      : isItemDiscovered 
                                        ? 'bg-[#1b261d] border-[#2d392e] hover:border-emerald-500/60 cursor-pointer hover:bg-[#202c21]' 
                                        : 'bg-[#121913]/90 border-[#1c241d]/80 opacity-45'
                                  }`}
                                >
                                  <div className="text-[14px] mb-1">
                                    {isItemDiscovered ? (
                                      (() => {
                                        if (item.class === NumaClass.FOREST) return "🌱";
                                        if (item.class === NumaClass.REEF) return "🪸";
                                        if (item.class === NumaClass.OCEAN) return "🐬";
                                        if (item.class === NumaClass.VOLCANO) return "🔥";
                                        if (item.class === NumaClass.WIND) return "🦅";
                                        if (item.class === NumaClass.CAVE) return "💎";
                                        if (item.class === NumaClass.MARSH) return "🐊";
                                        if (item.class === NumaClass.NIGHT) return "🌌";
                                        if (item.class === NumaClass.ANCIENT) return "🏺";
                                        if (item.class === NumaClass.SPIRIT) return "👻";
                                        return "🐾";
                                      })()
                                    ) : (
                                      "❓"
                                    )}
                                  </div>
                                  
                                  <div className="text-[7.5px] font-mono font-bold text-slate-500 uppercase">
                                    ID {item.id}
                                  </div>
                                  <div className="text-[11px] font-extrabold uppercase text-[#eff6ee] tracking-wide truncate">
                                    {isItemDiscovered ? item.name : "???"}
                                  </div>
                                  <div className="text-[8px] font-bold text-[#86a188] uppercase mt-0.5">
                                    {item.stage} suffix
                                  </div>

                                  {/* User Companion specific indicators */}
                                  {isItemDiscovered && activeCompOfItem ? (
                                    <div className="mt-2 text-[8px] font-mono text-cyan-400 bg-cyan-950/20 p-1 rounded border border-cyan-900/30">
                                      ✊ Partner active<br/>
                                      Bond: <span className="font-extrabold">{activeCompOfItem.bond}/100</span>
                                    </div>
                                  ) : isItemDiscovered && (
                                    <div className="mt-2 text-[7.5px] font-mono text-slate-500 uppercase">
                                      Not in active pack
                                    </div>
                                  )}
                                </div>

                                {/* Arrow & Requirement Indicator (Rendered between nodes) */}
                                {idx < evoLine.length - 1 && (
                                  <div className="flex flex-col items-center justify-center text-center px-1 lg:flex-row lg:gap-2">
                                    {/* Arrow icon */}
                                    <span className="text-xl rotate-90 lg:rotate-0 text-[#2d392e]/80 animate-pulse">
                                      ➔
                                    </span>
                                    
                                    {/* Requirement bubble */}
                                    <div className="bg-[#1b261d]/90 p-2 rounded-lg border border-[#2d392e]/70 text-[8.5px] font-mono max-w-[140px]">
                                      <span className="text-rose-400 block font-bold uppercase tracking-wider text-[7px] mb-0.5">
                                        Requirements
                                      </span>
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-center gap-1 font-bold text-[#eff6ee]">
                                          💚 Trust Level 100
                                        </div>
                                        
                                        {/* Dynamic current progress indicator */}
                                        {(() => {
                                          const prevStageClassComp = activeCompanions.find(c => c.numaId === item.id);
                                          if (prevStageClassComp) {
                                            const ready = prevStageClassComp.bond >= 100;
                                            return (
                                              <div className="pt-0.5 border-t border-[#2d392e] text-[7.5px]">
                                                <span>Active: {prevStageClassComp.bond}/100</span>
                                                <div className={`mt-0.5 font-sans font-bold ${ready ? 'text-emerald-400' : 'text-amber-500'}`}>
                                                  {ready ? "✅ Primed!" : "⏳ Feed dishes!"}
                                                </div>
                                              </div>
                                            );
                                          }
                                          return (
                                            <span className="text-[7px] text-slate-500 uppercase block">
                                              No partner companion
                                            </span>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Back to List row */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        playSound('click');
                        setSelectedCodexNuma(null);
                      }}
                      className="w-full py-2 bg-stone-700 hover:bg-stone-600 border border-stone-800 rounded-xl text-xs uppercase font-mono font-bold tracking-wider text-white text-center"
                    >
                      ◀ Back to Classified Catalog List
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h4 className="text-xs uppercase tracking-[0.2em] font-black text-rose-400">Classified Numa Indexes (Tap to Inspect)</h4>
                    
                    {/* Codex filters */}
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <select
                        value={codexClassFilter}
                        onChange={(e) => setCodexClassFilter(e.target.value)}
                        className="bg-[#1b261d] border border-[#2d392e] text-xs px-2.5 py-1.5 rounded-lg text-[#eff6ee]"
                      >
                        <option value="All">All element types</option>
                        {Object.values(NumaClass).map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                      
                      <div className="relative flex-grow sm:flex-grow-0">
                        <input 
                          type="search"
                          placeholder="Search name/habitat..."
                          value={codexSearch}
                          onChange={(e) => setCodexSearch(e.target.value)}
                          className="w-full bg-[#1b261d] border border-[#2d392e] text-xs px-3 py-1.5 pl-8 rounded-lg text-[#eff6ee] placeholder:text-slate-600"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2.5" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredNuma.map((num) => {
                      const isDiscovered = discoveredNuma.includes(num.id);
                      return (
                        <div 
                          key={num.id} 
                          onClick={() => {
                            if (isDiscovered) {
                              playSound('click');
                              setSelectedCodexNuma(num);
                            } else {
                              playSound('click');
                              showToast("⚠️ Locked: This memory current is undiscovered on your islands!");
                            }
                          }}
                          className={`p-4 rounded-2xl border transition-all ${
                            isDiscovered 
                            ? 'bg-[#1b261d] border-[#2d392e] cursor-pointer hover:border-emerald-500/80 hover:bg-[#202c21] hover:-translate-y-0.5 active:translate-y-0 duration-150' 
                            : 'bg-[#121913] border-[#1d261e] opacity-40 cursor-not-allowed font-mono text-[10px]'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-slate-500">ID {num.id}</span>
                              <h5 className="text-sm font-black uppercase text-[#eff6ee]">
                                {isDiscovered ? num.name : "???"}
                              </h5>
                              <span className="text-[8px] uppercase tracking-wider text-[#86a188] block">
                                {num.class} | {num.stage}
                              </span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xl">{isDiscovered ? (
                                (() => {
                                  if (num.class === NumaClass.FOREST) return "🌱";
                                  if (num.class === NumaClass.REEF) return "🪸";
                                  if (num.class === NumaClass.OCEAN) return "🐬";
                                  if (num.class === NumaClass.VOLCANO) return "🔥";
                                  if (num.class === NumaClass.WIND) return "🦅";
                                  if (num.class === NumaClass.CAVE) return "💎";
                                  if (num.class === NumaClass.MARSH) return "🐊";
                                  if (num.class === NumaClass.NIGHT) return "🌌";
                                  if (num.class === NumaClass.ANCIENT) return "🏺";
                                  if (num.class === NumaClass.SPIRIT) return "👻";
                                  return "🐾";
                                })()
                              ) : "❓"}</span>
                              {isDiscovered && (
                                <span className="text-[7.5px] uppercase font-bold text-emerald-400/90 font-mono">
                                  🔍 Inspect
                                </span>
                              )}
                            </div>
                          </div>

                          {isDiscovered ? (
                            <div className="mt-3 text-[11px] text-[#86a188] leading-tight space-y-1.5">
                              <p><strong>Habitat:</strong> {num.habitat}</p>
                              <p><strong>Behavior:</strong> {num.behavior}</p>
                              <p className="text-[10px] bg-emerald-990/10 text-emerald-400 p-1.5 rounded border border-emerald-900/25">
                                <strong>Ecology:</strong> {num.ecologicalRole}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-600 italic mt-3 font-mono">This memory current remains undiscovered. Search Lovi or other maps to welcome them!</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION B: COMPLETE ORGANIC FOOD PANTRY & THE COOKING SIMULATOR */}
              <div className="space-y-4 pt-6 border-t border-[#2d392e]">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs uppercase tracking-[0.2em] font-black text-amber-500">Volcanic Cooking Hearth</h4>
                  <span className="text-[11px] text-[#86a188]">Combine elements of the 90 Organic Foods</span>
                </div>

                {/* Interactive Cooking Form */}
                <div className="bg-[#1b261d] p-5 rounded-2xl border border-[#2d392e] space-y-4">
                  <p className="text-[11px] text-[#86a188] leading-relaxed">
                    Select one **Staple grain**, one **Foraged herb**, and one **Drink nectar** from your discovered inventory to combine them into an advanced, bond-elevating Prepared Dish!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Staple Grain</label>
                      <select
                        value={cookStapleId}
                        onChange={(e) => setCookStapleId(e.target.value)}
                        className="w-full bg-[#121913] border border-[#2d392e] text-xs px-2 py-1.5 rounded-lg text-[#eff6ee]"
                      >
                        <option value="">Select ingredient</option>
                        {foodItems.filter(f => f.category === FoodCategory.STAPLE).map(f => (
                          <option key={f.id} value={f.id} disabled={(pantryInventory[f.id] || 0) <= 0}>
                            {f.name} (Discovered: {pantryInventory[f.id] || 0})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Foraged Good</label>
                      <select
                        value={cookForageId}
                        onChange={(e) => setCookForageId(e.target.value)}
                        className="w-full bg-[#121913] border border-[#2d392e] text-xs px-2 py-1.5 rounded-lg text-[#eff6ee]"
                      >
                        <option value="">Select ingredient</option>
                        {foodItems.filter(f => f.category === FoodCategory.FORAGED).map(f => (
                          <option key={f.id} value={f.id} disabled={(pantryInventory[f.id] || 0) <= 0}>
                            {f.name} (Discovered: {pantryInventory[f.id] || 0})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Drink/Sap Infusion</label>
                      <select
                        value={cookDrinkId}
                        onChange={(e) => setCookDrinkId(e.target.value)}
                        className="w-full bg-[#121913] border border-[#2d392e] text-xs px-2 py-1.5 rounded-lg text-[#eff6ee]"
                      >
                        <option value="">Select ingredient</option>
                        {foodItems.filter(f => f.category === FoodCategory.DRINK).map(f => (
                          <option key={f.id} value={f.id} disabled={(pantryInventory[f.id] || 0) <= 0}>
                            {f.name} (Discovered: {pantryInventory[f.id] || 0})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleCook}
                    disabled={!cookStapleId || !cookForageId || !cookDrinkId}
                    className="w-full py-2.5 bg-[#4c6c4c] hover:bg-[#5e835e] disabled:opacity-20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Stir Deep Earth Hearth
                  </button>

                  {cookingResult && (
                    <div className="bg-black/20 p-3 rounded-lg text-xs font-mono text-[#eff6ee] border border-[#2d392e]">
                      {cookingResult}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION C: PROTO-LANGUAGE LEARNING CIRCLE */}
              <div className="space-y-4 pt-6 border-t border-[#2d392e]">
                <h4 className="text-xs uppercase tracking-[0.2em] font-black text-indigo-400 flex items-center gap-1.5">
                  <Scroll className="w-4 h-4 text-indigo-400" /> Munu Proto-Language Training
                </h4>
                <p className="text-[11px] text-[#86a188] leading-relaxed">
                  Earn premium Vala shells by practicing traditional translations. Sound phonetics are strictly capped to the certified vowels and consonants!
                </p>

                {/* Mini Quiz Card */}
                <div className="bg-[#1b261d] p-5 rounded-2xl border border-[#2d392e] space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-[#86a188] uppercase tracking-[0.2em] font-mono">Translate this Munu word:</span>
                      <h5 className="text-2xl font-black text-[#eff6ee] uppercase mt-1 tracking-widest">{vocabularyWords[vocabIndex].munuWord}</h5>
                      <p className="text-xs text-[#86a188] italic mt-1 font-mono">Example: "{vocabularyWords[vocabIndex].exampleSentence}"</p>
                    </div>
                    <span className="text-xs bg-[#4c6c4c]/20 text-[#eff6ee] px-2.5 py-1 rounded-full font-bold">Word {vocabIndex + 1}/{vocabularyWords.length}</span>
                  </div>

                  {!vocabFeedback ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Type English Translation (e.g. current, ledger, friendship, sprout)..."
                        value={vocabAnswer}
                        onChange={(e) => setVocabAnswer(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleVocabCheck(vocabularyWords[vocabIndex]); }}
                        className="w-full bg-[#121913] border border-[#2d392e] rounded-xl p-3 text-sm text-[#eff6ee] focus:ring-1 focus:ring-[#4c6c4c] outline-none"
                      />
                      <button
                        onClick={() => handleVocabCheck(vocabularyWords[vocabIndex])}
                        className="w-full py-2 bg-[#4c6c4c] text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-[#5e835e]"
                      >
                        Submit Translation
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
                      <div className="p-3 bg-black/25 rounded-lg text-xs font-mono text-[#eff6ee] border border-[#2d392e]">
                        {vocabFeedback}
                      </div>
                      <button
                        onClick={handleNextVocab}
                        className="w-full py-2 bg-[#d8a45c] text-black font-black rounded-lg text-xs uppercase tracking-wider hover:bg-[#e4b574]"
                      >
                        Next Word →
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: GEMINI AI CIVILIZATION FORGE */}
          {activeTab === 'forge' && (
            <div className="bg-[#161e17] p-6 rounded-3xl border border-[#2d392e] space-y-6 animate-in fade-in duration-300">
              
              <div className="border-b border-[#2d392e] pb-4">
                <h3 className="text-xl font-black text-[#eff6ee] uppercase tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d8a45c] animate-pulse" /> Gemini Civilization Forge
                </h3>
                <p className="text-xs text-[#86a188] font-mono">Generate and expand the live archipelago ecosystem dataset using server-side Gemini 3.5 Flash</p>
              </div>

              {/* MODULE A: GENERATE NEW NUMA CREATURE */}
              <div className="space-y-4 p-5 bg-[#1b261d] rounded-2xl border border-[#2d392e]">
                <h4 className="text-xs uppercase tracking-[0.2em] font-black text-[#eff6ee] flex items-center gap-2">
                  <Dna className="w-4 h-4 text-[#4c6c4c]" /> Numa Memory Synthesizer
                </h4>
                <p className="text-[11px] text-[#86a188] leading-relaxed">
                  Provide an inspiration or physical shape, and the server-side model will generate a fully consistent, phonetically matched, newly discovered Numa with unique stats and GBC color layouts.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Your Creative Inspiration/Idea</label>
                    <textarea
                      placeholder="E.g., A mossy turtle who sleeps in hot water pools, or a cold wind lizard who has feathers..."
                      value={customNumaIdea}
                      onChange={(e) => setCustomNumaIdea(e.target.value)}
                      className="w-full bg-[#121913] border border-[#2d392e] rounded-xl p-3 text-xs text-[#eff6ee] focus:ring-1 focus:ring-[#4c6c4c] outline-none min-h-[70px] placeholder:text-slate-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Biological Element Class</label>
                      <select
                        value={customNumaClass}
                        onChange={(e) => setCustomNumaClass(e.target.value as NumaClass)}
                        className="w-full bg-[#121913] border border-[#2d392e] text-xs px-2 py-2 rounded-lg text-[#eff6ee]"
                      >
                        {Object.values(NumaClass).map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Evolutionary Stage suffix</label>
                      <select
                        value={customNumaStage}
                        onChange={(e) => setCustomNumaStage(e.target.value as EvolutionStage)}
                        className="w-full bg-[#121913] border border-[#2d392e] text-xs px-2 py-2 rounded-lg text-[#eff6ee]"
                      >
                        <option value={EvolutionStage.JUVENILE}>Juvenile (-i suffix)</option>
                        <option value={EvolutionStage.MATURE}>Mature (-ku suffix)</option>
                        <option value={EvolutionStage.ELDER}>Elder (-ma suffix)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleAIGenerateNuma}
                    disabled={isSynthesizing || !customNumaIdea.trim()}
                    className="w-full py-2.5 bg-[#4c6c4c] hover:bg-[#5e835e] disabled:opacity-20 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isSynthesizing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing Island Memory...
                      </>
                    ) : "Synthesize memory companion"}
                  </button>

                  {synthesisError && (
                    <p className="text-[10px] text-amber-500 font-mono italic">{synthesisError}</p>
                  )}
                </div>
              </div>

              {/* MODULE B: ENCODE ANCIENT REGIONAL MYTHS */}
              <div className="space-y-4 p-5 bg-[#1b261d] rounded-2xl border border-[#2d392e]">
                <h4 className="text-xs uppercase tracking-[0.2em] font-black text-[#eff6ee] flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-[#4c6c4c]" /> Ancient Regional Scribe
                </h4>
                <p className="text-[11px] text-[#86a188] leading-relaxed">
                  Compose pristine legends, children's fables, or ritual practices matching local soundscapes. Powered by server-side Gemini 3.5.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Legend Core Theme/Subject</label>
                    <input
                      type="text"
                      placeholder="E.g., The Night Kora Vessel weaved moss, or Suna festival rituals..."
                      value={legendTheme}
                      onChange={(e) => setLegendTheme(e.target.value)}
                      className="w-full bg-[#121913] border border-[#2d392e] rounded-xl p-3 text-xs text-[#eff6ee] focus:ring-1 focus:ring-[#4c6c4c] outline-none placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    onClick={handleAIGenerateLegend}
                    disabled={isScribing || !legendTheme.trim()}
                    className="w-full py-2.5 bg-indigo-900 border border-indigo-700 hover:bg-indigo-800 disabled:opacity-20 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isScribing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Scribing Ancient Scribe...
                      </>
                    ) : "Draft Traditional Legend Scroll"}
                  </button>

                  {scribingError && (
                    <p className="text-[10px] text-amber-500 font-mono italic">{scribingError}</p>
                  )}
                </div>

                {/* List of Custom Legends */}
                <div className="mt-4 space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-[9px] uppercase font-bold text-slate-400">Archived region scrolls:</p>
                  {myLegends.map((leg, li) => (
                    <div key={li} className="p-3.5 bg-black/30 rounded-xl border border-[#2d392e] space-y-1.5 animate-in fade-in duration-300">
                      <div className="flex justify-between text-[10px] text-indigo-400 font-mono">
                        <span>{leg.island}</span>
                        <strong className="uppercase">{leg.title}</strong>
                      </div>
                      <p className="text-xs text-[#86a188] leading-relaxed italic">{leg.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: GBC HARDWARE CONTROL PANEL */}
          {activeTab === 'palette' && (
            <div className="bg-[#161e17] p-6 rounded-3xl border border-[#2d392e] space-y-6 animate-in fade-in duration-300">
              
              <div className="border-b border-[#2d392e] pb-4">
                <h3 className="text-xl font-black text-[#eff6ee] uppercase tracking-tight">Game Boy Hardware Control Room</h3>
                <p className="text-xs text-[#86a188] font-mono">Configure custom, retro Game Boy Color 4-color palettes and synthesizers.</p>
              </div>

              {/* Palette display selector */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-[0.2em] font-black text-[#eff6ee]">4-Color Selective Palettes</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(PALETTES).map(([pId, pal]) => {
                    const isSelected = currentPaletteId === pId;
                    return (
                      <button
                        key={pId}
                        onClick={() => {
                          playSound('beep');
                          setCurrentPaletteId(pId as any);
                        }}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          isSelected 
                          ? 'bg-[#1b261d] border-[#4c6c4c] ring-2 ring-[#4c6c4c]/40' 
                          : 'bg-[#121913] border-[#2d392e] hover:border-[#4c6c4c]'
                        }`}
                      >
                        <div>
                          <h5 className="text-sm font-black text-[#eff6ee] uppercase">{pal.name} Palette</h5>
                          <p className="text-[10px] text-slate-500 mt-0.5">Selective color theme maps</p>
                        </div>

                        {/* Squares representing colors */}
                        <div className="flex gap-1.5 mt-4">
                          <div className="w-6 h-6 rounded border border-black/10" style={{ backgroundColor: pal.bg }} />
                          <div className="w-6 h-6 rounded border border-black/10" style={{ backgroundColor: pal.accent }} />
                          <div className="w-6 h-6 rounded border border-black/10" style={{ backgroundColor: pal.primary }} />
                          <div className="w-6 h-6 rounded border border-black/10" style={{ backgroundColor: pal.dark }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound Synth Tester */}
              <div className="p-5 bg-[#1b261d] rounded-2xl border border-[#2d392e] space-y-4">
                <h4 className="text-xs uppercase tracking-[0.2em] font-black text-[#eff6ee] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#4c6c4c]" /> HTML5 8-Bit Chiptune Soundboard
                </h4>
                <p className="text-[11px] text-[#86a188] leading-relaxed">
                  Trigger raw synthetic waveforms generated directly inside the browser using HTML5 Web Audio oscillators. Simulates 1999 sound cartridge capabilities!
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'beep', label: "D-Pad Footstep", type: 'beep' },
                    { id: 'click', label: "Error Bumping", type: 'click' },
                    { id: 'water', label: "Mase Shallows Swell", type: 'water' },
                    { id: 'spark', label: "Koru Basalt Spark", type: 'spark' },
                    { id: 'success', label: "Arrived / Harvested", type: 'success' },
                    { id: 'evolve', label: "Companion Synthesis", type: 'evolve' }
                  ].map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => playSound(sound.type as any)}
                      className="py-2 px-3 bg-[#121913] hover:bg-[#253227] text-[#eff6ee] rounded-xl border border-[#2d392e] text-[10px] font-mono tracking-wide uppercase transition-colors"
                    >
                      {sound.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Short Intellectual Expansion Slogan Block */}
              <div className="bg-[#1b261d] p-5 rounded-2xl border border-[#2d392e] text-[11px] text-[#86a188] space-y-2 leading-relaxed font-mono">
                <p className="text-white font-bold uppercase tracking-wider text-[10px]">IP Expansion Intent:</p>
                <p>This prototype forms the core cultural dataset representing Mascarene Civilization (Munu Archipelago). Standardized on Game Boy Color constraints, this engine is optimized to feed children's video networks, original comic books, and linguistically cohesive AI language modeling datasets.</p>
              </div>

              {/* Durable Save State Restorer Control */}
              <div className="p-5 bg-[#1b261d] rounded-2xl border border-[#2d392e] space-y-3">
                <h4 className="text-xs uppercase tracking-[0.2em] font-black text-emerald-400">Ledger Memory Management</h4>
                <p className="text-[11px] text-[#86a188] leading-relaxed font-mono">
                  Wipe active state variables to discover Blas's original 9-year-old story in Ravali Quarter, help customers, and activate your first Sana Loop companion! Or do a full sandbox wipe.
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={handleReplayPrologue}
                    className="py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 border border-emerald-950 text-white rounded-xl text-xs font-black transition-all w-full tracking-wider uppercase shadow-md flex items-center justify-center gap-1.5"
                  >
                    ⏩ Play/Replay Retro Prologue Story
                  </button>
                  <button
                    onClick={handleResetProgress}
                    className="py-2 px-4 bg-red-950/20 hover:bg-red-900/40 border border-red-900/50 text-rose-400 rounded-xl text-xs font-bold transition-all w-full tracking-wider uppercase"
                  >
                    Full Reset (Standard Sandbox defaults)
                  </button>
                </div>
              </div>

            </div>
          )}

        </section>

      </main>

      {/* Aesthetic Footer */}
      <footer className="border-t border-[#2d392e] bg-[#121913] py-6 px-4 text-center text-xs text-[#86a188] font-mono select-none">
        <p className="uppercase tracking-widest text-[10px]">© 2026 Mascarene Civilization. All currents aligned.</p>
        <p className="text-slate-600 mt-1 uppercase text-[8px] tracking-[0.2em]">Authentic Cage Fluency-designed standalone prototype</p>
      </footer>
    </div>
  );
}
