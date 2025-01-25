"use client";

import { useGratitude } from "@/contexts/GratitudeContext";

export function GratitudeList() {
  const { gratitudes, loading } = useGratitude();

  if (loading) {
    return <div>Loading gratitudes...</div>;
  }

  if (gratitudes.length === 0) {
    return <div>No gratitudes added yet. Start by adding one above!</div>;
  }

  return (
    <ul className="space-y-2">
      {gratitudes.map((gratitude, index) => (
        <li key={index} className="bg-white p-4 rounded shadow">
          {gratitude}
        </li>
      ))}
    </ul>
  );
}
