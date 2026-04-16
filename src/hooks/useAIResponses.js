import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAIResponse, saveAIResponse, updateRound } from '../firebase/firestore';

export function useAIResponse(roundId) {
  const { user } = useAuth();
  const [aiResponse, setAIResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !roundId) return;
    setLoading(true);
    getAIResponse(user.uid, roundId)
      .then((data) => {
        setAIResponse(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, roundId]);

  const saveResponse = useCallback(
    async (data) => {
      if (!user || !roundId) return;
      await saveAIResponse(user.uid, roundId, data);
      await updateRound(user.uid, roundId, { hasAIResponse: true });
      setAIResponse(data);
    },
    [user, roundId]
  );

  return { aiResponse, loading, saveResponse };
}
