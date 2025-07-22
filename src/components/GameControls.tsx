import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useGameSettings } from '../hooks/useGameSettings';
import { useSound } from '../utils/sound';
import { GameConfig, Difficulty, VisualStyle } from '../types/game';
import { logger } from '../utils/logger';
import { validateNumberInput } from '../utils/validation';

export const GameControls: React.FC = React.memo(() => {
  const { state, startGame, submitAnswer, endGame } = useGame();
  const { settings, updateSettings } = useGameSettings();
  const { muted, toggleMute, playSound } = useSound();
  const [inputValue, setInputValue] = useState('');

  const handleStartGame = () => {
    playSound('click');
    startGame(settings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateNumberInput(inputValue);
    if (validation.isValid && validation.number !== undefined) {
      playSound('click');
      submitAnswer(validation.number);
      setInputValue('');
    } else {
      logger.warn('Invalid number input:', inputValue);
    }
  };

  const handleSettingChange = <K extends keyof GameConfig>(
    key: K,
    value: GameConfig[K]
  ) => {
    logger.debug(`Changing ${key} to:`, value);
    playSound('click');
    updateSettings({ [key]: value });
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg" role="region" aria-label="Game Controls">
      {/* Game Settings */}
      <fieldset className="mb-6">
        <legend className="text-lg font-medium text-white mb-4">Game Settings</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-gray-300 mb-2">Difficulty</label>
            <select
              id="difficulty"
              className="w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={settings.difficulty}
              onChange={(e) => handleSettingChange('difficulty', e.target.value as Difficulty)}
              disabled={state.isPlaying || state.waitingForGuess}
              aria-describedby="difficulty-desc"
            >
              <option value="easy">Easy (1-10)</option>
              <option value="medium">Medium (1-20)</option>
              <option value="hard">Hard (1-50)</option>
            </select>
            <div id="difficulty-desc" className="sr-only">
              Controls the range of numbers that will appear in the sequence
            </div>
          </div>

          <div>
            <label htmlFor="numbersCount" className="block text-gray-300 mb-2">Numbers Count</label>
            <input
              id="numbersCount"
              type="number"
              className="w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={settings.numbersCount}
              onChange={(e) => handleSettingChange('numbersCount', parseInt(e.target.value, 10))}
              min={3}
              max={10}
              disabled={state.isPlaying || state.waitingForGuess}
              aria-describedby="numbers-count-desc"
            />
            <div id="numbers-count-desc" className="sr-only">
              How many numbers will appear in the sequence (3-10)
            </div>
          </div>

          <div>
            <label htmlFor="visualStyle" className="block text-gray-300 mb-2">Visual Style</label>
            <select
              id="visualStyle"
              className="w-full bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={settings.visualStyle}
              onChange={(e) => {
                logger.debug('Visual style change event:', e.target.value);
                handleSettingChange('visualStyle', e.target.value as VisualStyle);
              }}
              disabled={state.isPlaying || state.waitingForGuess}
              aria-describedby="visual-style-desc"
            >
              <option value="minimal">Minimal</option>
              <option value="enhanced">Enhanced</option>
              <option value="3d">3D</option>
            </select>
            <div id="visual-style-desc" className="sr-only">
              Changes how numbers are displayed during the game
            </div>
          </div>
        </div>
      </fieldset>

      {/* Game Controls */}
      <div className="flex items-center justify-between mb-4" role="region" aria-label="Game Actions">
        <div className="flex gap-4">
          {!state.isPlaying && !state.waitingForGuess && !state.gameOver && (
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              onClick={handleStartGame}
              aria-label="Start new game"
            >
              Start Game
            </button>
          )}
          {(state.isPlaying || state.waitingForGuess) && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
              onClick={endGame}
              aria-label="End current game"
            >
              End Game
            </button>
          )}
        </div>

        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          title={muted ? 'Unmute sound' : 'Mute sound'}
        >
          <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
        </button>
      </div>

      {/* Sum Input */}
      {state.waitingForGuess && (
        <div role="region" aria-label="Answer Input">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor="answer-input" className="sr-only">
              Enter the sum of the numbers you saw
            </label>
            <input
              id="answer-input"
              type="number"
              className="flex-1 bg-gray-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter the sum..."
              aria-label="Sum of numbers"
              aria-required="true"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Submit answer"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Game Stats */}
      <div className="mt-4" role="region" aria-label="Game Statistics">
        <h3 className="sr-only">Current Game Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-700 p-2 rounded" aria-labelledby="score-label">
            <div id="score-label" className="text-gray-400 text-sm">Score</div>
            <div className="text-white text-xl" aria-live="polite">{state.score}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded" aria-labelledby="level-label">
            <div id="level-label" className="text-gray-400 text-sm">Level</div>
            <div className="text-white text-xl" aria-live="polite">{state.level}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded" aria-labelledby="streak-label">
            <div id="streak-label" className="text-gray-400 text-sm">Streak</div>
            <div className="text-white text-xl" aria-live="polite">{state.streak}</div>
          </div>
        </div>
      </div>
    </div>
  );
});