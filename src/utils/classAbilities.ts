import { Player, Enemy, Projectile, Particle } from './gameLogic';
import { CharacterClass, CLASS_CONFIGS } from '../types/classes';
import { GAME_CONFIG } from './constants';
import { normalize, getDistance } from './collision';

export interface AbilityResult {
  projectiles?: Projectile[];
  particles?: Particle[];
  damage?: number;
  manaCost?: number;
  cooldown?: number;
}

export function useClassAbility(
  player: Player, 
  enemies: Enemy[], 
  currentTime: number
): AbilityResult | null {
  // Only bolter class remains, no special abilities needed
  return null;
}

export function regenerateMana(player: Player, deltaTime: number): Player {
  // No mana system needed for bolter only
  return player;
}