import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { liveClassesApi, LiveClass } from '@/services/api/live-classes.api';
import { 
  Video, Calendar, Users, Mic2, 
  MessageSquareOff, MessageSquare, 
  Plus, Trash2, Edit3, DollarSign,
  ChevronLeft, ChevronRight, MonitorPlay,
  MonitorStop, Settings2
} from 'lucide-react';
import { cn } from '@/utils';

export const LiveClassesPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: liveClasses = [], isLoading } = useQuery({
    queryKey: ['liveClasses'],
    queryFn: liveClassesApi.getAll
  });

  const calendarDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-[2000ms]">
          <Mic2 size={160} className="text-primary rotate-12" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Live Classes Control</h2>
          <p className="text-slate-400 font-medium text-lg max-w-xl">
            Schedule group workshops, assign expert teachers, and manage the live learning ecosystem.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/25 hover:bg-primary/90 hover:-translate-y-1 transition-all active:translate-y-0"
        >
          <Plus size={24} />
          Create Live Class
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Calendar & Settings */}
        <div className="xl:col-span-2 space-y-8">
          {/* Scheduling Calendar UI (Mocked Visual) */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Calendar className="text-primary" size={24} />
                Weekly Schedule Overview
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><ChevronLeft size={20} /></button>
                <span className="font-bold text-slate-700 px-4">March 30 - April 05</span>
                <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><ChevronRight size={20} /></button>
              </div>
            </div>

            <div className="border border-slate-100 rounded-[2rem] overflow-hidden">
               <div className="grid grid-cols-8 bg-slate-50 border-b border-slate-100">
                  <div className="p-4 border-r border-slate-100"></div>
                  {calendarDays.map(day => (
                    <div key={day} className="p-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 last:border-0">{day}</div>
                  ))}
               </div>
               <div className="relative h-[400px] overflow-y-auto custom-scrollbar">
                  {hours.map((hour, i) => (
                    <div key={hour} className="grid grid-cols-8 border-b border-slate-50 last:border-0 group">
                       <div className="p-4 border-r border-slate-50 text-[10px] font-bold text-slate-400">{hour}</div>
                       {[1,2,3,4,5,6,7].map(d => (
                         <div key={d} className="p-4 border-r border-slate-50 last:border-0 relative">
                            {/* Mock Live Class Block */}
                            {i === 1 && d === 3 && (
                               <div className="absolute inset-1 bg-primary/10 border-l-4 border-primary rounded-xl p-2 z-10 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-primary/5">
                                  <p className="text-[10px] font-black text-primary leading-tight">Advanced Calc</p>
                                  <p className="text-[8px] font-bold text-slate-500 mt-1">Dr. Amit</p>
                               </div>
                            )}
                            {i === 6 && d === 1 && (
                               <div className="absolute inset-1 bg-rose-50 border-l-4 border-rose-500 rounded-xl p-2 z-10 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-rose-500/5">
                                  <p className="text-[10px] font-black text-rose-600 leading-tight">Physics Lab</p>
                                  <p className="text-[8px] font-bold text-slate-500 mt-1">Sneh Lata</p>
                               </div>
                            )}
                         </div>
                       ))}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Classes List & Controls */}
        <div className="space-y-8">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black text-slate-900">Manage Classes</h3>
              <span className="p-1 px-2.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest">{liveClasses.length} Scheduled</span>
           </div>
           
           <div className="space-y-6">
              {isLoading ? (
                [1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-[2rem] border border-slate-100 animate-pulse" />)
              ) : liveClasses.map((lc) => (
                <div key={lc.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all flex gap-1">
                      <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-primary transition-colors"><Edit3 size={16} /></button>
                      <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                   </div>

                   <div className="flex items-start gap-4 mb-6">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                        lc.status === 'LIVE' ? "bg-rose-50 border-rose-100 text-rose-600 animate-pulse" : "bg-blue-50 border-blue-100 text-blue-600"
                      )}>
                        {lc.status === 'LIVE' ? <MonitorPlay size={24} /> : <Video size={24} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-slate-900 text-lg leading-tight mb-1">{lc.title}</h4>
                        <div className="flex items-center gap-2">
                           <span className={cn(
                             "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border",
                             lc.status === 'LIVE' ? "bg-rose-500 text-white border-rose-600" : "bg-slate-100 text-slate-500 border-slate-200"
                           )}>
                             {lc.status}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {lc.duration}</span>
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teacher</p>
                         <p className="text-xs font-black text-slate-900 truncate">{lc.teacherName}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</p>
                         <p className="text-xs font-black text-slate-900 flex items-center gap-0.5">
                            <DollarSign size={12} className="text-emerald-500" />
                            {lc.price.toLocaleString()}
                         </p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Students</p>
                         <p className="text-xs font-black text-slate-900 flex items-center gap-2">
                            <Users size={14} className="text-primary" />
                            {lc.studentsCount} Active
                         </p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Chat</p>
                         <div className="flex items-center gap-2">
                            {lc.chatEnabled ? (
                              <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1">
                                <MessageSquare size={12} /> ON
                              </span>
                            ) : (
                              <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                                <MessageSquareOff size={12} /> OFF
                              </span>
                            )}
                            <button className="h-5 w-8 rounded-full bg-slate-100 border border-slate-200 relative transition-colors focus:ring-2 focus:ring-primary/20">
                               <div className={cn(
                                 "absolute top-0.5 h-3.5 w-3.5 rounded-full shadow-sm transition-all",
                                 lc.chatEnabled ? "right-0.5 bg-primary" : "left-0.5 bg-slate-300"
                               )} />
                            </button>
                         </div>
                      </div>
                   </div>

                   <button className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-[1.25rem] text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2 transition-all group-hover:bg-primary group-hover:text-white">
                      <MonitorPlay size={16} />
                      Monitor Session
                   </button>
                </div>
              ))}
           </div>

           {/* Quick Actions Card */}
           <div className="bg-gradient-to-br from-primary to-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 p-8 opacity-20 group-hover:scale-125 transition-transform duration-1000">
                 <Settings2 size={120} />
              </div>
              <div className="relative z-10">
                 <h4 className="text-xl font-black tracking-tight mb-2">Global Live Control</h4>
                 <p className="text-white/70 text-xs font-medium mb-6">Instantly toggle platform-wide settings for all active live sessions.</p>
                 <div className="space-y-3">
                    <button className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/20">
                       Mute All Guest Audios
                    </button>
                    <button className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/20">
                       Disable Platform Chat
                    </button>
                    <button className="w-full py-3 bg-white/10 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/20 hover:border-rose-500">
                       End All Live Sessions
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
