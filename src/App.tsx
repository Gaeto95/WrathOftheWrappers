import React from 'react';
import { useState } from 'react';
import { Game } from './components/Game';
import { useProfileSystem } from './hooks/useProfileSystem';

function App() {
  const [gameKey, setGameKey] = useState(0);
  const profileSystem = useProfileSystem();

  const handleStartNewGame = () => {
    console.log('Starting new game with profile:', profileSystem.profile?.name);
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            ⚔️ Wrath of the Wrappers
          </h1>
          <p className="text-gray-400">Complete Survival Action RPG</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{profileSystem.profile.name}</h3>
            <span className="text-2xl">🏹</span>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Gold:</span>
              <span className="text-yellow-400 font-bold">{profileSystem.profile.totalGold.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Best Time:</span>
              <span className="text-green-400">{Math.floor(profileSystem.profile.bestSurvivalTime)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Enemies Killed:</span>
              <span className="text-red-400">{profileSystem.profile.totalEnemiesKilled.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Play Time:</span>
              <span className="text-blue-400">{Math.floor(profileSystem.profile.totalPlayTime / 60000)}m</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏹</span>
              <span className="text-sm font-medium text-white">Bolter</span>
            </div>
            <div className="text-xs text-gray-400 mb-2">Permanent Upgrades:</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>⚔️ DMG: {profileSystem.profile.permanentUpgrades.damage}</div>
              <div>💨 SPD: {profileSystem.profile.permanentUpgrades.speed}</div>
              <div>❤️ HP: {profileSystem.profile.permanentUpgrades.health}</div>
              <div>🔥 FR: {profileSystem.profile.permanentUpgrades.fireRate}</div>
              <div className="col-span-2">💰 Gold: {profileSystem.profile.permanentUpgrades.goldBonus}</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Game 
            key={gameKey}
            profile={profileSystem.profile}
            profileSystem={profileSystem}
            onStartNewGame={handleStartNewGame}
          />
        </div>
      </div>
    </div>
  );
}

export default App;