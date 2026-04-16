import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid, 'profile', 'data'));
  return snap.exists() ? snap.data() : null;
}

export async function saveProfile(uid, data) {
  await setDoc(doc(db, 'users', uid, 'profile', 'data'), data, { merge: true });
}

export async function updateHandicapIndex(uid, handicapIndex) {
  await updateDoc(doc(db, 'users', uid, 'profile', 'data'), { handicapIndex });
}

// ─── Rounds ──────────────────────────────────────────────────────────────────

export async function getRounds(uid) {
  const q = query(
    collection(db, 'users', uid, 'rounds'),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getRound(uid, roundId) {
  const snap = await getDoc(doc(db, 'users', uid, 'rounds', roundId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addRound(uid, roundData) {
  const ref = await addDoc(collection(db, 'users', uid, 'rounds'), {
    ...roundData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateRound(uid, roundId, data) {
  await updateDoc(doc(db, 'users', uid, 'rounds', roundId), data);
}

export async function deleteRound(uid, roundId) {
  await deleteDoc(doc(db, 'users', uid, 'rounds', roundId));
}

// ─── AI Responses ────────────────────────────────────────────────────────────

export async function getAIResponse(uid, roundId) {
  const snap = await getDoc(doc(db, 'users', uid, 'aiResponses', roundId));
  return snap.exists() ? snap.data() : null;
}

export async function saveAIResponse(uid, roundId, data) {
  await setDoc(doc(db, 'users', uid, 'aiResponses', roundId), {
    ...data,
    generatedAt: serverTimestamp(),
  });
}
