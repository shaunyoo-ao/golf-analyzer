import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useRounds } from '../hooks/useRounds';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const {
    profile, loading: pL, error: pE,
    updateProfile, refetch: refetchProfile,
  } = useProfile();
  const {
    rounds, loading: rL, error: rE,
    saveRound: rawSave, removeRound, refetch: refetchRounds,
  } = useRounds();

  // hasLoaded becomes true after both hooks finish their first fetch and never resets.
  const pRef = useRef(false);
  const rRef = useRef(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    if (!pL) pRef.current = true;
    if (!rL) rRef.current = true;
    if (pRef.current && rRef.current) setHasLoaded(true);
  }, [pL, rL]);

  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await Promise.all([refetchProfile(), refetchRounds()]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetchProfile, refetchRounds]);

  // After saving a round, re-fetch profile to sync handicapIndex.
  const saveRound = useCallback(
    async (data, onStep) => {
      const id = await rawSave(data, onStep);
      await refetchProfile();
      return id;
    },
    [rawSave, refetchProfile]
  );

  return (
    <DataContext.Provider
      value={{
        profile, profileLoading: pL, profileError: pE, updateProfile,
        rounds, roundsLoading: rL, roundsError: rE, saveRound, removeRound,
        hasLoaded, refreshing, refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
