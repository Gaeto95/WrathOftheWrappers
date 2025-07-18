// Game balance and configuration constants
export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  FPS: 60,
  
  // Player settings
  PLAYER_SIZE: 30,
  PLAYER_SPEED: 200, // pixels per second
  PLAYER_MAX_HP: 100,
  PLAYER_DAMAGE: 25,
  PLAYER_FIRE_RATE: 0.5, // seconds between shots
  PLAYER_INVINCIBILITY_TIME: 1000, // milliseconds
  
  // Enemy settings
  ENEMY_SPAWN_RATE: 800, // milliseconds - faster initial spawning for more action
  ENEMY_TYPES: {
    GRUNT: {
      hp: 25,
      speed: 120, // Faster movement
      damage: 15, // reduced damage for longer survival
      size: 25,
      color: '#ff6b6b',
      goldDrop: { min: 15, max: 25 }
    },
    RUNNER: {
      hp: 12,
      speed: 180, // Much faster
      damage: 8, // reduced damage
      size: 20,
      color: '#ff8787',
      goldDrop: { min: 8, max: 18 }
    },
    TANK: {
      hp: 60,
      speed: 70, // Slightly faster
      damage: 25, // reduced damage
      size: 40,
      color: '#ff5252',
      goldDrop: { min: 30, max: 45 }
    },
    HEAVY_TANK: {
      hp: 120, // 2x tank HP
      speed: 140, // 2x tank speed
      damage: 50, // 2x tank damage
      size: 40, // Same size as tank
      color: '#cc0000', // Darker red
      goldDrop: { min: 60, max: 90 } // 2x tank gold
    },
    BOSS: {
      hp: 300, // 5x tank HP (50% reduction)
      speed: 50, // Slower than tank
      damage: 40, // Lower damage
      size: 60, // 50% bigger than tank (40 * 1.5 = 60)
      color: '#800080', // Purple for boss
      goldDrop: { min: 150, max: 225 } // 5x tank gold (adjusted for lower HP)
    }
  },
  
  // Projectile settings
  PROJECTILE_SPEED: 300,
  PROJECTILE_SIZE: 6,
  PROJECTILE_COLOR: '#ffd93d',
  
  // Item settings
  HEALTH_POTION_HEAL: 25,
  HEALTH_POTION_DROP_CHANCE: 0.1,
  GOLD_DROP_CHANCE: 0.8,
  
  // Upgrade costs (exponential scaling)
  UPGRADE_COSTS: {
    DAMAGE: [100, 250, 500, 1000, 2000, 4500, 9000, 18000, 36000, 72000],
    SPEED: [80, 200, 400, 800, 1600, 3600, 7200, 14400, 28800, 57600],
    HEALTH: [120, 300, 600, 1200, 2400, 5400, 10800, 21600, 43200, 86400],
    FIRE_RATE: [150, 375, 750, 1500, 3000, 6750, 13500, 27000, 54000, 108000],
    GOLD_BONUS: [200, 500, 1000, 2000, 4000, 9000, 18000, 36000, 72000, 144000]
  },
  
  // Difficulty scaling
  DIFFICULTY_INCREASE_INTERVAL: 15000, // 15 seconds - back to faster scaling
  SPAWN_RATE_INCREASE: 0.35, // 35% faster spawning - more aggressive
  ENEMY_HEALTH_INCREASE_INTERVAL: 60000, // 60 seconds - much slower health scaling
  ENEMY_HEALTH_INCREASE: 0.4, // 40% more health - more manageable scaling
  
  // Visual effects
  PARTICLE_COUNT: 8,
  PARTICLE_LIFE: 500,
  SCREEN_SHAKE_DURATION: 200,
  SCREEN_SHAKE_INTENSITY: 5,
  
  // Boss spawning
  BOSS_SPAWN_INTERVAL: 60000, // 60 seconds
  
  // Colors
  COLORS: {
    BACKGROUND: '#0a0a0a',
    PLAYER: '#4dabf7',
    HEALTH_BAR: '#ff6b6b',
    HEALTH_BAR_BG: '#333',
    GOLD: '#ffd93d',
    HEALTH_POTION: '#51cf66',
    UI_TEXT: '#ffffff',
    UI_BACKGROUND: 'rgba(0, 0, 0, 0.7)'
  }
};

export type EnemyType = keyof typeof GAME_CONFIG.ENEMY_TYPES;
export type UpgradeType = keyof typeof GAME_CONFIG.UPGRADE_COSTS;

export const ENEMY_TYPE_NAMES: EnemyType[] = ['GRUNT', 'RUNNER', 'TANK'];
export const HEAVY_TANK_SPAWN_CHANCE = 0.05; // 5% chance
export const UPGRADE_TYPE_NAMES: UpgradeType[] = ['DAMAGE', 'SPEED', 'HEALTH', 'FIRE_RATE', 'GOLD_BONUS'];