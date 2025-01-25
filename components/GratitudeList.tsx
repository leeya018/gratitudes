"use client";

import { useGratitude } from "@/contexts/GratitudeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRef, useEffect } from "react";

export default function GratitudeList() {
  const { gratitudes, loading } = useGratitude();
  const { user } = useAuth();
  const listRef = useRef<HTMLUListElement>(null);
  const firstItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (firstItemRef.current) {
      firstItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [gratitudes]); // Updated dependency array

  if (!user) {
    return <p>Please log in to view gratitudes.</p>;
  }

  if (loading && gratitudes.length === 0) {
    return <p>Loading gratitudes...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Today&apos;s Gratitudes:</h2>
      {gratitudes.length > 0 ? (
        <ul ref={listRef} className="list-disc pl-5">
          {gratitudes.map((gratitude, index) => (
            <li
              key={`${index}-${gratitude}`}
              className="mb-2"
              ref={index === 0 ? firstItemRef : null}
            >
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
