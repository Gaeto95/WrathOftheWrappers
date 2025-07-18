import React from 'react';
import { useState } from 'react';
import { Game } from './components/Game';
import { ProfileSelector } from './components/ProfileSelector';
import { useProfileSystem } from './hooks/useProfileSystem';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const profileSystem = useProfileSystem();

  if (!gameStarted || !profileSystem.activeProfile) {
    return (
      <ProfileSelector
        profiles={profileSystem.profiles}
        activeProfile={profileSystem.activeProfile}
        onSelectProfile={profileSystem.selectProfile}
        onCreateProfile={profileSystem.createProfile}
        onDeleteProfile={profileSystem.deleteProfile}
        onStartGame={() => setGameStarted(true)}
      />
    );
  }

  return (
    <Game 
      profile={profileSystem.activeProfile}
      profileSystem={profileSystem}
      onReturnToProfiles={() => setGameStarted(false)}
    />
  );
}

export default App;