import React, { useState } from 'react';
import { Activity, Radio, PhoneOff, Eye, Search, Filter, Video, Users2, MoreVertical, Ban } from 'lucide-react';
import { cn } from '@/utils';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

const SessionCard = ({ student, teacher, duration, status, type, onForceEnd, onSilentJoin, onViewRecording }: any) => (
  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all border-l-8 border-l-primary group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
            <MoreVertical size={16} />
        </button>
    </div>

    <div className="flex justify-between items-start mb-6">
      <div className="flex gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-xl text-slate-600 border-2 border-white shadow-sm">
            {student[0]}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white" />
        </div>
        <div>
          <h4 className="font-black text-slate-900 text-lg">{student}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student ID: #ST-8291</p>
        </div>
      </div>
      <div className="px-3 py-1.5 bg-primary/5 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest">
        {type}
      </div>
    </div>

    <div className="space-y-4 py-6 border-y border-slate-50">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Assigned Teacher</span>
        <span className="text-slate-900 font-black flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            {teacher}
        </span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Elapsed Time</span>
        <span className="text-slate-900 font-mono font-black text-base">{duration}</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mt-6">
      <button 
        onClick={onSilentJoin}
        className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
      >
        <Eye size={16} />
        Silent Join
      </button>
      <button 
        onClick={onViewRecording}
        className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
      >
        <Video size={16} />
        Recording
      </button>
      <button 
        onClick={onForceEnd}
        className="col-span-2 flex items-center justify-center gap-2 py-3 border-2 border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all"
      >
        <Ban size={16} />
        Force End Session
      </button>
    </div>
  </div>
);

export const WarRoomPage = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);

  const handleForceEnd = (session: any) => {
    setActiveSession(session);
    setIsConfirmOpen(true);
  };

  const confirmForceEnd = () => {
    // Logic to end session
    setIsConfirmOpen(false);
  };

  const sessions = [
    { student: "Rahul Malhotra", teacher: "Dr. Amit Trivedi", duration: "08:42", type: "DOUBT_MATH" },
    { student: "Priya Singh", teacher: "Sneh Lata", duration: "04:15", type: "LIVE_PHYSICS" },
    { student: "Aryan Khan", teacher: "Vikram Singh", duration: "12:05", type: "DOUBT_CHEM" },
    { student: "Sanya Mirza", teacher: "Priya Verma", duration: "02:59", type: "DOUBT_BIO" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-500 rounded-[2rem] shadow-xl shadow-red-500/30 text-white relative">
            <Radio size={28} className="animate-pulse" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">War Room</h2>
            <p className="text-slate-500 text-sm font-bold flex items-center gap-2 mt-1 uppercase tracking-widest">
              Live Monitor: 42 Active Sessions
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              placeholder="Search sessions, students, teachers..." 
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none w-80 transition-all"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
        {sessions.map((session, i) => (
          <SessionCard 
            key={i}
            {...session}
            onForceEnd={() => handleForceEnd(session)}
            onSilentJoin={() => {}}
            onViewRecording={() => {}}
          />
        ))}
      </div>

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmForceEnd}
        title="Force End Session?"
        message={`Are you sure you want to end the session between ${activeSession?.student} and ${activeSession?.teacher}? This action cannot be undone.`}
      />
    </div>
  );
};
