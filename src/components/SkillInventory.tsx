import React from 'react';
import { PassiveSkill } from '../types/classes';
import { X } from 'lucide-react';

interface SkillInventoryProps {
  equippedSkills: PassiveSkill[];
  onRemoveSkill: (skillId: string) => void;
}

export function SkillInventory({ equippedSkills, onRemoveSkill }: SkillInventoryProps) {
  const maxSkills = 5;
  const emptySlots = maxSkills - equippedSkills.length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-800';
      case 'rare': return 'border-blue-500 bg-blue-900 bg-opacity-30';
      case 'epic': return 'border-purple-500 bg-purple-900 bg-opacity-30';
      case 'legendary': return 'border-yellow-500 bg-yellow-900 bg-opacity-30';
      default: return 'border-gray-500 bg-gray-800';
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 p-4 rounded-lg">
      <div className="text-white text-sm font-medium mb-2 text-center">
        Equipped Skills ({equippedSkills.length}/{maxSkills})
      </div>
      
      <div className="flex gap-2">
        {equippedSkills.map(skill => (
          <div
            key={skill.id}
            className={`relative w-12 h-12 rounded-lg border-2 ${getRarityColor(skill.rarity)} flex items-center justify-center group cursor-pointer`}
            onClick={() => onRemoveSkill(skill.id)}
          >
            <span className="text-lg">{skill.icon}</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="w-2 h-2 text-white" />
            </div>
            
            {/* Level indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              {skill.currentLevel}
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              <div className="font-bold">{skill.name} (Level {skill.currentLevel})</div>
              <div className="text-gray-300">{skill.description}</div>
              <div className="text-xs text-gray-400 mt-1">Click to remove</div>
            </div>
          </div>
        ))}
        
        {/* Empty slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-600 bg-gray-800 bg-opacity-50 flex items-center justify-center"
          >
            <span className="text-gray-500 text-xs">+</span>
          </div>
        ))}
      </div>
    </div>
  );
}