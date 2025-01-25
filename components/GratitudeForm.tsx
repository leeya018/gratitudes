"use client";

import { useState, useRef, useEffect } from "react";
import { useGratitude } from "@/contexts/GratitudeContext";
import { useAuth } from "@/contexts/AuthContext";

export default function GratitudeForm() {
  const [gratitude, setGratitude] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { gratitudes, addGratitude, loading } = useGratitude();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude.trim() || gratitudes.length >= 10 || !user) return;

    setError(null);

    try {
      await addGratitude(gratitude);
      setGratitude("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
        ref={inputRef}
        type="text"
        value={gratitude}
        onChange={(e) => setGratitude(e.target.value)}
        placeholder="Enter something you're grateful for..."
        className="w-full p-2 border border-gray-300 rounded"
        disabled={gratitudes.length >= 10 || loading}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={gratitudes.length >= 10 || loading}
      >
        {loading ? "Adding..." : `Add Gratitude (${gratitudes.length}/10)`}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  );
}
