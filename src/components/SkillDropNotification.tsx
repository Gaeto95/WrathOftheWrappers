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

  if (!skill) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-800';
      case 'rare': return 'border-blue-500 bg-blue-900';
      case 'epic': return 'border-purple-500 bg-purple-900';
      case 'legendary': return 'border-yellow-500 bg-yellow-900';
      default: return 'border-gray-500 bg-gray-800';
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
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className={`${getRarityColor(skill.rarity)} border-2 rounded-lg p-4 max-w-xs w-full mx-4 shadow-xl`}>
        <div className="text-center mb-3">
          <div className="text-3xl mb-1">{skill.icon}</div>
          <h3 className="text-lg font-bold text-white">{skill.name}</h3>
          <div className={`text-xs font-medium ${getRarityText(skill.rarity)} capitalize`}>
            {skill.rarity} Skill
          </div>
        </div>

        <div className="mb-3">
          <p className="text-gray-300 text-xs text-center mb-1">
            {skill.description}
          </p>
          <div className="text-center">
            <span className="text-blue-400 font-bold text-sm">Level {skill.currentLevel}</span>
            <span className="text-gray-400 text-sm"> / {skill.maxLevel}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          <button
            onClick={onAccept}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded font-medium transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Check className="w-3 h-3" />
            Equip
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded font-medium transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <X className="w-3 h-3" />
            Reject
          </button>
        </div>

        <div className="text-center">
          <div className="text-xs text-gray-400">
            Auto-accept in {Math.ceil(timeLeft)}s
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-0.5">
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