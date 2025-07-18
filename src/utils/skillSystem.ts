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
  // 15% base chance, increases slightly with more enemies killed
  const baseChance = 0.15;
  const bonusChance = Math.min(0.1, enemiesKilled * 0.001);
  return Math.random() < (baseChance + bonusChance);
}

export function applySkillEffects(player: Player, skills: PassiveSkill[]): Player {
  // Don't apply skills if there are none
  if (!skills || skills.length === 0) return player;
  
  // Create a copy to avoid mutations
  let modifiedPlayer = { ...player };
  
  // Apply simple additive bonuses only
  let damageBonus = 0;
  let fireRateBonus = 0;
  let goldBonus = 0;
  
  skills.forEach(skill => {
    skill.effects.forEach(effect => {
      const levelMultiplier = skill.currentLevel;
      const effectValue = effect.value * levelMultiplier;
      
      switch (effect.type) {
        case 'damage':
          damageBonus += effectValue;
          break;
          
        case 'fireRate':
          fireRateBonus -= effectValue / 100;
          break;
          
        case 'goldBonus':
          goldBonus += effectValue / 100;
          break;
      }
    });
  });
  
  // Apply simple bonuses
  modifiedPlayer.damage = player.damage + damageBonus;
  modifiedPlayer.fireRate = Math.max(0.1, player.fireRate + fireRateBonus);
  modifiedPlayer.goldMultiplier = player.goldMultiplier + goldBonus;
  
  return modifiedPlayer;
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