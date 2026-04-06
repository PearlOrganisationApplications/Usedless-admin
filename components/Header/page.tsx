"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import logo from "../../assets/via_green_logo3.png";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { handle_Auth } from "@/api/controller/auth"; // Import the controller
import toast from "react-hot-toast"; // For feedback

interface HeaderProps {
  setIsAuthenticated: (value: boolean) => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ setIsAuthenticated, toggleSidebar }) => {
  const [clientName, setClientName] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("client_name") || "";
    setClientName(name);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // 1. Call the Logout API
      const res = await handle_Auth.logout();
      
      if (res.status === true) {
        toast.success(res.message || "Logged out successfully");
      }
    } catch (error) {
      console.error("Logout process error:", error);
    } finally {
      // 2. Local Cleanup (ALWAYS runs even if API fails)
      
      // Clear LocalStorage
      localStorage.removeItem("access_token"); 
      localStorage.removeItem("client_name");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // Clear Cookies
      Cookies.remove("access_token", { path: '/' });

      // 3. Update state (This triggers RootLayout to show Login)
      setIsAuthenticated(false);
      
      setIsLoggingOut(false);
      
      // 4. Redirect/Refresh
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md px-4 sm:px-6 md:px-10 py-3 flex items-center justify-between ">
      <div className="flex items-center">
        <button
          title="Hamburger"
          className="md:hidden p-2 rounded hover:bg-gray-200"
          onClick={toggleSidebar}
        >
          <Menu size={28} />
        </button>

        <div className="hidden md:flex items-center ml-0 md:ml-2">
          <Image src={logo} alt="Logo" className="h-8 w-32 md:w-40 object-contain" />
        </div>
      </div>

      <h2 className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold text-gray-800">
        {clientName || "Dashboard"}
      </h2>

      <button
        disabled={isLoggingOut}
        className={`${
          isLoggingOut ? "bg-gray-400" : "bg-red-600 hover:bg-red-800"
        } text-white px-4 sm:px-5 py-2 rounded-lg transition font-semibold text-sm sm:text-base cursor-pointer flex items-center gap-2`}
        onClick={handleLogout}
      >
        {isLoggingOut ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Processing...
          </>
        ) : (
          "Logout"
        )}
      </button>
    </header>
  );
};

export default Header;