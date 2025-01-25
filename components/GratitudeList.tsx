"use client";

import { useEffect, useState } from "react";
import { getGratitudesForToday } from "@/app/utils/gratitudes";
import { useAuth } from "@/contexts/AuthContext";

export default function GratitudeList() {
  const [gratitudes, setGratitudes] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGratitudes = async () => {
      if (user) {
        const fetchedGratitudes = await getGratitudesForToday(user.uid);
        setGratitudes(fetchedGratitudes);
      }
    };
    fetchGratitudes();
  }, [user]);

  if (!user) {
    return <p>Please log in to view gratitudes.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Today&apos;s Gratitudes:</h2>
      {gratitudes.length > 0 ? (
        <ul className="list-disc pl-5">
          {gratitudes.map((gratitude, index) => (
            <li key={index} className="mb-2">
              {gratitude}
            </li>
          ))}
        </ul>
      ) : (
        <p>No gratitudes recorded yet today. Start by adding one!</p>
      )}
    </div>
  );
}
