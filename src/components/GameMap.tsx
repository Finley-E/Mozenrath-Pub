import React from 'react';
import { Numa, NumaClass } from '../types';

interface GameMapProps {
  map: number[][];
  playerX: number;
  playerY: number;
  playerCompanion: Numa | null;
  onWalk: (dx: number, dy: number) => void;
  islandName: string;
}

// Tile type mapping from number to asset key
type TileType = 'path' | 'tree' | 'water' | 'volcano' | 'wind' | 'grass' | 'berry' | 'shrine';

const tileImages: Record<TileType, string> = {
  path: '/assets/tiles/path.png',
  tree: '/assets/tiles/tree.png',
  water: '/assets/tiles/water.png',
  volcano: '/assets/tiles/volcano.png',
  wind: '/assets/tiles/wind.png',
  grass: '/assets/tiles/grass.png',
  berry: '/assets/tiles/berry.png',
  shrine: '/assets/tiles/shrine.png',
};

// Fallback emojis if images fail to load or aren't available yet
const tileEmojis: Record<number, string> = {
  0: '🟫', // path
  1: '🌳', // tree
  2: '🌊', // water
  3: '🌋', // volcano
  4: '💨', // wind
  5: '🌿', // grass
  6: '🍒', // berry
  7: '⛩️'  // shrine
};

const numToTileType: Record<number, TileType> = {
  0: 'path',
  1: 'tree',
  2: 'water',
  3: 'volcano',
  4: 'wind',
  5: 'grass',
  6: 'berry',
  7: 'shrine',
};

export const GameMap: React.FC<GameMapProps> = ({
  map,
  playerX,
  playerY,
  playerCompanion,
  onWalk,
  islandName
}) => {
  const getTileEmoji = (tile: number) => {
    return tileEmojis[tile] || '❓';
  };

  const getCompanionEmoji = (numaClass: NumaClass) => {
    const emojis: Record<NumaClass, string> = {
      [NumaClass.FOREST]: '🌱',
      [NumaClass.REEF]: '🪸',
      [NumaClass.OCEAN]: '🐬',
      [NumaClass.VOLCANO]: '🔥',
      [NumaClass.WIND]: '🦅',
      [NumaClass.CAVE]: '💎',
      [NumaClass.MARSH]: '🐊',
      [NumaClass.NIGHT]: '🌌',
      [NumaClass.ANCIENT]: '🏺',
      [NumaClass.SPIRIT]: '👻'
    };
    return emojis[numaClass] || '🐾';
  };

  return (
    <div className="space-y-4">
      {/* Map Display */}
      <div className="border-4 border-[#4c6c4c] rounded-lg overflow-hidden bg-[#e0ffd1] p-2">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${map[0].length}, minmax(0, 1fr))` }}>
          {map.map((row, y) =>
            row.map((tile, x) => {
              const tileType = numToTileType[tile];
              const tileImage = tileType ? tileImages[tileType] : null;
              
              return (
                <div
                  key={`${x}-${y}`}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-lg md:text-2xl border border-black/10 hover:bg-white/30 transition-colors cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    if (x > playerX) onWalk(1, 0);
                    else if (x < playerX) onWalk(-1, 0);
                    else if (y > playerY) onWalk(0, 1);
                    else if (y < playerY) onWalk(0, -1);
                  }}
                >
                  {/* Tile background image (if available) */}
                  {tileImage && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${tileImage})` }}
                    />
                  )}
                  
                  {/* Emoji fallback (visible if no image or on top for debugging) */}
                  <span className="relative z-10">
                    {playerX === x && playerY === y ? '🚶' : getTileEmoji(tile)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#161e17] border-2 border-[#2d392e] rounded-lg p-4 space-y-2">
        <p className="text-[#eff6ee] font-bold uppercase tracking-wider text-sm">
          📍 {islandName}
        </p>
        {playerCompanion && (
          <div className="flex items-center justify-between text-xs text-[#86a188]">
            <span>{getCompanionEmoji(playerCompanion.class)} {playerCompanion.name}</span>
            <span>Following</span>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onWalk(0, -1)}
            className="flex-1 bg-[#4c6c4c] hover:bg-[#5e835e] text-white p-2 rounded text-sm font-bold transition-colors"
          >
            ⬆️
          </button>
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => onWalk(-1, 0)}
              className="flex-1 bg-[#4c6c4c] hover:bg-[#5e835e] text-white p-2 rounded text-sm font-bold transition-colors"
            >
              ⬅️
            </button>
            <button
              onClick={() => onWalk(1, 0)}
              className="flex-1 bg-[#4c6c4c] hover:bg-[#5e835e] text-white p-2 rounded text-sm font-bold transition-colors"
            >
              ➡️
            </button>
          </div>
          <button
            onClick={() => onWalk(0, 1)}
            className="flex-1 bg-[#4c6c4c] hover:bg-[#5e835e] text-white p-2 rounded text-sm font-bold transition-colors"
          >
            ⬇️
          </button>
        </div>
      </div>
    </div>
  );
};
