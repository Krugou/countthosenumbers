import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-5xl font-bold mb-8">Count Those Numbers</h1>
      <div className="flex flex-col gap-4">
        <Link
          to="/play"
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-semibold text-center"
        >
          Play Game
        </Link>
        <Link
          to="/leaderboard"
          className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-xl font-semibold text-center"
        >
          Leaderboard
        </Link>
        <Link
          to="/settings"
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-xl font-semibold text-center"
        >
          Settings
        </Link>
      </div>
    </div>
  );
};