"use client";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getGratitudesForToday,
  addGratitude as addGratitudeToFirestore,
} from "@/app/utils/gratitudes";

interface GratitudeContextType {
  gratitudes: string[];
  setGratitudes: React.Dispatch<React.SetStateAction<string[]>>;
  addGratitude: (gratitude: string) => Promise<void>;
  loading: boolean;
}

const GratitudeContext = createContext<GratitudeContextType | undefined>(
  undefined
);

export const useGratitude = () => {
  const context = useContext(GratitudeContext);
  if (!context) {
    throw new Error("useGratitude must be used within a GratitudeProvider");
  }
  return context;
};

export const GratitudeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gratitudes, setGratitudes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGratitudes = async () => {
      if (user) {
        setLoading(true);
        try {
          const fetchedGratitudes = await getGratitudesForToday(user.uid);
          setGratitudes(fetchedGratitudes);
        } catch (error) {
          console.error("Error fetching gratitudes:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGratitudes();
  }, [user]);

  const addGratitude = async (gratitude: string) => {
    if (user) {
      try {
        await addGratitudeToFirestore(user.uid, gratitude);
        setGratitudes((prevGratitudes) => [gratitude, ...prevGratitudes]);
      } catch (error) {
        console.error("Error adding gratitude:", error);
        throw error;
      }
    }
  };

  return (
    <GratitudeContext.Provider
      value={{ gratitudes, setGratitudes, addGratitude, loading }}
    >
      {children}
    </GratitudeContext.Provider>
  );
};
