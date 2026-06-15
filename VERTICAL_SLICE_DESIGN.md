# 🏝️ MASCARENE CIVILIZATION: VERTICAL SLICE DESIGN DOCUMENT

## The Heart of the Game

> **"The heart of Mascarene Civilization is not the 150 Numa.**  
> **The heart is a 9-year-old child from Valira Quarter helping at a family Tabaji,**  
> **finding a Sana Loop after a storm, and slowly helping an archipelago remember itself."**

---

## ⚠️ CRITICAL ROADMAP ADJUSTMENT

**The roadmap assumes:** "The game is 85% complete."

**Reality:** Technically maybe. Product-wise, **not yet.**

**The biggest risk isn't missing Circle Houses or learnsets.**  
**The biggest risk is:** Mascarene Civilization still doesn't have its equivalent of:

- **Pallet Town** (emotional home)
- **Pikachu** (iconic companion)
- **Professor Oak** (wise mentor)
- **Route 1** (first meaningful journey)

Those four things created emotional attachment **before** players cared about 151 creatures.

---

## 🎯 THREE PILLARS OF THE VERTICAL SLICE

### Pillar 1 — Valira Quarter (The Most Detailed Location)

This should become the most detailed location in the entire game. Right now it's just a name.

**Required Locations:**
| ID | Name | Type | NPCs | Unlock Condition |
|----|------|------|------|------------------|
| `valira_home` | Blas's Family Home | home | Mother, Father, Grandmother | Start |
| `valira_tabaji` | Family Tabaji Stall | tabaji | Customers, Neighbors | Start |
| `valira_story_circle` | Elder's Bench | story_circle | Elder Kavi, Children, Pim | Start |
| `valira_shelter` | Storm Shelter | shelter | Panicked Neighbors | During Storm Event |
| `valira_rooftops` | Rooftop Routes | rooftop | — | After restoring Memory Route |
| `valira_harbor_edge` | Harbor Edge | harbor | Fishers, Traders | Start |

**Players should remember Valira 20 hours later.**

---

### Pillar 2 — The First Hour (Most Critical Sequence)

Most creature RPGs fail here. The first hour must be:

#### Day 1 Script

| Beat | Location | Objective | Narrative | Mechanic Introduced |
|------|----------|-----------|-----------|---------------------|
| `TABAJI_WORK` | valira_tabaji | Help parents serve morning customers | Learn controls by moving food, talking to neighbors, understanding rhythm of Valira | Interaction & Family Tabaji |
| `STORM_STARTS` | valira_harbor_edge | Secure stalls before wind picks up | Sky turns green. Elders shout warnings. World changes dynamically. | Dynamic Weather & NPC Behavior Change |
| `SHELTER_SEQUENCE` | valira_shelter | Wait out storm with neighbors | Stories shared in dark. Hear about 'Silent Current' for first time. | Story Circles (Informal) |
| `DISCOVERY` | valira_rooftops | Find source of glowing light after rain | Storm washed away debris, revealing ancient path marker. Sana Loop warms up. | Sana Loop & Hidden Numa Vision |
| `FIRST_RESTORATION` | valira_rooftops | Clear path and place first Sanu Ledger fragment | You don't fight a boss. You restore a connection. The stone hums. | Memory Routes & Ledger Fragments |
| `FIRST_FESTIVAL` | valira_story_circle | Join small celebration that returns | Lights appear. Rare food cooked. Numa that was hiding now dances openly. | Festival Loop & Harmony |

**This is a complete emotional loop.** Demo ends here.

---

### Pillar 3 — Pim (The Companion, NOT Rival)

The roadmap keeps Pim mostly as Champion. **Wrong approach.**

**Pim should appear immediately:**
- Age 10
- Lives nearby
- Already collecting stories
- Keeps notes
- **Not rival. Not enemy. Not mentor.** A companion exploring the same mystery.

**Players remember people more than mechanics.**

```typescript
export const PIM = {
  id: 'pim',
  name: 'Pim',
  age: 10,
  role: 'Chronicler',
  description: "Always carries a notebook. Asks more questions than she answers.",
  starterNumaId: 'kozui', // She chose Kozui for its curiosity
  relationship: 'companion',
  quotes: {
    intro: "Did you see that? The wind changed direction before the rain started. The Numa know something we don't.",
    storm: "My grandmother says the storm isn't angry. It's... remembering. We should find shelter.",
    discovery: "Look! The Sana Loop reacted to that stone. It's not just jewelry, Blas. It's a key.",
    festival: "I wrote it all down. The song, the food, the way the Numa danced. We can't let this be forgotten again.",
  },
};
```

---

## 🎪 MISSING SYSTEM: FESTIVAL LOOP

This is where the project becomes **unique**.

Current structure: Battle → Explore → Restore (Good)

**Add:** Festival Loop

```
Restore Memory Route
        ↓
   Village celebrates
        ↓
   Rare foods appear
        ↓
   Unique Numa appear
        ↓
   Ledger updates
        ↓
   New routes unlock
```

