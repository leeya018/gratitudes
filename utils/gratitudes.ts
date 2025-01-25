import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export async function getGratitudesForToday(userId: string): Promise<string[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const gratitudesRef = collection(db, "dailyGratitudes");
  const q = query(
    gratitudesRef,
    where("userId", "==", userId),
    where("createdAt", ">=", today),
    where("createdAt", "<", tomorrow),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data().text);
}

export async function addGratitude(
  userId: string,
  gratitude: string
): Promise<void> {
  await addDoc(collection(db, "dailyGratitudes"), {
    userId,
    text: gratitude,
    createdAt: Timestamp.now(),
  });
}

export async function getAllDates(userId: string): Promise<string[]> {
  const gratitudesRef = collection(db, "dailyGratitudes");
  const q = query(
    gratitudesRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  const dates = querySnapshot.docs.map((doc) => {
    const date = doc.data().createdAt.toDate();
    return date.toISOString().split("T")[0];
  });

  return [...new Set(dates)]; // Remove duplicates
}

export async function getGratitudesForDate(
  userId: string,
  date: string
): Promise<string[]> {
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);

  const gratitudesRef = collection(db, "dailyGratitudes");
  const q = query(
    gratitudesRef,
    where("userId", "==", userId),
    where("createdAt", ">=", startDate),
    where("createdAt", "<", endDate),
    orderBy("createdAt", "asc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data().text);
}

export async function getGratitudeCountForToday(
  userId: string
): Promise<number> {
  const gratitudes = await getGratitudesForToday(userId);
  return gratitudes.length;
}
