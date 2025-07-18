import React from 'react';
import { Upgrades, getUpgradeCost, canAffordUpgrade, getUpgradeDescription } from '../utils/gameLogic';
import { UPGRADE_TYPE_NAMES, UpgradeType } from '../utils/constants';

interface UpgradeScreenProps {
  upgrades: Upgrades;
  gold: number;
  onUpgrade: (type: UpgradeType) => void;
  onClose: () => void;
}

export function UpgradeScreen({ upgrades, gold, onUpgrade, onClose }: UpgradeScreenProps) {
  const upgradeDisplayNames: Record<UpgradeType, string> = {
    DAMAGE: 'Damage',
    SPEED: 'Speed',
    HEALTH: 'Health',
    FIRE_RATE: 'Fire Rate',
    GOLD_BONUS: 'Gold Bonus'
  };

  const upgradeIcons: Record<UpgradeType, string> = {
    DAMAGE: '⚔️',
    SPEED: '💨',
    HEALTH: '❤️',
    FIRE_RATE: '🔥',
    GOLD_BONUS: '💰'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Upgrades</h2>
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 text-xl font-bold">Gold: {gold}</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UPGRADE_TYPE_NAMES.map(type => {
            const currentLevel = upgrades[type];
            const cost = getUpgradeCost(type, currentLevel);
            const canAfford = canAffordUpgrade(gold, type, currentLevel);
            const description = getUpgradeDescription(type);
            
            return (
              <div key={type} className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{upgradeIcons[type]}</span>
                  <h3 className="text-xl font-bold text-white">{upgradeDisplayNames[type]}</h3>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-300 mb-1">Level {currentLevel}</div>
                  <div className="text-sm text-blue-400">{description}</div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-400">Current:</div>
                  <div className="text-white font-medium">
                    {getCurrentUpgradeValue(type, currentLevel)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 font-bold">{cost} Gold</span>
                  <button
                    onClick={() => onUpgrade(type)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      canAfford
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function getCurrentUpgradeValue(type: UpgradeType, level: number): string {
  switch (type) {
    case 'DAMAGE':
      return `+${level * 10}`;
    case 'SPEED':
      return `+${level * 5}%`;
    case 'HEALTH':
      return `+${level * 20} HP`;
    case 'FIRE_RATE':
      return `-${(level * 0.05).toFixed(2)}s`;
    case 'GOLD_BONUS':
      return `+${level * 20}%`;
    default:
      return '0';
  }
}