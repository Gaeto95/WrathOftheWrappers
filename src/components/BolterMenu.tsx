import React, { useEffect, useState } from 'react';
import { Play, Sword, Shield, Zap, Target, Crown, Trophy, Clock, Coins, X } from 'lucide-react';
import { BolterData } from '../types/bolter';
import { CLASS_CONFIGS } from '../types/classes';

interface BolterMenuProps {
  bolterData: BolterData;
  onStartGame: () => void;
}

export function BolterMenu({ bolterData, onStartGame }: BolterMenuProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [creditsAudio, setCreditsAudio] = useState<HTMLAudioElement | null>(null);

  const creditsText = `⚔️ WRATH OF THE WRAPPERS ⚔️

A Complete Survival Action RPG
Built entirely with Bolt.new


GAME DESIGN & DEVELOPMENT
Created with love and no spoilers yet

Every line of code crafted with care
No spoilers in this section either

Powered by the magic of AI assistance
But still no spoilers to be found here


SPECIAL THANKS TO

The Bolt Platform
For making this dream possible
No spoilers about how amazing it is

React & TypeScript
The foundation of our adventure
Definitely no spoilers about the tech stack

Tailwind CSS
Making everything look beautiful
Zero spoilers about the styling secrets

Canvas API
Bringing the game world to life
Absolutely no spoilers about rendering magic


GAMEPLAY FEATURES

• Endless waves of enemies
• Progressive difficulty scaling  
• Permanent upgrade system
• Multiple enemy types with unique behaviors
• Dynamic skill system with random drops
• Beautiful sprite animations
• Epic boss battles every 60 seconds
• Screen scaling phases for increased challenge
• Auto-targeting combat system
• Particle effects and screen shake
• Multiple background textures
• Persistent progression system

No spoilers about any secret features though!


ENEMY TYPES ENCOUNTERED

Grunt Enemies
The basic threat, no spoilers about their tactics

Runner Enemies  
Fast and aggressive, but no spoilers on strategy

Tank Enemies
Slow but powerful, spoiler-free zone here

Heavy Tank Enemies
Elite variants with double stats
No spoilers about their spawn rates

Speeder Enemies
Lightning fast with unique rotation
Spoiler alert: there are no spoilers

Boss Enemies
Massive threats with special attacks
No spoilers about their devastating abilities


UPGRADE SYSTEM

Damage Upgrades
Increase your offensive power
No spoilers about the scaling formula

Speed Upgrades  
Move faster to avoid danger
No spoilers about movement mechanics

Health Upgrades
Survive longer in battle
No spoilers about the health calculations

Fire Rate Upgrades
Attack more frequently
No spoilers about the timing systems

Gold Bonus Upgrades
Earn more currency per kill
No spoilers about the economy balance


SKILL SYSTEM

Critical Strike
Chance for double damage
No spoilers about the proc rates

Gold Magnet
Increased pickup radius
No spoilers about the range calculations

Explosive Impact
Area of effect damage
No spoilers about the blast radius

Multi Shot
Fire additional projectiles
No spoilers about the cone patterns

Battle Frenzy
Reduced attack cooldowns
No spoilers about the stacking mechanics


TECHNICAL ACHIEVEMENTS

60 FPS Game Loop
Smooth performance guaranteed
No spoilers about the optimization tricks

Collision Detection
Precise hit detection systems
No spoilers about the algorithms used

Sprite Animation System
9 different character animations
No spoilers about the frame management

Particle Systems
Dynamic visual effects
No spoilers about the rendering pipeline

Audio Integration
Background music and sound effects
No spoilers about the audio implementation

Local Storage Persistence
Your progress is always saved
No spoilers about the data structures


DEVELOPMENT STATS

Lines of Code: 5000+
Components Created: 20+
Hours of Development: Countless
Bugs Fixed: Too many to count
Features Added: More than expected
Spoilers Included: Absolutely zero


EASTER EGGS

There might be some hidden features
But no spoilers about what they are

Secret mechanics may exist
But we're not spoiling anything here

Special interactions could be possible
But that would be a spoiler, wouldn't it?


FINAL THOUGHTS

This game represents the power of modern web development
No spoilers about the development process though

Built entirely in the browser using cutting-edge tools
But we won't spoil the technical details

A testament to what's possible with AI assistance
Though we're keeping the implementation secrets safe

Every pixel, every line of code, every game mechanic
Crafted with passion and attention to detail
But still no spoilers about the secret sauce


Thank you for playing Wrath of the Wrappers

May your bolts fly true
May your upgrades be plentiful  
May your survival times be legendary

And may you never encounter any spoilers
About the amazing journey that awaits


⚡ Powered by Bolt ⚡






THE END








`;

  // Initialize credits music
  useEffect(() => {
    const audioElement = new Audio('/credits-music.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.3;
    setCreditsAudio(audioElement);
    
    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, []);

  // Handle credits modal open/close with music
  useEffect(() => {
    if (showCredits && creditsAudio) {
      creditsAudio.currentTime = 0;
      creditsAudio.play().catch(e => console.log('Credits music failed to play:', e));
    } else if (creditsAudio) {
      creditsAudio.pause();
      creditsAudio.currentTime = 0;
    }
  }, [showCredits, creditsAudio]);

  // Letter by letter reveal animation
  useEffect(() => {
    if (!showCredits) {
      setDisplayedText('');
      setCurrentIndex(0);
      setScrollPosition(0);
      setShouldScroll(false);
      return;
    }

    if (currentIndex < creditsText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + creditsText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Check if we need to start scrolling (when text gets long enough)
        const estimatedLines = Math.floor((currentIndex + 1) / 50); // Rough estimate of lines
        if (estimatedLines > 15 && !shouldScroll) { // Start scrolling after ~15 lines
          setShouldScroll(true);
        }
        
        // Only scroll if we should be scrolling
        if (shouldScroll) {
          setScrollPosition(prev => prev + 2); // Smooth scrolling
        }
      }, 150); // 150ms per character for slow reveal

      return () => clearTimeout(timer);
    }
  }, [showCredits, currentIndex, creditsText]);

  const handleCloseCredits = () => {
    setShowCredits(false);
    if (creditsAudio) {
      creditsAudio.pause();
      creditsAudio.currentTime = 0;
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const bolterConfig = CLASS_CONFIGS.bolter;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Larger glowing orbs */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-5 animate-pulse"
            style={{
              width: `${100 + Math.random() * 150}px`,
              height: `${100 + Math.random() * 150}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-4 max-w-3xl w-full border border-purple-500/30 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl animate-pulse" />
          
          <div className="relative z-10">
            {/* Title Section */}
            <div className="text-center mb-4">
              <div className="relative">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2 animate-pulse drop-shadow-2xl">
                  ⚔️ Wrath of the Wrappers
                </h1>
                <div className="absolute inset-0 text-3xl md:text-4xl font-bold text-purple-400/20 blur-sm animate-pulse">
                  ⚔️ Wrath of the Wrappers
                </div>
              </div>
              <p className="text-gray-300 text-base font-medium animate-fade-in">Master the art of the Bolter</p>
              
              {/* Subtitle with typing effect */}
              <div className="mt-2 text-purple-300 text-sm font-light animate-pulse">
                Survive • Upgrade • Dominate
              </div>
            </div>

            {/* Bolter Class Card */}
            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-4 border border-purple-400/30 relative overflow-hidden group hover:border-purple-400/60 transition-all duration-500">
              {/* Card hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-4xl animate-bounce" style={{ animationDuration: '2s' }}>
                    {bolterConfig.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                      {bolterConfig.name}
                    </h3>
                    <p className="text-gray-300 text-sm">{bolterConfig.description}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 border border-yellow-500/30 group-hover:border-yellow-500/60 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1 mb-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <div className="text-sm text-gray-400">Gold</div>
                    </div>
                    <div className="text-lg font-bold text-yellow-400 animate-pulse">
                      {bolterData.totalGold.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 border border-green-500/30 group-hover:border-green-500/60 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1 mb-1">
                      <Trophy className="w-4 h-4 text-green-400" />
                      <div className="text-sm text-gray-400">Best Time</div>
                    </div>
                    <div className="text-lg font-bold text-green-400">
                      {formatTime(bolterData.bestSurvivalTime * 1000)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 border border-red-500/30 group-hover:border-red-500/60 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="w-4 h-4 text-red-400" />
                      <div className="text-sm text-gray-400">Enemies</div>
                    </div>
                    <div className="text-lg font-bold text-red-400">
                      {bolterData.totalEnemiesKilled.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 border border-blue-500/30 group-hover:border-blue-500/60 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <div className="text-sm text-gray-400">Play Time</div>
                    </div>
                    <div className="text-lg font-bold text-blue-400">
                      {formatTime(bolterData.totalPlayTime)}
                    </div>
                  </div>
                </div>

                {/* Upgrades Section */}
                <div className="bg-gray-600/40 backdrop-blur-sm rounded-lg p-3 border border-purple-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <div className="text-sm font-bold text-white">Permanent Upgrades</div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="flex flex-col items-center p-2 bg-gray-700/50 rounded-lg border border-red-500/30 hover:border-red-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-lg mb-1">⚔️</span>
                      <span className="text-gray-300 text-sm">Damage</span>
                      <span className="text-white font-bold text-sm">{bolterData.permanentUpgrades.damage}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-700/50 rounded-lg border border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-lg mb-1">💨</span>
                      <span className="text-gray-300 text-sm">Speed</span>
                      <span className="text-white font-bold text-sm">{bolterData.permanentUpgrades.speed}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-700/50 rounded-lg border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-lg mb-1">❤️</span>
                      <span className="text-gray-300 text-sm">Health</span>
                      <span className="text-white font-bold text-sm">{bolterData.permanentUpgrades.health}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-700/50 rounded-lg border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-lg mb-1">🔥</span>
                      <span className="text-gray-300 text-sm">Fire Rate</span>
                      <span className="text-white font-bold text-sm">{bolterData.permanentUpgrades.fireRate}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-700/50 rounded-lg border border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-lg mb-1">💰</span>
                      <span className="text-gray-300 text-sm">Gold</span>
                      <span className="text-white font-bold text-sm">{bolterData.permanentUpgrades.goldBonus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Game Button */}
            <div className="text-center">
              <button
                onClick={onStartGame}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl overflow-hidden"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative z-10 flex items-center gap-4">
                  <Play className="w-6 h-6" />
                  <span>Start Game</span>
                </div>
              </button>
            </div>
            
            {/* Enhanced "Powered by Bolt" with stronger glow */}
            <div className="mt-4 text-center">
              <div className="relative inline-block">
                <div className="text-xs text-purple-400 font-medium animate-pulse drop-shadow-2xl">
                  ⚡ Powered by Bolt
                </div>
                <div className="absolute inset-0 text-xs text-purple-400 font-medium blur-sm animate-pulse opacity-75">
                  ⚡ Powered by Bolt
                </div>
                <div className="absolute inset-0 text-xs text-purple-400 font-medium blur-md animate-pulse opacity-50">
                  ⚡ Powered by Bolt
                </div>
              </div>
            </div>

            {/* Credits Button */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowCredits(true)}
                className="text-xs text-gray-400 hover:text-purple-400 transition-colors duration-300 underline"
              >
                Credits
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Modal */}
      {showCredits && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleCloseCredits}
              className="absolute top-8 right-8 z-10 text-gray-400 hover:text-white transition-colors duration-300 bg-black bg-opacity-50 rounded-full p-3"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title at top */}
            <div className="absolute top-0 left-0 right-0 z-10 p-8 text-center">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                ⚔️ Wrath of the Wrappers
              </h1>
              <div className="text-gray-300 font-medium mt-2 text-xl">Credits</div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center">
              <div 
                className="w-full max-w-4xl px-8 transition-transform duration-300 ease-out"
                style={{ 
                  transform: `translateY(-${scrollPosition}px)`,
                  paddingTop: '200px' // Start below the title
                }}
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-light text-white leading-relaxed tracking-wide whitespace-pre-line">
                    {displayedText}
                    {currentIndex < creditsText.length && (
                      <span className="animate-pulse text-purple-400">|</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom instruction */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <div className="text-sm text-gray-500">Press ESC or click X to close</div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}