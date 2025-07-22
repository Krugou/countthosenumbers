import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, GameConfig } from '../types/game';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { generateSequence, calculateScore } from '../utils/gameUtils';
import { gameLogger } from '../utils/logger';

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
      gameLogger.start(action.config);
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
        gameLogger.debug('Finished showing sequence, waiting for guess');
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
      gameLogger.submit(action.answer, state.sequenceSum, isCorrect);

      if (!isCorrect) {
        gameLogger.debug('Incorrect answer, game over');
        return {
          ...state,
          isPlaying: false,
          gameOver: true,
          waitingForGuess: false,
        };
      }

      const newScore = state.score + calculateScore(state.level, state.streak);
      gameLogger.debug('Correct answer! New score:', newScore);

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
      gameLogger.end(state.score);
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

export { GameContext };

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
        gameLogger.debug('Attempting to save final score:', {
          score: state.score,
          difficulty: state.difficulty
        });
        try {
          await submitScore(state.score, state.difficulty);
          gameLogger.info('Score saved successfully');
        } catch (error) {
          gameLogger.error('save-score', error as Error);
        }
      }
    };

    saveScore();
  }, [state.gameOver, state.score, state.difficulty, submitScore]);

  const startGame = (config: GameConfig) => {
    gameLogger.debug('Starting game with config:', config);
    dispatch({ type: 'START_GAME', config });
  };

  const submitAnswer = (answer: number) => {
    if (state.waitingForGuess) {
      gameLogger.debug('Submitting answer:', answer);
      dispatch({ type: 'SUBMIT_ANSWER', answer });
    }
  };

  const endGame = () => {
    gameLogger.debug('Manually ending game');
    dispatch({ type: 'END_GAME' });
  };

  return (
    <GameContext.Provider value={{ state, startGame, submitAnswer, endGame }}>
      {children}
    </GameContext.Provider>
  );
};

