"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getIdToken } from "firebase/auth";

export default function GratitudeForm() {
  const [gratitude, setGratitude] = useState("");
  const [count, setCount] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCount = async () => {
      if (user) {
        try {
          const token = await getIdToken(user);
          const response = await fetch("/api/gratitudes/count", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const { count } = await response.json();
            setCount(count);
          }
        } catch (error) {
          console.error("Error fetching gratitude count:", error);
        }
      }
    };
    fetchCount();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude.trim() || count >= 10 || !user) return;

    try {
      const token = await getIdToken(user);
      const response = await fetch("/api/gratitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gratitude }),
      });

      if (response.ok) {
        setGratitude("");
        setCount((prevCount) => prevCount + 1);
        router.refresh();
      } else {
        console.error("Failed to add gratitude");
      }
    } catch (error) {
      console.error("Error adding gratitude:", error);
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
        disabled={count >= 10 || !user}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={count >= 10 || !user}
      >
        Add Gratitude ({count}/10)
      </button>
    </form>
  );
}
