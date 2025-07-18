import React from 'react';
import { useState } from 'react';
import { Game } from './components/Game';
import { ProfileSelector } from './components/ProfileSelector';
import { useProfileSystem } from './hooks/useProfileSystem';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [lastProfileId, setLastProfileId] = useState<string | null>(null);
  const profileSystem = useProfileSystem();

  const handleStartGame = () => {
    console.log('Starting game with profile:', profileSystem.activeProfile?.name);
    setGameStarted(true);
    setGameKey(prev => prev + 1);
    setLastProfileId(profileSystem.activeProfile?.id || null);
  };

  const handleReturnToProfiles = () => {
    console.log('Returning to profiles');
    setGameStarted(false);
    setLastProfileId(null);
  };

  // Check if profile changed and force new game
  const currentProfileId = profileSystem.activeProfile?.id || null;
  if (gameStarted && currentProfileId !== lastProfileId && currentProfileId !== null) {
    console.log('Profile changed during game, forcing restart');
    setGameKey(prev => prev + 1);
    setLastProfileId(currentProfileId);
  }

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