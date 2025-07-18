export interface BolterData {
  totalGold: number;
  totalPlayTime: number;
  bestSurvivalTime: number;
  totalEnemiesKilled: number;
  totalDeaths: number;
  permanentUpgrades: PermanentUpgrades;
}

export interface PermanentUpgrades {
  damage: number;
  speed: number;
  health: number;
  fireRate: number;
  goldBonus: number;
}