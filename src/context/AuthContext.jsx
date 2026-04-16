import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    // Must await getRedirectResult before subscribing to onAuthStateChanged.
    // Firebase v9+ requires an explicit getRedirectResult call to restore auth
    // state after signInWithRedirect; without it onAuthStateChanged fires null.
    getRedirectResult(auth)
      .catch((err) => {
        console.error('[Auth] redirect result error:', err?.code, err?.message);
      })
      .finally(() => {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
        });
      });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
