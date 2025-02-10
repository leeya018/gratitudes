"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [imageError, setImageError] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <nav className="bg-blue-500 p-4 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Gratitude Journal
        </Link>
        <ul className="flex items-center space-x-4">
          <li>
            <Link
              href="/"
              className={`text-white hover:text-blue-200 ${
                pathname === "/" ? "underline" : ""
              }`}
            >
              Daily Gratitudes
            </Link>
          </li>
          <li>
            <Link
              href="/goal-visualization"
              className={`text-white hover:text-blue-200 ${
                pathname === "/goal-visualization" ? "underline" : ""
              }`}
            >
              Goal Visualization
            </Link>
          </li>
          <li>
            <Link
              href="/home"
              className={`text-white hover:text-blue-200 ${
                pathname === "/home" ? "underline" : ""
              }`}
            >
              All Gratitudes
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <button
                  onClick={handleSignOut}
                  className="text-white hover:text-blue-200"
                >
                  Sign Out
                </button>
              </li>
              <li>
                {user.photoURL && !imageError ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={user.photoURL || "/placeholder.svg"}
                      alt="User profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                      onError={() => setImageError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm">
                      {user.displayName
                        ? user.displayName[0].toUpperCase()
                        : "U"}
                    </span>
                  </div>
                )}
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
