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
  const [profiles, setProfiles] = useLocalStorage<PlayerProfile[]>('mystic-grind-profiles', []);
  const [activeProfileId, setActiveProfileId] = useLocalStorage<string | null>('mystic-grind-active-profile', null);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const createProfile = useCallback((name: string, selectedClass: CharacterClass): PlayerProfile => {
    const newProfile: PlayerProfile = {
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      selectedClass,
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

    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    return newProfile;
  }, [setProfiles, setActiveProfileId]);

  const selectProfile = useCallback((profileId: string) => {
    setActiveProfileId(profileId);
  }, [setActiveProfileId]);

  const deleteProfile = useCallback((profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    if (activeProfileId === profileId) {
      setActiveProfileId(null);
    }
  }, [setProfiles, activeProfileId, setActiveProfileId]);

  const updateProfile = useCallback((updates: Partial<PlayerProfile>) => {
    if (!activeProfile) return;

    setProfiles(prev => prev.map(p => 
      p.id === activeProfile.id 
        ? { ...p, ...updates, lastPlayed: Date.now() }
        : p
    ));
  }, [activeProfile, setProfiles]);

  // Add method to get current profile with latest data
  const getCurrentProfile = useCallback(() => {
    return profiles.find(p => p.id === activeProfileId) || null;
  }, [profiles, activeProfileId]);

  const purchaseUpgrade = useCallback((upgradeType: keyof PermanentUpgrades, cost: number) => {
    const currentProfile = getCurrentProfile();
    if (!currentProfile || currentProfile.totalGold < cost) return false;

    const newUpgrades = {
      ...currentProfile.permanentUpgrades,
      [upgradeType]: currentProfile.permanentUpgrades[upgradeType] + 1
    };

    updateProfile({
      totalGold: currentProfile.totalGold - cost,
      permanentUpgrades: newUpgrades
    });

    return true;
  }, [activeProfile, updateProfile]);

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

  const endGameSession = useCallback((finalStats: {
    goldEarned: number;
    enemiesKilled: number;
    survivalTime: number;
  }) => {
    if (!currentSession || !activeProfile) return;

    const sessionDuration = Date.now() - currentSession.startTime;
    const currentProfile = getCurrentProfile();
    if (!currentProfile) return;
    
    updateProfile({
      totalGold: currentProfile.totalGold + finalStats.goldEarned,
      totalPlayTime: currentProfile.totalPlayTime + sessionDuration,
      bestSurvivalTime: Math.max(currentProfile.bestSurvivalTime, finalStats.survivalTime),
      totalEnemiesKilled: currentProfile.totalEnemiesKilled + finalStats.enemiesKilled,
      totalDeaths: currentProfile.totalDeaths + 1
    });

    setCurrentSession(null);
  }
  )

  // Auto-create first profile if none exist
  useEffect(() => {
    if (profiles.length === 0) {
      createProfile('Player 1', 'bolter');
    }
  }, [profiles.length, createProfile]);

  return {
    profiles,
    activeProfile: getCurrentProfile(),
    currentSession,
    createProfile,
    selectProfile,
    deleteProfile,
    updateProfile,
    purchaseUpgrade,
    startGameSession,
    endGameSession,
    getCurrentProfile
  };
}