"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Trash2,
  Users,
  UserCog,
  Send,
  ArrowRight,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const ADMIN_ROLES = ["admin", "administrator"];

// Icon mapping for each nav path
const ICON_MAP: Record<string, React.ElementType> = {
  "/": LayoutDashboard,
  "/reports": FileText,
  "/manage_reports": ClipboardList,
  "/allwaste": Trash2,
  "/client": Users,
  "/manage_user": UserCog,
  "/user_waste": Trash2,
};

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
          "fixed inset-0 z-20 md:hidden transition-opacity backdrop-blur-sm",
          isOpen ? "visible opacity-100 bg-slate-900/40" : "invisible opacity-0"
        )}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed md:static top-16 left-0 h-screen w-64 flex flex-col overflow-y-auto",
          "bg-gradient-to-b from-white via-slate-50 to-slate-100",
          "border-r border-slate-200/80 shadow-xl shadow-slate-200/40 z-30",
          "transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Nav list */}
        <nav className="flex flex-col gap-1.5 mt-6 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = ICON_MAP[item.path] ?? FileText;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeSidebar}
                className={clsx(
                  "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-500 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200/70 hover:shadow-md hover:shadow-slate-300/40"
                )}
              >
                <Icon
                  size={18}
                  strokeWidth={2.2}
                  className={clsx(
                    "shrink-0 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                  )}
                />
                <span className="truncate">{item.name}</span>

                {isActive && (
                  <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                )}
              </Link>
            );
          })}

                  {/* Send Report — same styling as other nav items */}
          <Link
            href="/reports/send-report"
            onClick={closeSidebar}
            className={clsx(
              "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 mt-1.5",
              pathname === "/reports/send-report"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-500 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200/70 hover:shadow-md hover:shadow-slate-300/40"
            )}
          >
            <Send
              size={18}
              strokeWidth={2.2}
              className={clsx(
                "shrink-0 transition-transform duration-300 group-hover:scale-110",
                pathname === "/reports/send-report" ? "text-white" : "text-slate-400 group-hover:text-blue-600"
              )}
            />
            <span className="truncate">Send Report</span>

            {pathname === "/reports/send-report" && (
              <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
            )}
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;