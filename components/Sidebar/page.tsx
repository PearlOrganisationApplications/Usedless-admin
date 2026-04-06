"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const ADMIN_ROLES = ["admin", "administrator"];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole?.toLowerCase() ?? "user");
    setIsLoading(false);
  }, []);

  const isAdmin = role ? ADMIN_ROLES.includes(role) : false;

  // Base items for everyone
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "All Reports", path: "/reports" },
  ];

  if (!isLoading) {
    if (isAdmin) {
      navItems.push(
        { name: "Manage Reports", path: "/manage_reports" },
        { name: "All Waste", path: "/allwaste" },
        { name: "Client", path: "/client" }
      );
    } else {
      navItems.push(
        { name: "Manage User", path: "/manage_user" },
        { name: "Manage waste", path: "/user_waste" }
      );
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-20 md:hidden transition-opacity",
          isOpen ? "visible opacity-50 bg-black" : "invisible opacity-0"
        )}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed md:static top-16 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-30 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className="flex flex-col gap-2 mt-4 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeSidebar}
                className={clsx(
                  "px-4 py-2.5 rounded-lg transition-all text-sm font-semibold",
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;