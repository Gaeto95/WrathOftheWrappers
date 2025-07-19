import React, { useRef, useEffect } from 'react';
import { GameState } from '../utils/gameLogic';
import { GAME_CONFIG } from '../utils/constants';
import { CLASS_CONFIGS } from '../types/classes';

interface PlayerAnimationState {
  isMoving: boolean;
  isAttacking: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
  animationFrame: number;
  lastFrameTime: number;
  currentAnimation: string;
}

const playerAnimationState: PlayerAnimationState = {
  isMoving: false,
  isAttacking: false,
  direction: 'down',
  animationFrame: 0,
  lastFrameTime: 0,
  currentAnimation: 'idle'
};

// Individual sprite file configuration
const SPRITE_CONFIG = {
  frameWidth: 64,
  frameHeight: 64,
  framesPerAnimation: 8, // Use 8 frames for most animations
  framesPerRow: 8, // 8 frames per row for most sprites
  rows: 1, // Use only top row for most sprites
  animations: {
    idle: { file: 'Idle.png', frames: 8, speed: 150 },
    running: { file: 'Running.png', frames: 8, speed: 100 },
    jumping: { file: 'Jumping.png', frames: 8, speed: 120 },
    normalAttack: { file: 'Normal Attack.png', frames: 8, speed: 80, framesPerRow: 8, rows: 2 }, // Special layout
    lowAttack: { file: 'Low attack.png', frames: 8, speed: 80 },
    highAttack: { file: 'High Attack.png', frames: 8, speed: 80 },
    crouch: { file: 'crouch.png', frames: 8, speed: 150 },
    dash: { file: 'Dash.png', frames: 8, speed: 80 },
    death: { file: 'death.png', frames: 8, speed: 120 }
  }
};

interface CanvasProps {
  gameState: GameState;
  phaseTransition?: { active: boolean; timeLeft: number; blinkCount: number };
  width: number;
  height: number;
  input?: any;
}

// Monster sprite images cache
const monsterImages = new Map<string, HTMLImageElement>();
const spriteImages = new Map<string, HTMLImageElement>();
const coinImageCache = new Map<string, HTMLImageElement>();
const potionImageCache = new Map<string, HTMLImageElement>();
let spritesInitialized = false; // Track if sprites have been initialized
let monstersLoaded = false;

