import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import { getApp } from 'firebase/app';

function getStorageInstance() {
  const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  if (!bucket) throw new Error('Firebase Storage not configured. Set VITE_FIREBASE_STORAGE_BUCKET in environment.');
  return getStorage(getApp());
}

export async function uploadTrophyImage(uid, trophyId, blob) {
  const storage = getStorageInstance();
  console.log('[Storage] bucket:', storage.app.options.storageBucket);
  console.log('[Storage] uid:', uid, 'path:', `users/${uid}/trophies/${trophyId}.jpg`);

  const storageRef = ref(storage, `users/${uid}/trophies/${trophyId}.jpg`);

  const uploadPromise = uploadBytes(storageRef, blob, { contentType: 'image/jpeg' })
    .then((snapshot) => {
      console.log('[Storage] uploadBytes OK, fetching download URL...');
      return getDownloadURL(snapshot.ref);
    })
    .then((url) => {
      console.log('[Storage] download URL OK');
      return url;
    })
    .catch((err) => {
      console.error('[Storage] error code:', err?.code, 'message:', err?.message, err);
      throw new Error(`Upload failed (${err?.code ?? 'unknown'}): ${err?.message ?? err}`);
    });

  const timeout = new Promise((_, reject) =>
    setTimeout(() => {
      console.error('[Storage] timed out after 30s — check Storage rules and bucket name');
      reject(new Error('Upload timed out (30s). Open browser console for details.'));
    }, 30000)
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
