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
import { createInitialPlayer } from '../utils/gameLogic';
import { calculateFinalStats } from '../utils/skillSystem';
import { resetPlayerAnimation } from './Canvas';

interface PhaseTransition {
  active: boolean;
  timeLeft: number;
  blinkCount: number;
  phase: number;
  startScale?: number;
}

interface GameProps {
  bolterData: BolterData;
  bolterSystem: any;
  onReturnToMenu: () => void;
}

export function Game({ bolterData, bolterSystem, onReturnToMenu }: GameProps) {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [gameOverAudio, setGameOverAudio] = useState<HTMLAudioElement | null>(null);
  const [backgroundTexture, setBackgroundTexture] = useState<string>('default');

  // Background music setup
  useEffect(() => {
    const audioElement = new Audio('/background-music.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.105;
    setAudio(audioElement);
    
    // Setup game over sound
    const gameOverElement = new Audio('/game-over.mp3');
    gameOverElement.volume = 0.3;
    setGameOverAudio(gameOverElement);
    
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
      gameOverElement.pause();
      gameOverElement.currentTime = 0;
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
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    startTime: Date.now(),
    enemiesKilled: 0
  });
  const [sessionEnded, setSessionEnded] = useState(false);
  
  const [phaseTransition, setPhaseTransition] = useState<PhaseTransition>({
    active: false,
    timeLeft: 0,
    blinkCount: 0,
    phase: 1
  });
  
  const input = useInput();
  useGameLoop(gameState, setGameState, input, phaseTransition, setPhaseTransition);

  // Handle start game
  const handleStartGame = useCallback(() => {
    // Game is already in playing state, just set the start time to begin the timer
    setGameState(prev => ({
      ...prev,
      gameStartTime: Date.now() // This will make the timer start counting
    }));
  }, []);

  // Auto-start the game when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      handleStartGame();
    }, 100); // Small delay to ensure everything is loaded
    
    return () => clearTimeout(timer);
  }, [handleStartGame]);

  // Start game session only when game actually starts
  useEffect(() => {
    if (!sessionEnded && gameStarted) {
      bolterSystem.startGameSession();
    }
  }, [gameStarted, sessionEnded, bolterSystem]);

  // Mark game as started when it begins playing
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.gameStartTime > 0 && !gameStarted) {
      setGameStarted(true);
    }
  }, [gameState.gameStatus, gameState.gameStartTime, gameStarted]);

  // Handle death
  useEffect(() => {
    if (gameState.gameStatus === 'dead' && !sessionEnded) {
      // Stop background music and play game over sound
      if (audio) {
        audio.pause();
        setMusicEnabled(false);
      }
      if (gameOverAudio) {
        gameOverAudio.currentTime = 0;
        gameOverAudio.play().catch(e => console.log('Game over sound failed to play:', e));
      }
      
      // Save stats if we have a current session
      if (bolterSystem.currentSession) {
        const finalStats = {
          survivalTime: gameState.score,
          goldEarned: gameState.gold,
          enemiesKilled: gameState.enemiesKilled || 0
        };
        
        console.log('Game ended, saving stats:', finalStats);
        bolterSystem.saveCurrentSessionStats(finalStats);
      }
      setSessionEnded(true);
    }
  }, [gameState.gameStatus, sessionEnded, bolterSystem, audio, gameOverAudio, gameState.score, gameState.gold, gameState.enemiesKilled]);

  const handleRestart = useCallback(() => {
    console.log('Quick restart - creating fresh game without saving current session');
    
    // Reset player animation state
    resetPlayerAnimation();
    
    // Stop game over sound and restart background music
    if (gameOverAudio) {
      gameOverAudio.pause();
      gameOverAudio.currentTime = 0;
    }
    if (audio) {
      audio.currentTime = 0;
      audio.play().then(() => {
        setMusicEnabled(true);
      }).catch(e => console.log('Background music restart failed:', e));
    }
    
    // Create completely fresh game state and start it immediately
    const freshState = createInitialGameState(bolterSystem.bolterData.permanentUpgrades, 'bolter');
    freshState.gameStartTime = Date.now(); // Start the timer immediately
    setGameState(freshState);
    
    setSessionStats({
      startTime: Date.now(),
      enemiesKilled: 0
    });
    setSessionEnded(false);
    
    // Start fresh session
    bolterSystem.startGameSession();
  }, [bolterSystem, audio, gameOverAudio]);

  const handleUpgrade = useCallback((type: keyof PermanentUpgrades, cost: number) => {
    // Check if we have enough total gold (profile + session)
    const totalGold = bolterSystem.bolterData.totalGold + gameState.gold;
    if (totalGold < cost) return false;
    
    // Deduct cost from session gold first, then profile if needed
    if (gameState.gold >= cost) {
      // Deduct from session gold only
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - cost
      }));
      // Purchase the upgrade using profile gold (but we already deducted from session)
      bolterSystem.updateBolterData({
        totalGold: bolterSystem.bolterData.totalGold + cost, // Add back what we're about to deduct
        permanentUpgrades: {
          ...bolterSystem.bolterData.permanentUpgrades,
          [type]: bolterSystem.bolterData.permanentUpgrades[type] + 1
        }
      });
    } else {
      // Deduct what we can from session, rest from profile
      const remainingCost = cost - gameState.gold;
      setGameState(prev => ({
        ...prev,
        gold: 0
      }));
      bolterSystem.updateBolterData({
        totalGold: bolterSystem.bolterData.totalGold - remainingCost,
        permanentUpgrades: {
          ...bolterSystem.bolterData.permanentUpgrades,
          [type]: bolterSystem.bolterData.permanentUpgrades[type] + 1
        }
      });
    }
    
    return true;
  }, [bolterSystem, gameState.gold]);

  const handleAcceptSkill = useCallback(() => {
    if (!gameState.pendingSkillDrop) return;
    
    setGameState(prev => {
      // Additional safety check inside state updater to prevent race conditions
      if (!prev.pendingSkillDrop) return prev;
      
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
      
      // Create a fresh base player from upgrades only
      const basePlayer = createInitialPlayer(prev.upgrades, prev.player.classState.selectedClass);
      
      // Preserve current position and health
      const playerWithSkills = {
        ...basePlayer,
        x: prev.player.x,
        y: prev.player.y,
        hp: prev.player.hp,
        lastShot: prev.player.lastShot,
        invulnerableUntil: prev.player.invulnerableUntil,
        classState: {
          ...prev.player.classState,
          equippedSkills: newSkills
        }
      };
      
      // Calculate final stats with skills applied to base stats
      const finalPlayer = calculateFinalStats(playerWithSkills, newSkills);
      
      return {
        ...prev,
        player: finalPlayer,
        pendingSkillDrop: null
      };
    });
  }, [gameState.pendingSkillDrop]);

  const handleRejectSkill = useCallback(() => {
    setGameState(prev => ({ ...prev, pendingSkillDrop: null }));
  }, []);

  const handleRemoveSkill = useCallback((skillId: string) => {
    setGameState(prev => {
      const newSkills = prev.player.classState.equippedSkills.filter(s => s.id !== skillId);
      
      // Create a fresh base player from upgrades only
      const basePlayer = createInitialPlayer(prev.upgrades, prev.player.classState.selectedClass);
      
      // Preserve current position and health
      const playerWithSkills = {
        ...basePlayer,
        x: prev.player.x,
        y: prev.player.y,
        hp: prev.player.hp,
        lastShot: prev.player.lastShot,
        invulnerableUntil: prev.player.invulnerableUntil,
        classState: {
          ...prev.player.classState,
          equippedSkills: newSkills
        }
      };
      
      // Calculate final stats with remaining skills applied to base stats
      const finalPlayer = calculateFinalStats(playerWithSkills, newSkills);
      
      return {
        ...prev,
        player: finalPlayer
      };
    });
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
    // Show upgrade screen for dead state
    setGameState(prev => ({ ...prev, gameStatus: 'upgrading-dead' }));
  }, []);

  const handleUpgradeScreenRestart = useCallback(() => {
    // Force a completely fresh restart without saving current session
    console.log('Creating completely fresh game state');
    
    // Reset player animation state
    resetPlayerAnimation();
    
    // Stop game over sound and restart background music
    if (gameOverAudio) {
      gameOverAudio.pause();
      gameOverAudio.currentTime = 0;
    }
    if (audio) {
      audio.currentTime = 0;
      audio.play().then(() => {
        setMusicEnabled(true);
      }).catch(e => console.log('Background music restart failed:', e));
    }
    
    // Create brand new game state with current upgrades
    const freshGameState = createInitialGameState(bolterSystem.bolterData.permanentUpgrades, 'bolter');
    console.log('Fresh game state created:', {
      time: freshGameState.time,
      enemies: freshGameState.enemies.length,
      gold: freshGameState.gold
    });
    
    setGameState(freshGameState);
    setSessionStats({
      startTime: Date.now(),
      enemiesKilled: 0
    });
    setSessionEnded(false);
    
    // Start completely new session
    bolterSystem.startGameSession();
  }, [bolterSystem, audio, gameOverAudio, musicEnabled]);

  // Save stats when returning to profiles
  useEffect(() => {
    return () => {
      // Cleanup function - save stats when component unmounts
      if (!sessionEnded && gameState.gold > 0 && gameState.gameStatus !== 'dead') {
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

      {/* Background Texture Controls */}
      {/* Background Texture Dropdown - Positioned above canvas with proper spacing */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 mb-8">
        <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
          <div className="text-white text-sm mb-2 font-medium text-center">Background:</div>
          <div className="flex gap-2">
            <button
              onClick={() => setBackgroundTexture('default')}
              className={`px-3 py-1 rounded text-xs transition-all duration-200 ${
                backgroundTexture === 'default' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setBackgroundTexture('desert')}
              className={`px-3 py-1 rounded text-xs transition-all duration-200 ${
                backgroundTexture === 'desert' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              Desert
            </button>
            <button
              onClick={() => setBackgroundTexture('grassland')}
              className={`px-3 py-1 rounded text-xs transition-all duration-200 ${
                backgroundTexture === 'grassland' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              Grassland
            </button>
            <button
              onClick={() => setBackgroundTexture('stone')}
              className={`px-3 py-1 rounded text-xs transition-all duration-200 ${
                backgroundTexture === 'stone' 
                  ? 'bg-gray-500 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              Stone
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-20">
        <Canvas
          gameState={gameState}
          phaseTransition={phaseTransition}
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          input={input}
          backgroundTexture={backgroundTexture}
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
        
        {gameState.gameStatus === 'upgrading-dead' && (
          <EnhancedUpgradeScreen
            bolterData={bolterSystem.bolterData}
            currentSessionGold={gameState.gold}
            onUpgrade={handleUpgrade}
            onClose={handleUpgradeScreenRestart}
            isDead={true}
          />
        )}
      </div>
      
    </div>
  );
}