import React from 'react';
import { Link } from 'react-router-dom';
import { GameProvider } from '@countthosenumbers/shared';
import { DesktopGameDisplay } from '../components/DesktopGameDisplay';

export const GamePage: React.FC = () => {
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
      <GameProvider>
        <DesktopGameDisplay />
      </GameProvider>
    </div>
  );
};