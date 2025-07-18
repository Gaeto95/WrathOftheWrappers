import React from 'react';

interface PauseScreenProps {
  onResume: () => void;
  onUpgrade: () => void;
  onRestart: () => void;
}

export function PauseScreen({ onResume, onUpgrade, onRestart }: PauseScreenProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Game Paused</h2>
        
        <div className="space-y-4">
          <button
            onClick={onResume}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            ▶️ Resume
          </button>
          
          <button
            onClick={onUpgrade}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            💰 Upgrades
          </button>
          
          <button
            onClick={onRestart}
            className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            🔄 Restart
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-400">
          Press ESC to resume
        </div>
      </div>
    </div>
  );
}