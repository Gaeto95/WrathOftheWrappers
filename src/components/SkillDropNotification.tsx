import React, { useEffect, useState } from 'react';
import { PassiveSkill } from '../types/classes';
import { Check, X } from 'lucide-react';

interface SkillDropNotificationProps {
  skill: PassiveSkill | null;
  onAccept: () => void;
  onReject: () => void;
  autoRejectTime?: number;
}

export function SkillDropNotification({ 
  skill, 
  onAccept, 
  onReject, 
  autoRejectTime = 10000 
}: SkillDropNotificationProps) {
  const [timeLeft, setTimeLeft] = useState(5); // Fixed 5 seconds

  useEffect(() => {
    if (!skill) return;

    setTimeLeft(5); // Always 5 seconds
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onAccept(); // Auto-accept instead of reject
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [skill, onAccept]); // Changed dependency

  // Add keyboard shortcuts
  useEffect(() => {
    if (!skill) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'c') {
        onAccept();
      } else if (event.key.toLowerCase() === 'v') {
        onReject();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [skill, onAccept, onReject]);
  if (!skill) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-900 bg-opacity-95';
      case 'rare': return 'border-blue-500 bg-blue-900 bg-opacity-95';
      case 'epic': return 'border-purple-500 bg-purple-900 bg-opacity-95';
      case 'legendary': return 'border-yellow-500 bg-yellow-900 bg-opacity-95';
      default: return 'border-gray-500 bg-gray-900 bg-opacity-95';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="absolute top-40 left-4 z-50">
      <div className={`${getRarityColor(skill.rarity)} border rounded-lg p-2 w-40 shadow-xl`}>
        <div className="text-center mb-2">
          <div className="text-lg mb-1">{skill.icon}</div>
          <h3 className="text-xs font-bold text-white">{skill.name}</h3>
          <div className={`text-xs font-medium ${getRarityText(skill.rarity)} capitalize`}>
            {skill.rarity} Skill
          </div>
        </div>

        <div className="mb-2">
          <p className="text-gray-300 text-xs text-center mb-1 leading-tight line-clamp-2">
            {skill.description}
          </p>
          <div className="text-center">
            <span className="text-blue-400 font-bold text-xs">Lv{skill.currentLevel}</span>
            <span className="text-gray-400 text-xs">/{skill.maxLevel}</span>
          </div>
        </div>

        <div className="flex gap-1 mb-1">
          <button
            onClick={onAccept}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-1 rounded text-xs font-medium transition-colors flex items-center justify-center"
          >
            <Check className="w-3 h-3" />
            C
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-1 rounded text-xs font-medium transition-colors flex items-center justify-center"
          >
            <X className="w-3 h-3" />
            V
          </button>
        </div>

        <div className="text-center">
          <div className="text-xs text-gray-400">
            Auto in {Math.ceil(timeLeft)}s
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-green-500 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}