// Mascarene GBC-spec 16x11 Matrix Game Engine
// Adheres strictly to the 16x11 grid coordinates and 1999 Game Boy Color core mechanical specification

export enum GbcTileType {
  PATH = 0,
  OBSTACLE_TREES = 1,
  OBSTACLE_AQUATIC = 2,
  OBSTACLE_LAVA = 3,
  OBSTACLE_WINDMILL = 4,
  CURRENT_GRASS = 5,
  HARVEST_PLANT = 6,
  GUARDIAN_SHRINE = 7,
  MEMORY_FRAGMENT = 8
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface MovementResult {
  success: boolean;
  x: number;
  y: number;
  tile: GbcTileType | -1;
  message: string;
}

export interface OverworldEvent {
  type: 'none' | 'encounter' | 'harvest' | 'shrine' | 'fragment' | 'obstacle';
  title?: string;
  description?: string;
  payload?: any;
}

/**
 * Standard 16x11 GBC Viewport Game Engine Utility
 */
export class MunuGameEngine {
  public static readonly GRID_WIDTH = 16;
  public static readonly GRID_HEIGHT = 11;

  /**
   * Evaluates if targeted coordinates are within boundary limits.
   */
  public static isWithinBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.GRID_WIDTH && y >= 0 && y < this.GRID_HEIGHT;
  }

  /**
   * Resolves the GBC tile category code at given state coordinates.
   */
  public static getTileAt(x: number, y: number, map: number[][]): GbcTileType | -1 {
    if (!this.isWithinBounds(x, y)) {
      return -1;
    }
    const row = map[y];
    if (!row) return -1;
    const val = row[x];
    return val !== undefined ? (val as GbcTileType) : -1;
  }

  /**
   * Validates move permissions checking bounds and solid obstacle values (1, 2, 3, 4).
   */
  public static isSolidObstacle(tile: GbcTileType | -1): boolean {
    if (tile === -1) return true;
    return (
      tile === GbcTileType.OBSTACLE_TREES ||
      tile === GbcTileType.OBSTACLE_AQUATIC ||
      tile === GbcTileType.OBSTACLE_LAVA ||
      tile === GbcTileType.OBSTACLE_WINDMILL
    );
  }

  /**
   * Direct coordinate movement solver utilizing boundary constraints and solid layer detection.
   */
  public static solveMove(
    current: Coordinates,
    dx: number,
    dy: number,
    map: number[][]
  ): MovementResult {
    const nextX = current.x + dx;
    const nextY = current.y + dy;

    if (!this.isWithinBounds(nextX, nextY)) {
      return {
        success: false,
        x: current.x,
        y: current.y,
        tile: -1,
        message: "Reached edge of localized Munu Sea!"
      };
    }

    const tile = this.getTileAt(nextX, nextY, map);

    if (this.isSolidObstacle(tile)) {
      let barrier = "Solid block";
      if (tile === GbcTileType.OBSTACLE_TREES) barrier = "Ancient Trees";
      if (tile === GbcTileType.OBSTACLE_AQUATIC) barrier = "Swirling Deep Shallows";
      if (tile === GbcTileType.OBSTACLE_LAVA) barrier = "Fuming Basalt Stream";
      if (tile === GbcTileType.OBSTACLE_WINDMILL) barrier = "Guardian's Boundary Portal";

      return {
        success: false,
        x: current.x,
        y: current.y,
        tile,
        message: `Blocked by ${barrier}!`
      };
    }

    return {
      success: true,
      x: nextX,
      y: nextY,
      tile,
      message: "Moved successfully."
    };
  }

  /**
   * Action dispatcher when entering active overworld grid cells.
   */
  public static dispatchEvent(
    x: number,
    y: number,
    tile: GbcTileType,
    prologueComplete: boolean
  ): OverworldEvent {
    // Prologue mode specific overrides
    if (!prologueComplete) {
      if (tile === GbcTileType.MEMORY_FRAGMENT) {
        return {
          type: 'fragment',
          title: "Memory Scroll Piece",
          description: "A page section glowing with green Sanu ledger memories.",
          payload: { x, y }
        };
      }
      return { type: 'none' };
    }

    // Standard sandbox exploration
    switch (tile) {
      case GbcTileType.CURRENT_GRASS:
        return {
          type: 'encounter',
          title: "Munu Wild Spotting",
          description: "An unstable ecological current sparks! Wild Numa approaches.",
          payload: { x, y }
        };
      case GbcTileType.HARVEST_PLANT:
        return {
          type: 'harvest',
          title: "Ecological Node",
          description: "Wild crop ready for seed-pantry harvesting.",
          payload: { x, y }
        };
      case GbcTileType.GUARDIAN_SHRINE:
        return {
          type: 'shrine',
          title: "Guardian Sanctum",
          description: "Historic shrine dedicated to regional ancient guardians.",
          payload: { x, y }
        };
      default:
        return { type: 'none' };
    }
  }

  /**
   * Simulates classic 1999 GBC relative damage calculation
   */
  public static calculateGbcDamage(
    attackerLvl: number,
    movePower: number,
    attackStat: number,
    defenseStat: number
  ): number {
    // Derived from original retro formulae: Core = ( (2 * Level / 5 + 2) * Attack * Power / Defense ) / 50 + 2
    const levelFactor = (2 * attackerLvl) / 5 + 2;
    const baseNum = levelFactor * attackStat * movePower;
    const defenseFactor = Math.max(1, defenseStat);
    const quotient = baseNum / defenseFactor / 50 + 2;
    const randomMultiplier = 0.85 + Math.random() * 0.15; // 85% to 100% variance
    
    return Math.max(2, Math.floor(quotient * randomMultiplier));
  }

  /**
   * Dynamic level performance scaling calculator for companions
   */
  public static getScaledCompanionStats(
    baseMemory: number,
    baseAttack: number,
    baseDefense: number,
    level: number
  ) {
    const scaleFactor = 1 + 0.12 * (level - 1);
    const maxHp = Math.floor(baseMemory * scaleFactor);
    const attack = Math.floor(baseAttack * scaleFactor);
    const defense = Math.floor(baseDefense * scaleFactor);

    return { maxHp, attack, defense };
  }
}
