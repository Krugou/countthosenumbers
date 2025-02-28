import { useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types/game';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAnonymous: boolean;
}

interface UseAuth {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAnonymous: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  playAsGuest: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export const useAuth = (): UseAuth => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAnonymous: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState((prev) => ({
        ...prev,
        user,
        loading: false,
        isAnonymous: user?.isAnonymous || false,
      }));
    });

    return () => unsubscribe();
  }, []);

  const playAsGuest = async (username: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const { user } = await signInAnonymously(auth);

      // Create temporary user profile
      const userProfile: UserProfile = {
        uid: user.uid,
        username: `${username} (Guest)`,
        highScores: {},
        lastPlayed: Date.now(),
        totalGamesPlayed: 0,
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      setAuthState((prev) => ({ ...prev, isAnonymous: true }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: (error as Error).message,
        loading: false,
      }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: (error as Error).message,
        loading: false,
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      const userProfile: UserProfile = {
        uid: user.uid,
        username,
        highScores: {},
        lastPlayed: Date.now(),
        totalGamesPlayed: 0,
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: (error as Error).message,
        loading: false,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signOut(auth);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: (error as Error).message,
        loading: false,
      }));
      throw error;
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!authState.user) {
      throw new Error('No user logged in');
    }

    try {
      const userRef = doc(db, 'users', authState.user.uid);
      const snapshot = await getDoc(userRef);
      const currentProfile = snapshot.data() as UserProfile;

      await setDoc(userRef, {
        ...currentProfile,
        ...profile,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: (error as Error).message,
      }));
      throw error;
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAnonymous: authState.isAnonymous,
    signIn,
    signUp,
    playAsGuest,
    logout,
    updateProfile,
  };
};