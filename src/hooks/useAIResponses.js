import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAIResponse, saveAIResponse } from '../firebase/firestore';

export function useAIResponse(roundId) {
  const { user } = useAuth();
  const [aiResponse, setAIResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchResponse = useCallback(async () => {
    if (!user || !roundId) return;
    setLoading(true);
    const data = await getAIResponse(user.uid, roundId);
    setAIResponse(data);
    setLoading(false);
  }, [user, roundId]);

  const saveResponse = useCallback(
    async (data) => {
      if (!user || !roundId) return;
      await saveAIResponse(user.uid, roundId, data);
      setAIResponse(data);
    },
    [user, roundId]
  );

  return { aiResponse, loading, fetchResponse, saveResponse };
}
