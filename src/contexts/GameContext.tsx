import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, GameConfig } from '../types/game';
import { useLeaderboard } from '../hooks/useLeaderboard';

interface GameContextType {
  state: GameState;
  startGame: (config: GameConfig) => void;
  submitAnswer: (answer: number) => void;
  endGame: () => void;
}

const initialState: GameState = {
  currentNumber: 0,
  sequence: [],
  userInput: [],
  score: 0,
  isPlaying: false,
  gameOver: false,
  streak: 0,
  level: 1,
  currentIndex: -1,
  sequenceSum: 0,
  showingSequence: false,
  waitingForGuess: false,
  difficulty: 'medium',
};

type GameAction =
  | { type: 'START_GAME'; config: GameConfig }
  | { type: 'SHOW_NEXT_NUMBER' }
  | { type: 'SUBMIT_ANSWER'; answer: number }
  | { type: 'END_GAME' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'FINISH_SEQUENCE' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      console.log('Starting new game with config:', action.config);
      const sequence = generateSequence(action.config);
      return {
        ...initialState,
        isPlaying: true,
        sequence,
        currentIndex: 0,
        showingSequence: true,
        sequenceSum: sequence.reduce((a, b) => a + b, 0),
        waitingForGuess: false,
        difficulty: action.config.difficulty,
      };
    }
    case 'SHOW_NEXT_NUMBER': {
      if (state.currentIndex >= state.sequence.length - 1) {
        console.log('Finished showing sequence, waiting for guess');
        return {
          ...state,
          showingSequence: false,
          waitingForGuess: true,
          currentIndex: -1,
        };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
      };
    }
    case 'SUBMIT_ANSWER': {
      const isCorrect = state.sequenceSum === action.answer;
      console.log('Submitting answer:', {
        answer: action.answer,
        correct: state.sequenceSum,
        isCorrect
      });

      if (!isCorrect) {
        console.log('Incorrect answer, game over');
        return {
          ...state,
          isPlaying: false,
          gameOver: true,
          waitingForGuess: false,
        };
      }

      const newScore = state.score + calculateScore(state.level, state.streak);
      console.log('Correct answer! New score:', newScore);

      return {
        ...state,
        level: state.level + 1,
        score: newScore,
        streak: state.streak + 1,
        waitingForGuess: false,
        isPlaying: false,
        gameOver: true, // End the game on correct answer too
      };
    }
    case 'END_GAME':
      console.log('Ending game with score:', state.score);
      return {
        ...state,
        isPlaying: false,
        gameOver: true,
        waitingForGuess: false,
      };
    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { submitScore } = useLeaderboard(state.difficulty);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.showingSequence && state.currentIndex >= 0) {
      timer = setTimeout(() => {
        dispatch({ type: 'SHOW_NEXT_NUMBER' });
      }, 1000); // Show each number for 1 second
    }
    return () => clearTimeout(timer);
  }, [state.showingSequence, state.currentIndex]);

  // Save score when game is over
  useEffect(() => {
    const saveScore = async () => {
      if (state.gameOver && state.score > 0) {
        console.log('Attempting to save final score:', {
          score: state.score,
          difficulty: state.difficulty
        });
        try {
          await submitScore(state.score, state.difficulty);
          console.log('Score saved successfully');
        } catch (error) {
          console.error('Failed to save score:', error);
        }
      }
    };

    saveScore();
  }, [state.gameOver, state.score, state.difficulty, submitScore]);

  const startGame = (config: GameConfig) => {
    console.log('Starting game with config:', config);
    dispatch({ type: 'START_GAME', config });
  };

  const submitAnswer = (answer: number) => {
    if (state.waitingForGuess) {
      console.log('Submitting answer:', answer);
      dispatch({ type: 'SUBMIT_ANSWER', answer });
    }
  };

  const endGame = () => {
    console.log('Manually ending game');
    dispatch({ type: 'END_GAME' });
  };

  return (
    <GameContext.Provider value={{ state, startGame, submitAnswer, endGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Helper functions
const generateSequence = (config: GameConfig): number[] => {
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

const calculateScore = (level: number, streak: number): number => {
  const baseScore = 100;
  const levelMultiplier = 1.5;
  const streakBonus = Math.floor(streak / 3) * 50;

  return Math.floor(baseScore * Math.pow(levelMultiplier, level - 1) + streakBonus);
};