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

function stripUndefined(obj) {
  if (Array.isArray(obj)) return obj.map(stripUndefined);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)])
    );
  }
  return obj;
}

export async function saveProfile(uid, data) {
  await setDoc(doc(db, 'users', uid, 'profile', 'data'), stripUndefined(data), { merge: true });
}

export async function updateHandicapIndex(uid, handicapIndex) {
  // Use setDoc with merge so it works even if the profile doc doesn't exist yet
  await setDoc(
    doc(db, 'users', uid, 'profile', 'data'),
    { handicapIndex },
    { merge: true }
  );
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
  await updateDoc(doc(db, 'users', uid, 'rounds', roundId), {
    ...data,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
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

// ─── Upcoming Round ──────────────────────────────────────────────────────────

export async function getUpcomingRound(uid) {
  const snap = await getDoc(doc(db, 'users', uid, 'upcomingRound', 'data'));
  return snap.exists() ? snap.data() : null;
}

export async function saveUpcomingRound(uid, data) {
  await setDoc(doc(db, 'users', uid, 'upcomingRound', 'data'), stripUndefined(data));
}

export async function deleteUpcomingRound(uid) {
  await deleteDoc(doc(db, 'users', uid, 'upcomingRound', 'data'));
}
