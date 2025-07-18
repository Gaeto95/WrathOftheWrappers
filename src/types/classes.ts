export type CharacterClass = 'bolter';

export interface ClassConfig {
  name: string;
  description: string;
  icon: string;
  baseStats: {
    healthModifier: number;    // Multiplier for base health
    speedModifier: number;     // Multiplier for base speed
    damageModifier: number;    // Multiplier for base damage
    fireRateModifier: number;  // Multiplier for fire rate (lower = faster)
  };
  abilities: {
    primary: ClassAbility;
    passive: ClassAbility;
  };
  projectileConfig: {
    speed: number;
    size: number;
    color: string;
    piercing?: boolean;
    areaOfEffect?: number;
    range?: number;
  };
}

export interface ClassAbility {
  name: string;
  description: string;
  icon: string;
  cooldown?: number;
  manaCost?: number;
}

export interface PassiveSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  currentLevel: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effects: SkillEffect[];
}

export interface SkillEffect {
  type: 'damage' | 'speed' | 'health' | 'fireRate' | 'goldBonus' | 'piercing' | 'vampirism' | 'critical' | 'aoe' | 'magnet';
  value: number;
  isPercentage: boolean;
}

export interface PlayerClassState {
  selectedClass: CharacterClass;
  equippedSkills: PassiveSkill[];
  mana?: number;
  maxMana?: number;
  lastAbilityUse: number;
}

export const CLASS_CONFIGS: Record<CharacterClass, ClassConfig> = {
  bolter: {
    name: 'Bolter',
    description: 'Swift and precise. High mobility with piercing bolts.',
    icon: '🏹',
    baseStats: {
      healthModifier: 0.8,   // 20% less health
      speedModifier: 1.2,    // 20% more speed
      damageModifier: 1.0,   // Normal damage
      fireRateModifier: 0.6  // 40% faster firing
    },
    abilities: {
      primary: {
        name: 'Piercing Bolt',
        description: 'Bolts pierce through multiple enemies',
        icon: '🎯'
      },
      passive: {
        name: 'Eagle Eye',
        description: 'Increased bolt speed and range',
        icon: '👁️'
      }
    },
    projectileConfig: {
      speed: 400,
      size: 4,
      color: '#22c55e',
      range: 600
    }
  }
};

export const PASSIVE_SKILLS: Record<string, Omit<PassiveSkill, 'id' | 'currentLevel'>> = {
  criticalStrike: {
    name: 'Critical Strike',
    description: 'Chance to deal double damage',
    icon: '💥',
    maxLevel: 10,
    rarity: 'epic',
    effects: [{ type: 'critical', value: 1, isPercentage: true }]
  },
  goldMagnet: {
    name: 'Gold Magnet',
    description: 'Increased pickup radius for items',
    icon: '🧲',
    maxLevel: 10,
    rarity: 'common',
    effects: [{ type: 'magnet', value: 10, isPercentage: true }]
  },
  explosiveImpact: {
    name: 'Explosive Impact',
    description: 'Projectiles explode on impact',
    icon: '💣',
    maxLevel: 5,
    rarity: 'legendary',
    effects: [{ type: 'aoe', value: 20, isPercentage: false }]
  },
  battleFrenzy: {
    name: 'Battle Frenzy',
    description: 'Reduces attack cooldown by 0.5% per level',
    icon: '⚡',
    maxLevel: 10,
    rarity: 'rare',
    effects: [{ type: 'fireRate', value: 0.5, isPercentage: false }] // Flat 0.5% reduction per level
  }
};