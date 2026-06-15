# Mascarene Civilization Enhancement Report

## Overview

This document outlines the major systems added to transform the Mascarene civilization from a creature-collection game into a **living, breathing archipelago** where memory restoration, family bonds, food traditions, migration routes, and living settlements are the core differentiators.

---

## 1. Five Currents System

### Concept
The archipelago is sustained by five primordial currents flowing through all islands. These are not rulers but natural forces that maintain ecological balance.

| Current | Primordial | ID | Role |
| ------- | ---------- | -- | ---- |
| Wind    | Wera       | 146 | Sky currents, flight, high-altitude ecosystems |
| Tide    | Raza       | 147 | Ocean flows, tidal memory, reef guardianship |
| Flame   | Kora       | 148 | Geological heat, clay firing, volcanic foundations |
| Memory  | Sana       | 149 | Historical archives, ancestral knowledge, ledger wisdom |
| Life    | Muna       | 150 | Biological origin, pristine water, birth of all Numa |

### Implementation
- `CurrentType` enum in `types.ts`
- `FIVE_CURRENTS` constant in `mascareneData.ts`
- Each Memory Route strengthens one specific Current
- `currentsBalance` tracked in SanuLedger (0-100 per Current)

### Endgame Vision
When all five Currents reach balance, the **Silent Current** awakens—not as a boss fight, but as the archipelago remembering itself.

---

## 2. Memory Routes System

### Concept
Ancient pathways once used by Numa migrations, traders, storytellers, and food caravans. Over time they became forgotten. The player gradually restores them.

### Visible World Progression
**Before Restoration:**
- Village isolated
- Fewer foods available
- Fewer Numa sightings
- No festivals

**After Restoration:**
- New stalls appear
- New NPCs arrive
- Migration returns
- Festivals restart

### Implementation
```typescript
interface MemoryRoute {
  id: string;
  name: string;
  description: string;
  fromSettlement: string;
  toSettlement: string;
  requiredCurrentType?: CurrentType;
  rewards: {
    vala?: number;
    items?: string[];
    unlocksFestival?: string;
    spawnsNpc?: string[];
  };
  isRestored: boolean;
}
```

### Initial Routes (4)
1. **Ironwood Root Path** (Lovi) - Memory Current
2. **Basalt Terrace Trail** (Koru) - Flame Current
3. **Tidal Reef Walkway** (Mase) - Tide Current
4. **Alpine Wind Passage** (Wesa) - Wind Current

---

## 3. Living Numa Ecology

### Concept
Numa do not spawn randomly. They follow ecological chains with temporal relationships.

### Example Chain (Taki Line)
```
Day 0: Forest Numa Taki appears
Day 3: Forest Fruit (fora-01) blooms
Day 5: Small Wind Numa arrive
Day 10: Rare Elder Takima appears in restored habitat
```

### Implementation
```typescript
export const NUMA_ECOLOGY_CHAINS: Record<string, {
  delayDays: number;
  spawnsAfter: string[];
  condition?: string;
}[]> = {
  "001": [/* Taki chain */],
  "004": [/* Kozui chain */],
  "007": [/* Vanui chain */]
};
```

This makes the world feel alive and rewards patient observation.

---

## 4. Story Circles System

### Concept
Every major settlement has a Story Circle where children gather and elders tell stories. Some stories are true, some are false. The player learns through exploration.

### Story Categories
- **myth** - Traditional legends about Numa and the archipelago
- **migration** - Historical records of Numa movements
- **food** - Culinary traditions and recipes
- **clue** - Hidden hints about game mechanics (reveals clues)

### Implementation
```typescript
interface StoryCircleEntry {
  id: string;
  settlementName: string;
  elderName: string;
  stories: {
    id: string;
    title: string;
    content: string;
    isTrue: boolean; // Some stories are false!
    category: 'myth' | 'migration' | 'food' | 'clue';
    revealedClue?: string;
  }[];
}
```

### Initial Story Circles (4)
1. **Valira Quarter** - Elder Nulu-Va (includes Silent Current legend)
2. **Koru Ash-Dome** - Keeper Raza-Ta (includes false volcano tale)
3. **Mase Drift-Shelter** - Loom-Mother Yo-Ra (includes false pearl story)
4. **Wesa Kite-Cliff** - Wind-Sage Wera-Lo (includes Path Stone clue)

This makes the Sanu Ledger feel meaningful as players verify stories through exploration.

---

## 5. Family Home Ledger (Tabaji Evolution)

### Concept
Blas is 9 years old. Family matters. The player's actions improve their family's Tabaji (food stall), giving emotional grounding.

### Three Stages
| Level | Description | Unlocked Features |
| ----- | ----------- | ----------------- |
| 1 | Tiny Stall | Basic pantry, simple meal service |
| 2 | Expanded Counter | Prepared recipes, festival prep, NPC seating |
| 3 | Major Gathering Place | Festival hosting, Story Circle annex, trade network |

### Implementation
```typescript
interface HomeLedger {
  level: number; // 1-3
  description: string;
  unlockedFeatures: string[];
  tabajiStallUpgrades: string[];
}
```

Progression is tied to:
- Memory Routes restored
- Festivals unlocked
- Stories collected
- Foods discovered

---

## 6. Harmony System (Battle Layer)

### Concept
Replace generic "friendship" with **Harmony**—a thematic bond raised through discovery, festivals, helping settlements, and restoring routes.

### Mechanics
- Range: 0-100 per Numa
- Raised through:
  - Discovering Numa in wild (not catching)
  - Participating in festivals
  - Restoring Memory Routes
  - Helping settlements
