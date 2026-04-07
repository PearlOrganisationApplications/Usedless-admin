import React, { useState } from 'react';
import { 
  MessageSquare, Clock, CheckCircle2, AlertTriangle, ShieldAlert, Ticket, Trash2,
  Headphones, PhoneCall, Mic, MicOff, Search, PlayCircle, Star, PauseCircle
} from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import { cn } from '@/utils';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

export const SupportPage = () => {
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'LIVE_CHAT' | 'COMPLAINTS' | 'CALL_LOGS'>('TICKETS');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{title: string, message: string} | null>(null);

  // TICKETS DATA
  const tickets = [
    { id: 'T-102', user: 'Rahul Malhotra', issue: 'Payment failed for Plus pack', priority: 'HIGH', status: 'OPEN', time: '12 mins ago', type: 'PAYMENT' },
    { id: 'T-103', user: 'Ishani Patel', issue: 'Teacher not joined session', priority: 'CRITICAL', status: 'OPEN', time: '5 mins ago', type: 'SESSION' },
    { id: 'T-104', user: 'Aarav Sharma', issue: 'Unable to view MCQ report', priority: 'LOW', status: 'RESOLVED', time: '2 hours ago', type: 'TECHNICAL' },
    { id: 'T-105', user: 'Sanya Mirza', issue: 'Need refund for math session', priority: 'HIGH', status: 'OPEN', time: '1 hour ago', type: 'BILLING' },
  ];

  // COMPLAINTS DATA
  const complaints = [
    { id: 'C-091', reporter: 'Rohit K.', target: 'Inst: Sandeep Verma', incident: 'Teacher used abusive language', severity: 'CRITICAL', status: 'INVESTIGATING', date: '21 Mar, 10:30 AM' },
    { id: 'C-092', reporter: 'Meera Singh', target: 'Inst: Priya J.', incident: 'Teacher disconnected forcefully', severity: 'HIGH', status: 'WARN_ISSUED', date: '20 Mar, 04:15 PM' },
    { id: 'C-093', reporter: 'Anil Dash', target: 'Inst: Rajesh Kumar', incident: 'Was sleeping during live class', severity: 'CRITICAL', status: 'SUSPENDED', date: '19 Mar, 08:00 AM' },
  ];

  // CALL LOGS DATA
  const callLogs = [
    { id: 'CL-881', caller: '+91 98765 43210', agent: 'Neha Sharma', duration: '04:12', sentiment: 'FRUSTRATED', date: 'Today, 11:42 AM' },
    { id: 'CL-882', caller: '+91 81234 56789', agent: 'Akash Gupta', duration: '12:45', sentiment: 'NEUTRAL', date: 'Today, 10:15 AM' },
    { id: 'CL-883', caller: '+91 77788 99911', agent: 'AI Voicebot', duration: '01:30', sentiment: 'HAPPY', date: 'Yesterday, 04:30 PM' },
  ];

  const handleAction = (type: string, ticketId: string) => {
    if (type === 'ESC') {
        setConfirmAction({ title: 'Escalate to Manager?', message: `Are you sure you want to escalate ticket #${ticketId}? This will page the senior operations manager immediately.` });
    } else if (type === 'COMP_WARN') {
        setConfirmAction({ title: 'Issue Formal Warning?', message: `Send an automated severe warning to the teacher for complaint #${ticketId}?` });
    } else {
        setConfirmAction({ title: 'Assign Free Session?', message: `Assign a complimentary doubt session to the user as a resolution for ticket #${ticketId}?` });
    }
    setIsConfirmOpen(true);
  };

  const ticketColumns = [
    { header: 'Ticket ID', accessor: 'id' as const, render: (val: string) => <span className="font-mono text-xs font-black text-slate-400">#{val}</span> },
    { 
      header: 'Customer', 
      accessor: 'user' as const,
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px]">{val[0]}</div>
          <span className="font-bold text-slate-900 text-sm">{val}</span>
        </div>
      )
    },
    { 
        header: 'Context / Issue', 
        accessor: 'issue' as const,
        render: (val: string, row: any) => (
            <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">{val}</p>
                <p className="text-[10px] font-black text-primary uppercase mt-1 tracking-widest">{row.type}</p>
            </div>
        )
    },
    { 
      header: 'Severity', 
      accessor: 'priority' as const,
      render: (val: string) => (
        <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider", val === 'CRITICAL' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : val === 'HIGH' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-100 text-slate-700')}>
          {val}
        </span>
      )
    },
    { 
        header: 'Status', 
        accessor: 'status' as const,
        render: (val: string) => (
            <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", val === 'OPEN' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500')} />
                <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{val}</span>
            </div>
        )
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      render: (val: string) => (
        <div className="flex items-center gap-2">
            <button onClick={() => handleAction('FREE', val)} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors title='Assign Free Session'"><Ticket size={16} /></button>
            <button onClick={() => handleAction('ESC', val)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors title='Escalate'"><ShieldAlert size={16} /></button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all ml-2">Resolve</button>
        </div>
      )
    }
  ];

  const complaintColumns = [
    { header: 'Compl. ID', accessor: 'id' as const, render: (val: string) => <span className="font-mono text-xs font-black text-slate-400">#{val}</span> },
    { 
        header: 'Reporter & Target', 
        accessor: 'reporter' as const,
        render: (val: string, row: any) => (
            <div>
                <p className="text-sm font-bold text-slate-900">{val} <span className="text-xs text-slate-400 font-normal">reported</span></p>
                <p className="text-xs font-black text-rose-500 mt-0.5">{row.target}</p>
            </div>
        )
    },
    { header: 'Incident Details', accessor: 'incident' as const, render: (val: string) => <span className="font-bold text-slate-700 text-sm">{val}</span> },
    { header: 'Date', accessor: 'date' as const, render: (val: string) => <span className="text-xs font-bold text-slate-500">{val}</span> },
    { 
        header: 'Resolution Status', 
        accessor: 'status' as const,
        render: (val: string) => (
            <span className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase",
                val === 'SUSPENDED' ? 'bg-red-50 text-red-600 border border-red-100' : 
                val === 'WARN_ISSUED' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600 animate-pulse'
            )}>
                {val.replace('_', ' ')}
            </span>
        )
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      render: (val: string, row: any) => (
        <div className="flex items-center gap-2">
            <button onClick={() => handleAction('COMP_WARN', val)} disabled={row.status === 'SUSPENDED'} className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors disabled:opacity-50">Warn</button>
            <button disabled={row.status === 'SUSPENDED'} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors disabled:opacity-50">Suspend</button>
        </div>
      )
    }
  ];

  const callLogColumns = [
    { header: 'Call Ref', accessor: 'id' as const, render: (val: string) => <span className="font-mono text-[10px] font-black tracking-widest text-slate-400">{val}</span> },
    { 
        header: 'Caller ID & Agent', 
        accessor: 'caller' as const,
        render: (val: string, row: any) => (
            <div>
                <p className="font-mono text-sm font-bold text-slate-900 tracking-tight">{val}</p>
                <p className="text-[10px] font-black text-primary uppercase mt-0.5 flex items-center gap-1"><Headphones size={10} /> {row.agent}</p>
            </div>
        )
    },
    { header: 'Duration', accessor: 'duration' as const, render: (val: string) => <span className="font-mono text-sm font-bold text-slate-600">{val}</span> },
    { 
        header: 'AI Sentiment', 
        accessor: 'sentiment' as const,
        render: (val: string) => (
            <span className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase",
                val === 'FRUSTRATED' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                val === 'HAPPY' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
            )}>
                {val}
            </span>
        )
    },
    { header: 'Timestamp', accessor: 'date' as const, render: (val: string) => <span className="text-xs font-bold text-slate-500">{val}</span> },
    {
      header: 'Playback',
      accessor: 'id' as const,
      render: () => (
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm text-slate-600 rounded-xl text-xs font-bold hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all">
            <PlayCircle size={14} /> Listen
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Support & CRM Hub</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Unified command center for tickets, live chats, and escalation logs.</p>
        </div>
        <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                Generate Report
            </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-4 md:px-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'TICKETS', label: 'Ticket Queue', icon: Ticket },
            { id: 'LIVE_CHAT', label: 'Live Resolution', icon: MessageSquare },
            { id: 'COMPLAINTS', label: 'Complaints', icon: ShieldAlert },
            { id: 'CALL_LOGS', label: 'Call Logs', icon: PhoneCall },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-5 py-6 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-primary" : ""} />
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />}
            </button>
          ))}
        </div>

        <div className="p-8 flex-1">
          
          {/* TAB: TICKETS */}
          {activeTab === 'TICKETS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
                    <div className="p-3 bg-red-50 text-red-500 rounded-xl mb-3"><AlertTriangle size={24}/></div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">05</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Critical SLA Breach</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
                    <div className="p-3 bg-amber-50 text-amber-500 rounded-xl mb-3"><Clock size={24}/></div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">12</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Pending Unassigned</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl mb-3"><CheckCircle2 size={24}/></div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">84</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Resolved Today</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-900/20 flex flex-col items-center text-center text-white">
                    <div className="p-3 bg-white/10 text-white rounded-xl mb-3"><MessageSquare size={24}/></div>
                    <h4 className="text-2xl font-black tracking-tighter">3.2m</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Avg Resolution Time</p>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col min-h-[400px]">
                <DataTable columns={ticketColumns} data={tickets} gridTemplateColumns="0.8fr 1.5fr 2.5fr 1fr 1fr 2.2fr" />
              </div>
            </div>
          )}

          {/* TAB: LIVE CHAT PANEL */}
          {activeTab === 'LIVE_CHAT' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] animate-in fade-in slide-in-from-left-4 duration-500">
               {/* Contact List */}
               <div className="lg:col-span-1 border border-slate-200 rounded-[2.5rem] bg-slate-50 flex flex-col overflow-hidden">
                  <div className="p-5 border-b border-slate-200 bg-white">
                     <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input placeholder="Search active chats..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                     {[
                        { name: 'Aarush V.', waiting: '2m', unread: 2, active: true },
                        { name: 'Kavya T.', waiting: '4m', unread: 0, active: false },
                        { name: 'Arjun S.', waiting: '1m', unread: 1, active: false }
                     ].map((chat, i) => (
                        <div key={i} className={cn("p-4 rounded-xl cursor-pointer transition-all border", chat.active ? "bg-white border-primary shadow-[0_4px_20px_-4px_rgba(var(--primary),0.3)]" : "bg-white border-slate-100 hover:border-slate-300 shadow-sm")}>
                           <div className="flex justify-between items-start">
                              <div>
                                 <h5 className="font-bold text-slate-900 text-sm">{chat.name}</h5>
                                 <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock size={10}/> Wait: {chat.waiting}
                                 </p>
                              </div>
                              {chat.unread > 0 && <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">{chat.unread}</span>}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Chat Panel */}
               <div className="lg:col-span-2 border border-slate-200 rounded-[2.5rem] bg-white flex flex-col overflow-hidden relative shadow-sm">
                  {/* Chat Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between z-10 bg-white/80 backdrop-blur-md">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black">AV</div>
                        <div>
                           <h4 className="font-black text-slate-900 text-lg">Aarush V.</h4>
                           <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Now
                           </span>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">Transfer Chat</button>
                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">Mark Resolved</button>
                     </div>
                  </div>
                  
                  {/* Chat Area */}
                  <div className="flex-1 bg-slate-50 p-6 overflow-y-auto space-y-6">
                     <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0" />
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[70%]">
                           <p className="text-sm font-medium text-slate-700">Sir, my subscription was deducted twice from my bank account. Please help.</p>
                           <span className="text-[10px] font-bold text-slate-400 mt-2 block">10:41 AM</span>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 flex-row-reverse">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex flex-shrink-0 items-center justify-center font-black text-xs">You</div>
                        <div className="bg-primary/10 p-4 rounded-2xl rounded-tr-none shadow-sm border border-primary/20 max-w-[70%]">
                           <p className="text-sm font-medium text-slate-900">Hello Aarush, apologies for the inconvenience. Let me check your transaction history immediately.</p>
                           <span className="text-[10px] font-bold text-primary/60 mt-2 block text-right">10:43 AM · Seen</span>
                        </div>
                     </div>
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 bg-white border-t border-slate-100">
                     <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-2xl focus-within:ring-2 ring-primary/20 transition-all">
                        <input className="flex-1 bg-transparent px-3 text-sm font-medium outline-none placeholder:text-slate-400" placeholder="Type resolution message..." />
                        <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-transform"><MessageSquare size={16} /></button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: COMPLAINTS */}
          {activeTab === 'COMPLAINTS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
               <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-white text-rose-500 rounded-xl shadow-sm"><ShieldAlert size={24}/></div>
                     <div>
                        <h3 className="text-lg font-black text-rose-900 tracking-tight">Severe Incident Reports</h3>
                        <p className="text-xs font-bold text-rose-500/80 mt-1 max-w-xl">
                           Complaints logged here bypass L1 support and require immediate Manager/Admin intervention. Actions taken here directly impact Teacher Quality scores.
                        </p>
                     </div>
                  </div>
                  <button className="px-5 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 whitespace-nowrap">
                     Export Compliance Log
                  </button>
               </div>

               <div className="border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col min-h-[400px]">
                  <DataTable columns={complaintColumns} data={complaints} gridTemplateColumns="0.8fr 1.5fr 2fr 1fr 1.2fr 1.5fr" />
               </div>
            </div>
          )}

          {/* TAB: CALL LOGS */}
          {activeTab === 'CALL_LOGS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
               <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-xl">
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                     <div className="text-center md:text-left">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Today's Call Volume</p>
                        <h4 className="text-3xl font-black text-white">1,402</h4>
                     </div>
                     <div className="h-10 w-px bg-slate-800 hidden md:block" />
                     <div className="text-center md:text-left">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Avg Answer Speed</p>
                        <h4 className="text-3xl font-black text-emerald-400">14s</h4>
                     </div>
                     <div className="h-10 w-px bg-slate-800 hidden md:block" />
                     <div className="text-center md:text-left">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">AI Handled</p>
                        <h4 className="text-3xl font-black text-primary">62%</h4>
                     </div>
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                     <Headphones size={16} /> Whisper UI Settings
                  </button>
               </div>

               <div className="border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col min-h-[400px]">
                  <DataTable columns={callLogColumns} data={callLogs} gridTemplateColumns="0.8fr 1.5fr 1fr 1fr 1.2fr 1fr" />
               </div>
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => setIsConfirmOpen(false)}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
      />
    </div>
  );
};
