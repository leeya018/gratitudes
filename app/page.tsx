import { GratitudeForm } from "@/components/GratitudeForm";
import { GratitudeList } from "@/components/GratitudeList";
import CompletionMessage from "@/components/CompletionMessage";
import { GratitudeProvider } from "@/contexts/GratitudeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <GratitudeProvider>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Daily Gratitude</h1>
          <GratitudeForm />
          <GratitudeList />
          <CompletionMessage />
        </div>
      </GratitudeProvider>
    </ProtectedRoute>
  );
}
