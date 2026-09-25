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
const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  useEffect(() => {
    const name = localStorage.getItem("client_name") || "";
    setClientName(name);
  }, []);

 const confirmLogout = async () => {   // 👈 naam handleLogout se confirmLogout kiya
  try {
    setIsLoggingOut(true);
    const res = await handle_Auth.logout();
    if (res.status === true) {
      toast.success(res.message || "Logged out successfully");
    }
  } catch (error) {
    console.error("Logout process error:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("client_name");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    Cookies.remove("access_token", { path: '/' });
    setIsAuthenticated(false);
    setIsLoggingOut(false);
    setShowLogoutConfirm(false); // 👈 modal band karo
    window.location.href = "/";
  }
};
const handleLogoutClick = () => {
  setShowLogoutConfirm(true);
};
  return (
     <>
<header className="sticky top-0 z-50 w-full bg-white shadow-md pl-0 pr-4 sm:pr-6 md:pr-6 py-3 flex items-center justify-between">      <div className="flex items-center">
        <button
          title="Hamburger"
          className="md:hidden p-2 rounded hover:bg-gray-200"
          onClick={toggleSidebar}
        >
          <Menu size={28} />
        </button>

        <div className="hidden md:flex items-center md:ml-0">
          <Image src={logo} alt="Logo" className="h-8 w-32 md:w-40 object-contain" />
        </div>
      </div>

      

     <button
  disabled={isLoggingOut}
  className={`${
    isLoggingOut ? "bg-gray-400" : "bg-red-600 hover:bg-red-800"
  } text-white px-4 sm:px-5 py-2 rounded-lg transition font-semibold text-sm sm:text-base cursor-pointer flex items-center gap-2`}
  onClick={handleLogoutClick}   
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
     {showLogoutConfirm && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-6  text-center">
            Confirm Logout
          </h3>
          <p className="text-gray-600 mb-6">
           “Are you sure you want to log out?”
          </p>
       <div className="flex justify-between items-center w-full">
  <button
    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100"
    onClick={() => setShowLogoutConfirm(false)}
    disabled={isLoggingOut}
  >
    Cancel
  </button>

  <button
    className={`${
      isLoggingOut ? "bg-gray-400" : "bg-red-600 hover:bg-red-800"
    } text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2`}
    onClick={confirmLogout}
    disabled={isLoggingOut}
  >
    {isLoggingOut ? (
      <>
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        Processing...
      </>
    ) : (
      "Yes, Logout"
    )}
  </button>
</div>
        </div>
      </div>
    )}
     </>
  );
};

export default Header;