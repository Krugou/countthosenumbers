import React, { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { GameScene } from './components/GameScene';
import { GameControls } from './components/GameControls';
import { Leaderboard } from './components/Leaderboard';
import { useGameSettings } from './hooks/useGameSettings';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './components/AuthModal';

function App() {
  const { settings } = useGameSettings();
  const { user, isAnonymous, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(!user);

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold">Count Those Numbers</h1>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-400">
                  Playing as: <span className="text-white">{isAnonymous ? 'Guest' : user.email}</span>
                </span>
                <button
                  onClick={handleAuthAction}
                  className="button-secondary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className="button-secondary"
              >
                Login / Register
              </button>
            )}
          </div>
          <p className="text-gray-400">
            Test your memory with this fun number sequence game!
          </p>
        </header>

        <main className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Game Controls */}
            <div className="lg:col-span-1">
              <GameControls />
            </div>

            {/* Middle column - Game Scene */}
            <div className="lg:col-span-1 aspect-square">
              <GameScene />
            </div>

            {/* Right column - Leaderboard */}
            <div className="lg:col-span-1">
              <Leaderboard difficulty={settings.difficulty} />
            </div>
          </div>
        </main>

        <footer className="mt-8 text-center text-gray-400">
          <p>&copy; 2024 Count Those Numbers. All rights reserved.</p>
        </footer>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </GameProvider>
  );
}

export default App;
