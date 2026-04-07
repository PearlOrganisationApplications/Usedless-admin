import React, { useState } from 'react';
import { DataTable } from '@/components/tables/DataTable';
import { 
  Users, UserPlus, Gift, ShieldAlert, BarChart, Settings, 
  TrendingUp, Activity, CheckCircle2, AlertTriangle, UserX, Target, Zap
} from 'lucide-react';
import { cn } from '@/utils';

export const ReferralManagementPage = () => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'RULES' | 'FRAUD'>('ANALYTICS');
  
  // Analytics Mock Data
  const topReferrers = [
    { id: '1', name: 'Rohan Sharma', role: 'STUDENT', referrals: 42, earnings: '₹12,600', status: 'ACTIVE' },
    { id: '2', name: 'Dr. Amit Trivedi', role: 'TEACHER', referrals: 28, earnings: '₹28,000', status: 'ACTIVE' },
    { id: '3', name: 'Sneha Patel', role: 'STUDENT', referrals: 15, earnings: '₹4,500', status: 'ACTIVE' },
    { id: '4', name: 'Vikram Singh', role: 'TEACHER', referrals: 12, earnings: '₹12,000', status: 'ACTIVE' },
  ];

  // Fraud Mock Data
  const fraudAlerts = [
    { id: 'F-101', user: 'Anil Kumar', role: 'STUDENT', issue: 'Self-Referral Loop', severity: 'HIGH', date: '2 hours ago' },
    { id: 'F-102', user: 'Priya Verma', role: 'STUDENT', issue: 'Multiple IPs', severity: 'MEDIUM', date: '5 hours ago' },
    { id: 'F-103', user: 'Rajesh Gupta', role: 'TEACHER', issue: 'Fake Account Creation', severity: 'CRITICAL', date: '1 day ago' },
  ];

  const analyticsColumns = [
    { 
      header: 'User', 
      accessor: 'name' as const,
      render: (val: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl text-white shadow-lg",
            item.role === 'TEACHER' ? "bg-amber-500 shadow-amber-500/20" : "bg-blue-500 shadow-blue-500/20"
          )}>
            {item.role === 'TEACHER' ? <Users size={16} /> : <UserPlus size={16} />}
          </div>
          <div>
            <p className="font-bold text-slate-900">{val}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.role}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Total Referrals', 
      accessor: 'referrals' as const,
      render: (val: number) => <span className="font-black text-slate-900">{val}</span>
    },
    { 
      header: 'Total Earnings', 
      accessor: 'earnings' as const,
      render: (val: string) => <span className="font-mono font-black text-emerald-600">{val}</span>
    },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      render: (val: string) => (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
          {val}
        </span>
      )
    }
  ];

  const fraudColumns = [
    { 
      header: 'Case ID', 
      accessor: 'id' as const,
      render: (val: string) => <span className="font-mono text-xs font-bold text-slate-500">{val}</span>
    },
    { 
      header: 'Suspect User', 
      accessor: 'user' as const,
      render: (val: string, item: any) => (
        <div>
          <p className="font-bold text-slate-900">{val}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.role}</p>
        </div>
      )
    },
    { 
      header: 'Detected Issue', 
      accessor: 'issue' as const,
      render: (val: string) => (
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-500" />
          <span className="font-bold text-slate-700">{val}</span>
        </div>
      )
    },
    { 
      header: 'Severity', 
      accessor: 'severity' as const,
      render: (val: string) => (
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase flex w-max items-center gap-1.5",
          val === 'HIGH' ? "bg-amber-50 text-amber-600 border border-amber-200" : 
          val === 'CRITICAL' ? "bg-rose-50 text-rose-600 border border-rose-200 animate-pulse" : 
          "bg-blue-50 text-blue-600 border border-blue-200"
        )}>
          {val}
        </span>
      )
    },
    { header: 'Detected', accessor: 'date' as const },
    {
      header: 'Action',
      accessor: 'id' as const,
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors" title="Determine Safe">
            <CheckCircle2 size={18} />
          </button>
          <button className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Block User">
            <UserX size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dynamic Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Target className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Referral Engine Control</h2>
            </div>
            <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
              Supervise the platform's viral growth engine. Manage reward settings, monitor top referrers, and flag suspicious activities with automated fraud detection.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Conversions</p>
              <h4 className="text-3xl font-black">4,289</h4>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Payouts</p>
              <h4 className="text-3xl font-black text-emerald-400">₹8.5L</h4>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <TrendingUp size={160} className="absolute -right-10 -bottom-10 opacity-5 rotate-12" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Activity size={80} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Campaigns</p>
            <h3 className="text-4xl font-black text-slate-900 mt-2">03</h3>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-3">
              <Zap size={14} /> Running smoothly
            </p>
          </div>
          <div className="bg-rose-500 rounded-[2rem] p-6 text-white shadow-lg shadow-rose-500/25 flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <ShieldAlert size={80} />
            </div>
            <p className="text-[10px] font-black text-rose-200 uppercase tracking-widest">Fraud Alerts</p>
            <h3 className="text-4xl font-black mt-2">12</h3>
            <p className="text-xs font-bold text-white/80 mt-3">Require immediate action</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-4 md:px-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'ANALYTICS', label: 'Analytics Dashboard', icon: BarChart },
            { id: 'RULES', label: 'Rules & Rewards', icon: Settings },
            { id: 'FRAUD', label: 'Fraud Detection', icon: ShieldAlert },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-6 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                activeTab === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'ANALYTICS' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Top Referrers</h3>
                  <p className="text-sm font-bold text-slate-500">Users with the highest conversion rates</p>
                </div>
              </div>
              <div className="h-[25rem] overflow-x-auto min-w-full">
                <DataTable columns={analyticsColumns} data={topReferrers} gridTemplateColumns="2fr 1.5fr 1.5fr 1fr" />
              </div>
            </div>
          )}

          {activeTab === 'RULES' && (
            <div className="space-y-10 max-w-4xl animate-in fade-in slide-in-from-left-4 duration-500">
              
              {/* Student Settings */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><UserPlus size={20} /></div>
                  <h3 className="text-xl font-black text-slate-900">Student Referral Rules</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Reward per Conversion</label>
                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus-within:border-primary focus-within:ring-2 ring-primary/20 transition-all">
                      <span className="font-black text-primary">₹</span>
                      <input type="number" defaultValue={500} className="w-full font-black text-slate-900 outline-none bg-transparent" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">Auto-Credit Wallet</h4>
                        <p className="text-xs font-bold text-slate-500 mt-1">Directly credit to student wallet</p>
                      </div>
                      <button className="w-14 h-8 rounded-full bg-primary relative transition-all">
                        <div className="w-6 h-6 bg-white rounded-full absolute top-1 left-7 shadow-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Teacher Settings */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Users size={20} /></div>
                  <h3 className="text-xl font-black text-slate-900">Teacher Referral Rules</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Reward per Conversion</label>
                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus-within:border-primary focus-within:ring-2 ring-primary/20 transition-all">
                      <span className="font-black text-amber-500">₹</span>
                      <input type="number" defaultValue={1000} className="w-full font-black text-slate-900 outline-none bg-transparent" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">Tiered Rewards</h4>
                        <p className="text-xs font-bold text-slate-500 mt-1">Increase reward by 10% after 5 refs</p>
                      </div>
                      <button className="w-14 h-8 rounded-full bg-slate-200 relative transition-all">
                        <div className="w-6 h-6 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-1 active:translate-y-0">
                Save Reward Settings
              </button>

            </div>
          )}

          {activeTab === 'FRAUD' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black text-rose-600 flex items-center gap-2">
                    <ShieldAlert size={24} /> Detected Anomalies
                  </h3>
                  <p className="text-sm font-bold text-slate-500">System-flagged suspicious referral patterns</p>
                </div>
              </div>
              <div className="h-[25rem] overflow-x-auto min-w-full">
                <DataTable columns={fraudColumns} data={fraudAlerts} gridTemplateColumns="1fr 1.5fr 2fr 1.5fr 1fr 1fr" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
