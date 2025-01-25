"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getGratitudesForToday,
  addGratitude as addGratitudeToFirestore,
} from "@/app/utils/gratitudes";

interface GratitudeContextType {
  gratitudes: string[];
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

  const fetchGratitudes = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    fetchGratitudes();
  }, [fetchGratitudes]);

  const addGratitude = async (gratitude: string) => {
    if (!user) throw new Error("User must be authenticated to add a gratitude");

    setLoading(true);
    try {
      await addGratitudeToFirestore(user.uid, gratitude);
      setGratitudes((prev) => [gratitude, ...prev]);
    } catch (error) {
      console.error("Error adding gratitude:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GratitudeContext.Provider value={{ gratitudes, addGratitude, loading }}>
      {children}
    </GratitudeContext.Provider>
  );
};
