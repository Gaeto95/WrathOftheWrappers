import { GAME_CONFIG, EnemyType, UpgradeType, ENEMY_TYPE_NAMES } from './constants';
import { HEAVY_TANK_SPAWN_CHANCE } from './constants';
import { Point, getDistance, normalize, getRandomSpawnPosition } from './collision';
import { CharacterClass, CLASS_CONFIGS, PassiveSkill, PlayerClassState } from '../types/classes';
import { calculateFinalStats, generateRandomSkill, shouldDropSkill } from './skillSystem';
import { useClassAbility, regenerateMana } from './classAbilities';

export interface Player {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  damage: number;
  speed: number;
  fireRate: number;
  lastShot: number;
  invulnerableUntil: number;
  goldMultiplier: number;
  classState: PlayerClassState;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  size: number;
  color: string;
  flashUntil: number;
  goldDrop: { min: number; max: number };
  lastAttack?: number; // For boss attacks
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  size: number;
  isFireball?: boolean;
  piercing?: boolean;
  piercedEnemies?: Set<string>;
  isBossProjectile?: boolean;
  sourceEnemyId?: string;
}

export interface Item {
  id: string;
  type: 'gold' | 'health';
  x: number;
  y: number;
  value: number;
  collected: boolean;
  isMegaBolt?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Upgrades {
  damage: number;
  speed: number;
  health: number;
  fireRate: number;
  goldBonus: number;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  items: Item[];
  particles: Particle[];
  gold: number;
  time: number;
  score: number;
  gameStatus: 'waiting' | 'playing' | 'paused' | 'dead' | 'upgrading' | 'upgrading-dead';
  lastEnemySpawn: number;
  nextDifficultyIncrease: number;
  nextEnemyHealthIncrease: number;
  difficultyMultiplier: number;
  enemyHealthMultiplier: number;
  upgrades: Upgrades;
  screenShake: number;
  camera: { x: number; y: number };
  pendingSkillDrop: PassiveSkill | null;
  screenScale: number;
  enemiesKilled: number;
  lastBossSpawn: number;
  bossPhaseActive: boolean;
  megaBoltFlash: number; // Flash effect timer
  lastBossDefeat: number; // Track when last boss was defeated
  gameStartTime: number; // When the game actually started
}

export function createInitialPlayer(upgrades: Upgrades, characterClass: CharacterClass): Player {
  const classConfig = CLASS_CONFIGS[characterClass];
  
  // Calculate percentage-based upgrades with diminishing returns
  const damageMultiplier = 1 + (upgrades.damage * 0.15) / (1 + upgrades.damage * 0.02);
  const speedMultiplier = 1 + (upgrades.speed * 0.08) / (1 + upgrades.speed * 0.015);
  const healthMultiplier = 1 + (upgrades.health * 0.25) / (1 + upgrades.health * 0.02);
  const fireRateReduction = Math.min(0.75, (upgrades.fireRate * 0.04) / (1 + upgrades.fireRate * 0.05));
  const goldMultiplier = 1 + (upgrades.goldBonus * 0.25) / (1 + upgrades.goldBonus * 0.02);
  
  const basePlayer = {
    x: GAME_CONFIG.CANVAS_WIDTH / 2,
    y: GAME_CONFIG.CANVAS_HEIGHT / 2,
    hp: Math.floor(GAME_CONFIG.PLAYER_MAX_HP * healthMultiplier * classConfig.baseStats.healthModifier),
    maxHp: Math.floor(GAME_CONFIG.PLAYER_MAX_HP * healthMultiplier * classConfig.baseStats.healthModifier),
    damage: Math.floor(GAME_CONFIG.PLAYER_DAMAGE * damageMultiplier * classConfig.baseStats.damageModifier),
    speed: GAME_CONFIG.PLAYER_SPEED * speedMultiplier * classConfig.baseStats.speedModifier,
    fireRate: Math.max(0.08, GAME_CONFIG.PLAYER_FIRE_RATE * (1 - fireRateReduction) * classConfig.baseStats.fireRateModifier),
    lastShot: 0,
    invulnerableUntil: 0,
    goldMultiplier: goldMultiplier,
    classState: {
      selectedClass: characterClass,
      equippedSkills: [],
      lastAbilityUse: 0
    }
  };
  
  // Apply initial skill effects if any skills are equipped
  return calculateFinalStats(basePlayer, basePlayer.classState.equippedSkills);
}

export function createInitialGameState(upgrades: Upgrades, characterClass: CharacterClass): GameState {
  return {
    player: createInitialPlayer(upgrades, characterClass),
    enemies: [],
    projectiles: [],
    items: [],
    particles: [],
    gold: 0,
    time: 0, // This will be set when game actually starts
    score: 0,
    gameStatus: 'playing', // Start in playing state but time won't advance until gameStartTime is set
    lastEnemySpawn: 0,
    nextDifficultyIncrease: GAME_CONFIG.DIFFICULTY_INCREASE_INTERVAL,
    nextEnemyHealthIncrease: GAME_CONFIG.ENEMY_HEALTH_INCREASE_INTERVAL,
    difficultyMultiplier: 1,
    enemyHealthMultiplier: 1,
    upgrades,
    screenShake: 0,
    camera: { x: 0, y: 0 },
    pendingSkillDrop: null,
    screenScale: 1,
    enemiesKilled: 0,
    lastBossSpawn: 0,
    bossPhaseActive: false,
    megaBoltFlash: 0,
    lastBossDefeat: 0,
    gameStartTime: 0 // Track when game actually started
  };
}

export function createEnemy(gameState: GameState): Enemy {
  // Special enemy spawn chances: 5% Heavy Tank, 2% Speeder, 93% normal monsters
  const spawnRoll = Math.random();
  let type: EnemyType;
  
  if (spawnRoll < 0.05) {
    // 5% chance for Heavy Tank
    type = 'HEAVY_TANK';
  } else if (spawnRoll < 0.07) {
    // 2% chance for Speeder (0.05 to 0.07)
    type = 'SPEEDER';
  } else {
    // 93% chance for normal enemies - explicit equal distribution
    const normalTypes = ['GRUNT', 'RUNNER', 'TANK'] as const;
    type = normalTypes[Math.floor(Math.random() * normalTypes.length)];
  }
  
  const config = GAME_CONFIG.ENEMY_TYPES[type];
  const spawnPos = getRandomSpawnPosition(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT, gameState.screenScale);
  
  return {
    id: `enemy_${Date.now()}_${Math.random()}`,
    type,
    x: spawnPos.x,
    y: spawnPos.y,
    hp: config.hp * gameState.enemyHealthMultiplier,
    maxHp: config.hp * gameState.enemyHealthMultiplier,
    speed: config.speed,
    damage: config.damage,
    size: config.size,
    color: config.color,
    flashUntil: 0,
    goldDrop: config.goldDrop,
    lastAttack: 0
  };
}

export function createProjectile(from: Point, to: Point, damage: number, player?: Player): Projectile {
  const direction = normalize({ x: to.x - from.x, y: to.y - from.y });
  
  let speed = GAME_CONFIG.PROJECTILE_SPEED;
  let size = GAME_CONFIG.PROJECTILE_SIZE;
  let piercing = false;
  
  if (player) {
    const classConfig = CLASS_CONFIGS[player.classState.selectedClass];
    speed = classConfig.projectileConfig.speed;
    size = classConfig.projectileConfig.size;
    piercing = classConfig.projectileConfig.piercing || false;
    
    // Check for piercing skills
    const piercingSkill = player.classState.equippedSkills.find(skill => 
      skill.effects.some(effect => effect.type === 'piercing')
    );
    if (piercingSkill) {
      piercing = true;
    }
  }
  
  return {
    id: `projectile_${Date.now()}_${Math.random()}`,
    x: from.x,
    y: from.y,
    vx: direction.x * speed,
    vy: direction.y * speed,
    damage,
    size,
    piercing,
    piercedEnemies: piercing ? new Set() : undefined
  };
}

export function createItem(type: 'gold' | 'health' | 'megabolt', position: Point, value: number): Item {
  return {
    id: `item_${Date.now()}_${Math.random()}`,
    type: type === 'megabolt' ? 'gold' : type, // Display as gold but mark as mega bolt
    x: position.x,
    y: position.y,
    value,
    collected: false,
    isMegaBolt: type === 'megabolt'
  };
}

export function createParticles(position: Point, color: string, count: number = GAME_CONFIG.PARTICLE_COUNT): Particle[] {
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 50 + Math.random() * 100;
    
    particles.push({
      x: position.x,
      y: position.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: GAME_CONFIG.PARTICLE_LIFE,
      maxLife: GAME_CONFIG.PARTICLE_LIFE,
      color,
      size: 3 + Math.random() * 3
    });
  }
  
