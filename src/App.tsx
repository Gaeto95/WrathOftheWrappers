import React from 'react';
import { useState } from 'react';
import { Game } from './components/Game';
import { ProfileSelector } from './components/ProfileSelector';
import { useProfileSystem } from './hooks/useProfileSystem';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Force new game instance
  const profileSystem = useProfileSystem();

  const handleStartGame = () => {
    setGameStarted(true);
    setGameKey(prev => prev + 1); // Force new game instance
  };

  const handleReturnToProfiles = () => {
    setGameStarted(false);
    setGameKey(prev => prev + 1); // Force new game instance when returning
  };
  if (!gameStarted || !profileSystem.activeProfile) {
    return (
      <ProfileSelector
        profiles={profileSystem.profiles}
        activeProfile={profileSystem.activeProfile}
        onSelectProfile={profileSystem.selectProfile}
        onCreateProfile={profileSystem.createProfile}
        onDeleteProfile={profileSystem.deleteProfile}
        onStartGame={handleStartGame}
      />
    );
  }

  return (
    <Game 
      key={gameKey}
      profile={profileSystem.activeProfile}
      profileSystem={profileSystem}
      onReturnToProfiles={handleReturnToProfiles}
    />
  );
}

export default App;