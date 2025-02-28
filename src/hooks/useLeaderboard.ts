import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LeaderboardEntry, Difficulty } from '../types/game';
import { useAuth } from './useAuth';

interface UseLeaderboard {
  topScores: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  submitScore: (score: number, difficulty: Difficulty) => Promise<void>;
}

interface FirestoreLeaderboardEntry extends LeaderboardEntry {
  id?: string;
  expiresAt?: Date;
}

export const useLeaderboard = (difficulty: Difficulty): UseLeaderboard => {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('Setting up leaderboard listener for difficulty:', difficulty);
    const leaderboardRef = collection(db, 'leaderboards', difficulty, 'scores');
    const q = query(
      leaderboardRef,
      orderBy('score', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const scores = snapshot.docs.map(doc => {
          const data = doc.data() as FirestoreLeaderboardEntry;
          return {
            userId: data.userId,
            username: data.username,
            score: data.score,
            timestamp: data.timestamp,
          };
        });
        console.log('Received leaderboard scores:', scores);
        setTopScores(scores);
        setLoading(false);
      } catch (error) {
        console.error('Error processing leaderboard data:', error);
        setError((error as Error).message);
        setLoading(false);
      }
    }, (error) => {
      console.error('Error in leaderboard subscription:', error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [difficulty]);

  const submitScore = async (score: number, difficulty: Difficulty) => {
    console.log('Attempting to submit score:', { score, difficulty, user });

    if (!user) {
      const error = 'Must be logged in to submit scores';
      console.error(error);
      setError(error);
      return;
    }

    try {
      const entry: FirestoreLeaderboardEntry = {
        userId: user.uid,
        username: user.isAnonymous ? 'Anonymous Player' : user.email || 'Unknown',
        score,
        timestamp: Date.now(),
      };

      console.log('Submitting score entry:', entry);

      const docRef = doc(db, 'leaderboards', difficulty, 'scores', user.uid);

      if (user.isAnonymous) {
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 24);

        await setDoc(docRef, {
          ...entry,
          expiresAt: serverTimestamp(),
        });
        console.log('Anonymous score submitted with expiration');
      } else {
        await setDoc(docRef, entry);
        console.log('Registered user score submitted');
      }

      console.log('Score successfully saved to database');
    } catch (error) {
      console.error('Error submitting score:', error);
      setError((error as Error).message);
      throw error;
    }
  };

  return {
    topScores,
    loading,
    error,
    submitScore,
  };
};