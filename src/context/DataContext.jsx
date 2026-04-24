import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useRounds } from '../hooks/useRounds';
import { useUpcomingRound } from '../hooks/useUpcomingRound';

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
  const {
    upcomingRound, loading: urL,
    saveUpcomingRound, deleteUpcomingRound, refetch: refetchUpcoming,
  } = useUpcomingRound();

  // hasLoaded becomes true after profile + rounds finish their first fetch.
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
      await Promise.all([refetchProfile(), refetchRounds(), refetchUpcoming()]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetchProfile, refetchRounds, refetchUpcoming]);

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
        upcomingRound, upcomingRoundLoading: urL, saveUpcomingRound, deleteUpcomingRound,
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
