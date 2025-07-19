import { useRef, useEffect, useCallback } from 'react';
import { GameState, createEnemy, createProjectile, createItem, createParticles, findNearestEnemy } from '../utils/gameLogic';
import { circleToCircle, circleToCircleWithRadius, isOffScreen, getDistance, normalize, getRandomSpawnPosition } from '../utils/collision';
import { GAME_CONFIG } from '../utils/constants';
import { InputState } from './useInput';
import { applySkillEffects, generateRandomSkill, shouldDropSkill } from '../utils/skillSystem';
import { useClassAbility, regenerateMana } from '../utils/classAbilities';

export function useGameLoop(
  gameState: GameState,
  setGameState: (updater: (prev: GameState) => GameState) => void,
  input: InputState,
  phaseTransition: { active: boolean; timeLeft: number; blinkCount: number },
  setPhaseTransition: (transition: { active: boolean; timeLeft: number; blinkCount: number }) => void
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

    setGameState(prevState => updateGameState(prevState, deltaTime, input, phaseTransition, setPhaseTransition));

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.gameStatus, setGameState, input, phaseTransition, setPhaseTransition]);

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

function updateGameState(state: GameState, deltaTime: number, input: InputState, phaseTransition: any, setPhaseTransition: any): GameState {
  const dt = deltaTime / 1000; // Convert to seconds
  
  // Update time
  const newTime = state.time + deltaTime;
  
  // Update mega bolt flash
  const megaBoltFlash = Math.max(0, state.megaBoltFlash - deltaTime);
  
  // Initialize projectiles array early so it can be used throughout the function
  let projectiles = state.projectiles
    .map(projectile => ({
      ...projectile,
      x: projectile.x + projectile.vx * dt,
      y: projectile.y + projectile.vy * dt
    }))
    .filter(projectile => !isOffScreen(projectile, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT));
  
  // Update player
  let player = { ...state.player };
  
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
    const updatedEnemy = {
      ...enemy,
      x: enemy.x + direction.x * enemy.speed * dt,
      y: enemy.y + direction.y * enemy.speed * dt,
      flashUntil: Math.max(0, enemy.flashUntil - deltaTime),
      lastAttack: enemy.lastAttack || 0
    };
    
    // Boss attacks
    if (enemy.type === 'BOSS' && newTime - updatedEnemy.lastAttack > GAME_CONFIG.BOSS_ATTACK_INTERVAL) {
      // Create boss projectiles
      const baseAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      const spreadStep = GAME_CONFIG.BOSS_PROJECTILE_SPREAD / (GAME_CONFIG.BOSS_PROJECTILE_COUNT - 1);
      const startAngle = baseAngle - GAME_CONFIG.BOSS_PROJECTILE_SPREAD / 2;
      
      for (let i = 0; i < GAME_CONFIG.BOSS_PROJECTILE_COUNT; i++) {
        const angle = startAngle + (i * spreadStep);
        const targetX = enemy.x + Math.cos(angle) * 500;
        const targetY = enemy.y + Math.sin(angle) * 500;
        
        const bossProjectile = createProjectile(
          { x: enemy.x, y: enemy.y },
          { x: targetX, y: targetY },
          enemy.damage
        );
        bossProjectile.isBossProjectile = true;
        bossProjectile.size = 8; // Larger boss projectiles
        projectiles.push(bossProjectile);
      }
      
      updatedEnemy.lastAttack = newTime;
    }
    
    return updatedEnemy;
  });
  
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
    // Create main projectile
    const mainProjectile = createProjectile(player, nearestEnemy, player.damage, player);
    projectiles.push(mainProjectile);
    
    // Create additional projectiles for multi-shot
    const multiShotCount = (player as any).multiShot || 0;
    if (multiShotCount > 0 && nearestEnemy) {
      // Calculate base angle to target
      const baseAngle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
      
      // Create cone of projectiles
      for (let i = 1; i <= multiShotCount; i++) {
        // Alternate left and right, with increasing angle
        const side = i % 2 === 1 ? 1 : -1; // 1 for right, -1 for left
        const angleOffset = (Math.ceil(i / 2) * 0.3) * side; // 0.3 radians = ~17 degrees per step
        const shotAngle = baseAngle + angleOffset;
        
        // Calculate target position for this angle
        const range = 300; // Range for the cone shot
        const targetX = player.x + Math.cos(shotAngle) * range;
        const targetY = player.y + Math.sin(shotAngle) * range;
        
        const coneProjectile = createProjectile(
          player, 
          { x: targetX, y: targetY }, 
          player.damage, 
          player
        );
        projectiles.push(coneProjectile);
      }
    }
    
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
  let bossWasDefeated = false;
  const aliveEnemies = enemies.filter(enemy => {
    if (enemy.hp <= 0) {
      totalEnemiesKilled++;
      enemiesKilled++;
      
      // Check if this was a boss
      if (enemy.type === 'BOSS') {
        bossWasDefeated = true;
      }
      
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
      
      // Separate check for Mega Bolt (very rare)
      if (Math.random() < GAME_CONFIG.MEGA_BOLT_DROP_CHANCE) {
        items.push(createItem('megabolt', { x: enemy.x, y: enemy.y }, 100)); // 100 gold value
      }
      
      // Check for skill drop
      if (!pendingSkillDrop && shouldDropSkill(totalEnemiesKilled)) {
        pendingSkillDrop = generateRandomSkill();
      }
      
      return false;
    }
    return true;
  });
  
  // Update last boss defeat time if a boss was defeated
  if (bossWasDefeated) {
    lastBossDefeat = newTime;
  }
  
  // Check player-enemy collisions
  let screenShake = Math.max(0, state.screenShake - deltaTime);
  
  // Check player-boss projectile collisions
  const survivingProjectiles = newProjectiles.filter(projectile => {
    if (!projectile.isBossProjectile) return true;
    
    const collision = circleToCircle(
      { x: player.x, y: player.y, radius: GAME_CONFIG.PLAYER_SIZE / 2 },
      { x: projectile.x, y: projectile.y, radius: projectile.size }
    );
    
    if (collision && newTime > player.invulnerableUntil) {
      player.hp -= projectile.damage;
      player.invulnerableUntil = newTime + GAME_CONFIG.PLAYER_INVINCIBILITY_TIME;
      screenShake = GAME_CONFIG.SCREEN_SHAKE_DURATION;
      
      // Create hit particles
      particles.push(...createParticles({ x: player.x, y: player.y }, GAME_CONFIG.COLORS.PLAYER, 6));
      
      if (player.hp <= 0) {
        return false; // Remove projectile and trigger death
      }
      return false; // Remove projectile
    }
    
    return true;
  });
  
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
  let activateMegaBolt = false;
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
      if (item.isMegaBolt) {
        // Mega Bolt collected!
        activateMegaBolt = true;
        gold += item.value; // Still gives gold
      } else if (item.type === 'gold') {
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
  
  // Handle Mega Bolt activation
  let finalEnemies = aliveEnemies;
  let finalMegaBoltFlash = megaBoltFlash;
  
  if (activateMegaBolt) {
    // Clear all enemies and create massive particle explosion
    finalEnemies = [];
    finalMegaBoltFlash = GAME_CONFIG.MEGA_BOLT_FLASH_DURATION;
    
    // Create particles for each destroyed enemy
    aliveEnemies.forEach(enemy => {
      particles.push(...createParticles({ x: enemy.x, y: enemy.y }, enemy.color, 12));
      // Add gold for each destroyed enemy
      const goldAmount = Math.floor(
        (enemy.goldDrop.min + Math.random() * (enemy.goldDrop.max - enemy.goldDrop.min)) * 
        player.goldMultiplier
      );
      gold += goldAmount;
    });
    
    // Create massive flash particles at player position
    particles.push(...createParticles({ x: player.x, y: player.y }, GAME_CONFIG.COLORS.MEGA_BOLT, 30));
    
    // Screen shake for dramatic effect
    screenShake = GAME_CONFIG.SCREEN_SHAKE_DURATION * 3;
  }
  
  // Spawn enemies
  let lastEnemySpawn = state.lastEnemySpawn;
  let lastBossSpawn = state.lastBossSpawn;
  let lastBossDefeat = state.lastBossDefeat || 0;
  
  // Reduce spawn rate during phase transitions and overall
  let spawnRate = GAME_CONFIG.ENEMY_SPAWN_RATE / state.difficultyMultiplier;
  
  // Don't spawn enemies during phase transitions
  if (phaseTransition.active) {
    spawnRate = Infinity; // Prevent spawning during transition
  } else {
    // Reduce spawn rate by 50% to make it much less overwhelming
    spawnRate *= 1.5;
  }
  
  // Regular enemy spawning
  // Don't spawn enemies during boss defeat pause
  const timeSinceLastBossDefeat = newTime - lastBossDefeat;
  const inBossDefeatPause = timeSinceLastBossDefeat < GAME_CONFIG.BOSS_DEFEAT_PAUSE;
  
  if (newTime - lastEnemySpawn > spawnRate && !inBossDefeatPause) {
    aliveEnemies.push(createEnemy(state));
    lastEnemySpawn = newTime;
  }
  
  // Boss spawning every 60 seconds
  if (newTime - lastBossSpawn > GAME_CONFIG.BOSS_SPAWN_INTERVAL && !phaseTransition.active && !inBossDefeatPause) {
    // Clear all existing enemies before boss spawn
    aliveEnemies.length = 0;
    
    const bossConfig = GAME_CONFIG.ENEMY_TYPES.BOSS;
    const spawnPos = getRandomSpawnPosition(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT, state.screenScale);
    
    const boss = {
      id: `boss_${newTime}_${Math.random()}`,
      type: 'BOSS' as EnemyType,
      x: spawnPos.x,
      y: spawnPos.y,
      hp: bossConfig.hp * state.enemyHealthMultiplier,
      maxHp: bossConfig.hp * state.enemyHealthMultiplier,
      speed: bossConfig.speed,
      damage: bossConfig.damage,
      size: bossConfig.size,
      color: bossConfig.color,
      flashUntil: 0,
      goldDrop: bossConfig.goldDrop,
      lastAttack: newTime - GAME_CONFIG.BOSS_ATTACK_INTERVAL // Make boss attack immediately
    };
    
    aliveEnemies.push(boss);
    lastBossSpawn = newTime;
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
  let currentPhase = Math.floor(newTime / 60000) + 1; // Phase 1 at 60s, Phase 2 at 120s, etc.
  let expectedPhase = Math.floor(state.time / 60000) + 1;
  
  // Check if we've entered a new phase
  if (currentPhase > expectedPhase && !phaseTransition.active) {
    // Start phase transition
    setPhaseTransition({
      active: true,
      timeLeft: 5000, // 5 seconds - better balance
      blinkCount: 0,
      phase: currentPhase
    });
    
    // Progressive zoom out for each phase - calculate from current scale
    if (currentPhase === 2) screenScale = 0.85; // Phase 1: 15% zoom out
    else if (currentPhase === 3) screenScale = 0.75; // Phase 2: 25% zoom out  
    else if (currentPhase >= 4) screenScale = 0.7; // Phase 3+: 30% zoom out
  }
  
  // Handle phase transition
  if (phaseTransition.active) {
    const newTimeLeft = phaseTransition.timeLeft - deltaTime;
    const newBlinkCount = Math.floor((5000 - newTimeLeft) / 400); // Blink every 400ms
    
    if (newTimeLeft <= 0) {
      setPhaseTransition({
        active: false,
        timeLeft: 0,
        blinkCount: 0,
        phase: 1
      });
    } else {
      setPhaseTransition({
        active: true,
        timeLeft: newTimeLeft,
        blinkCount: newBlinkCount,
        phase: phaseTransition.phase || 1
      });
    }
  }
  
  return {
    ...state,
    player,
    enemies: finalEnemies,
    projectiles: survivingProjectiles,
    items: uncollectedItems,
    particles,
    gold,
    time: newTime,
    lastEnemySpawn,
    lastBossSpawn,
    nextDifficultyIncrease,
    nextEnemyHealthIncrease,
    difficultyMultiplier,
    enemyHealthMultiplier,
    screenShake,
    camera,
    pendingSkillDrop,
    screenScale,
    enemiesKilled,
    megaBoltFlash: finalMegaBoltFlash,
    lastBossDefeat
  };
}