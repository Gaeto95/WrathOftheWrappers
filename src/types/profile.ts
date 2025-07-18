export interface PlayerProfile {
  id: string;
  name: string;
  selectedClass: import('./classes').CharacterClass;
  createdAt: number;
  lastPlayed: number;
  totalGold: number;
  totalPlayTime: number;
  bestSurvivalTime: number;
  totalEnemiesKilled: number;
  totalDeaths: number;
  permanentUpgrades: PermanentUpgrades;
  achievements: Achievement[];
}

export interface PermanentUpgrades {
  damage: number;
  speed: number;
  health: number;
  fireRate: number;
  goldBonus: number;
}

export interface Achievement {
  id: string;
  unlockedAt: number;
  type: 'survival' | 'gold' | 'combat' | 'upgrade';
}

export interface GameSession {
  startTime: number;
  endTime?: number;
  goldEarned: number;
  enemiesKilled: number;
  survivalTime: number;
  upgradesPurchased: number;
}