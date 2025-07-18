import React from 'react';
import { CharacterClass, CLASS_CONFIGS } from '../types/classes';

interface ClassSelectorProps {
  selectedClass: CharacterClass | null;
  onSelectClass: (characterClass: CharacterClass) => void;
  onConfirm: () => void;
}

export function ClassSelector({ selectedClass, onSelectClass, onConfirm }: ClassSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl shadow-2xl p-8 max-w-4xl w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Choose Your Class</h2>
          <p className="text-gray-400">Select a character class that matches your playstyle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(Object.keys(CLASS_CONFIGS) as CharacterClass[]).map(classKey => {
            const config = CLASS_CONFIGS[classKey];
            const isSelected = selectedClass === classKey;
            
            return (
              <div
                key={classKey}
                className={`bg-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-900 bg-opacity-30 transform scale-105' 
                    : 'border-gray-700 hover:border-purple-400 hover:bg-gray-700'
                }`}
                onClick={() => onSelectClass(classKey)}
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{config.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{config.name}</h3>
                </div>

                <p className="text-gray-300 text-sm mb-4 text-center">
                  {config.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-2">Base Stats:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Health:</span>
                        <span className={config.baseStats.healthModifier > 1 ? 'text-green-400' : config.baseStats.healthModifier < 1 ? 'text-red-400' : 'text-white'}>
                          {config.baseStats.healthModifier > 1 ? '+' : ''}{Math.round((config.baseStats.healthModifier - 1) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Speed:</span>
                        <span className={config.baseStats.speedModifier > 1 ? 'text-green-400' : config.baseStats.speedModifier < 1 ? 'text-red-400' : 'text-white'}>
                          {config.baseStats.speedModifier > 1 ? '+' : ''}{Math.round((config.baseStats.speedModifier - 1) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Damage:</span>
                        <span className={config.baseStats.damageModifier > 1 ? 'text-green-400' : config.baseStats.damageModifier < 1 ? 'text-red-400' : 'text-white'}>
                          {config.baseStats.damageModifier > 1 ? '+' : ''}{Math.round((config.baseStats.damageModifier - 1) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fire Rate:</span>
                        <span className={config.baseStats.fireRateModifier < 1 ? 'text-green-400' : config.baseStats.fireRateModifier > 1 ? 'text-red-400' : 'text-white'}>
                          {config.baseStats.fireRateModifier < 1 ? '+' : ''}{Math.round((1 - config.baseStats.fireRateModifier) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-2">Abilities:</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span>{config.abilities.primary.icon}</span>
                        <span className="text-yellow-400">{config.abilities.primary.name}</span>
                      </div>
                      <div className="text-gray-400 text-xs pl-6">
                        {config.abilities.primary.description}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span>{config.abilities.passive.icon}</span>
                        <span className="text-blue-400">{config.abilities.passive.name}</span>
                      </div>
                      <div className="text-gray-400 text-xs pl-6">
                        {config.abilities.passive.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={onConfirm}
            disabled={!selectedClass}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
              selectedClass
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedClass ? `Start as ${CLASS_CONFIGS[selectedClass].name}` : 'Select a Class'}
          </button>
        </div>
      </div>
    </div>
  );
}