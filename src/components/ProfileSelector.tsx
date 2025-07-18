import React, { useState } from 'react';
import { User, Plus, Trash2, Play } from 'lucide-react';
import { PlayerProfile } from '../types/profile';
import { ClassSelector } from './ClassSelector';
import { CharacterClass, CLASS_CONFIGS } from '../types/classes';

interface ProfileSelectorProps {
  profiles: PlayerProfile[];
  activeProfile: PlayerProfile | null;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onStartGame: () => void;
}

export function ProfileSelector({
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onStartGame
}: ProfileSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  const handleCreateProfile = () => {
    if (newProfileName.trim() && selectedClass) {
      onCreateProfile(newProfileName.trim(), selectedClass);
      setNewProfileName('');
      setSelectedClass(null);
      setShowCreateForm(false);
      setShowClassSelector(false);
    }
  };

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

  // Debug logging
  console.log('ProfileSelector render - profiles:', profiles.map(p => ({
    name: p.name,
    gold: p.totalGold,
    enemies: p.totalEnemiesKilled,
    playTime: p.totalPlayTime
  })));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <User className="w-10 h-10 text-purple-400" />
            ⚔️ Wrath of the Wrappers
          </h1>
          <p className="text-gray-400">Select your character profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className={`bg-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-600 ${
                activeProfile?.id === profile.id ? 'ring-2 ring-purple-500 bg-gray-600' : ''
              }`}
              onClick={() => onSelectProfile(profile.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProfile(profile.id);
                  }}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gold:</span>
                  <span className="text-yellow-400 font-bold">{profile.totalGold.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Best Time:</span>
                  <span className="text-green-400">{formatTime(profile.bestSurvivalTime * 1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Enemies Killed:</span>
                  <span className="text-red-400">{profile.totalEnemiesKilled.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Play Time:</span>
                  <span className="text-blue-400">{formatTime(profile.totalPlayTime)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{CLASS_CONFIGS[profile.selectedClass].icon}</span>
                  <span className="text-sm font-medium text-white">{CLASS_CONFIGS[profile.selectedClass].name}</span>
                </div>
                <div className="text-xs text-gray-400 mb-2">Permanent Upgrades:</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>⚔️ DMG: {profile.permanentUpgrades.damage}</div>
                  <div>💨 SPD: {profile.permanentUpgrades.speed}</div>
                  <div>❤️ HP: {profile.permanentUpgrades.health}</div>
                  <div>🔥 FR: {profile.permanentUpgrades.fireRate}</div>
                  <div className="col-span-2">💰 Gold: {profile.permanentUpgrades.goldBonus}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Profile Card */}
          <div
            className="bg-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-gray-600 border-2 border-dashed border-gray-500 flex flex-col items-center justify-center"
            onClick={() => {
              setShowCreateForm(true);
              setShowClassSelector(true);
            }}
          >
            <Plus className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-400">Create New Profile</span>
          </div>
        </div>

        {showCreateForm && (
          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Create New Profile</h3>
            
            {!selectedClass ? (
              <div className="text-center">
                <p className="text-gray-400 mb-4">First, choose your character class</p>
                <button
                  onClick={() => setShowClassSelector(true)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Select Class
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-gray-600 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{CLASS_CONFIGS[selectedClass].icon}</span>
                    <div>
                      <div className="text-white font-bold">{CLASS_CONFIGS[selectedClass].name}</div>
                      <div className="text-gray-300 text-sm">{CLASS_CONFIGS[selectedClass].description}</div>
                    </div>
                    <button
                      onClick={() => setSelectedClass(null)}
                      className="ml-auto text-gray-400 hover:text-white"
                    >
                      Change
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Enter profile name..."
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-purple-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
                    autoFocus
                  />
                  <button
                    onClick={handleCreateProfile}
                    disabled={!newProfileName.trim()}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewProfileName('');
                      setSelectedClass(null);
                      setShowClassSelector(false);
                    }}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            </div>
        )}

        {activeProfile && (
          <div className="text-center">
            <button
              onClick={onStartGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              Start Game with {activeProfile.name}
            </button>
          </div>
        )}
      </div>
      
      {showClassSelector && (
        <ClassSelector
          selectedClass={selectedClass}
          onSelectClass={setSelectedClass}
          onConfirm={() => setShowClassSelector(false)}
        />
      )}
    </div>
  );
}