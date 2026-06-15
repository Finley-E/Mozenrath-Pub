# Tile Assets Directory

Place your 16×16 or 32×32 pixel tile PNGs here.

## Required Tiles (Priority 1)

- `grass.png` - Grass terrain
- `water.png` - Water/ocean terrain
- `sand.png` - Sand/beach terrain
- `path.png` - Dirt path (replaces 🟫)
- `tree.png` - Tree obstacle (replaces 🌳)
- `volcano.png` - Volcanic terrain (replaces 🌋)
- `wind.png` - Windy terrain (replaces 💨)
- `berry.png` - Berry bush (replaces 🍒)
- `shrine.png` - Shrine landmark (replaces ⛩️)

## Recommended Specifications

- **Size**: 32×32 pixels (or 16×16 for smaller tiles)
- **Format**: PNG with transparency
- **Palette**: Game Boy inspired (optional)
  - Light: #9bbc0f
  - Medium-light: #8bac0f
  - Medium-dark: #306230
  - Dark: #0f380f

## Where to Get Free Tiles

- [OpenGameArt.org](https://opengameart.org/) - Search "16x16 RPG tiles"
- [Kenney.nl](https://kenney.nl/) - CC0 asset packs
- [Itch.io](https://itch.io/game-assets/free/tag-pixel-art) - Free pixel art packs
- [Lospec](https://lospec.com/palette-list/tags/gameboy) - Palettes and resources

## Integration

Once you add tile images, update `src/components/GameMap.tsx` to use background images instead of emojis.
