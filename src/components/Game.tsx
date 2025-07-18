import React, { useState, useCallback, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Canvas } from './Canvas';
import { UI } from './UI';
import { EnhancedUpgradeScreen } from './EnhancedUpgradeScreen';
import { EnhancedDeathScreen } from './EnhancedDeathScreen';
import { PauseScreen } from './PauseScreen';
import { useGameLoop } from '../hooks/useGameLoop';
import { useInput } from '../hooks/useInput';
import { createInitialGameState, GameState } from '../utils/gameLogic';
import { SkillInventory } from './SkillInventory';
import { SkillDropNotification } from './SkillDropNotification';
import { GAME_CONFIG } from '../utils/constants';
import { BolterData, PermanentUpgrades } from '../types/bolter';
import { PassiveSkill } from '../types/classes';

interface GameProps {
  bolterData: BolterData;
  bolterSystem: any;
  onReturnToMenu: () => void;
}

export function Game({ bolterData, bolterSystem, onReturnToMenu }: GameProps) {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Background music setup
  useEffect(() => {
    const audioElement = new Audio('/background-music.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.105;
    setAudio(audioElement);
    
    // Autoplay music when game starts
    audioElement.play().then(() => {
      setMusicEnabled(true);
    }).catch(e => {
      console.log('Autoplay failed, user interaction required:', e);
      setMusicEnabled(false);
    });

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, []);

  const toggleMusic = useCallback(() => {
    if (!audio) return;

    if (musicEnabled) {
      audio.pause();
      setMusicEnabled(false);
    } else {
      audio.play().catch(e => console.log('Audio play failed:', e));
      setMusicEnabled(true);
    }
  }, [audio, musicEnabled]);

  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialGameState(bolterData.permanentUpgrades, 'bolter')
  );
  const [sessionStats, setSessionStats] = useState({
    startTime: Date.now(),
    enemiesKilled: 0
  });
  const [sessionEnded, setSessionEnded] = useState(false);
  
  const input = useInput();
  useGameLoop(gameState, setGameState, input);

  // Start game session
  useEffect(() => {
    if (!sessionEnded) {
      bolterSystem.startGameSession();
    }
  }, []); // Empty dependency array - only run once on mount

  // Handle death
  useEffect(() => {
    if (gameState.gameStatus === 'dead' && !sessionEnded) {
      const finalStats = {
        survivalTime: gameState.score,
        goldEarned: gameState.gold,
        enemiesKilled: gameState.enemiesKilled || 0
      };
      
      console.log('Game ended, saving stats:', finalStats);
      bolterSystem.saveCurrentSessionStats(finalStats);
      setSessionEnded(true);
    }
  }, [gameState.gameStatus, gameState.gold, gameState.score, gameState.enemiesKilled, bolterSystem, sessionEnded]);

  const handleRestart = useCallback(() => {
    // Save current session stats before restarting
    if (!sessionEnded) {
      const finalStats = {
        survivalTime: gameState.score,
        goldEarned: gameState.gold,
        enemiesKilled: gameState.enemiesKilled || 0
      };
      console.log('Manual restart, saving stats:', finalStats);
      bolterSystem.saveCurrentSessionStats(finalStats);
    }
    
    setGameState(createInitialGameState(bolterSystem.bolterData.permanentUpgrades, 'bolter'));
    setSessionStats({
      startTime: Date.now(),
      enemiesKilled: 0
    });
    setSessionEnded(false);
    // Start new session
    bolterSystem.startGameSession();
  }, [bolterSystem, gameState.score, gameState.gold, gameState.enemiesKilled, sessionEnded]);

  const handleUpgrade = useCallback((type: keyof PermanentUpgrades, cost: number) => {
    // Check if we have enough total gold (profile + session)
    const totalGold = bolterSystem.bolterData.totalGold + gameState.gold;
    if (totalGold < cost) return false;
    
    const success = bolterSystem.purchaseUpgrade(type, cost);
    
    // Deduct cost from session gold first, then profile if needed
    if (success) {
      if (gameState.gold >= cost) {
        // Deduct from session gold only
        setGameState(prev => ({
          ...prev,
          gold: prev.gold - cost
        }));
      } else {
        // Deduct what we can from session, rest from profile
        const remainingCost = cost - gameState.gold;
        bolterSystem.updateBolterData({
          totalGold: bolterSystem.bolterData.totalGold - remainingCost
        });
        setGameState(prev => ({
          ...prev,
          gold: 0
        }));
      }
    }
    
    return success;
  }, [bolterSystem, gameState.gold]);

  const handleAcceptSkill = useCallback(() => {
    if (!gameState.pendingSkillDrop) return;
    
    setGameState(prev => {
      const newSkills = [...prev.player.classState.equippedSkills];
      
      // Check if we already have this skill type
      const existingSkillIndex = newSkills.findIndex(s => s.name === prev.pendingSkillDrop!.name);
      
      if (existingSkillIndex >= 0) {
        // Upgrade existing skill
        newSkills[existingSkillIndex] = {
          ...newSkills[existingSkillIndex],
          currentLevel: Math.min(newSkills[existingSkillIndex].maxLevel, newSkills[existingSkillIndex].currentLevel + 1)
        };
      } else if (newSkills.length < 5) {
        // Add new skill
        newSkills.push(prev.pendingSkillDrop!);
      } else {
        // Replace oldest skill
        newSkills.shift();
        newSkills.push(prev.pendingSkillDrop!);
      }
      
      return {
        ...prev,
        player: {
          ...prev.player,
          classState: {
            ...prev.player.classState,
            equippedSkills: newSkills
          }
        },
        pendingSkillDrop: null
      };
    });
  }, [gameState.pendingSkillDrop]);

  const handleRejectSkill = useCallback(() => {
    setGameState(prev => ({ ...prev, pendingSkillDrop: null }));
  }, []);

  const handleRemoveSkill = useCallback((skillId: string) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        classState: {
          ...prev.player.classState,
          equippedSkills: prev.player.classState.equippedSkills.filter(s => s.id !== skillId)
        }
      }
    }));
  }, []);

  const handlePause = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
  }, []);

  const handleResume = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  }, []);

  const handleShowUpgrades = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'upgrading' }));
  }, []);

  const handleCloseUpgrades = useCallback(() => {
    // Just resume the current game, don't restart
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  }, []);

  const handleUpgradeAndRestart = useCallback(() => {
    // Show upgrade screen first
    setGameState(prev => ({ ...prev, gameStatus: 'upgrading' }));
  }, []);

  const handleUpgradeScreenRestart = useCallback(() => {
    // This should only be called from the "Start New Game" button
    handleRestart();
  }, [handleRestart]);

  // Save stats when returning to profiles
  useEffect(() => {
    return () => {
      // Cleanup function - save stats when component unmounts
      if (!sessionEnded && gameState.gold > 0) {
        const finalStats = {
          survivalTime: gameState.score,
          goldEarned: gameState.gold,
          enemiesKilled: gameState.enemiesKilled || 0
        };
        console.log('Component unmounting, saving stats:', finalStats);
        bolterSystem.saveCurrentSessionStats(finalStats);
      }
    };
  }, [gameState.score, gameState.gold, gameState.enemiesKilled, sessionEnded, bolterSystem]);

  return (
    <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        className="absolute top-4 right-4 z-50 bg-black bg-opacity-70 p-3 rounded-lg text-white hover:bg-opacity-90 transition-all duration-200"
        title={musicEnabled ? "Mute Music" : "Play Music"}
      >
        {musicEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </button>

      <div className="relative">
        <Canvas
          gameState={gameState}
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          input={input}
        />
        
        {gameState.gameStatus === 'playing' && (
          <>
            <UI gameState={gameState} bolterData={bolterData} />
            <SkillInventory 
              equippedSkills={gameState.player.classState.equippedSkills}
              onRemoveSkill={handleRemoveSkill}
            />
            {gameState.pendingSkillDrop && (
              <SkillDropNotification
                skill={gameState.pendingSkillDrop}
                onAccept={handleAcceptSkill}
                onReject={handleRejectSkill}
              />
            )}
          </>
        )}
        
        {gameState.gameStatus === 'paused' && (
          <PauseScreen
            onResume={handleResume}
            onUpgrade={handleShowUpgrades}
            onRestart={handleRestart}
            onReturnToMenu={onReturnToMenu}
          />
        )}
        
        {gameState.gameStatus === 'dead' && (
          <EnhancedDeathScreen
            bolterData={bolterData}
            sessionStats={{
              survivalTime: gameState.score,
              goldEarned: gameState.gold,
              enemiesKilled: gameState.enemiesKilled || 0
            }}
            onUpgrade={handleUpgradeAndRestart}
            onRestart={handleRestart}
          />
        )}
        
        {gameState.gameStatus === 'upgrading' && (
          <EnhancedUpgradeScreen
            bolterData={bolterSystem.bolterData}
            currentSessionGold={gameState.gold}
            onUpgrade={handleUpgrade}
            onClose={handleCloseUpgrades}
          />
        )}
      </div>
      
    </div>
  );
}