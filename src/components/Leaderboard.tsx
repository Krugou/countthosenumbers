import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Difficulty } from '../types/game';
import { LoadingSkeleton } from './LoadingSkeleton';

interface LeaderboardProps {
  difficulty: Difficulty;
}

export const Leaderboard: React.FC<LeaderboardProps> = React.memo(({ difficulty }) => {
  const { topScores, loading, error } = useLeaderboard(difficulty);

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg" aria-label="Loading leaderboard">
        <h2 className="text-xl text-white mb-4 text-center">
          Leaderboard - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </h2>
        <LoadingSkeleton count={5} height="h-16" className="space-y-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg" aria-label="Leaderboard error">
        <div className="text-red-500 text-center">Error loading leaderboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl text-white mb-4 text-center">
        Leaderboard - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </h2>

      {topScores.length === 0 ? (
        <div className="text-gray-400 text-center" aria-label="No scores available">
          No scores yet. Be the first to play!
        </div>
      ) : (
        <div className="space-y-2" role="table" aria-label="High scores">
          {topScores.map((score, index) => (
            <div
              key={`${score.userId}-${score.timestamp}`}
              className="flex items-center justify-between p-2 bg-gray-700 rounded"
              role="row"
            >
              <div className="flex items-center space-x-4" role="cell">
                <span className="text-gray-400 w-8" aria-label={`Rank ${index + 1}`}>
                  #{index + 1}
                </span>
                <span className="text-white" aria-label={`Player ${score.username}`}>
                  {score.username}
                </span>
              </div>
              <div className="flex items-center space-x-4" role="cell">
                <span className="text-yellow-400" aria-label={`Score ${score.score}`}>
                  {score.score}
                </span>
                <span className="text-gray-400 text-sm" aria-label={`Played on ${new Date(score.timestamp).toLocaleDateString()}`}>
                  {new Date(score.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});