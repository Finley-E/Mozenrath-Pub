# Sprite Assets Directory

Place your character and creature sprite PNGs here.

## Player Sprites (Priority 1)

Create a walking cycle with 4 directions × 2-4 frames each:

- `player_down_1.png`, `player_down_2.png` - Walking down
- `player_up_1.png`, `player_up_2.png` - Walking up
- `player_left_1.png`, `player_left_2.png` - Walking left
- `player_right_1.png`, `player_right_2.png` - Walking right

**Specifications:**
- Size: 32×32 pixels (or match tile size)
- Format: PNG with transparency
- Style: Consistent pixel art, 4-directional

## Numa (Creature) Sprites

### Front Battle Sprites (Priority 2)
- `taki_front.png` - Forest starter
- `kozui_front.png` - Reef/Ocean starter
- `vanui_front.png` - Volcano starter

### Back Battle Sprites (Optional)
- `taki_back.png`
- `kozui_back.png`
- `vanui_back.png`

### Icons (for UI)
- `taki_icon.png` (16×16 or 24×24)
- `kozui_icon.png`
- `vanui_icon.png`

**Battle Sprite Specifications:**
- Front: 56×56 pixels (Pokémon-style)
- Back: 48×48 pixels (optional)
- Icon: 16×16 or 24×24 pixels
- Format: PNG with transparency

## NPC Sprites (Future)

- `npc_idle.png` - Stationary NPCs
- `npc_walk_*.png` - Walking cycles

## Where to Get Free Sprites

- [OpenGameArt.org](https://opengameart.org/) - Search "RPG character sprites"
- [Kenney.nl](https://kenney.nl/) - Character packs
- [Itch.io](https://itch.io/game-assets/free/tag-character) - Free character sprites
- [Craftpix.net](https://craftpix.net/freebies/) - Free game assets

## Tools for Creating Sprites

- **Aseprite** ($20) - Professional pixel art tool
- **LibreSprite** (Free) - Open-source Aseprite fork
- **Pixelorama** (Free) - Godot-backed pixel art editor
- **Piskel** (Free web version) - Browser-based pixel art

## Animation Tips

For a basic walk cycle:
1. Frame 1: Both feet on ground (neutral)
2. Frame 2: One foot forward, body slightly up
3. Repeat/alternate for smooth animation

Use CSS or JavaScript to swap frames at 8-12 FPS for walking animation.
