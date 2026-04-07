import React, { useState } from 'react';
import { Settings2, Zap, LayoutList, BookOpen, Save, RefreshCcw, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/utils';

export const MatchingLogicPage = () => {
  const [autoAllocation, setAutoAllocation] = useState(true);
  const [matchingMode, setMatchingMode] = useState<'BALANCED' | 'SPEED' | 'QUALITY'>('BALANCED');

  const subjects = [
    { name: 'Mathematics', weight: 80, activeTeachers: 24, queueSize: 5 },
    { name: 'Physics', weight: 75, activeTeachers: 18, queueSize: 12 },
    { name: 'Chemistry', weight: 65, activeTeachers: 15, queueSize: 3 },
    { name: 'Biology', weight: 50, activeTeachers: 12, queueSize: 1 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Matching Logic</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Configure automated student-teacher pairing algorithms.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
           <Save size={18} />
           Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Controls */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                      <Zap size={24} />
                   </div>
                   <div>
                      <h4 className="font-black text-slate-900">Auto-Teacher Allocation</h4>
                      <p className="text-xs text-slate-500 font-bold">Automatically match students with available teachers</p>
                   </div>
                </div>
                <button 
                  onClick={() => setAutoAllocation(!autoAllocation)}
                  className={cn(
                    "w-14 h-8 rounded-full transition-all relative",
                    autoAllocation ? "bg-primary" : "bg-slate-200"
                  )}
                >
                   <div className={cn(
                     "w-6 h-6 bg-white rounded-full absolute top-1 transition-all",
                     autoAllocation ? "left-7" : "left-1"
                   )} />
                </button>
             </div>

             <div className="pt-8 border-t border-slate-100">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Algorithm Priority Mode</h5>
                <div className="grid grid-cols-3 gap-4">
                   {[
                     { id: 'SPEED', label: 'Response Speed', icon: Clock, desc: 'Prioritize fastest connection' },
                     { id: 'BALANCED', label: 'Balanced', icon: Settings2, desc: 'Optimized for speed & rating' },
                     { id: 'QUALITY', label: 'Quality Rating', icon: ShieldCheck, desc: 'Prioritize highest rated teachers' },
                   ].map((mode) => (
                     <button
                        key={mode.id}
                        onClick={() => setMatchingMode(mode.id as any)}
                        className={cn(
                          "p-6 rounded-[2rem] border-2 text-left transition-all group",
                          matchingMode === mode.id 
                            ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                            : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                        )}
                     >
                        <mode.icon size={24} className={cn("mb-3", matchingMode === mode.id ? "text-primary" : "text-slate-400")} />
                        <p className="font-black text-slate-900 text-sm whitespace-nowrap">{mode.label}</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed">{mode.desc}</p>
                     </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                      <LayoutList size={24} />
                   </div>
                   <div>
                      <h4 className="font-black text-slate-900">Priority Queue System</h4>
                      <p className="text-xs text-slate-500 font-bold">Manage waiting list priority for different users</p>
                   </div>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                    <RefreshCcw size={12} />
                    Reset Queue
                </button>
             </div>

             <div className="space-y-4">
                {[
                  { type: 'Premium Plus', priority: 'Urgent (L1)', color: 'bg-red-500' },
                  { type: 'Premium', priority: 'High (L2)', color: 'bg-orange-500' },
                  { type: 'Standard', priority: 'Normal (L3)', color: 'bg-blue-500' },
                  { type: 'Free Trial', priority: 'Lowest (L4)', color: 'bg-slate-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100">
                     <span className="font-black text-slate-900 text-sm">{item.type}</span>
                     <div className="flex items-center gap-3">
                        <span className={cn("w-2 h-2 rounded-full", item.color)} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.priority}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-8 shadow-xl shadow-slate-900/20">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                   <BookOpen size={24} />
                </div>
                <div>
                   <h4 className="font-black text-white">Subject Config</h4>
                   <p className="text-xs text-slate-400 font-bold">Matching weights per subject</p>
                </div>
             </div>

             <div className="space-y-6">
                {subjects.map((subject, i) => (
                  <div key={i} className="space-y-3">
                     <div className="flex justify-between items-end">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">{subject.name}</p>
                        <p className="text-sm font-black text-white">{subject.weight}% Weight</p>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000"
                          style={{ width: `${subject.weight}%` }}
                        />
                     </div>
                     <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        <span>{subject.activeTeachers} Active Teachers</span>
                        <span>{subject.queueSize} in Queue</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-emerald-500 p-8 rounded-[3rem] text-white group cursor-pointer hover:bg-emerald-600 transition-all overflow-hidden relative">
             <div className="relative z-10">
                <h4 className="font-black text-xl mb-1">Status: Operational</h4>
                <p className="text-xs font-bold text-emerald-100">Matching engine heartbeat is healthy</p>
                <div className="mt-6 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Active now: 142 Matches/min</span>
                </div>
             </div>
             <Zap size={120} className="absolute -bottom-6 -right-6 text-emerald-400/20 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