Now restoration has **visible rewards**.

### First Festival: Festival of Returning Winds

```typescript
{
  id: 'festival_of_returning_winds',
  name: "Festival of Returning Winds",
  triggerRoute: 'ironwood_root_path',
  foods: ['Spiced Wind Wraps', 'Rain-Honey Tea'],
  uniqueNumaSpawns: ['takima_elder', 'breeze_wisp'],
  ledgerUpdate: "Records the first successful migration return in 50 years.",
}
```

---

## 📜 MISSING SYSTEM: LEDGER FRAGMENTS

Instead of: **"Catch 150 creatures."**

Use: **"Memory Fragments"**

| Type | Example | What It Restores |
|------|---------|------------------|
| `recipe` | Grandmother's Rain-Honey Recipe | Family Tabaji Menu |
| `song` | The First Verse of Return | Festival Music |
| `migration` | Fragment of the Wind Path | Ironwood Root Path |
| `story` | Elder's Tale Fragment | Story Circle Archive |
| `navigation` | Tide Chart Fragment | Harbor Access |

**Completion restores parts of civilization.** Much stronger theme.

---

## 🏠 MISSING SYSTEM: FAMILY PROGRESSION

Blas is 9. The Tabaji should evolve.

| Level | Name | Description | Visual Changes | Unlocks |
|-------|------|-------------|----------------|---------|
| 1 | Wooden Stall | Simple setup. Just enough to feed family and neighbors. | Weathered wood, Single pot, Cloth awning | Basic Wraps |
| 2 | Neighborhood Hub | Expanded counter. People sit and talk while they eat. | Stone counter, Two pots, Lanterns, Seating area | Regional Dishes, Story Listening |
| 3 | Regional Gathering Place | A landmark. Traders stop here specifically for the food. | Carved pillars, Multiple stations, Festival decorations | Rare Recipes, Festival Hosting |
| 4 | Festival Center | The heart of Valira. Where the great feasts are held. | Golden accents, Large fire pit, Music stage | Legendary Feasts, Silent Current Rituals |

**Players feel their actions changed home.**

---

## ✅ VERTICAL SLICE CHECKLIST

If these **8 things work**, then:
- 150 Numa becomes **content generation**
- 50 moves becomes **balancing**
- 8 Circle Houses becomes **scaling**

| System | Target | Status |
|--------|--------|--------|
| **Valira Quarter** | Most detailed location in game | 🎯 100% |
| **Sana Loop** | Reveals hidden Numa and memories | 🎯 100% |
| **Starter Lines** | Taki/Kozui/Vanui fully implemented | 🎯 100% |
| **Pim** | Companion chronicler, not rival | 🎯 100% |
| **First Circle House** | Elder Kavi with 9 stories | 🎯 100% |
| **First Festival** | Festival of Returning Winds | 🎯 100% |
| **First Memory Route** | Ironwood Root Path restoration | 🎯 100% |
| **First Ledger Restoration** | Fragment collection and placement | 🎯 100% |

---

## 🚀 WHAT TO BUILD NEXT

**NOT:**
- ❌ 50 moves
- ❌ Elite Four
- ❌ Postgame content

**INSTEAD:**
- ✅ Valira Quarter (100% detail)
- ✅ First Hour Script (polished sequence)
- ✅ Pim integration (companion moments)
- ✅ Festival Loop (visible rewards)
- ✅ Family Tabaji progression (emotional grounding)

---

## 💡 KEY DIFFERENTIATORS

These systems ensure Mascarene is **NOT** "Pokémon with different creatures":

1. **Memory Restoration** — World heals as you explore
2. **Family Bonds** — Your Tabaji evolves with your actions
3. **Food Traditions** — Culinary culture matters mechanically
4. **Migration Routes** — Numa have ecological relationships
5. **Living Settlements** — NPCs return when paths restored
6. **Storytelling** — Knowledge earned, some tales false
7. **Harmony over Grinding** — Bond through cultural participation
8. **Silent Current Ending** — Restoration, not conquest

---

## 📝 IMPLEMENTATION STATUS

All vertical slice data has been added to `/workspace/services/mascareneData.ts`:

- ✅ `VALIRA_QUARTER_LOCATIONS` (6 locations)
- ✅ `PIM` (companion trainer)
- ✅ `DAY_ONE_SCRIPT` (6 story beats)
- ✅ `VALIRA_FIRST_FESTIVAL` (festival event)
- ✅ `STARTING_FRAGMENTS` (3 ledger fragments)
- ✅ `TABAJI_PROGRESSION` (4 stages)
- ✅ `VERTICAL_SLICE_CHECKLIST` (8 items)

Build status: **SUCCESS** ✅

---

## 🎬 FINAL NOTE

Without these 8 systems working perfectly, the project risks becoming:

> **"A technically impressive monster battler instead of a memorable civilization RPG."**

With them, everything else scales naturally:
- 150 Numa → Content pipeline
- Multiple islands → Template replication
- Endgame → Extension of core loops

**Protect the heart. Build the vertical slice. Then scale.**
