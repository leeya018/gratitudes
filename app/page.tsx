import GratitudeForm from "@/components/GratitudeForm";
import GratitudeList from "@/components/GratitudeList";
import CompletionMessage from "@/components/CompletionMessage";
import Link from "next/link";
import { getGratitudesForToday } from "./utils/gratitudes";

export default async function Home() {
  const gratitudes = await getGratitudesForToday();
  const isComplete = gratitudes.length >= 10;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gratitude Journal</h1>
      {!isComplete && <GratitudeForm />}
      <GratitudeList />
      {isComplete && <CompletionMessage />}
      <Link
        href="/home"
        className="text-blue-500 hover:underline mt-4 inline-block"
      >
        View All Entries
      </Link>
      <Link
        href="/goal-visualization"
        className="text-blue-500 hover:underline mt-4 inline-block ml-4"
      >
        Goal Visualization
      </Link>
    </div>
  );
}
