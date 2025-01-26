import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import type { SentenceRecord } from "../types/sentences";

export async function addSentence(
  userId: string,
  text: string,
  audioData?: string
): Promise<string> {
  if (!userId) throw new Error("User must be authenticated to add a sentence");

  try {
    const sentenceData: SentenceRecord = {
      userId,
      text,
      createdAt: serverTimestamp(),
      audioData: audioData || null,
    };

    const docRef = await addDoc(collection(db, "sentences"), sentenceData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding sentence:", error);
    throw error;
  }
}

export async function getSentences(userId: string): Promise<SentenceRecord[]> {
  if (!userId) throw new Error("User must be authenticated to get sentences");

  try {
    const q = query(collection(db, "sentences"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        text: data.text,
        audioData: data.audioData,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
      } as SentenceRecord;
    });
  } catch (error) {
    console.error("Error getting sentences:", error);
    throw error; // Propagate the error instead of returning an empty array
  }
}

export async function updateSentence(
  sentenceId: string,
  updates: Partial<SentenceRecord>
): Promise<void> {
  try {
    const sentenceRef = doc(db, "sentences", sentenceId);
    await updateDoc(sentenceRef, updates);
  } catch (error) {
    console.error("Error updating sentence:", error);
    throw error;
  }
}

export async function deleteSentence(sentenceId: string): Promise<void> {
  try {
    const sentenceRef = doc(db, "sentences", sentenceId);
    await deleteDoc(sentenceRef);
  } catch (error) {
    console.error("Error deleting sentence:", error);
    throw error;
  }
}
