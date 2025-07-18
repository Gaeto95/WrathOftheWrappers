import React from 'react';
import { useState } from 'react';
import { Game } from './components/Game';
import { BolterMenu } from './components/BolterMenu';
import { useBolterSystem } from './hooks/useBolterSystem';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const bolterSystem = useBolterSystem();

  const handleStartGame = () => {
    console.log('Starting game with Bolter');
    setGameStarted(true);
    setGameKey(prev => prev + 1);
  };

  const handleReturnToMenu = () => {
    console.log('Returning to menu');
    setGameStarted(false);
  };

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