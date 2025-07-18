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
  const [timeLeft, setTimeLeft] = useState(autoRejectTime / 1000);

  useEffect(() => {
    if (!skill) return;

    setTimeLeft(autoRejectTime / 1000);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onReject();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [skill, autoRejectTime, onReject]);

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
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className={`${getRarityColor(skill.rarity)} border-2 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl`}>
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{skill.icon}</div>
          <h3 className="text-xl font-bold text-white">{skill.name}</h3>
          <div className={`text-sm font-medium ${getRarityText(skill.rarity)} capitalize`}>
            {skill.rarity} Skill
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 text-sm text-center mb-2">
            {skill.description}
          </p>
          <div className="text-center">
            <span className="text-blue-400 font-bold">Level {skill.currentLevel}</span>
            <span className="text-gray-400"> / {skill.maxLevel}</span>
          </div>
        </div>

        <div className="flex gap-3 mb-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Equip
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>

        <div className="text-center">
          <div className="text-xs text-gray-400">
            Auto-reject in {Math.ceil(timeLeft)}s
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
            <div 
              className="bg-red-500 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / (autoRejectTime / 1000)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}