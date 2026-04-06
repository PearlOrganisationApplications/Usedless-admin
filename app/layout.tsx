"use client";

import { useEffect, useState } from "react";
import "./globals.css";
import Header from "@/components/Header/page"; 
import Sidebar from "@/components/Sidebar/page";
import Login from "@/components/Login";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  // 1. Loading State
  if (isAuthenticated === null) {
    return (
      <html lang="en">
        <body className="flex items-center justify-center h-screen bg-white">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-500 animate-pulse">Loading App...</p>
          </div>
        </body>
      </html>
    );
  }

  // 2. Unauthenticated State
  if (isAuthenticated === false) {
    return (
      <html lang="en">
        <body>
          <Login setIsAuthenticated={setIsAuthenticated} />
          <Toaster position="top-right" />
        </body>
      </html>
    );
  }

  // 3. Authenticated Layout
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased overflow-hidden">
        <div className="h-screen flex flex-col">
          <Header
            setIsAuthenticated={setIsAuthenticated}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              isOpen={sidebarOpen}
              closeSidebar={() => setSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="max-w-[1600px] mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}