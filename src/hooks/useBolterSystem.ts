import { useState, useCallback } from 'react';
import { BolterData, PermanentUpgrades } from '../types/bolter';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_UPGRADES: PermanentUpgrades = {
  damage: 0,
  speed: 0,
  health: 0,
  fireRate: 0,
  goldBonus: 0
};

export function useBolterSystem() {
  const [bolterData, setBolterData] = useLocalStorage<BolterData>('bolter-data', {
    totalGold: 0,
    totalPlayTime: 0,
    bestSurvivalTime: 0,
    totalEnemiesKilled: 0,
    totalDeaths: 0,
    permanentUpgrades: { ...DEFAULT_UPGRADES }
  });

  const [currentSession, setCurrentSession] = useState<{
    startTime: number;
    goldEarned: number;
    enemiesKilled: number;
    survivalTime: number;
  } | null>(null);

  const updateBolterData = useCallback((updates: Partial<BolterData>) => {
    const updatedData = { ...bolterData, ...updates };
    console.log('Updating Bolter data:', updatedData);
    setBolterData(updatedData);
  }, [bolterData, setBolterData]);

  const purchaseUpgrade = useCallback((upgradeType: keyof PermanentUpgrades, cost: number) => {
    const newUpgrades = {
      ...bolterData.permanentUpgrades,
      [upgradeType]: bolterData.permanentUpgrades[upgradeType] + 1
    };

    updateBolterData({
      permanentUpgrades: newUpgrades
    });

    return true;
  }, [bolterData, updateBolterData]);

  const startGameSession = useCallback(() => {
    if (currentSession) return;
    
    const session = {
      startTime: Date.now(),
      goldEarned: 0,
      enemiesKilled: 0,
      survivalTime: 0
    };
    setCurrentSession(session);
  }, [currentSession]);

  const saveCurrentSessionStats = useCallback((stats: {
    goldEarned: number;
    enemiesKilled: number;
    survivalTime: number;
  }) => {
    console.log('saveCurrentSessionStats called with:', stats);
    
    // Prevent saving if session is null (already saved)
    if (!currentSession) {
      console.log('No active session, skipping save');
      return;
    }
    
    const sessionDuration = currentSession ? Date.now() - currentSession.startTime : 0;
    
    console.log('Saving session stats:', {
      currentGold: bolterData.totalGold,
      goldEarned: stats.goldEarned,
      newTotal: bolterData.totalGold + stats.goldEarned,
      enemiesKilled: stats.enemiesKilled,
      survivalTime: stats.survivalTime
    });
    
    // Prevent saving empty sessions
    if (stats.goldEarned === 0 && stats.enemiesKilled === 0) {
      console.log('Empty session, skipping save');
      setCurrentSession(null);
      return;
    }
    
    const updatedData = {
      totalGold: bolterData.totalGold + stats.goldEarned,
      totalPlayTime: bolterData.totalPlayTime + sessionDuration,
      bestSurvivalTime: Math.max(bolterData.bestSurvivalTime, stats.survivalTime),
      totalEnemiesKilled: bolterData.totalEnemiesKilled + stats.enemiesKilled,
      totalDeaths: bolterData.totalDeaths + 1
    };
    
    console.log('Updating Bolter data with:', updatedData);
    updateBolterData(updatedData);
    
    // Clear session immediately to prevent duplicate saves
    setCurrentSession(null);
  }, [bolterData, updateBolterData, currentSession]);

  return {
    bolterData,
    currentSession,
    updateBolterData,
    purchaseUpgrade,
    startGameSession,
    saveCurrentSessionStats
  };
}