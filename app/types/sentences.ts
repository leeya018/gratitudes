export interface SentenceRecord {
  id: string;
  text: string;
  audioData?: string;
  userId: string;
  createdAt: Date;
}
