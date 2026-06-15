# Audio Assets Directory

Place your music and sound effect files here.

## Required Audio (Priority 1)

### Music Tracks
- `overworld_theme.ogg` or `overworld_theme.mp3` - Main exploration music (looping)
- `battle_theme.ogg` or `battle_theme.mp3` - Battle background music (looping)

### Sound Effects
- `encounter.wav` or `encounter.ogg` - Wild Numa encounter alarm
- `critical_hit.wav` - Critical hit sound
- `attack_basic.wav` - Basic attack sound
- `heal.wav` - Healing/restore sound

## Optional Audio (Future Polish)

### Creature Sounds
- `taki_cry.wav` - Forest starter cry
- `kozui_cry.wav` - Reef/Ocean starter cry
- `vanui_cry.wav` - Volcano starter cry

### UI Sounds
- `menu_select.wav` - Menu navigation click
- `menu_confirm.wav` - Selection confirmation
- `step_grass.wav` - Walking on grass (optional, can be repetitive)

### Environmental Sounds
- `water_ambient.ogg` - Ocean/water ambient loop
- `wind_ambient.ogg` - Windy area ambient
- `volcano_ambient.ogg` - Volcanic area rumble

## Audio Specifications

### Music
- **Format**: OGG (preferred for web) or MP3
- **Length**: 60-120 seconds (loopable)
- **Style**: Chiptune/Game Boy inspired (4-channel limitation optional)
- **Volume**: Normalized to -14 LUFS for consistency

### Sound Effects
- **Format**: WAV or OGG
- **Length**: Under 2 seconds
- **Sample Rate**: 22050 Hz or 44100 Hz
- **Bit Depth**: 16-bit

## Where to Get Free Audio

### Music
- [OpenGameArt.org](https://opengameart.org/) - Search "chiptune" or "RPG music"
- [FreeMusicArchive.org](https://freemusicarchive.org/) - Filter by CC licenses
- [Incompetech](https://incompetech.com/music/) - Kevin MacLeod (CC-BY)
- [Bandcamp](https://bandcamp.com/tag/chiptune) - Many artists offer free downloads

### Sound Effects
- [Freesound.org](https://freesound.org/) - Huge library (check licenses)
- [OpenGameArt.org](https://opengameart.org/) - Sound effects section
- [Kenney.nl](https://kenney.nl/sounds) - CC0 sound packs
- [Bfxr](https://www.bfxr.net/) - Generate 8-bit sound effects

## Tools for Creating Audio

### Music Creation
- **LMMS** (Free) - Full DAW with chiptune capabilities
- **Bosca Ceoil** (Free) - Simple chiptune composer
- **Famitracker** (Free) - NES-style music tracker
- **DefleMask** (Free) - Multi-platform chiptune tracker

### Sound Effect Generation
- **Bfxr** (Web/Download) - 8-bit SFX generator
- **ChipTone** (Paid) - Professional chiptune SFX
- **Audacity** (Free) - Audio editing and processing

## Integration Example

```typescript
import { Howl } from 'howler';

// Background music (loops automatically)
const overworldMusic = new Howl({
  src: ['/assets/audio/overworld_theme.ogg'],
  loop: true,
  volume: 0.5,
});

// Sound effects
const encounterSound = new Howl({
  src: ['/assets/audio/encounter.ogg'],
  volume: 0.7,
});

// Play sounds
overworldMusic.play();
encounterSound.play();
```

## Licensing Notes

⚠️ **Important**: Always check the license before using audio assets:
- **CC0**: Free to use, no attribution required
- **CC-BY**: Free to use, must credit the artist
- **CC-BY-SA**: Free to use, must credit + share alike
- **Non-commercial**: Cannot use in commercial projects

Document all audio sources in a `CREDITS.md` file.
