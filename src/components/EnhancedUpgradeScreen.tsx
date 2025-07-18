import React from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { PlayerProfile, PermanentUpgrades } from '../types/profile';
import { GAME_CONFIG, UpgradeType, UPGRADE_TYPE_NAMES } from '../utils/constants';

interface EnhancedUpgradeScreenProps {
  profile: PlayerProfile;
  onUpgrade: (type: keyof PermanentUpgrades, cost: number) => boolean;
  onClose: () => void;
}

export function EnhancedUpgradeScreen({ profile, onUpgrade, onClose }: EnhancedUpgradeScreenProps) {
  // Get the current total gold (profile gold + current session gold)
  const getCurrentTotalGold = () => {
    // This will be passed from the Game component
    return profile.totalGold;
  };

  const upgradeDisplayNames: Record<keyof PermanentUpgrades, string> = {
    damage: 'Damage',
    speed: 'Speed',
    health: 'Health',
    fireRate: 'Fire Rate',
    goldBonus: 'Gold Bonus'
  };

  const upgradeIcons: Record<keyof PermanentUpgrades, string> = {
    damage: '⚔️',
    speed: '💨',
    health: '❤️',
    fireRate: '🔥',
    goldBonus: '💰'
  };

  const upgradeTypeMapping: Record<keyof PermanentUpgrades, UpgradeType> = {
    damage: 'DAMAGE',
    speed: 'SPEED',
    health: 'HEALTH',
    fireRate: 'FIRE_RATE',
    goldBonus: 'GOLD_BONUS'
  };

  const getUpgradeCost = (type: keyof PermanentUpgrades, level: number): number => {
    const costs = GAME_CONFIG.UPGRADE_COSTS[upgradeTypeMapping[type]];
    return level < costs.length ? costs[level] : costs[costs.length - 1] * Math.pow(2, level - costs.length + 1);
  };

  const getUpgradeDescription = (type: keyof PermanentUpgrades): string => {
    switch (type) {
      case 'damage':
        return 'Increase base damage by 10';
      case 'speed':
        return 'Increase movement speed by 5%';
      case 'health':
        return 'Increase max health by 20';
      case 'fireRate':
        return 'Decrease attack cooldown by 0.05s';
      case 'goldBonus':
        return 'Increase gold drops by 20%';
      default:
        return '';
    }
  };

  const getCurrentUpgradeValue = (type: keyof PermanentUpgrades, level: number): string => {
    switch (type) {
      case 'damage':
        return `+${level * 10}`;
      case 'speed':
        return `+${level * 5}%`;
      case 'health':
        return `+${level * 20} HP`;
      case 'fireRate':
        return `-${(level * 0.05).toFixed(2)}s`;
      case 'goldBonus':
        return `+${level * 20}%`;
      default:
        return '0';
    }
  };

  const getNextUpgradeValue = (type: keyof PermanentUpgrades, level: number): string => {
    return getCurrentUpgradeValue(type, level + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                Permanent Upgrades
              </h2>
              <p className="text-gray-400">Enhance {profile.name}'s abilities</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 text-2xl font-bold">{profile.totalGold.toLocaleString()} Gold</div>
            <div className="text-sm text-gray-400">Available to spend</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(upgradeDisplayNames) as Array<keyof PermanentUpgrades>).map(type => {
            const currentLevel = profile.permanentUpgrades[type];
            const cost = getUpgradeCost(type, currentLevel);
            const canAfford = profile.totalGold >= cost;
            const description = getUpgradeDescription(type);
            const currentValue = getCurrentUpgradeValue(type, currentLevel);
            const nextValue = getNextUpgradeValue(type, currentLevel);
            
            return (
              <div key={type} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{upgradeIcons[type]}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{upgradeDisplayNames[type]}</h3>
                    <div className="text-sm text-purple-400">Level {currentLevel}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-300 mb-2">{description}</div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Current:</span>
                      <span className="text-white font-bold">{currentValue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Next Level:</span>
                      <span className="text-green-400 font-bold">{nextValue}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-yellow-400 font-bold text-lg">{cost.toLocaleString()} Gold</div>
                  <button
                    onClick={() => onUpgrade(type, cost)}
                    disabled={!canAfford}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      canAfford
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Upgrade' : 'Not Enough Gold'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Profile Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{Math.floor(profile.bestSurvivalTime)}s</div>
              <div className="text-gray-400">Best Survival</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{profile.totalEnemiesKilled.toLocaleString()}</div>
              <div className="text-gray-400">Enemies Killed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{profile.totalDeaths}</div>
              <div className="text-gray-400">Total Deaths</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{Math.floor(profile.totalPlayTime / 60000)}m</div>
              <div className="text-gray-400">Play Time</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
          >
            🎮 Start New Game
          </button>
        </div>
      </div>
    </div>
  );
}