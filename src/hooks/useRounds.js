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

      // Compute score differential for any round with a total score.
      // Use provided CR/SR or WHS defaults (72.0 / 113) so manual rounds also qualify.
      if (finalData.totalScore) {
        const cr = finalData.courseRating ? Number(finalData.courseRating) : 72;
        const sr = finalData.slopeRating ? Number(finalData.slopeRating) : 113;
        finalData.scoreDifferential = scoreDifferential(
          Number(finalData.totalScore), cr, sr
        );
      }

      onStep?.(1); // Step 1: writing round document
      // Strip id from data before writing to Firestore (undefined id causes addDoc error)
      const { id: docId, ...dataToSave } = finalData;
      let roundId;
      if (docId) {
        await updateRound(user.uid, docId, dataToSave);
        roundId = docId;
      } else {
        roundId = await addRound(user.uid, dataToSave);
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
