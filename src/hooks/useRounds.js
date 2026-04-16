import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getRounds,
  getRound,
  addRound,
  updateRound,
  deleteRound,
  updateHandicapIndex,
} from '../firebase/firestore';
import { scoreDifferential, handicapIndex } from '../utils/handicap';

export function useRounds() {
  const { user } = useAuth();
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRounds = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getRounds(user.uid);
      setRounds(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRounds();
  }, [fetchRounds]);

  const saveRound = useCallback(
    async (roundData, onStep) => {
      if (!user) return;

      let finalData = { ...roundData };

      // Compute score differential if rating data is present
      if (finalData.courseRating && finalData.slopeRating && finalData.totalScore) {
        finalData.scoreDifferential = scoreDifferential(
          Number(finalData.totalScore),
          Number(finalData.courseRating),
          Number(finalData.slopeRating)
        );
      }

      onStep?.(1); // Step 1: writing round document
      let roundId;
      if (finalData.id) {
        const { id, ...rest } = finalData;
        await updateRound(user.uid, id, rest);
        roundId = id;
      } else {
        roundId = await addRound(user.uid, finalData);
      }

      onStep?.(2); // Step 2: refresh list + compute handicap
      const updated = await getRounds(user.uid);
      setRounds(updated);

      const newHI = handicapIndex(updated);
      if (newHI !== null) {
        await updateHandicapIndex(user.uid, newHI);
      }

      onStep?.(3); // Step 3: done
      return roundId;
    },
    [user]
  );

  const removeRound = useCallback(
    async (roundId) => {
      if (!user) return;
      await deleteRound(user.uid, roundId);
      setRounds((prev) => prev.filter((r) => r.id !== roundId));
    },
    [user]
  );

  return { rounds, loading, error, saveRound, removeRound, refetch: fetchRounds };
}

export function useRound(roundId) {
  const { user } = useAuth();
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !roundId) {
      setLoading(false);
      return;
    }
    getRound(user.uid, roundId)
      .then((data) => {
        setRound(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, roundId]);

  return { round, loading };
}
