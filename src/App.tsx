import React from 'react';
import { useState, useEffect } from 'react';
import { Game } from './components/Game';
import { BolterMenu } from './components/BolterMenu';
import { LoadingScreen } from './components/LoadingScreen';
import { useBolterSystem } from './hooks/useBolterSystem';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const bolterSystem = useBolterSystem();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleStartGame = () => {
    console.log('Starting game with Bolter');
    setGameStarted(true);
  };

  const handleReturnToMenu = () => {
    console.log('Returning to menu');
    setGameStarted(false);
    setGameKey(prev => prev + 1); // Increment key when returning to menu for fresh restart
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (!gameStarted) {
    return (
      <BolterMenu
        bolterData={bolterSystem.bolterData}
        onStartGame={handleStartGame}
      />
    );
  }

  return (
    <Game 
      key={gameKey}
      bolterData={bolterSystem.bolterData}
      bolterSystem={bolterSystem}
      onReturnToMenu={handleReturnToMenu}
    />
  );
}

export default App;