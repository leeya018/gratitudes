import type { Timestamp } from "firebase/firestore";

export interface SentenceRecord {
  id: string;
  userId: string;
  text: string;
  createdAt: Date | Timestamp;
  audioData: string | null;
}
