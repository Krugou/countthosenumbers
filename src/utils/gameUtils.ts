import { GameConfig } from '../types/game';

export const generateSequence = (config: GameConfig): number[] => {
  const sequence: number[] = [];
  const { numbersCount, difficulty } = config;

  for (let i = 0; i < numbersCount; i++) {
    let number: number;
    switch (difficulty) {
      case 'easy':
        number = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      case 'medium':
        number = Math.floor(Math.random() * 20) + 1; // 1-20
        break;
      case 'hard':
        number = Math.floor(Math.random() * 50) + 1; // 1-50
        break;
    }
    sequence.push(number);
  }

  return sequence;
};

export const calculateScore = (level: number, streak: number): number => {
  const baseScore = 100;
  const levelMultiplier = 1.5;
  const streakBonus = Math.floor(streak / 3) * 50;

  return Math.floor(baseScore * Math.pow(levelMultiplier, level - 1) + streakBonus);
};