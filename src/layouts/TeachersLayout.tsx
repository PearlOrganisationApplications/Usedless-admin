import React from 'react';
import { LayoutDashboard, Users, BookOpen, Settings, Bell, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Teachers', path: '/teachers' },
    { icon: BookOpen, label: 'Sessions', path: '/sessions' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <BookOpen size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight">EduMaster</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/10" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              A
            </div>
            <div>
              <p className="text-xs font-black">Admin User</p>
              <p className="text-[10px] text-slate-400 font-bold">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 w-96">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search teachers, sessions, or students..." 
              className="bg-transparent border-none focus:outline-none text-sm font-medium w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <button className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <User size={18} />
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
