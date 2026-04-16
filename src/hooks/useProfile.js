import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, saveProfile } from '../firebase/firestore';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getProfile(user.uid)
      .then((data) => {
        setProfile(
          data || {
            name: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            age: '',
            gender: '',
            heightCm: '',
            weightKg: '',
            handedness: '',
            aiFeedbackLanguage: 'ko',
            handicapIndex: null,
            clubDistances: {},
            favoriteCourses: [],
            accountCreatedAt: new Date().toISOString(),
          }
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  const updateProfile = useCallback(
    async (data) => {
      if (!user) return;
      await saveProfile(user.uid, data);
      setProfile(data);
    },
    [user]
  );

  return { profile, loading, error, updateProfile };
}
