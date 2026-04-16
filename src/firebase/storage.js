import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import { getApp } from 'firebase/app';

function getStorageInstance() {
  return getStorage(getApp());
}

export async function uploadTrophyImage(uid, trophyId, blob) {
  const storageRef = ref(getStorageInstance(), `users/${uid}/trophies/${trophyId}.jpg`);
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}

export async function deleteTrophyImage(uid, trophyId) {
  try {
    await deleteObject(ref(getStorageInstance(), `users/${uid}/trophies/${trophyId}.jpg`));
  } catch {
    // Ignore if file doesn't exist
  }
}
