import { useState, useEffect, useCallback } from 'react';
import { PlayerProfile, PermanentUpgrades, GameSession } from '../types/profile';
import { CharacterClass } from '../types/classes';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_UPGRADES: PermanentUpgrades = {
  damage: 0,
  speed: 0,
  health: 0,
  fireRate: 0,
  goldBonus: 0
};

export function useProfileSystem() {
  const [profile, setProfile] = useLocalStorage<PlayerProfile>('mystic-grind-profile', createDefaultProfile());
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

  function createDefaultProfile(): PlayerProfile {
    return {
      id: 'default-profile',
      name: 'Player',
      selectedClass: 'bolter',
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      totalGold: 0,
      totalPlayTime: 0,
      bestSurvivalTime: 0,
      totalEnemiesKilled: 0,
      totalDeaths: 0,
      permanentUpgrades: { ...DEFAULT_UPGRADES },
      achievements: []
    };
  }

  const updateProfile = useCallback((updates: Partial<PlayerProfile>) => {
    const updatedProfile = { ...profile, ...updates, lastPlayed: Date.now() };
    console.log('Updating profile:', updatedProfile.name, 'New gold:', updatedProfile.totalGold);
    setProfile(updatedProfile);
  }, [profile, setProfile]);

  const purchaseUpgrade = useCallback((upgradeType: keyof PermanentUpgrades, cost: number) => {
    console.log('Purchasing upgrade:', upgradeType, 'Cost:', cost, 'Current gold:', profile.totalGold);
    
    const newUpgrades = {
      ...profile.permanentUpgrades,
      [upgradeType]: profile.permanentUpgrades[upgradeType] + 1
    };

    updateProfile({
      permanentUpgrades: newUpgrades
    });

    return true;
  }, [profile, updateProfile]);

  const startGameSession = useCallback(() => {
    if (currentSession) return; // Prevent starting multiple sessions
    
    const session: GameSession = {
      startTime: Date.now(),
      goldEarned: 0,
      enemiesKilled: 0,
      survivalTime: 0,
      upgradesPurchased: 0
    };
    setCurrentSession(session);
  }, [currentSession]);

  const saveCurrentSessionStats = useCallback((stats: {
    goldEarned: number;
    enemiesKilled: number;
    survivalTime: number;
  }) => {
    console.log('saveCurrentSessionStats called with:', stats);
    
    // Calculate session duration if we have a valid session
    const sessionDuration = currentSession ? Date.now() - currentSession.startTime : 0;
    
    console.log('Saving session stats:', {
      currentGold: profile.totalGold,
      goldEarned: stats.goldEarned,
      newTotal: profile.totalGold + stats.goldEarned,
      enemiesKilled: stats.enemiesKilled,
      survivalTime: stats.survivalTime
    });
    
    const updatedData = {
      totalGold: profile.totalGold + stats.goldEarned,
      totalPlayTime: profile.totalPlayTime + sessionDuration,
      bestSurvivalTime: Math.max(profile.bestSurvivalTime, stats.survivalTime),
      totalEnemiesKilled: profile.totalEnemiesKilled + stats.enemiesKilled,
      totalDeaths: profile.totalDeaths + 1
    };
    
    console.log('Updating profile with:', updatedData);
    updateProfile(updatedData);
    
    // Clear the session after saving
    setCurrentSession(null);
  }, [profile, updateProfile, currentSession]);

  return {
    profile,
    currentSession,
    updateProfile,
    purchaseUpgrade,
    startGameSession,
    saveCurrentSessionStats
  };
}