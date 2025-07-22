// Input validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 20) {
    errors.push('Username must be no more than 20 characters long');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateNumberInput = (value: string): { isValid: boolean; number?: number } => {
  const trimmed = value.trim();
  if (trimmed === '') {
    return { isValid: false };
  }
  
  const number = parseInt(trimmed, 10);
  if (isNaN(number)) {
    return { isValid: false };
  }
  
  // Reasonable bounds for game answers
  if (number < -10000 || number > 10000) {
    return { isValid: false };
  }
  
  return { isValid: true, number };
};

import { GameConfig } from '../types/game';

export const validateGameConfig = (config: unknown): config is GameConfig => {
  return (
    config !== null &&
    config !== undefined &&
    typeof config === 'object' &&
    'difficulty' in config &&
    'numbersCount' in config &&
    'operations' in config &&
    'visualStyle' in config &&
    ['easy', 'medium', 'hard'].includes((config as GameConfig).difficulty) &&
    typeof (config as GameConfig).numbersCount === 'number' &&
    (config as GameConfig).numbersCount >= 3 &&
    (config as GameConfig).numbersCount <= 10 &&
    ['addition', 'subtraction', 'both'].includes((config as GameConfig).operations) &&
    ['3d', 'minimal', 'enhanced'].includes((config as GameConfig).visualStyle)
  );
};