import React from 'react';
import { Play } from 'lucide-react';
import { BolterData } from '../types/bolter';
import { CLASS_CONFIGS } from '../types/classes';

interface BolterMenuProps {
  bolterData: BolterData;
  onStartGame: () => void;
}

export function BolterMenu({ bolterData, onStartGame }: BolterMenuProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const bolterConfig = CLASS_CONFIGS.bolter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <span className="text-5xl">{bolterConfig.icon}</span>
            ⚔️ Wrath of the Wrappers
          </h1>
          <p className="text-gray-400">Master the art of the Bolter</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{bolterConfig.icon}</span>
            <div>
              <h3 className="text-2xl font-bold text-white">{bolterConfig.name}</h3>
              <p className="text-gray-300">{bolterConfig.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Gold</div>
              <div className="text-2xl font-bold text-yellow-400">{bolterData.totalGold.toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Best Time</div>
              <div className="text-2xl font-bold text-green-400">{formatTime(bolterData.bestSurvivalTime * 1000)}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Enemies Killed</div>
              <div className="text-2xl font-bold text-red-400">{bolterData.totalEnemiesKilled.toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Play Time</div>
              <div className="text-2xl font-bold text-blue-400">{formatTime(bolterData.totalPlayTime)}</div>
            </div>
          </div>

          <div className="bg-gray-600 rounded-lg p-4">
            <div className="text-sm font-medium text-white mb-2">Permanent Upgrades:</div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">⚔️ Damage:</span>
                <span className="text-white font-bold">{bolterData.permanentUpgrades.damage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">💨 Speed:</span>
                <span className="text-white font-bold">{bolterData.permanentUpgrades.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">❤️ Health:</span>
                <span className="text-white font-bold">{bolterData.permanentUpgrades.health}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">🔥 Fire Rate:</span>
                <span className="text-white font-bold">{bolterData.permanentUpgrades.fireRate}</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-gray-300">💰 Gold Bonus:</span>
                <span className="text-white font-bold">{bolterData.permanentUpgrades.goldBonus}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStartGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}