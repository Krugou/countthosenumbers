import { useState, useEffect } from 'react';
import { GameConfig, Difficulty, Operation, VisualStyle } from '../types/game';

const DEFAULT_CONFIG: GameConfig = {
  difficulty: 'medium',
  numbersCount: 5,
  operations: 'addition',
  visualStyle: 'minimal',
};

interface UseGameSettings {
  settings: GameConfig;
  updateSettings: (newSettings: Partial<GameConfig>) => void;
  resetSettings: () => void;
}

export const useGameSettings = (): UseGameSettings => {
  const [settings, setSettings] = useState<GameConfig>(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    console.log('Settings updated:', settings);
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<GameConfig>) => {
    console.log('Updating settings with:', newSettings);
    setSettings((prev) => {
      const updated = {
        ...prev,
        ...newSettings,
      };
      console.log('New settings will be:', updated);
      return updated;
    });
  };

  const resetSettings = () => {
    console.log('Resetting settings to default');
    setSettings(DEFAULT_CONFIG);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
};

// Utility functions for settings validation
export const validateDifficulty = (difficulty: string): difficulty is Difficulty => {
  return ['easy', 'medium', 'hard'].includes(difficulty);
};

export const validateOperation = (operation: string): operation is Operation => {
  return ['addition', 'subtraction', 'both'].includes(operation);
};

export const validateVisualStyle = (style: string): style is VisualStyle => {
  return ['3d', 'minimal', 'enhanced'].includes(style);
};

export const validateNumbersCount = (count: number): boolean => {
  return count >= 3 && count <= 10;
};

export const getDifficultySettings = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy':
      return {
        numbersCount: 3,
        timeLimit: 5000, // 5 seconds per number
        maxNumber: 10,
      };
    case 'medium':
      return {
        numbersCount: 5,
        timeLimit: 4000, // 4 seconds per number
        maxNumber: 50,
      };
    case 'hard':
      return {
        numbersCount: 7,
        timeLimit: 3000, // 3 seconds per number
        maxNumber: 100,
      };
  }
};