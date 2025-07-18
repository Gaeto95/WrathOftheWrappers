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
  PLAYER_FIRE_RATE: 0.3, // seconds between shots - faster starting fire rate
  PLAYER_INVINCIBILITY_TIME: 1000, // milliseconds
  
  // Enemy settings
  ENEMY_SPAWN_RATE: 1200, // milliseconds - slower spawning for better balance
  ENEMY_TYPES: {
    GRUNT: {
      hp: 20,
      speed: 80,
      damage: 20, // doubled damage
      size: 25,
      color: '#ff6b6b',
      goldDrop: { min: 10, max: 20 }
    },
    RUNNER: {
      hp: 10,
      speed: 150,
      damage: 12, // more than doubled damage
      size: 20,
      color: '#ff8787',
      goldDrop: { min: 5, max: 15 }
    },
    TANK: {
      hp: 50,
      speed: 50,
      damage: 35, // much higher damage
      size: 40,
      color: '#ff5252',
      goldDrop: { min: 20, max: 30 }
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
    DAMAGE: [50, 100, 200, 400, 800, 1600, 3200, 6400],
    SPEED: [30, 60, 120, 240, 480, 960, 1920, 3840],
    HEALTH: [40, 80, 160, 320, 640, 1280, 2560, 5120],
    FIRE_RATE: [60, 120, 240, 480, 960, 1920, 3840, 7680],
    GOLD_BONUS: [100, 200, 400, 800, 1600, 3200, 6400, 12800]
  },
  
  // Difficulty scaling
  DIFFICULTY_INCREASE_INTERVAL: 15000, // 15 seconds - even slower difficulty scaling
  SPAWN_RATE_INCREASE: 0.3, // 30% faster spawning - less aggressive
  ENEMY_HEALTH_INCREASE_INTERVAL: 45000, // 45 seconds - slower health scaling
  ENEMY_HEALTH_INCREASE: 0.5, // 50% more health - much tankier enemies
  
  // Visual effects
  PARTICLE_COUNT: 8,
  PARTICLE_LIFE: 500,
  SCREEN_SHAKE_DURATION: 200,
  SCREEN_SHAKE_INTENSITY: 5,
  
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
export const UPGRADE_TYPE_NAMES: UpgradeType[] = ['DAMAGE', 'SPEED', 'HEALTH', 'FIRE_RATE', 'GOLD_BONUS'];