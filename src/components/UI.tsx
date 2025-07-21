import React from 'react';
import { GameState } from '../utils/gameLogic';
import { GAME_CONFIG } from '../utils/constants';
import { CLASS_CONFIGS } from '../types/classes';
import { BolterData } from '../types/bolter';

interface UIProps {
  gameState: GameState;
  bolterData: BolterData;
}

export function UI({ gameState, bolterData }: UIProps) {
  const healthPercent = (gameState.player.hp / gameState.player.maxHp) * 100;
  const currentScore = Math.floor(gameState.time / 1000);
  const highScore = bolterData?.bestSurvivalTime || 0;
  const classConfig = CLASS_CONFIGS[gameState.player.classState.selectedClass];
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 p-4 rounded-lg text-white min-w-[200px] text-lg">
        {/* Class Info */}
        <div className="mb-3 flex items-center gap-2 text-xl">
          <span className="text-3xl">{classConfig.icon}</span>
          <div>
            <div className="text-base font-bold text-purple-400">{classConfig.name}</div>
          </div>
        </div>
        
        {/* Health Bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-base font-medium">Health</span>
            <span className="text-sm">{Math.ceil(gameState.player.hp)}/{gameState.player.maxHp}</span>
          </div>
          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>
        
        {/* Gold */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-medium">Gold</span>
          <span className="text-yellow-400 font-bold text-lg">{(bolterData.totalGold + gameState.gold).toLocaleString()}</span>
        </div>
        
        {/* Score & Time */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-medium">Time</span>
          <span className={`font-bold text-lg ${currentScore >= 60 ? 'text-yellow-400' : 'text-blue-400'}`}>
            {currentScore}s {currentScore >= 60 && '🔥'}
          </span>
        </div>
        
        {/* High Score */}
        <div className="flex items-center justify-between">
          <span className="text-base font-medium">Best</span>
          <span className="text-green-400 font-bold text-lg">{Math.floor(highScore)}s</span>
        </div>
      </div>
      
      {/* Game Stats */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 p-4 rounded-lg text-white min-w-[150px] text-base">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Enemies:</span>
            <span className="text-red-400">{gameState.enemies.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Damage:</span>
            <span className="text-yellow-400">{gameState.player.damage}</span>
          </div>
          <div className="flex justify-between">
            <span>Fire Rate:</span>
            <span className="text-blue-400">{gameState.player.fireRate.toFixed(2)}s</span>
          </div>
          <div className="flex justify-between">
            <span>Speed:</span>
            <span className="text-green-400">{Math.round(gameState.player.speed)}</span>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 p-3 rounded-lg text-white text-base">
        <div className="text-sm space-y-1">
          <div><strong>WASD:</strong> Move</div>
          <div><strong>ESC:</strong> Pause</div>
          <div><strong>Auto-Bolt:</strong> {classConfig.name}</div>
        </div>
      </div>
      
      {/* Difficulty Indicator */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 p-3 rounded-lg text-white text-base">
        <div className="text-sm space-y-1">
          {gameState.screenScale !== 1 && (
            <div className="flex justify-between mb-1">
              <span>Scale:</span>
              <span className="text-yellow-400 font-bold">{gameState.screenScale < 1 ? 'Zoomed Out' : (gameState.screenScale * 100).toFixed(0) + '%'}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Difficulty:</span>
            <span className="text-red-400 font-bold">{gameState.difficultyMultiplier.toFixed(1)}x</span>
          </div>
          <div className="flex justify-between">
            <span>Enemy HP:</span>
            <span className="text-orange-400 font-bold">{gameState.enemyHealthMultiplier.toFixed(1)}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}