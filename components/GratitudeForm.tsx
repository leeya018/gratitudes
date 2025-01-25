"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  addGratitude,
  getGratitudeCountForToday,
} from "@/app/utils/gratitudes";

export default function GratitudeForm() {
  const [gratitude, setGratitude] = useState("");
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCount = async () => {
      if (user) {
        const count = await getGratitudeCountForToday(user.uid);
        setCount(count);
      }
    };
    fetchCount();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude.trim() || count >= 10 || !user) return;

    try {
      await addGratitude(user.uid, gratitude);
      setGratitude("");
      setCount((prevCount) => prevCount + 1);
      setError(null);
      router.refresh();
    } catch (error) {
      console.error("Error adding gratitude:", error);
      setError("Failed to add gratitude. Please try again.");
    }
  };

  if (!user) {
    return <p>Please log in to add gratitudes.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={gratitude}
        onChange={(e) => setGratitude(e.target.value)}
        placeholder="Enter something you're grateful for..."
        className="w-full p-2 border border-gray-300 rounded"
        disabled={count >= 10}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={count >= 10}
      >
        Add Gratitude ({count}/10)
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  );
}
