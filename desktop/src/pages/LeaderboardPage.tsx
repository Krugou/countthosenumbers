import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeaderboard } from '@countthosenumbers/shared';
import type { Difficulty } from '@countthosenumbers/shared';

export const LeaderboardPage: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const { topScores, loading, error } = useLeaderboard(selectedDifficulty);

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
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>

        <div className="mb-8">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
            className="bg-gray-800 text-white rounded-lg p-3"
            aria-label="Select difficulty"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-xl">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-xl">{error}</div>
        ) : (
          <div className="space-y-4">
            {topScores.map((score, index) => (
              <div
                key={`${score.userId}-${score.timestamp}`}
                className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <div className="font-semibold">{score.username}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(score.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-400">{score.score}</div>
              </div>
            ))}
            {topScores.length === 0 && (
              <div className="text-center text-gray-400 text-xl">
                No scores yet. Be the first to play!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};