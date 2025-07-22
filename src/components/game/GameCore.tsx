import React from 'react';
import { useGame } from '../../hooks/useGame';
import { useGameSettings } from '../../hooks/useGameSettings';
import { useSound } from '../../utils/sound';

interface GameCoreProps {
  renderNumber: (number: number, isVisible: boolean) => React.ReactNode;
  renderInput: (onSubmit: (value: number) => void) => React.ReactNode;
  renderControls: (onStart: () => void, onEnd: () => void) => React.ReactNode;
  renderGameOver: (score: number, sum: number, onRestart: () => void) => React.ReactNode;
}

export const GameCore: React.FC<GameCoreProps> = ({
  renderNumber,
  renderInput,
  renderControls,
  renderGameOver,
}) => {
  const { state, startGame, submitAnswer, endGame } = useGame();
  const { settings } = useGameSettings();
  const { playSound } = useSound();

  const handleStartGame = () => {
    playSound('click');
    startGame(settings);
  };

  const handleSubmit = (value: number) => {
    playSound('click');
    submitAnswer(value);
  };

  const handleEndGame = () => {
    playSound('click');
    endGame();
  };

  // Game state rendering
  if (state.gameOver) {
    return renderGameOver(state.score, state.sequenceSum, handleStartGame);
  }

  if (state.waitingForGuess) {
    return renderInput(handleSubmit);
  }

  if (state.showingSequence && state.currentIndex >= 0) {
    return renderNumber(state.sequence[state.currentIndex], true);
  }

  // Initial/default state
  return renderControls(handleStartGame, handleEndGame);
};