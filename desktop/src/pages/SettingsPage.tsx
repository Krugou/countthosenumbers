import React from 'react';
import { Link } from 'react-router-dom';
import { useGameSettings } from '@countthosenumbers/shared';
import type { Difficulty, Operation, VisualStyle } from '@countthosenumbers/shared';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useGameSettings();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-4">
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold"
        >
          ← Back to Menu
        </Link>
      </div>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Game Settings</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-lg mb-2">Difficulty</label>
            <select
              value={settings.difficulty}
              onChange={(e) => updateSettings({ difficulty: e.target.value as Difficulty })}
              className="w-full bg-gray-800 text-white rounded-lg p-3"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-lg mb-2">Numbers Count</label>
            <input
              type="number"
              value={settings.numbersCount}
              onChange={(e) => updateSettings({ numbersCount: parseInt(e.target.value, 10) })}
              min={3}
              max={10}
              className="w-full bg-gray-800 text-white rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">Operations</label>
            <select
              value={settings.operations}
              onChange={(e) => updateSettings({ operations: e.target.value as Operation })}
              className="w-full bg-gray-800 text-white rounded-lg p-3"
            >
              <option value="addition">Addition Only</option>
              <option value="subtraction">Subtraction Only</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="block text-lg mb-2">Visual Style</label>
            <select
              value={settings.visualStyle}
              onChange={(e) => updateSettings({ visualStyle: e.target.value as VisualStyle })}
              className="w-full bg-gray-800 text-white rounded-lg p-3"
            >
              <option value="minimal">Minimal</option>
              <option value="enhanced">Enhanced</option>
              <option value="3d">3D</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};