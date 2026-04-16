import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export async function uploadTrophyImage(uid, trophyId, blob) {
  const storageRef = ref(storage, `users/${uid}/trophies/${trophyId}.jpg`);
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}

export async function deleteTrophyImage(uid, trophyId) {
  try {
    await deleteObject(ref(storage, `users/${uid}/trophies/${trophyId}.jpg`));
  } catch {
    // Ignore if file doesn't exist
  }
}
