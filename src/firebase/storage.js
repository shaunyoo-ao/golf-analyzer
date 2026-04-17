import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import { getApp } from 'firebase/app';

function getStorageInstance() {
  const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  if (!bucket) throw new Error('Firebase Storage not configured. Set VITE_FIREBASE_STORAGE_BUCKET in environment.');
  return getStorage(getApp());
}

export async function uploadTrophyImage(uid, trophyId, blob) {
  const storageRef = ref(getStorageInstance(), `users/${uid}/trophies/${trophyId}.jpg`);
  const uploadPromise = uploadBytes(storageRef, blob, { contentType: 'image/jpeg' })
    .then(() => getDownloadURL(storageRef));
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Upload timed out. Check Firebase Storage is enabled and security rules allow writes.')), 30000)
  );
  return Promise.race([uploadPromise, timeout]);
}

export async function deleteTrophyImage(uid, trophyId) {
  try {
    await deleteObject(ref(getStorageInstance(), `users/${uid}/trophies/${trophyId}.jpg`));
  } catch {
    // Ignore if file doesn't exist
  }
}
