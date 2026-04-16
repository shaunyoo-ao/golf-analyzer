import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from './config';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// Ensure session persists across browser restarts
setPersistence(auth, browserLocalPersistence).catch(() => {});

export async function signInWithGoogle() {
  await signInWithRedirect(auth, provider);
}

export async function signOutUser() {
  await signOut(auth);
}
