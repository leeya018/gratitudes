import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import type { SentenceRecord } from "../types/sentences";

export async function addSentence(
  userId: string,
  text: string,
  audioData?: string
): Promise<string> {
  try {
    const sentenceData: {
      userId: string;
      text: string;
      audioData?: string;
      createdAt: Timestamp;
    } = {
      userId,
      text,
      createdAt: Timestamp.now(),
    };

    if (audioData !== undefined) {
      sentenceData.audioData = audioData;
    }

    const docRef = await addDoc(collection(db, "sentences"), sentenceData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding sentence:", error);
    throw new Error("Failed to add sentence");
  }
}

export async function getSentences(userId: string): Promise<SentenceRecord[]> {
  try {
    const q = query(collection(db, "sentences"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as SentenceRecord[];
  } catch (error) {
    console.error("Error getting sentences:", error);
    // Instead of throwing an error, return an empty array
    return [];
  }
}

export async function deleteSentence(sentenceId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "sentences", sentenceId));
  } catch (error) {
    console.error("Error deleting sentence:", error);
    throw new Error("Failed to delete sentence");
  }
}

export async function updateSentence(
  sentenceId: string,
  updateData: Partial<SentenceRecord>
): Promise<void> {
  try {
    const sentenceRef = doc(db, "sentences", sentenceId);
    await updateDoc(sentenceRef, updateData);
  } catch (error) {
    console.error("Error updating sentence:", error);
    throw new Error("Failed to update sentence");
  }
}
