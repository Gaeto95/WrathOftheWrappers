import React from 'react';

interface DeathScreenProps {
  score: number;
  highScore: number;
  gold: number;
  onRestart: () => void;
  onUpgrade: () => void;
}

export function DeathScreen({ score, highScore, gold, onRestart, onUpgrade }: DeathScreenProps) {
  const isNewRecord = score > highScore;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-red-400 mb-2">Game Over</h2>
          {isNewRecord && (
            <div className="text-yellow-400 text-lg font-bold mb-2">🎉 New Record! 🎉</div>
          )}
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Survival Time</div>
            <div className="text-2xl font-bold text-blue-400">{score} seconds</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Best Time</div>
            <div className="text-xl font-bold text-green-400">{highScore} seconds</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Gold Earned</div>
            <div className="text-xl font-bold text-yellow-400">{gold}</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            💰 Upgrade & Restart
          </button>
          
          <button
            onClick={onRestart}
            className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            🔄 Restart
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-400">
          Use your gold to upgrade your abilities and survive longer!
        </div>
      </div>
    </div>
  );
}