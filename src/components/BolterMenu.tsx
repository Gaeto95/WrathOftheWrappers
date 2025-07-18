import React, { useEffect, useState } from 'react';
import { Play, Sword, Shield, Zap, Target, Crown, Trophy, Clock, Coins } from 'lucide-react';
import { BolterData } from '../types/bolter';
import { CLASS_CONFIGS } from '../types/classes';

interface BolterMenuProps {
  bolterData: BolterData;
  onStartGame: () => void;
}

export function BolterMenu({ bolterData, onStartGame }: BolterMenuProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Larger glowing orbs */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-10 animate-pulse"
            style={{
              width: `${50 + Math.random() * 100}px`,
              height: `${50 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="border border-purple-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>

        {/* Mouse follower effect */}
        <div
          className="absolute w-96 h-96 bg-gradient-radial from-purple-500/10 to-transparent rounded-full pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-4xl w-full border border-purple-500/30 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl animate-pulse" />
          
          {/* Floating icons around the card */}
          <div className="absolute -top-4 -left-4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>
            <Sword className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
          </div>
          <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Shield className="w-8 h-8 text-blue-400 drop-shadow-lg" />
          </div>
          <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>
            <Zap className="w-8 h-8 text-purple-400 drop-shadow-lg" />
          </div>
          <div className="absolute -bottom-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '1.5s' }}>
            <Target className="w-8 h-8 text-green-400 drop-shadow-lg" />
          </div>

          <div className="relative z-10">
            {/* Title Section */}
            <div className="text-center mb-12">
              <div className="relative">
                <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 animate-pulse drop-shadow-2xl">
                  ⚔️ Wrath of the Wrappers
                </h1>
                <div className="absolute inset-0 text-6xl md:text-7xl font-bold text-purple-400/20 blur-sm animate-pulse">
                  ⚔️ Wrath of the Wrappers
                </div>
              </div>
              <p className="text-gray-300 text-xl font-medium animate-fade-in">Master the art of the Bolter</p>
              
              {/* Subtitle with typing effect */}
              <div className="mt-4 text-purple-300 text-lg font-light animate-pulse">
                Survive • Upgrade • Dominate
              </div>
            </div>

            {/* Bolter Class Card */}
            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-400/30 relative overflow-hidden group hover:border-purple-400/60 transition-all duration-500">
              {/* Card hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>
                    {bolterConfig.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      {bolterConfig.name}
                    </h3>
                    <p className="text-gray-300 text-lg">{bolterConfig.description}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 group-hover:border-yellow-500/60 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <div className="text-sm text-gray-400">Gold</div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400 animate-pulse">
                      {bolterData.totalGold.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 group-hover:border-green-500/60 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-green-400" />
                      <div className="text-sm text-gray-400">Best Time</div>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatTime(bolterData.bestSurvivalTime * 1000)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-red-500/30 group-hover:border-red-500/60 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-red-400" />
                      <div className="text-sm text-gray-400">Enemies</div>
                    </div>
                    <div className="text-2xl font-bold text-red-400">
                      {bolterData.totalEnemiesKilled.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 group-hover:border-blue-500/60 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <div className="text-sm text-gray-400">Play Time</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      {formatTime(bolterData.totalPlayTime)}
                    </div>
                  </div>
                </div>

                {/* Upgrades Section */}
                <div className="bg-gray-600/40 backdrop-blur-sm rounded-xl p-6 border border-purple-400/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-6 h-6 text-purple-400" />
                    <div className="text-lg font-bold text-white">Permanent Upgrades</div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="flex flex-col items-center p-3 bg-gray-700/50 rounded-lg border border-red-500/30 hover:border-red-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-2xl mb-1">⚔️</span>
                      <span className="text-gray-300 text-sm">Damage</span>
                      <span className="text-white font-bold text-lg">{bolterData.permanentUpgrades.damage}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-700/50 rounded-lg border border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-2xl mb-1">💨</span>
                      <span className="text-gray-300 text-sm">Speed</span>
                      <span className="text-white font-bold text-lg">{bolterData.permanentUpgrades.speed}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-700/50 rounded-lg border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-2xl mb-1">❤️</span>
                      <span className="text-gray-300 text-sm">Health</span>
                      <span className="text-white font-bold text-lg">{bolterData.permanentUpgrades.health}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-700/50 rounded-lg border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-2xl mb-1">🔥</span>
                      <span className="text-gray-300 text-sm">Fire Rate</span>
                      <span className="text-white font-bold text-lg">{bolterData.permanentUpgrades.fireRate}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-700/50 rounded-lg border border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 hover:scale-105">
                      <span className="text-2xl mb-1">💰</span>
                      <span className="text-gray-300 text-sm">Gold</span>
                      <span className="text-white font-bold text-lg">{bolterData.permanentUpgrades.goldBonus}</span>
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
                className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white rounded-2xl font-bold text-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl overflow-hidden"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative z-10 flex items-center gap-4">
                  <Play className={`w-8 h-8 transition-transform duration-300 ${isHovered ? 'scale-125 rotate-12' : ''}`} />
                  <span>Start Game</span>
                  <div className="text-3xl animate-pulse">🏹</div>
                </div>
              </button>
              
              {/* Button subtitle */}
              <p className="mt-4 text-gray-400 text-lg animate-pulse">
                Enter the battlefield and prove your worth
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-tr-full" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-full" />
    </div>
  );
}