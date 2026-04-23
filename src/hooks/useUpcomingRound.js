import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUpcomingRound, saveUpcomingRound as fsSave, deleteUpcomingRound as fsDel } from '../firebase/firestore';

export function useUpcomingRound() {
  const { user } = useAuth();
  const [upcomingRound, setUpcomingRound] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try { setUpcomingRound(await getUpcomingRound(user.uid)); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { refetch(); }, [refetch]);

  const save = useCallback(async (data) => {
    await fsSave(user.uid, data);
    await refetch();
  }, [user, refetch]);

  const remove = useCallback(async () => {
    await fsDel(user.uid);
    setUpcomingRound(null);
  }, [user]);

  return { upcomingRound, loading, saveUpcomingRound: save, deleteUpcomingRound: remove, refetch };
}
