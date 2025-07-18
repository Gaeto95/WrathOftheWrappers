import React from 'react';
import { Skull, TrendingUp, RotateCcw, Trophy } from 'lucide-react';
import { BolterData } from '../types/bolter';

interface EnhancedDeathScreenProps {
  bolterData: BolterData;
  sessionStats: {
    survivalTime: number;
    goldEarned: number;
    enemiesKilled: number;
  };
  onUpgrade: () => void;
  onRestart: () => void;
}

export function EnhancedDeathScreen({ 
  bolterData, 
  sessionStats, 
  onUpgrade, 
  onRestart 
}: EnhancedDeathScreenProps) {
  const isNewRecord = sessionStats.survivalTime > bolterData.bestSurvivalTime;
  const totalGoldAfterSession = bolterData.totalGold + sessionStats.goldEarned;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-red-900 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 text-center border border-red-500">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-12 h-12 text-red-400" />
            <h2 className="text-4xl font-bold text-red-400">Game Over</h2>
          </div>
          
          {isNewRecord && (
            <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 text-yellow-400 text-xl font-bold">
                <Trophy className="w-6 h-6" />
                🎉 New Personal Record! 🎉
              </div>
            </div>
          )}
          
          <p className="text-gray-300">
            The Bolter has fallen in battle...
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {sessionStats.survivalTime}s
            </div>
            <div className="text-sm text-gray-400">Survival Time</div>
            {isNewRecord && (
              <div className="text-xs text-yellow-400 mt-1">New Record!</div>
            )}
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              +{sessionStats.goldEarned}
            </div>
            <div className="text-sm text-gray-400">Gold Earned</div>
            <div className="text-xs text-gray-500 mt-1">
              Total: {totalGoldAfterSession.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {sessionStats.enemiesKilled}
            </div>
            <div className="text-sm text-gray-400">Enemies Defeated</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Session Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Previous Best:</span>
              <span className="text-green-400">{Math.floor(bolterData.bestSurvivalTime)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">This Run:</span>
              <span className={isNewRecord ? "text-yellow-400 font-bold" : "text-white"}>
                {sessionStats.survivalTime}s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Enemies:</span>
              <span className="text-red-400">{(bolterData.totalEnemiesKilled + sessionStats.enemiesKilled).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Deaths:</span>
              <span className="text-gray-300">{bolterData.totalDeaths + 1}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onUpgrade}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <TrendingUp className="w-6 h-6" />
            Open Upgrade Menu ({sessionStats.goldEarned} Gold Available)
          </button>
          
          <button
            onClick={onRestart}
            className="w-full px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-6 h-6" />
            Quick Restart (No Upgrades)
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-400">
          Use your earned gold to purchase permanent upgrades that will make you stronger in future runs!
        </div>
      </div>
    </div>
  );
}