- High Harmony unlocks:
  - Alternate moves
  - Special evolutions
  - Combo abilities

### Implementation
Added to Numa interface:
```typescript
interface Numa {
  // ... existing fields
  harmony?: number; // 0-100
  ecologicalLinks?: string[]; // Related Numa or environmental effects
}
```

And companions:
```typescript
activeCompanions: { 
  numaId: string; 
  nickname?: string; 
  bond: number; 
  harmony?: number; // NEW
}[];
```

---

## 7. Wayfarer Loop Mystery (Sana Loop Lore)

### Concept
The Sana Loop necklace is one of several Wayfarer Loops. Each stores memories from previous bearers. As the game progresses, Blas experiences visions.

### Vision Triggers
- Restoring a Memory Route
- Visiting a Story Circle for the first time
- Encountering an extinct Numa habitat
- Unlocking a Path Stone

### Implementation
Tracked in SanuLedger:
```typescript
loopVisions: string[]; // IDs of ancient memories/vision fragments
```

### Narrative Arc
1. Early game: Vague dreams of glowing paths
2. Mid game: Clear visions of ancient festivals
3. Late game: Memories of extinct Numa species
4. Endgame: Understanding the Silent Current

---

## 8. Updated Data Structures

### types.ts Additions
- `CurrentType` enum (Wind, Tide, Flame, Memory, Life)
- `harmony` and `ecologicalLinks` on Numa interface
- `restoredRoutes`, `storyCirclesVisited`, `homeLedgerLevel`, `loopVisions`, `currentsBalance` on SanuLedger
- `MemoryRoute` interface
- `StoryCircleEntry` interface
- `HomeLedger` interface

### mascareneData.ts Additions
- `FIVE_CURRENTS` constant
- `MEMORY_ROUTES` array (4 initial routes)
- `STORY_CIRCLES` array (4 circles with 9 total stories)
- `HOME_LEDGER_PROGRESSION` array (3 levels)
- `NUMA_ECOLOGY_CHAINS` record (chains for Taki, Kozui, Vanui lines)

---

## Prototype Scope (Valira Quarter Demo)

For a minimal viable prototype, focus on:

### Area
- **Valira Quarter** only (Lovi Canopy starting area)

### Systems
- Sana Loop (basic vision trigger)
- Sanu Ledger (tracking discoveries)
- Harmony (simple 0-100 meter)
- Terrain (existing GBC grid)
- Memory Routes (1 route: Ironwood Root Path)

### Creatures
- Taki line (001, 002, 003)
- Kozui line (004, 005, 006)
- Vanui line (007, 008, 009)

### Story Beats
1. Storm arrives, Blas washed ashore
2. Receives Sana Loop from elder
3. Hears first Story Circle tale (Silent Current legend)
4. Discovers first Memory Route fragment
5. Restores Ironwood Root Path
6. First festival returns (Suna Tave)
7. Receives first Path Stone
8. Experiences first Wayfarer Loop vision

### End of Demo
- Family Tabaji at Level 1 → Level 2
- One Memory Route fully restored
- One festival active again
- First vision of ancient Numa migration

---

## Why This Matters

Current creature games focus on:
- Catching monsters
- Battling gyms
- Completing dex

Mascarene differentiates through:
- **Memory restoration** (world heals as you explore)
- **Family bonds** (your home evolves with you)
- **Food traditions** (culinary culture matters)
- **Migration routes** (Numa have ecological relationships)
- **Living settlements** (NPCs return when you restore paths)
- **Storytelling** (knowledge is earned, some tales are false)
- **Harmony over grinding** (bond through cultural participation)
- **Silent Current ending** (restoration, not conquest)

This creates emotional investment in the **civilization itself**, not just the creatures.

---

## Next Steps

1. **UI Components**
   - Memory Route map overlay
   - Story Circle dialog system
   - Home Ledger progression display
   - Harmony meter in battle UI
   - Currents balance visualization

2. **Game Logic**
   - Route restoration mechanics
   - Ecology chain timers
   - Harmony gain events
   - Vision triggers
   - Festival activation

3. **Content Expansion**
   - More Memory Routes (2-3 per island)
   - Additional Story Circles (2 per settlement)
   - Extended ecology chains (all 150 Numa)
   - More visions (10-15 total)

4. **Save System**
   - Persist restored routes
   - Track visited circles
   - Store harmony values
   - Record vision progress

---

## File Changes Summary

### Modified Files
1. `/workspace/types.ts`
   - Added `CurrentType` enum
   - Extended `Numa` interface with `harmony` and `ecologicalLinks`
   - Extended `SanuLedger` with new tracking fields
   - Added `MemoryRoute`, `StoryCircleEntry`, `HomeLedger` interfaces

2. `/workspace/services/mascareneData.ts`
   - Updated imports
   - Added `FIVE_CURRENTS` constant
   - Added `MEMORY_ROUTES` array
   - Added `STORY_CIRCLES` array
   - Added `HOME_LEDGER_PROGRESSION` array
   - Added `NUMA_ECOLOGY_CHAINS` record

### Build Status
✅ TypeScript compilation successful
✅ No type errors
✅ All exports properly typed

---

## Conclusion

These systems transform Mascarene from "Pokémon with different creatures" into a unique experience where **the archipelago itself is a character**. Players emotionally connect with:
- Their family's growing Tabaji
- The return of festivals they helped restore
- The stories they verified through exploration
- The Numa ecologies they observed over time
- The memories flowing through the Sana Loop

This is the foundation worth protecting as the project scales to 150 Numa, multiple islands, and a full RPG.
