import React, { useEffect, useState } from 'react';
import { Sword, Shield, Zap, Target } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const loadingTips = [
    "🏹 The Bolter excels at piercing through enemy lines",
    "💰 Gold persists between runs - invest in permanent upgrades",
    "⚡ Skills drop randomly - choose wisely for your build",
    "🎯 Auto-targeting helps you focus on movement and survival",
    "🔥 Fire rate upgrades compound with skill bonuses",
    "👾 Different enemy types require different strategies",
    "💎 Rare skills can completely change your playstyle",
    "🏃 Speed is often more valuable than raw damage"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-red-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
      </div>

      <div className="text-center z-10 max-w-2xl mx-auto px-8">
        {/* Main title with glow effect */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-4 animate-pulse">
            ⚔️ Wrath of the Wrappers
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            Master the art of survival
          </p>
        </div>

        {/* Animated icons */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="animate-bounce" style={{ animationDelay: '0s' }}>
            <Sword className="w-12 h-12 text-yellow-400" />
          </div>
          <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Shield className="w-12 h-12 text-blue-400" />
          </div>
          <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>
            <Zap className="w-12 h-12 text-purple-400" />
          </div>
          <div className="animate-bounce" style={{ animationDelay: '0.6s' }}>
            <Target className="w-12 h-12 text-green-400" />
          </div>
        </div>

        {/* Loading bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-2 text-gray-400 font-medium">
            Loading... {progress}%
          </div>
        </div>

        {/* Rotating tips */}
        <div className="bg-black bg-opacity-40 rounded-lg p-6 border border-purple-500 border-opacity-30">
          <div className="text-purple-400 font-bold mb-2">💡 Pro Tip</div>
          <div className="text-gray-300 text-lg font-medium min-h-[3rem] flex items-center justify-center">
            {loadingTips[currentTip]}
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}