import React, { useState } from 'react';
import { GameCore } from '@countthosenumbers/shared';

export const DesktopGameDisplay: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const renderNumber = (number: number, isVisible: boolean) => (
    <div className="flex items-center justify-center">
      <span className="text-7xl font-bold">
        {isVisible ? number : ''}
      </span>
    </div>
  );

  const renderInput = (onSubmit: (value: number) => void) => (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl">What is the sum of all numbers?</h2>
      <div className="flex gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="px-4 py-2 bg-gray-800 rounded-lg text-lg w-48"
          placeholder="Enter the sum..."
        />
        <button
          onClick={() => {
            const value = parseInt(inputValue, 10);
            if (!isNaN(value)) {
              onSubmit(value);
              setInputValue('');
            }
          }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
        >
          Submit
        </button>
      </div>
    </div>
  );

  const renderControls = (onStart: () => void, onEnd: () => void) => (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onStart}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-semibold"
      >
        Start Game
      </button>
      <button
        onClick={onEnd}
        className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-xl font-semibold"
      >
        End Game
      </button>
    </div>
  );

  const renderGameOver = (score: number, sum: number, onRestart: () => void) => (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-red-500">Game Over!</h1>
      <p className="text-2xl">Score: {score}</p>
      <p className="text-2xl">The sum was: {sum}</p>
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-semibold"
      >
        Play Again
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <GameCore
        renderNumber={renderNumber}
        renderInput={renderInput}
        renderControls={renderControls}
        renderGameOver={renderGameOver}
      />
    </div>
  );
};