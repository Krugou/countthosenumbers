import React, { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { WebGameDisplay } from './components/web/WebGameDisplay';
import { GameControls } from './components/GameControls';
import { Leaderboard } from './components/Leaderboard';
import { useGameSettings } from './hooks/useGameSettings';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';

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
    <ErrorBoundary>
      <GameProvider>
        <div className="min-h-screen bg-gray-900 text-white p-8">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold">Count Those Numbers</h1>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-400" aria-label="Current user">
                    Playing as: <span className="text-white">{isAnonymous ? 'Guest' : user.email}</span>
                  </span>
                  <button
                    onClick={handleAuthAction}
                    className="button-secondary"
                    aria-label="Sign out of account"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="button-secondary"
                  aria-label="Sign in or create account"
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
              <section className="lg:col-span-1" aria-label="Game settings and controls">
                <GameControls />
              </section>

              {/* Middle column - Game Scene */}
              <section className="lg:col-span-1 aspect-square" aria-label="Game display area">
                <WebGameDisplay />
              </section>

              {/* Right column - Leaderboard */}
              <aside className="lg:col-span-1" aria-label="Leaderboard">
                <Leaderboard difficulty={settings.difficulty} />
              </aside>
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
    </ErrorBoundary>
  );
}

export default App;
