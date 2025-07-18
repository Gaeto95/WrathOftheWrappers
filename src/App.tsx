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
    console.log('Starting game with profile:', profileSystem.activeProfile?.name);
    setGameStarted(true);
    setGameKey(prev => prev + 1); // Force new game instance
  };

  const handleReturnToProfiles = () => {
    console.log('Returning to profiles');
    setGameStarted(false);
    setGameKey(prev => prev + 1); // Force new game instance when returning
  };

  const handleProfileChange = () => {
    console.log('Profile changed, forcing new game instance');
    // Force new game instance when profile changes
    setGameKey(prev => prev + 1);
  };

  if (!gameStarted || !profileSystem.activeProfile) {
    return (
      <ProfileSelector
        profiles={profileSystem.profiles}
        activeProfile={profileSystem.activeProfile}
        onSelectProfile={(profileId) => {
          profileSystem.selectProfile(profileId);
          handleProfileChange();
        }}
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