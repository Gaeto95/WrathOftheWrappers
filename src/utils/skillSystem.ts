import { PassiveSkill, PASSIVE_SKILLS, SkillEffect } from '../types/classes';
import { Player } from './gameLogic';

export function generateRandomSkill(): PassiveSkill {
  const skillKeys = Object.keys(PASSIVE_SKILLS);
  const randomKey = skillKeys[Math.floor(Math.random() * skillKeys.length)];
  const baseSkill = PASSIVE_SKILLS[randomKey];
  
  return {
    ...baseSkill,
    id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    currentLevel: 1
  };
}

export function shouldDropSkill(enemiesKilled: number): boolean {
  // 8% base chance, increases very slightly with more enemies killed
  const baseChance = 0.08;
  const bonusChance = Math.min(0.02, enemiesKilled * 0.0002);
  return Math.random() < (baseChance + bonusChance);
}

export function applySkillEffects(player: Player, skills: PassiveSkill[]): Player {
  // Don't apply skills if there are none
  if (!skills || skills.length === 0) return player;
  
  // Create a copy of the player
  let modifiedPlayer = { ...player };
  
  // Calculate total bonuses from all skills
  let damageBonus = 0;
  let fireRateReduction = 0;
  let goldBonus = 0;
  let magnetRadius = 0;
  
  skills.forEach(skill => {
    skill.effects.forEach(effect => {
      const levelMultiplier = skill.currentLevel;
      const effectValue = effect.value * levelMultiplier;
      
      switch (effect.type) {
        case 'damage':
          damageBonus += effectValue;
          break;
          
        case 'fireRate':
          fireRateReduction += effectValue; // Flat reduction: 0.01s per level
          break;
          
        case 'goldBonus':
          goldBonus += effectValue / 100;
          break;
          
        case 'magnet':
          magnetRadius += effectValue;
          break;
      }
    });
  });
  
  // Store skill bonuses separately to avoid stacking
  (modifiedPlayer as any).skillBonuses = {
    damage: damageBonus,
    fireRateReduction: fireRateReduction,
    goldBonus: goldBonus,
    magnetRadius: magnetRadius
  };
  
  return modifiedPlayer;
}

export function calculateFinalStats(basePlayer: Player, skills: PassiveSkill[]): Player {
  // Start with base player stats (from upgrades only)
  let finalPlayer = { ...basePlayer };
  
  // Calculate total skill bonuses
  let totalDamageBonus = 0;
  let totalFireRateReduction = 0;
  let totalGoldBonus = 0;
  let totalMagnetRadius = 0;
  
  skills.forEach(skill => {
    skill.effects.forEach(effect => {
      const levelMultiplier = skill.currentLevel;
      const effectValue = effect.value * levelMultiplier;
      
      switch (effect.type) {
        case 'damage':
          totalDamageBonus += effectValue;
          break;
          
        case 'fireRate':
          totalFireRateReduction += effectValue;
          break;
          
        case 'goldBonus':
          totalGoldBonus += effectValue / 100;
          break;
          
        case 'magnet':
          totalMagnetRadius += effectValue;
          break;
      }
    });
  });
  
  // Apply bonuses to base stats (not current stats)
  finalPlayer.damage = basePlayer.damage + totalDamageBonus;
  finalPlayer.fireRate = Math.max(0.05, basePlayer.fireRate - totalFireRateReduction);
  finalPlayer.goldMultiplier = basePlayer.goldMultiplier + totalGoldBonus;
  
  // Store magnet radius for collision detection
  (finalPlayer as any).magnetRadius = totalMagnetRadius;
  (finalPlayer as any).multiShot = totalMultiShot;
  
  return finalPlayer;
}

export function getSkillTooltip(skill: PassiveSkill): string {
  const effects = skill.effects.map(effect => {
    const value = effect.value * skill.currentLevel;
    const sign = effect.type === 'fireRate' ? '-' : '+';
    const suffix = effect.isPercentage ? '%' : '';
    return `${sign}${value}${suffix} ${effect.type}`;
  }).join(', ');
  
  return `${skill.description}\nLevel ${skill.currentLevel}/${skill.maxLevel}\nEffects: ${effects}`;
}