import type { Timestamp, FieldValue } from "firebase/firestore";

export interface SentenceRecord {
  id?: string;
  userId: string;
  text: string;
  createdAt: Date | Timestamp | FieldValue;
  audioData: string | null;
}
