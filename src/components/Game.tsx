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
import { PlayerProfile, PermanentUpgrades } from '../types/profile';
import { PassiveSkill } from '../types/classes';

interface GameProps {
  profile: PlayerProfile;
  profileSystem: any;
  onReturnToProfiles: () => void;
}

export function Game({ profile, profileSystem, onReturnToProfiles }: GameProps) {
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
    createInitialGameState(profile.permanentUpgrades, profile.selectedClass)
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
      profileSystem.startGameSession();
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
      
      profileSystem.endGameSession(finalStats);
      setSessionEnded(true);
    }
  }, [gameState.gameStatus, gameState.gold, gameState.score, gameState.enemiesKilled, profileSystem, sessionEnded]);

  const handleRestart = useCallback(() => {
    setGameState(createInitialGameState(profile.permanentUpgrades, profile.selectedClass));
    setSessionStats({
      startTime: Date.now(),
      enemiesKilled: 0
    });
    setSessionEnded(false);
  }, [profile.permanentUpgrades, profileSystem]);

  const handleUpgrade = useCallback((type: keyof PermanentUpgrades, cost: number) => {
    const success = profileSystem.purchaseUpgrade(type, cost);
    // Don't auto-restart, just return success status
    return success;
  }, [profileSystem]);

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
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  }, []);

  const handleUpgradeAndRestart = useCallback(() => {
    // Show upgrade screen first
    setGameState(prev => ({ ...prev, gameStatus: 'upgrading' }));
  }, []);

  const handleUpgradeScreenRestart = useCallback(() => {
    // Properly restart the game with fresh state
    setGameState(createInitialGameState(profileSystem.activeProfile.permanentUpgrades, profile.selectedClass));
    setSessionStats({
      startTime: Date.now(),
      enemiesKilled: 0
    });
    setSessionEnded(false);
    // Start a new session
    profileSystem.startGameSession();
  }, [profileSystem]);

  const handleCloseUpgradesAndRestart = useCallback(() => {
    // When closing upgrades after death, start fresh game
    setGameState(createInitialGameState(profileSystem.activeProfile.permanentUpgrades, profile.selectedClass));
    setSessionStats({
      startTime: Date.now(),
      enemiesKilled: 0
    });
    setSessionEnded(false);
    // Start a new session
    profileSystem.startGameSession();
  }, [profileSystem, profile.selectedClass]);

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
            <UI gameState={gameState} profile={profile} />
            <SkillInventory 
              equippedSkills={gameState.player.classState.equippedSkills}
              onRemoveSkill={handleRemoveSkill}
            />
          </>
        )}
        
        {gameState.gameStatus === 'paused' && (
          <PauseScreen
            onResume={handleResume}
            onUpgrade={handleShowUpgrades}
            onRestart={handleRestart}
            onReturnToProfiles={onReturnToProfiles}
          />
        )}
        
        {gameState.gameStatus === 'dead' && (
          <EnhancedDeathScreen
            profile={profile}
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
            profile={profile}
            onUpgrade={handleUpgrade}
            onClose={sessionEnded ? handleCloseUpgradesAndRestart : handleCloseUpgrades}
          />
        )}
      </div>
      
      {gameState.pendingSkillDrop && (
        <SkillDropNotification
          skill={gameState.pendingSkillDrop}
          onAccept={handleAcceptSkill}
          onReject={handleRejectSkill}
        />
      )}
    </div>
  );
}