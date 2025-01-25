"use client";

import { useEffect, useState } from "react";
import { getGratitudesForDate } from "../../utils/gratitudes";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function EntryPage({ params }: { params: { date: string } }) {
  const [gratitudes, setGratitudes] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGratitudes = async () => {
      if (user) {
        const fetchedGratitudes = await getGratitudesForDate(
          user.uid,
          params.date
        );
        setGratitudes(fetchedGratitudes);
      }
    };
    fetchGratitudes();
  }, [user, params.date]);

  if (!user) {
    return <p>Please log in to view gratitudes.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gratitudes for {params.date}</h1>
      {gratitudes.length > 0 ? (
        <ul className="list-disc pl-5">
          {gratitudes.map((gratitude, index) => (
            <li key={index} className="mb-2">
              {gratitude}
            </li>
          ))}
        </ul>
      ) : (
        <p>No gratitudes recorded for this date.</p>
      )}
      <Link
        href="/home"
        className="text-blue-500 hover:underline mt-4 inline-block"
      >
        Back to All Entries
      </Link>
    </div>
  );
}
