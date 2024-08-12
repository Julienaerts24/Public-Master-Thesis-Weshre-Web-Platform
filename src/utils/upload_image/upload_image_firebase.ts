import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/firebase/config.js";

export async function uploadImageFromBlobUrl(blobUrl: string, storagePath: string) {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const storage = getStorage(app);
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
}

export async function getImageFromFirestoreUrl(firestoreURL: string): Promise<string> {
  try {
      const response = await fetch(firestoreURL);
      if (!response.ok) {
          throw new Error(`Failed to fetch image: Status ${response.status}`);
      }
      const blob = await response.blob();
      return URL.createObjectURL(blob);  // Convert the blob to a blob URL
  } catch (error) {
      console.error("Error downloading image as blob URL:", error);
      throw error;
  }
}

