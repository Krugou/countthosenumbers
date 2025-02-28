import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'guest';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, playAsGuest, error, user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('guest');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  // Don't show modal if user is already authenticated
  if (!isOpen || user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (mode) {
        case 'login':
          await signIn(formData.email, formData.password);
          break;
        case 'register':
          await signUp(formData.email, formData.password, formData.username);
          break;
        case 'guest':
          await playAsGuest(formData.username);
          break;
      }
      onClose();
    } catch {
      // Error is handled by the useAuth hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Play as Guest'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 text-red-400 p-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username field - shown for register and guest */}
          {(mode === 'register' || mode === 'guest') && (
            <div>
              <label htmlFor="username" className="block text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="input-primary w-full"
                placeholder="Enter username"
              />
            </div>
          )}

          {/* Email and password fields - shown for login and register */}
          {(mode === 'login' || mode === 'register') && (
            <>
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-primary w-full"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-primary w-full"
                  placeholder="Enter password"
                />
              </div>
            </>
          )}

          <button type="submit" className="button-primary w-full">
            {mode === 'login'
              ? 'Login'
              : mode === 'register'
              ? 'Register'
              : 'Play as Guest'}
          </button>
        </form>

        <div className="mt-4 flex gap-4 justify-center text-sm">
          <button
            onClick={() => setMode('guest')}
            className={`text-gray-400 hover:text-white ${
              mode === 'guest' ? 'text-white' : ''
            }`}
          >
            Play as Guest
          </button>
          <button
            onClick={() => setMode('login')}
            className={`text-gray-400 hover:text-white ${
              mode === 'login' ? 'text-white' : ''
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`text-gray-400 hover:text-white ${
              mode === 'register' ? 'text-white' : ''
            }`}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};