"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GratitudeForm() {
  const [gratitude, setGratitude] = useState("");
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCount = async () => {
      const response = await fetch("/api/gratitudes/count");
      if (response.ok) {
        const { count } = await response.json();
        setCount(count);
      }
    };
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude.trim() || count >= 20) return;

    const response = await fetch("/api/gratitudes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gratitude }),
    });

    if (response.ok) {
      setGratitude("");
      setCount((prevCount) => prevCount + 1);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={gratitude}
        onChange={(e) => setGratitude(e.target.value)}
        placeholder="Enter something you're grateful for..."
        className="w-full p-2 border border-gray-300 rounded"
        disabled={count >= 20}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={count >= 20}
      >
        Add Gratitude ({count}/20)
      </button>
    </form>
  );
}
