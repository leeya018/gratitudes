import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";

interface GratitudeDocument {
  userId: string;
  date: string;
  gratitudes: string[];
  lastUpdated: Timestamp;
}

export async function getGratitudesForToday(userId: string): Promise<string[]> {
  if (!userId) return [];

  const today = new Date().toISOString().split("T")[0];
  const docRef = doc(db, "dailyGratitudes", `${userId}_${today}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return (docSnap.data() as GratitudeDocument).gratitudes;
  }
  return [];
}

export async function addGratitude(
  userId: string,
  gratitude: string
): Promise<void> {
  if (!userId) throw new Error("User must be authenticated to add a gratitude");

  const today = new Date().toISOString().split("T")[0];
  const docRef = doc(db, "dailyGratitudes", `${userId}_${today}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as GratitudeDocument;
    if (data.gratitudes.length >= 10) {
      throw new Error("Maximum of 10 gratitudes per day reached");
    }
    await updateDoc(docRef, {
      gratitudes: arrayUnion(gratitude),
      lastUpdated: Timestamp.now(),
    });
  } else {
    await setDoc(docRef, {
      userId,
      date: today,
      gratitudes: [gratitude],
      lastUpdated: Timestamp.now(),
    });
  }
}

export async function getAllDates(userId: string): Promise<string[]> {
  if (!userId) return [];

  const q = query(
    collection(db, "dailyGratitudes"),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  const dates = querySnapshot.docs.map((doc) => doc.data().date);
  return [...new Set(dates)].sort().reverse(); // Remove duplicates and sort in descending order
}

export async function getGratitudesForDate(
  userId: string,
  date: string
): Promise<string[]> {
  if (!userId) return [];

  const docRef = doc(db, "dailyGratitudes", `${userId}_${date}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return (docSnap.data() as GratitudeDocument).gratitudes;
  }
  return [];
}

export async function getGratitudeCountForToday(
  userId: string
): Promise<number> {
  const gratitudes = await getGratitudesForToday(userId);
  return gratitudes.length;
}
