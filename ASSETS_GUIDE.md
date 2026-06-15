# Mascarene Civilization - Asset Pipeline Guide

This document provides a complete guide for adding visuals and audio to your GBC-style game.

## Quick Start: Priority Assets

Focus on these assets first for maximum visual impact:

1. **Tile images** (grass, water, sand) - Replaces emoji tiles
2. **Player walk cycle** (4 directions × 2 frames) - Character movement
3. **Starter Numa battle sprites** (Taki, Kozui, Vanui) - Battle screen polish
4. **One ambient music track** - Overworld atmosphere

---

## Directory Structure

```
/public/assets/
├── tiles/          # Terrain tiles (32×32 or 16×16 PNG)
│   ├── grass.png
│   ├── water.png
│   ├── sand.png
│   ├── path.png
│   ├── tree.png
│   ├── volcano.png
│   ├── wind.png
│   ├── berry.png
│   └── shrine.png
├── sprites/        # Character & creature sprites
│   ├── player_down_1.png
│   ├── player_down_2.png
│   ├── player_up_1.png
│   ├── player_up_2.png
│   ├── player_left_1.png
│   ├── player_left_2.png
│   ├── player_right_1.png
│   ├── player_right_2.png
│   ├── taki_front.png
│   ├── kozui_front.png
│   └── vanui_front.png
├── numa/           # Additional creature assets
│   └── [numa-name]_front.png
└── audio/          # Music and sound effects
    ├── overworld_theme.ogg
    ├── battle_theme.ogg
    ├── encounter.ogg
    └── [sfx].wav
```

---

## Where to Get Assets (Legal & Free)

### Pixel Art Tiles & Sprites

| Source | License | Notes |
|--------|---------|-------|
| [OpenGameArt.org](https://opengameart.org/) | Mixed (CC0, CC-BY, GPL) | Search "16x16 RPG tiles" |
| [Kenney.nl](https://kenney.nl/) | CC0 | High-quality, no attribution required |
| [Itch.io](https://itch.io/game-assets/free/tag-pixel-art) | Mixed | Filter by "free" and check licenses |
| [Lospec](https://lospec.com/) | Mixed | Palettes + resources |

### Audio (Music & SFX)

| Source | License | Notes |
|--------|---------|-------|
| [OpenGameArt.org](https://opengameart.org/) | Mixed | Music + SFX sections |
| [Freesound.org](https://freesound.org/) | Mixed | Check individual licenses |
| [FreeMusicArchive.org](https://freemusicarchive.org/) | Mixed | Filter by CC licenses |
| [Bfxr](https://www.bfxr.net/) | Free | Generate 8-bit sound effects |

### Tools for Creating Your Own

| Tool | Cost | Platform | Best For |
|------|------|----------|----------|
| [Aseprite](https://www.aseprite.org/) | $20 | Win/Mac/Linux | Professional pixel art |
| [LibreSprite](https://libresprite.github.io/) | Free | Win/Mac/Linux | Open-source Aseprite fork |
| [Pixelorama](https://pixelorama.org/) | Free | Win/Mac/Linux | Godot-backed editor |
| [Piskel](https://www.piskelapp.com/) | Free | Web | Browser-based pixel art |
| [LMMS](https://lmms.io/) | Free | Win/Mac/Linux | Music production |
| [Audacity](https://www.audacityteam.org/) | Free | Win/Mac/Linux | Audio editing |

---

## Integration Status

### ✅ Completed

- [x] Asset directory structure created (`/public/assets/`)
- [x] Tile image integration in `GameMap.tsx`
- [x] Fallback emoji system (works with or without images)
- [x] README documentation in each asset folder

### 🔄 Next Steps

1. **Add tile images**: Download/create PNG files and place in `/public/assets/tiles/`
2. **Test tile rendering**: Images will automatically replace emojis when available
3. **Add player sprites**: Create walking animation frames
4. **Implement sprite overlay**: Add moving player character on top of grid
5. **Add audio**: Integrate Howler.js for music and sound effects

---

## Code Integration Examples

### Using Tile Images (Already Implemented)

The `GameMap.tsx` component now supports both emoji fallback and custom tile images:

```typescript
// Tile mapping (in GameMap.tsx)
const tileImages: Record<TileType, string> = {
  grass: '/assets/tiles/grass.png',
  water: '/assets/tiles/water.png',
  // ... etc
};

// Renders image background if available, otherwise shows emoji
<div className="relative overflow-hidden">
  {tileImage && (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${tileImage})` }}
    />
  )}
  <span className="relative z-10">{emoji}</span>
</div>
```

### Adding Player Sprite Overlay (Future)

```tsx
{/* Add this after the map div in GameMap.tsx */}
<img
  src={`/assets/sprites/player_${facing}_${frame}.png`}
  className="absolute w-8 h-8 transition-all duration-100 pointer-events-none"
  style={{ 
    left: `${playerX * 32 + 2}px`, 
    top: `${playerY * 32 + 2}px`,
    zIndex: 20
  }}
  alt="Player"
/>
```

### Adding Audio with Howler.js (Future)

```bash
npm install howler
```

```typescript
// In your game component
import { Howl } from 'howler';

const overworldMusic = new Howl({
  src: ['/assets/audio/overworld_theme.ogg'],
  loop: true,
  volume: 0.5,
});

const encounterSound = new Howl({
  src: ['/assets/audio/encounter.ogg'],
  volume: 0.7,
});

// Play sounds
overworldMusic.play();
encounterSound.play();
```

---

## Recommended Palette (Game Boy Style)

For authentic GBC aesthetics, consider using a limited palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Lightest | #9bbc0f | Highlights, light areas |
| Light | #8bac0f | Mid-tones, grass |
| Dark | #306230 | Shadows, outlines |
| Darkest | #0f380f | Deep shadows, black |

[View on Lospec](https://lospec.com/palette-list/gameboy)

---

## Licensing Checklist

Before distributing your game:

- [ ] Document all asset sources in `CREDITS.md`
- [ ] Verify licenses allow your intended use (commercial/non-commercial)
- [ ] Provide attribution where required (CC-BY)
- [ ] Avoid copyrighted material (e.g., official Pokémon sprites)
- [ ] Keep records of download URLs and license terms

---

## Troubleshooting

### Tiles Not Showing

1. Check file paths are correct (`/assets/tiles/grass.png`)
2. Verify PNG files exist in `/public/assets/tiles/`
3. Check browser console for 404 errors
4. Ensure images are not corrupted

### Performance Issues

1. Optimize PNG file sizes (use [TinyPNG](https://tinypng.com/))
2. Use sprite sheets for animations instead of individual frames
3. Limit simultaneous audio tracks

### Audio Not Playing

1. Check browser autoplay policies (user interaction may be required)
2. Verify audio format compatibility (OGG + MP3 for best support)
3. Check volume levels and mute states

---

## Resources & Tutorials

- [Pixel Art Tutorial Series](https://mortmort.com/planning) by MortMort
- [Game Boy Dev Wiki](https://gbdev.io/)
- [Howler.js Documentation](https://github.com/goldfire/howler.js)
- [OpenGameArt Forums](https://opengameart.org/forum) - Ask for asset requests

---

**Need Help?** Post on r/PixelArt, r/INAT, or Discord game dev servers for collaboration opportunities!
