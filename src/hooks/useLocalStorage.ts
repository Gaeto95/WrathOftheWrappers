import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item && item !== 'undefined' ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
}

export function useGamePersistence() {
  const [savedGold, setSavedGold] = useLocalStorage('mystic-grind-gold', 0);
  const [savedUpgrades, setSavedUpgrades] = useLocalStorage('mystic-grind-upgrades', {
    damage: 0,
    speed: 0,
    health: 0,
    fireRate: 0,
    goldBonus: 0
  });
  const [highScore, setHighScore] = useLocalStorage('mystic-grind-high-score', 0);

  const saveGameData = (gold: number, upgrades: any, score: number) => {
    setSavedGold(gold);
    setSavedUpgrades(upgrades);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return {
    savedGold,
    savedUpgrades,
    highScore,
    saveGameData
  };
}