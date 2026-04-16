import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from './config';

const provider = new GoogleAuthProvider();

// Ensure session persists across browser restarts
setPersistence(auth, browserLocalPersistence).catch(() => {});

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser() {
  await signOut(auth);
}
