export type Difficulty = 'easy' | 'medium' | 'hard';
export type Operation = 'addition' | 'subtraction' | 'both';
export type VisualStyle = '3d' | 'minimal' | 'enhanced';

export interface GameConfig {
  difficulty: Difficulty;
  numbersCount: number;
  operations: Operation;
  visualStyle: VisualStyle;
}

export interface UserProfile {
  uid: string;
  username: string;
  highScores: {
    [difficulty in Difficulty]?: number;
  };
  lastPlayed: number; // timestamp
  totalGamesPlayed: number;
}

export interface GameSession {
  sessionId: string;
  userId: string;
  config: GameConfig;
  score: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  timestamp: number;
}

export interface GameState {
  currentNumber: number;
  sequence: number[];
  userInput: number[];
  score: number;
  isPlaying: boolean;
  gameOver: boolean;
  streak: number;
  level: number;
  currentIndex: number;
  sequenceSum: number;
  showingSequence: boolean;
  waitingForGuess: boolean;
  difficulty: Difficulty;
}