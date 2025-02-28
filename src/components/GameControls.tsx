import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useGameSettings } from '../hooks/useGameSettings';
import { useSound } from '../utils/sound';
import { GameConfig, Difficulty, VisualStyle } from '../types/game';

export const GameControls: React.FC = () => {
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
    const number = parseInt(inputValue, 10);
    if (!isNaN(number)) {
      playSound('click');
      submitAnswer(number);
      setInputValue('');
    }
  };

  const handleSettingChange = <K extends keyof GameConfig>(
    key: K,
    value: GameConfig[K]
  ) => {
    console.log(`Changing ${key} to:`, value);
    playSound('click');
    updateSettings({ [key]: value });
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      {/* Game Settings */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="difficulty" className="block text-gray-300 mb-2">Difficulty</label>
          <select
            id="difficulty"
            className="w-full bg-gray-700 text-white rounded p-2"
            value={settings.difficulty}
            onChange={(e) => handleSettingChange('difficulty', e.target.value as Difficulty)}
            disabled={state.isPlaying || state.waitingForGuess}
          >
            <option value="easy">Easy (1-10)</option>
            <option value="medium">Medium (1-20)</option>
            <option value="hard">Hard (1-50)</option>
          </select>
        </div>

        <div>
          <label htmlFor="numbersCount" className="block text-gray-300 mb-2">Numbers Count</label>
          <input
            id="numbersCount"
            type="number"
            className="w-full bg-gray-700 text-white rounded p-2"
            value={settings.numbersCount}
            onChange={(e) => handleSettingChange('numbersCount', parseInt(e.target.value, 10))}
            min={3}
            max={10}
            disabled={state.isPlaying || state.waitingForGuess}
          />
        </div>

        <div>
          <label htmlFor="visualStyle" className="block text-gray-300 mb-2">Visual Style</label>
          <select
            id="visualStyle"
            className="w-full bg-gray-700 text-white rounded p-2"
            value={settings.visualStyle}
            onChange={(e) => {
              console.log('Visual style change event:', e.target.value);
              handleSettingChange('visualStyle', e.target.value as VisualStyle);
            }}
            disabled={state.isPlaying || state.waitingForGuess}
          >
            <option value="minimal">Minimal</option>
            <option value="enhanced">Enhanced</option>
            <option value="3d">3D</option>
          </select>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          {!state.isPlaying && !state.waitingForGuess && !state.gameOver && (
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          )}
          {(state.isPlaying || state.waitingForGuess) && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
              onClick={endGame}
            >
              End Game
            </button>
          )}
        </div>

        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          onClick={toggleMute}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Sum Input */}
      {state.waitingForGuess && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="number"
            className="flex-1 bg-gray-700 text-white rounded p-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter the sum..."
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </form>
      )}

      {/* Game Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400 text-sm">Score</div>
          <div className="text-white text-xl">{state.score}</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400 text-sm">Level</div>
          <div className="text-white text-xl">{state.level}</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400 text-sm">Streak</div>
          <div className="text-white text-xl">{state.streak}</div>
        </div>
      </div>
    </div>
  );
};