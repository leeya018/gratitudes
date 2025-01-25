"use client";

import { useState } from "react";
import { useGratitude } from "@/contexts/GratitudeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function GratitudeForm() {
  const [gratitude, setGratitude] = useState("");
  const { addGratitude, gratitudes } = useGratitude();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gratitude.trim()) {
      try {
        await addGratitude(gratitude);
        setGratitude("");
        toast({
          title: "Gratitude added",
          description: "Your gratitude has been successfully added.",
        });
      } catch (error) {
        console.error("Error adding gratitude:", error);
        toast({
          title: "Error",
          description:
            "There was an error adding your gratitude. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={gratitude}
        onChange={(e) => setGratitude(e.target.value)}
        placeholder="Enter something you're grateful for..."
        maxLength={100}
      />
      <Button type="submit" disabled={gratitudes.length >= 10}>
        Add Gratitude
      </Button>
      {gratitudes.length >= 10 && (
        <p className="text-sm text-red-500">
          You've reached the maximum of 10 gratitudes for today.
        </p>
      )}
    </form>
  );
}
