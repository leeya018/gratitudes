"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllDates } from "../utils/gratitudes";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [dates, setDates] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDates = async () => {
      if (user) {
        const fetchedDates = await getAllDates(user.uid);
        setDates(fetchedDates);
      }
    };
    fetchDates();
  }, [user]);

  if (!user) {
    return <p>Please log in to view your manifest journal entries.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Manifest Journal Entries</h1>
      {dates.length > 0 ? (
        <ul className="space-y-2">
          {dates.map((date) => (
            <li key={date}>
              <Link
                href={`/entries/${date}`}
                className="text-blue-500 hover:underline"
              >
                {date}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No entries yet. Start by adding some gratitudes!</p>
      )}
      <Link
        href="/"
        className="text-blue-500 hover:underline mt-4 inline-block"
      >
        Back to Today&apos;s Entry
      </Link>
    </div>
  );
}
