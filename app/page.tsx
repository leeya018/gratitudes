import GratitudeForm from "@/components/GratitudeForm";
import GratitudeList from "@/components/GratitudeList";
import CompletionMessage from "@/components/CompletionMessage";
import { getGratitudesForToday } from "./utils/gratitudes";

export default async function Home() {
  const gratitudes = await getGratitudesForToday();
  const isComplete = gratitudes.length >= 10;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Daily Gratitude</h1>
      {!isComplete && <GratitudeForm />}
      <GratitudeList />
      {isComplete && <CompletionMessage />}
    </div>
  );
}
