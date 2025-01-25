"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/login";

  return (
    <AuthProvider>
      {showNavbar && <Navbar />}
      <main className={`min-h-screen bg-gray-100 ${showNavbar ? "pt-16" : ""}`}>
        {children}
      </main>
    </AuthProvider>
  );
}