  return particles;
}

export function findNearestEnemy(player: Player, enemies: Enemy[]): Enemy | null {
  if (enemies.length === 0) return null;
  
  let nearest = enemies[0];
  let nearestDistance = getDistance(player, nearest);
  
  for (let i = 1; i < enemies.length; i++) {
    const distance = getDistance(player, enemies[i]);
    if (distance < nearestDistance) {
      nearest = enemies[i];
      nearestDistance = distance;
    }
  }
  
  return nearest;
}

export function getUpgradeCost(upgradeType: UpgradeType, currentLevel: number): number {
  const costs = GAME_CONFIG.UPGRADE_COSTS[upgradeType];
  return currentLevel < costs.length ? costs[currentLevel] : costs[costs.length - 1] * Math.pow(2, currentLevel - costs.length + 1);
}

export function canAffordUpgrade(gold: number, upgradeType: UpgradeType, currentLevel: number): boolean {
  return gold >= getUpgradeCost(upgradeType, currentLevel);
}

export function getUpgradeDescription(upgradeType: UpgradeType): string {
  switch (upgradeType) {
    case 'DAMAGE':
      return 'Increase damage by 15%';
    case 'SPEED':
      return 'Increase movement speed by 8%';
    case 'HEALTH':
      return 'Increase max health by 25%';
    case 'FIRE_RATE':
      return 'Decrease attack cooldown by 8%';
    case 'GOLD_BONUS':
      return 'Increase gold drops by 25%';
    default:
      return '';
  }
}