export function Canvas({ gameState, phaseTransition, width, height, input }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load all sprite images
  useEffect(() => {
    if (spritesInitialized) return; // Prevent reloading
    
    const animations = Object.entries(SPRITE_CONFIG.animations);
    spritesInitialized = true;
    
    animations.forEach(([animName, config]) => {
      const img = new Image();
      img.src = `/${config.file}`;
      
      img.onload = () => {
        spriteImages.set(animName, img);
      };
      
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${config.file}`);
      };
    });
  }, []); // Empty dependency array - only run once

  // Load monster sprites
  useEffect(() => {
    if (monstersLoaded) return; // Prevent reloading

    // Load monster sprites
    const bigMonsterImg = new Image();
    bigMonsterImg.src = '/big-monster.png';
    bigMonsterImg.onload = () => {
      monsterImages.set('big', bigMonsterImg);
    };
    bigMonsterImg.onerror = () => {
      console.warn('Failed to load big-monster.png');
    };
    
    const smallMonsterImg = new Image();
    smallMonsterImg.src = '/small-monster.png';
    smallMonsterImg.onload = () => {
      monsterImages.set('small', smallMonsterImg);
      monstersLoaded = true;
    };
    smallMonsterImg.onerror = () => {
      console.warn('Failed to load small-monster.png');
      monstersLoaded = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = GAME_CONFIG.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    // Apply camera shake and screen scaling
    ctx.save();
    
    // Apply additional zoom during phase transition for dramatic effect
    let effectiveScale = gameState.screenScale;
    if (phaseTransition?.active) {
      // Gradually zoom out during transition
      const progress = 1 - (phaseTransition.timeLeft / 3000);
      effectiveScale = 1 - (progress * 0.3); // Zoom out more dramatically during transition
    }
    
    // Apply screen scaling from center
    if (effectiveScale !== 1) {
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.translate(centerX, centerY);
      ctx.scale(effectiveScale, effectiveScale);
      ctx.translate(-centerX, -centerY);
      
      // Improve rendering quality when scaled
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
    
    ctx.translate(gameState.camera.x, gameState.camera.y);

    // Draw background pattern
    drawBackgroundPattern(ctx, width, height);

    // Draw items
    gameState.items.forEach(item => {
      drawItem(ctx, item);
    });

    // Draw enemies
    gameState.enemies.forEach(enemy => {
      drawEnemy(ctx, enemy, gameState.time, gameState.player);
    });

    // Draw projectiles
    gameState.projectiles.forEach(projectile => {
      drawProjectile(ctx, projectile);
    });

    // Draw particles
    gameState.particles.forEach(particle => {
      drawParticle(ctx, particle);
    });

    // Draw player
    drawPlayer(ctx, gameState.player, gameState.time, input, spriteImages);

    ctx.restore();
  }, [gameState, width, height, input]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-2 border-gray-800 bg-black"
    />
  );
}

function drawBackgroundPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  
  const gridSize = 100; // Larger grid to account for zoom out
  
  // Draw vertical lines
  for (let x = -gridSize; x <= width + gridSize; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height + gridSize);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = -gridSize; y <= height + gridSize; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(-gridSize, y);
    ctx.lineTo(width + gridSize, y);
    ctx.stroke();
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: any, time: number, input?: any, spriteImages?: Map<string, HTMLImageElement>) {
  const isInvulnerable = time < player.invulnerableUntil;
  const alpha = isInvulnerable && Math.sin(time * 0.02) > 0 ? 0.5 : 1;
  
  // Determine current state
  const isMoving = input && (input.up || input.down || input.left || input.right);
  const isAttacking = time - player.lastShot < 400; // Show attack animation for 400ms after shooting
  
  // Determine direction for flipping
  let facingLeft = false;
  if (input) {
    if (input.left) facingLeft = true;
    else if (input.right) facingLeft = false;
    // Keep previous direction if moving up/down only
  }
  
  // Determine animation
  let currentAnimation = 'idle';
  if (isAttacking) {
    currentAnimation = 'normalAttack';
  } else if (isMoving) {
    currentAnimation = 'running';
  }
  
  // Calculate animation speed with limits
  let animConfig = SPRITE_CONFIG.animations[currentAnimation as keyof typeof SPRITE_CONFIG.animations];
  let animSpeed = animConfig?.speed || 100;
  
  // Make attack animations match fire rate but with limits
  if (currentAnimation === 'normalAttack' && player.fireRate) {
    // Always use 100ms for consistent animation speed
    animSpeed = 100;
  }
  
  // Update animation frame
  if (animConfig && time - playerAnimationState.lastFrameTime > animSpeed) {
    if (playerAnimationState.currentAnimation !== currentAnimation) {
      // Reset frame when changing animation
      playerAnimationState.animationFrame = 0;
      playerAnimationState.currentAnimation = currentAnimation;
    } else {
      // Ensure frame stays within bounds
      playerAnimationState.animationFrame = (playerAnimationState.animationFrame + 1) % Math.min(animConfig.frames, 8);
    }
    playerAnimationState.lastFrameTime = time;
  }
  
  // Try to get the sprite for current animation
  let finalAnimation = currentAnimation;
  let spriteImage = spriteImages.get(finalAnimation);
  
  // More thorough sprite validation
  const isSpriteReady = (img: HTMLImageElement | undefined) => {
    if (!img) return false;
    if (!img.complete) return false;
    if (img.naturalWidth === 0 || img.naturalHeight === 0) return false;
    return true;
  };
  
  // If current animation sprite isn't ready, try idle
  if (!isSpriteReady(spriteImage)) {
    finalAnimation = 'idle';
    spriteImage = spriteImages.get('idle');
  }
  
  // If idle also isn't ready, use fallback
  if (!isSpriteReady(spriteImage)) {
    drawPlayerFallback(ctx, player, alpha, facingLeft);
    return;
  }
  
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // Calculate sprite position - use only top row (8 frames)
  animConfig = SPRITE_CONFIG.animations[finalAnimation as keyof typeof SPRITE_CONFIG.animations];
  const currentFrame = Math.min(
    finalAnimation === currentAnimation ? playerAnimationState.animationFrame : 0,
    (animConfig?.frames || 8) - 1 // Never exceed available frames
  );
  
  // Handle different sprite layouts
  let frameX, frameY;
  if (finalAnimation === 'normalAttack') {
    // Normal Attack has 8 frames in top row, use only those
    frameX = currentFrame * SPRITE_CONFIG.frameWidth;
    frameY = 0; // Always use top row for attack
  } else {
    // Standard layout - horizontal strip
    frameX = currentFrame * SPRITE_CONFIG.frameWidth;
    frameY = 0;
  }
  
  // Validate frame coordinates don't exceed sprite bounds
  if (frameX >= spriteImage!.naturalWidth) {
    console.warn('Frame X exceeds sprite width:', frameX, spriteImage!.naturalWidth);
    drawPlayerFallback(ctx, player, alpha, facingLeft);
    ctx.restore();
    return;
  }
  
  const renderSize = GAME_CONFIG.PLAYER_SIZE * 3; // Even larger to stay visible when zoomed out
  
  // Handle flipping for left direction
  if (facingLeft) {
    ctx.scale(-1, 1);
    try {
      ctx.drawImage(
        spriteImage!,
        frameX, frameY, SPRITE_CONFIG.frameWidth, SPRITE_CONFIG.frameHeight,
        -player.x - renderSize/2, player.y - renderSize/2, renderSize, renderSize
      );
    } catch (error) {
      console.error('Error drawing flipped sprite:', error);
      ctx.restore();
      drawPlayerFallback(ctx, player, alpha, facingLeft);
      return;
    }
  } else {
    try {
      ctx.drawImage(
        spriteImage!,
        frameX, frameY, SPRITE_CONFIG.frameWidth, SPRITE_CONFIG.frameHeight,
        player.x - renderSize/2, player.y - renderSize/2, renderSize, renderSize
      );
    } catch (error) {
      console.error('Error drawing sprite:', error);
      ctx.restore();
      drawPlayerFallback(ctx, player, alpha, facingLeft);
      return;
    }
  }
  
  ctx.restore();
}

function drawPlayerFallback(ctx: CanvasRenderingContext2D, player: any, alpha: number, facingLeft: boolean) {
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // Draw player glow
  const gradient = ctx.createRadialGradient(
    player.x, player.y, 0,
    player.x, player.y, GAME_CONFIG.PLAYER_SIZE
  );
  gradient.addColorStop(0, GAME_CONFIG.COLORS.PLAYER + '88');
  gradient.addColorStop(1, GAME_CONFIG.COLORS.PLAYER + '00');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(
    player.x - GAME_CONFIG.PLAYER_SIZE,
    player.y - GAME_CONFIG.PLAYER_SIZE,
    GAME_CONFIG.PLAYER_SIZE * 2,
    GAME_CONFIG.PLAYER_SIZE * 2
  );
  
  // Draw player body
  ctx.fillStyle = GAME_CONFIG.COLORS.PLAYER;
  ctx.fillRect(
    player.x - GAME_CONFIG.PLAYER_SIZE / 2,
    player.y - GAME_CONFIG.PLAYER_SIZE / 2,
    GAME_CONFIG.PLAYER_SIZE,
    GAME_CONFIG.PLAYER_SIZE
  );
  
  // Draw player border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    player.x - GAME_CONFIG.PLAYER_SIZE / 2,
    player.y - GAME_CONFIG.PLAYER_SIZE / 2,
    GAME_CONFIG.PLAYER_SIZE,
    GAME_CONFIG.PLAYER_SIZE
  );
  
  ctx.restore();
}
function drawEnemy(ctx: CanvasRenderingContext2D, enemy: any, time: number, player: any) {
  const isFlashing = time < enemy.flashUntil;
  const color = isFlashing ? '#ffffff' : enemy.color;
  
  // Determine which sprite to use based on enemy type
  let monsterSprite = null;
  if (enemy.type === 'HEAVY_TANK') {
    // Try to load heavy tank sprite, fallback to big monster
    let heavyTankMonster = monsterImages.get('heavy-tank');
    if (!heavyTankMonster) {
      heavyTankMonster = new Image();
      heavyTankMonster.src = '/heavy-tank-monster.png';
      monsterImages.set('heavy-tank', heavyTankMonster);
    }
    
    if (heavyTankMonster && heavyTankMonster.complete && heavyTankMonster.naturalWidth > 0) {
      monsterSprite = heavyTankMonster;
    } else {
      // Fallback to big monster sprite
      const bigMonster = monsterImages.get('big');
      if (bigMonster && bigMonster.complete && bigMonster.naturalWidth > 0) {
        monsterSprite = bigMonster;
      }
    }
  } else if (enemy.type === 'TANK') {
    // Regular Tank uses big monster sprite
    const bigMonster = monsterImages.get('big');
    if (bigMonster && bigMonster.complete && bigMonster.naturalWidth > 0) {
      monsterSprite = bigMonster;
    }
  } else if (enemy.type === 'BOSS') {
    // Try to load boss sprite, fallback to big monster
    let bossMonster = monsterImages.get('boss');
    if (!bossMonster) {
      bossMonster = new Image();
      bossMonster.src = '/boss-monster.png';
      monsterImages.set('boss', bossMonster);
    }
    
    if (bossMonster && bossMonster.complete && bossMonster.naturalWidth > 0) {
      monsterSprite = bossMonster;
    } else {
      // Fallback to big monster sprite
      const bigMonster = monsterImages.get('big');
      if (bigMonster && bigMonster.complete && bigMonster.naturalWidth > 0) {
        monsterSprite = bigMonster;
      }
    }
  } else if (enemy.type === 'GRUNT' || enemy.type === 'RUNNER') {
    const smallMonster = monsterImages.get('small');
    if (smallMonster && smallMonster.complete && smallMonster.naturalWidth > 0) {
      monsterSprite = smallMonster;
    }
  }
  
  if (monsterSprite) {
    // Draw monster sprite
    const spriteSize = enemy.size * 3; // Even larger to stay visible when zoomed out
    
    ctx.save();
    if (isFlashing) {
      ctx.filter = 'brightness(2)'; // Flash effect
    }
    
    // For small monsters (worm), rotate to face the player
    if (enemy.type === 'GRUNT' || enemy.type === 'RUNNER') {
      // Calculate angle to player - worm sprite points up by default, so we need to adjust
      const playerX = player.x;
      const playerY = player.y;
      const angle = Math.atan2(playerY - enemy.y, playerX - enemy.x);
      
      // Translate to enemy position, rotate (subtract PI/2 since sprite points up by default), then draw centered
      ctx.translate(enemy.x, enemy.y);
      ctx.rotate(angle - Math.PI / 2); // Subtract 90 degrees since worm sprite points up
      
      ctx.drawImage(
        monsterSprite,
        -spriteSize/2, 
        -spriteSize/2, 
        spriteSize, 
        spriteSize
      );
    } else {
      // Big monsters don't rotate
      ctx.drawImage(
        monsterSprite,
        enemy.x - spriteSize/2, 
        enemy.y - spriteSize/2, 
        spriteSize, 
        spriteSize
      );
    }
    ctx.restore();
  } else {
    // Fallback to colored circles
    // Draw enemy glow
    const gradient = ctx.createRadialGradient(
      enemy.x, enemy.y, 0,
      enemy.x, enemy.y, enemy.size * 1.5
    );
    gradient.addColorStop(0, color + '44');
    gradient.addColorStop(1, color + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw enemy body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw enemy border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Draw health bar
  const healthPercent = enemy.hp / enemy.maxHp;
  const barWidth = enemy.size * 1.5;
  const barHeight = 4;
  const barX = enemy.x - barWidth / 2;
  const barY = enemy.y - enemy.size - 10;
  
  ctx.fillStyle = GAME_CONFIG.COLORS.HEALTH_BAR_BG;
  ctx.fillRect(barX, barY, barWidth, barHeight);
  
  ctx.fillStyle = GAME_CONFIG.COLORS.HEALTH_BAR;
  ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
}

function drawProjectile(ctx: CanvasRenderingContext2D, projectile: any) {
  const color = projectile.isFireball ? '#f59e0b' : GAME_CONFIG.PROJECTILE_COLOR;
  const glowColor = projectile.isFireball ? '#fbbf24' : GAME_CONFIG.PROJECTILE_COLOR;
  
  // Draw projectile glow
  const gradient = ctx.createRadialGradient(
    projectile.x, projectile.y, 0,
    projectile.x, projectile.y, projectile.size * 2
  );
  gradient.addColorStop(0, glowColor + 'aa');
  gradient.addColorStop(1, glowColor + '00');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.size * 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw projectile body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawItem(ctx: CanvasRenderingContext2D, item: any) {
  if (item.type === 'gold') {
    let coinImage = coinImageCache.get('coin');
    if (!coinImage) {
      coinImage = new Image();
      coinImage.src = '/coin.png';
      coinImageCache.set('coin', coinImage);
    }
    
    if (coinImage.complete && coinImage.naturalWidth > 0) {
      // Draw coin image
      const size = 64;
      ctx.drawImage(coinImage, item.x - size/2, item.y - size/2, size, size);
    } else {
      // Fallback to circle
      const color = GAME_CONFIG.COLORS.GOLD;
      const size = 12;
      
      // Draw item glow
      const gradient = ctx.createRadialGradient(
        item.x, item.y, 0,
        item.x, item.y, size * 1.5
      );
      gradient.addColorStop(0, color + '88');
      gradient.addColorStop(1, color + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(item.x, item.y, size * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw item body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(item.x, item.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw item border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(item.x, item.y, size, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    let potionImage = potionImageCache.get('potion');
    if (!potionImage) {
      potionImage = new Image();
      potionImage.src = '/potion.png';
      potionImageCache.set('potion', potionImage);
    }
    
    if (potionImage.complete && potionImage.naturalWidth > 0) {
      // Draw potion image
      const size = 50;
      ctx.drawImage(potionImage, item.x - size/2, item.y - size/2, size, size);
    } else {
      // Fallback to circle
      const color = GAME_CONFIG.COLORS.HEALTH_POTION;
      const size = 20;
      
      // Draw item glow
      const gradient = ctx.createRadialGradient(
        item.x, item.y, 0,
        item.x, item.y, size * 1.5
      );
      gradient.addColorStop(0, color + '88');
      gradient.addColorStop(1, color + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(item.x, item.y, size * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw item body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(item.x, item.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw item border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(item.x, item.y, size, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, particle: any) {
  const alpha = particle.life / particle.maxLife;
  ctx.save();
  ctx.globalAlpha = alpha;
  
  ctx.fillStyle = particle.color;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}