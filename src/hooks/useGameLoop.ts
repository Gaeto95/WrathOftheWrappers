import { useRef, useEffect, useCallback } from 'react';
import { GameState, createEnemy, createProjectile, createItem, createParticles, findNearestEnemy } from '../utils/gameLogic';
import { circleToCircle, circleToCircleWithRadius, isOffScreen, getDistance, normalize } from '../utils/collision';
import { GAME_CONFIG } from '../utils/constants';
import { InputState } from './useInput';
import { applySkillEffects, generateRandomSkill, shouldDropSkill } from '../utils/skillSystem';
import { useClassAbility, regenerateMana } from '../utils/classAbilities';

export function useGameLoop(
  gameState: GameState,
  setGameState: (updater: (prev: GameState) => GameState) => void,
  input: InputState
) {
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  const gameLoop = useCallback((currentTime: number) => {
    // Only update deltaTime if game is actually playing
    if (gameState.gameStatus !== 'playing') {
      lastTimeRef.current = currentTime;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    setGameState(prevState => updateGameState(prevState, deltaTime, input));

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.gameStatus, setGameState, input]);

  useEffect(() => {
    // Always run the game loop, but it will only update when status is 'playing'
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, gameState.gameStatus]);

  // Handle escape key for pause
  useEffect(() => {
    if (input.escape && gameState.gameStatus === 'playing') {
      setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
    }
  }, [input.escape, gameState.gameStatus, setGameState]);
}

function updateGameState(state: GameState, deltaTime: number, input: InputState): GameState {
  const dt = deltaTime / 1000; // Convert to seconds
  
  // Update time
  const newTime = state.time + deltaTime;
  
  // Update player
  let player = { ...state.player };
  
  // Apply skill effects to player stats
  player = applySkillEffects(player, player.classState.equippedSkills);
  
  // Update player position
  let dx = 0;
  let dy = 0;
  
  if (input.up) dy -= 1;
  if (input.down) dy += 1;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  
  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }
  
  player.x += dx * player.speed * dt;
  player.y += dy * player.speed * dt;
  
  // Keep player in bounds - adjust for screen scale
  const effectiveWidth = GAME_CONFIG.CANVAS_WIDTH / state.screenScale;
  const effectiveHeight = GAME_CONFIG.CANVAS_HEIGHT / state.screenScale;
  const centerOffsetX = (effectiveWidth - GAME_CONFIG.CANVAS_WIDTH) / 2;
  const centerOffsetY = (effectiveHeight - GAME_CONFIG.CANVAS_HEIGHT) / 2;
  
  player.x = Math.max(
    GAME_CONFIG.PLAYER_SIZE / 2 - centerOffsetX, 
    Math.min(effectiveWidth - GAME_CONFIG.PLAYER_SIZE / 2 - centerOffsetX, player.x)
  );
  player.y = Math.max(
    GAME_CONFIG.PLAYER_SIZE / 2 - centerOffsetY, 
    Math.min(effectiveHeight - GAME_CONFIG.PLAYER_SIZE / 2 - centerOffsetY, player.y)
  );
  
  // Update enemies
  const enemies = state.enemies.map(enemy => {
    const direction = normalize({ x: player.x - enemy.x, y: player.y - enemy.y });
    return {
      ...enemy,
      x: enemy.x + direction.x * enemy.speed * dt,
      y: enemy.y + direction.y * enemy.speed * dt,
      flashUntil: Math.max(0, enemy.flashUntil - deltaTime)
    };
  });
  
  // Update projectiles
  const projectiles = state.projectiles
    .map(projectile => ({
      ...projectile,
      x: projectile.x + projectile.vx * dt,
      y: projectile.y + projectile.vy * dt
    }))
    .filter(projectile => !isOffScreen(projectile, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT));
  
  // Update particles
  const particles = state.particles
    .map(particle => ({
      ...particle,
      x: particle.x + particle.vx * dt,
      y: particle.y + particle.vy * dt,
      life: particle.life - deltaTime
    }))
    .filter(particle => particle.life > 0);
  
  // Auto-attack
  const nearestEnemy = findNearestEnemy(player, enemies);
  if (nearestEnemy && newTime - player.lastShot > player.fireRate * 1000) {
    const newProjectile = createProjectile(player, nearestEnemy, player.damage, player);
    projectiles.push(newProjectile);
    player.lastShot = newTime;
  }
  
  // Use class abilities
  const abilityResult = useClassAbility(player, enemies, newTime);
  if (abilityResult) {
    if (abilityResult.projectiles) {
      projectiles.push(...abilityResult.projectiles);
    }
    if (abilityResult.particles) {
      particles.push(...abilityResult.particles);
    }
    if (abilityResult.cooldown) {
      player.classState.lastAbilityUse = newTime;
    }
  }
  
  // Check projectile-enemy collisions
  const hitEnemies = new Set<string>();
  let totalEnemiesKilled = 0;
  const newProjectiles = projectiles.filter(projectile => {
    let shouldRemoveProjectile = false;
    
    for (const enemy of enemies) {
      // Skip if enemy already hit by non-piercing projectile
      if (!projectile.piercing && hitEnemies.has(enemy.id)) continue;
      
      // Skip if piercing projectile already hit this enemy
      if (projectile.piercing && projectile.piercedEnemies?.has(enemy.id)) continue;
      
      const collision = circleToCircle(
        { x: projectile.x, y: projectile.y, radius: projectile.size },
        { x: enemy.x, y: enemy.y, radius: enemy.size }
      );
      
      if (collision) {
        if (projectile.piercing) {
          projectile.piercedEnemies?.add(enemy.id);
        } else {
          hitEnemies.add(enemy.id);
          shouldRemoveProjectile = true;
        }
        
        enemy.hp -= projectile.damage;
        enemy.flashUntil = newTime + 200;
        
        // Create hit particles
        particles.push(...createParticles({ x: enemy.x, y: enemy.y }, enemy.color, 4));
        
        // Break after first hit for non-piercing projectiles
        if (!projectile.piercing) {
          break;
        }
      }
    }
    
    return !shouldRemoveProjectile;
  });
  
  // Remove dead enemies and create items
  const items = [...state.items];
  let pendingSkillDrop = state.pendingSkillDrop;
  let enemiesKilled = state.enemiesKilled;
  const aliveEnemies = enemies.filter(enemy => {
    if (enemy.hp <= 0) {
      totalEnemiesKilled++;
      enemiesKilled++;
      
      // Create death particles
      particles.push(...createParticles({ x: enemy.x, y: enemy.y }, enemy.color, 8));
      
      // Drop either gold OR health potion, not both
      const dropRoll = Math.random();
      if (dropRoll < GAME_CONFIG.HEALTH_POTION_DROP_CHANCE) {
        // Drop health potion (higher priority)
        items.push(createItem('health', { x: enemy.x, y: enemy.y }, GAME_CONFIG.HEALTH_POTION_HEAL));
      } else if (dropRoll < GAME_CONFIG.GOLD_DROP_CHANCE + GAME_CONFIG.HEALTH_POTION_DROP_CHANCE) {
        // Drop gold
        const goldAmount = Math.floor(
          (enemy.goldDrop.min + Math.random() * (enemy.goldDrop.max - enemy.goldDrop.min)) * 
          player.goldMultiplier
        );
        items.push(createItem('gold', { x: enemy.x, y: enemy.y }, goldAmount));
      }
      
      // Check for skill drop
      if (!pendingSkillDrop && shouldDropSkill(totalEnemiesKilled)) {
        pendingSkillDrop = generateRandomSkill();
      }
      
      return false;
    }
    return true;
  });
  
  // Check player-enemy collisions
  let screenShake = Math.max(0, state.screenShake - deltaTime);
  if (newTime > player.invulnerableUntil) {
    for (const enemy of aliveEnemies) {
      const collision = circleToCircle(
        { x: player.x, y: player.y, radius: GAME_CONFIG.PLAYER_SIZE / 2 },
        { x: enemy.x, y: enemy.y, radius: enemy.size }
      );
      
      if (collision) {
        player.hp -= enemy.damage;
        player.invulnerableUntil = newTime + GAME_CONFIG.PLAYER_INVINCIBILITY_TIME;
        screenShake = GAME_CONFIG.SCREEN_SHAKE_DURATION;
        
        // Play damage sound effect
        const damageAudio = new Audio('/damage-sound.mp3');
        damageAudio.volume = 0.06; // 6% volume (70% lower than 20%)
        damageAudio.play().catch(e => console.log('Damage sound failed to play:', e));
        
        // Create hit particles
        particles.push(...createParticles({ x: player.x, y: player.y }, GAME_CONFIG.COLORS.PLAYER, 6));
        
        if (player.hp <= 0) {
          return {
            ...state,
            player,
            gameStatus: 'dead',
            score: Math.floor(newTime / 1000)
          };
        }
        break;
      }
    }
  }
  
  // Check player-item collisions
  let gold = state.gold;
  const uncollectedItems = items.filter(item => {
    // Base collection radius
    let itemRadius = item.type === 'gold' ? 40 : 25;
    
    // Apply magnet skill bonus
    const magnetBonus = (player as any).magnetRadius || 0;
    itemRadius += magnetBonus;
    
    const collision = circleToCircleWithRadius(
      { x: player.x, y: player.y, radius: GAME_CONFIG.PLAYER_SIZE / 2 },
      { x: item.x, y: item.y, radius: itemRadius },
      itemRadius
    );
    
    if (collision) {
      if (item.type === 'gold') {
        gold += item.value;
      } else if (item.type === 'health') {
        player.hp = Math.min(player.maxHp, player.hp + item.value);
      }
      
      // Create collection particles
      const color = item.type === 'gold' ? GAME_CONFIG.COLORS.GOLD : GAME_CONFIG.COLORS.HEALTH_POTION;
      particles.push(...createParticles({ x: item.x, y: item.y }, color, 6));
      
      return false;
    }
    return true;
  });
  
  // Spawn enemies
  let lastEnemySpawn = state.lastEnemySpawn;
  const spawnRate = GAME_CONFIG.ENEMY_SPAWN_RATE / state.difficultyMultiplier;
  if (newTime - lastEnemySpawn > spawnRate) {
    aliveEnemies.push(createEnemy(state));
    lastEnemySpawn = newTime;
  }
  
  // Update difficulty
  let difficultyMultiplier = state.difficultyMultiplier;
  let nextDifficultyIncrease = state.nextDifficultyIncrease;
  if (newTime >= nextDifficultyIncrease) {
    difficultyMultiplier *= (1 + GAME_CONFIG.SPAWN_RATE_INCREASE);
    nextDifficultyIncrease += GAME_CONFIG.DIFFICULTY_INCREASE_INTERVAL;
  }
  
  let enemyHealthMultiplier = state.enemyHealthMultiplier;
  let nextEnemyHealthIncrease = state.nextEnemyHealthIncrease;
  if (newTime >= nextEnemyHealthIncrease) {
    enemyHealthMultiplier *= (1 + GAME_CONFIG.ENEMY_HEALTH_INCREASE);
    nextEnemyHealthIncrease += GAME_CONFIG.ENEMY_HEALTH_INCREASE_INTERVAL;
  }
  
  // Update camera shake
  const camera = {
    x: screenShake > 0 ? (Math.random() - 0.5) * GAME_CONFIG.SCREEN_SHAKE_INTENSITY : 0,
    y: screenShake > 0 ? (Math.random() - 0.5) * GAME_CONFIG.SCREEN_SHAKE_INTENSITY : 0
  };
  
  // Screen scaling at 60 seconds
  let screenScale = state.screenScale;
  if (newTime >= 60000 && screenScale === 1) { // 60 seconds
    screenScale = 0.8; // Zoom out to show 25% more area - less blur
  }
  
  return {
    ...state,
    player,
    enemies: aliveEnemies,
    projectiles: newProjectiles,
    items: uncollectedItems,
    particles,
    gold,
    time: newTime,
    lastEnemySpawn,
    nextDifficultyIncrease,
    nextEnemyHealthIncrease,
    difficultyMultiplier,
    enemyHealthMultiplier,
    screenShake,
    camera,
    pendingSkillDrop,
    screenScale,
    enemiesKilled
  };
}