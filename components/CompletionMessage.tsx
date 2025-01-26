"use client";

import React from "react";
import { useGratitude } from "@/contexts/GratitudeContext";

export default function CompletionMessage() {
  const { isComplete } = useGratitude();

  if (!isComplete) {
    return null;
  }

  return (
    <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
      <p>
        Youve completed your gratitude journal for today. Great job focusing on
        the positive aspects of your life!
      </p>
    </div>
  );
}
