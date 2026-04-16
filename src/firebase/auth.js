import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from './config';

const provider = new GoogleAuthProvider();

// Ensure session persists across browser restarts
setPersistence(auth, browserLocalPersistence).catch(() => {});

export async function signInWithGoogle() {
  await signInWithRedirect(auth, provider);
}

export async function handleRedirectResult() {
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

export async function signOutUser() {
  await signOut(auth);
}
