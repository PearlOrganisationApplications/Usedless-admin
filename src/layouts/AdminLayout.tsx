import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserRound, Video, 
  Wallet, PieChart, Megaphone, Settings, Settings2,
  LogOut, Menu, X, ChevronRight, MessageSquare,
  TowerControl, GraduationCap, School, BookOpen,
  Clapperboard, Share2, HelpCircle, ShieldCheck, Gift,
  CreditCard, Trophy, Gamepad2, MonitorPlay, Lock
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { PermissionGate } from '@/routes/PermissionGate';
import { cn } from '@/utils';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', roles: ['SUPER_ADMIN', 'MANAGER', 'SUPPORT', 'FINANCE', 'MARKETING'] },
  { icon: Users, label: 'Students', path: '/students', permission: 'STUDENT_VIEW', roles: ['SUPER_ADMIN'] },
  { icon: UserRound, label: 'Teachers', path: '/teachers', permission: 'TEACHER_VIEW', roles: ['SUPER_ADMIN'] },
  { icon: Video, label: 'Sessions', path: '/sessions', permission: 'SESSION_VIEW', roles: ['SUPER_ADMIN'] },
  { icon: TowerControl, label: 'War Room', path: '/war-room', permission: 'SESSION_MONITOR', roles: ['SUPER_ADMIN'] },
  { icon: Wallet, label: 'Finance', path: '/finance', permission: 'PAYOUT_APPROVE', roles: ['SUPER_ADMIN', 'FINANCE'] },
  { icon: Megaphone, label: 'Marketing', path: '/marketing', permission: 'CAMPAIGN_CREATE', roles: ['SUPER_ADMIN', 'MARKETING'] },
  { icon: Clapperboard, label: 'Reels', path: '/reels', permission: 'CONTENT_MODERATE', roles: ['SUPER_ADMIN'] },
  { icon: Share2, label: 'Referral', path: '/referral', permission: 'SYSTEM_SETTINGS_UPDATE', roles: ['SUPER_ADMIN'] },
  { icon: MessageSquare, label: 'Support', path: '/support', permission: 'SUPPORT_VIEW', roles: ['SUPER_ADMIN', 'SUPPORT'] },
  { icon: ShieldCheck, label: 'Admins', path: '/system/admins', roles: ['SUPER_ADMIN'] },
  { icon: Lock, label: 'Roles', path: '/system/roles', roles: ['SUPER_ADMIN'] },
  { icon: Settings, label: 'System', path: '/system', permission: 'SYSTEM_SETTINGS_UPDATE', roles: ['SUPER_ADMIN'] },
];

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}>
        <div className="p-6 flex items-center justify-between">
          {!collapsed && <span className="text-xl font-bold text-white tracking-tight">VLM <span className="text-primary">Academy</span></span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-slate-800 rounded">
            {collapsed ? <ChevronRight size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Main Section */}
          <div className="space-y-1">
             <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Main</p>
             <PermissionGate role={['SUPER_ADMIN', 'MANAGER', 'SUPPORT', 'FINANCE', 'MARKETING']}>
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname === '/dashboard' ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <LayoutDashboard size={20} />
                  {!collapsed && <span>Dashboard</span>}
                </Link>
             </PermissionGate>
             <PermissionGate permission="STUDENT_VIEW" role={['SUPER_ADMIN']}>
                <Link
                  to="/students"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/students') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Users size={20} />
                  {!collapsed && <span>Students</span>}
                </Link>
             </PermissionGate>
          </div>

          {/* Teacher Engine Section */}
          <div className="space-y-1">
             <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Teacher Engine</p>
             <PermissionGate permission="TEACHER_VIEW" role={['SUPER_ADMIN']}>
                <Link
                  to="/teachers"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/teachers') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <GraduationCap size={20} />
                  {!collapsed && <span>Management</span>}
                </Link>
             </PermissionGate>
             <PermissionGate permission="TEACHER_VIEW" role={['SUPER_ADMIN']}>
                <Link
                  to="/matching"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/matching') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Settings2 size={20} />
                  {!collapsed && <span>Matching Logic</span>}
                </Link>
             </PermissionGate>
          </div>

          {/* Session Engine Section */}
          <div className="space-y-1">
             <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Session Engine</p>
             <PermissionGate permission="SESSION_VIEW" role={['SUPER_ADMIN']}>
                <Link
                  to="/sessions"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/sessions') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Video size={20} />
                  {!collapsed && <span>Session List</span>}
                </Link>
             </PermissionGate>
             <PermissionGate permission="SESSION_VIEW" role={['SUPER_ADMIN']}>
                <Link
                  to="/sessions/live-classes"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/sessions/live-classes') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <MonitorPlay size={20} />
                  {!collapsed && <span>Live Classes</span>}
                </Link>
             </PermissionGate>
             <PermissionGate permission="SESSION_MONITOR" role={['SUPER_ADMIN']}>
                <Link
                  to="/war-room"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/war-room') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <TowerControl size={20} />
                  {!collapsed && <span>War Room</span>}
                </Link>
             </PermissionGate>
          </div>
          
          {/* Financial Ecosystem Section */}
          <div className="space-y-1">
             <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Finance</p>
             <PermissionGate permission="FINANCE_VIEW" role={['SUPER_ADMIN']}>
                <Link
                  to="/finance"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/finance') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Wallet size={20} />
                  {!collapsed && <span>Payouts & Wallets</span>}
                </Link>
             </PermissionGate>
             <PermissionGate permission="FINANCE_VIEW" role={['SUPER_ADMIN']}>
                <Link
                  to="/student-wallets"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/student-wallets') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Gift size={20} />
                  {!collapsed && <span>Student Wallets</span>}
                </Link>
             </PermissionGate>
             <PermissionGate permission="FINANCE_VIEW" role={['SUPER_ADMIN']}>
                <Link
                  to="/subscriptions"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/subscriptions') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <CreditCard size={20} />
                  {!collapsed && <span>Subscriptions</span>}
                </Link>
             </PermissionGate>
          </div>

          {/* Gamification & Engagements Section */}
          <div className="space-y-1">
             <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Gamification & Engagements</p>
             <PermissionGate role={['SUPER_ADMIN']}>
                <Link
                  to="/gamification/mcq"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/gamification/mcq') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Gamepad2 size={20} />
                  {!collapsed && <span>MCQ Management</span>}
                </Link>
             </PermissionGate>
             <PermissionGate role={['SUPER_ADMIN']}>
                <Link
                  to="/gamification/engagements"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                    location.pathname.startsWith('/gamification/engagements') ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Trophy size={20} />
                  {!collapsed && <span>Engagements</span>}
                </Link>
             </PermissionGate>
          </div>

          {/* Internal Section */}
          <div className="space-y-1">
             <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Internal</p>
             {sidebarItems.slice(4).map((item) => (
                <PermissionGate key={item.path} permission={item.permission} role={item.roles}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold",
                      location.pathname.startsWith(item.path) 
                        ? "bg-primary text-white" 
                        : "hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    {/* @ts-ignore */}
                    <item.icon size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </PermissionGate>
              ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800">
            {sidebarItems.find(i => location.pathname.startsWith(i.path))?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right mr-2 hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role?.toString().replace('_', ' ') || 'Staff'}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
