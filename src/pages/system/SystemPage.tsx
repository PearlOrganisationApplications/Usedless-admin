import React, { useState } from 'react';
import { 
  Settings, Shield, Zap, Globe, AlertTriangle, Save, 
  Cpu, Database, UploadCloud, Sliders, Bot, UserCog,
  FileCheck, Trash2, Link as LinkIcon, Server, Activity, Smartphone,
  Lock, Eye, ShieldAlert, MapPin
} from 'lucide-react';
import { cn } from '@/utils';
import { DataTable } from '@/components/tables/DataTable';

const ToggleCard = ({ title, description, icon: Icon, enabled, onChange, color }: any) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-slate-200 transition-all">
        <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-xl shadow-sm bg-white", color)}><Icon size={20}/></div>
            <div>
                <h5 className="font-bold text-slate-900 text-sm">{title}</h5>
                <p className="text-xs text-slate-500 max-w-sm mt-0.5">{description}</p>
            </div>
        </div>
        <div 
          onClick={onChange}
          className={cn(
            "w-12 h-6 rounded-full relative cursor-pointer transition-all shadow-inner", 
            enabled ? 'bg-primary' : 'bg-slate-200'
          )}
        >
            <div className={cn(
              "w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm", 
              enabled ? 'left-7' : 'left-1'
            )} />
        </div>
    </div>
);

export const SystemPage = () => {
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'INFRASTRUCTURE' | 'SECURITY' | 'AI_ENGINE' | 'TRAINING_DATA'>('GLOBAL');
  
  // Toggle States
  const [mtEnabled, setMtEnabled] = useState(false);
  const [refEnabled, setRefEnabled] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [gdprEnabled, setGdprEnabled] = useState(true);

  // KB Mock Data
  const kbFiles = [
    { id: '1', name: 'class10_physics_curriculum.pdf', type: 'PDF', size: '2.4 MB', date: '2026-03-20', status: 'INDEXED' },
    { id: '2', name: 'platform_guidelines_v2.docx', type: 'DOCX', size: '1.1 MB', date: '2026-03-15', status: 'INDEXED' },
    { id: '3', name: 'faq_responses_q1.csv', type: 'CSV', size: '45 KB', date: '2026-03-29', status: 'SYNCING' },
  ];

  // Audit Logs Mock Data
  const auditLogs = [
    { id: 'AL-882', user: 'Dr. Amit Trivedi', role: 'TEACHER', action: 'Login Success', ip: '112.134.55.12', location: 'Mumbai, IN', date: 'Today, 09:41 AM', risk: 'LOW' },
    { id: 'AL-883', user: 'Rohan Sharma', role: 'STUDENT', action: 'Multiple Logins Blocked', ip: '45.112.99.30', location: 'Unknown', date: 'Today, 10:15 AM', risk: 'HIGH' },
    { id: 'AL-884', user: 'System Admin', role: 'SUPER_ADMIN', action: 'Changed Payout Limit', ip: '192.168.1.1', location: 'Office VPN', date: 'Yesterday', risk: 'MEDIUM' },
    { id: 'AL-885', user: 'Sneha Patel', role: 'STUDENT', action: 'Failed Payment', ip: '103.24.55.91', location: 'Delhi, IN', date: 'Yesterday', risk: 'LOW' },
  ];

  const kbColumns = [
    { 
      header: 'File Name', 
      accessor: 'name' as const,
      render: (val: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 text-slate-500 rounded-lg"><FileCheck size={16} /></div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{val}</p>
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">{item.size}</p>
          </div>
        </div>
      )
    },
    { header: 'Type', accessor: 'type' as const, render: (val: string) => <span className="font-black text-xs text-slate-500">{val}</span> },
    { header: 'Uploaded', accessor: 'date' as const, render: (val: string) => <span className="text-sm font-medium text-slate-600">{val}</span> },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      render: (val: string) => (
        <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase", val === 'INDEXED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse")}>
          {val}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: 'id' as const,
      render: () => (
        <div className="flex items-center gap-2">
           <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-primary rounded-lg transition-colors"><LinkIcon size={16}/></button>
           <button className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
        </div>
      )
    }
  ];

  const auditColumns = [
    { header: 'Case ID', accessor: 'id' as const, render: (val: string) => <span className="font-mono text-[10px] font-black text-slate-400">{val}</span> },
    { 
      header: 'User/Entity', 
      accessor: 'user' as const,
      render: (val: string, item: any) => (
        <div>
          <p className="font-bold text-slate-900">{val}</p>
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">{item.role}</p>
        </div>
      )
    },
    { header: 'Action Log', accessor: 'action' as const, render: (val: string) => <span className="font-bold text-slate-700">{val}</span> },
    { 
      header: 'IP & Trace', 
      accessor: 'ip' as const,
      render: (val: string, item: any) => (
        <div>
          <p className="font-mono text-xs font-bold text-slate-500">{val}</p>
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {item.location}</p>
        </div>
      )
    },
    { header: 'Timestamp', accessor: 'date' as const, render: (val: string) => <span className="text-xs font-bold text-slate-600">{val}</span> },
    { 
      header: 'Risk', 
      accessor: 'risk' as const,
      render: (val: string) => (
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase",
          val === 'HIGH' ? "bg-rose-50 text-rose-600 border border-rose-100 animate-pulse" : 
          val === 'MEDIUM' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
        )}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Dynamic Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Settings className="text-slate-300" size={24} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">System & Engine Config</h2>
            </div>
            <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
              Global control panel for platform behavior, API routing, server load monitoring, strict security compliance, AI Tutor parameters, and knowledge base ingestion pipelines.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 px-6 py-3.5 rounded-xl font-bold shadow-lg hover:bg-slate-700 hover:text-white transition-all hover:-translate-y-0.5 whitespace-nowrap border border-slate-700">
            <Save size={18} />
            Apply Master Config
          </button>
        </div>

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <Cpu size={240} className="absolute -right-16 -bottom-16 opacity-10 rotate-12 pointer-events-none text-slate-500" />
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-4 md:px-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'GLOBAL', label: 'Global Setup', icon: Settings },
            { id: 'INFRASTRUCTURE', label: 'Infrastructure', icon: Server },
            { id: 'SECURITY', label: 'Security & Logs', icon: Shield },
            { id: 'AI_ENGINE', label: 'AI Engine', icon: Bot },
            { id: 'TRAINING_DATA', label: 'Knowledge Base', icon: Database },
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

        <div className="p-8 flex-1 overflow-visible">
          
          {/* TAB: GLOBAL SETUP */}
          {activeTab === 'GLOBAL' && (
            <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="space-y-4">
                 <h3 className="text-xl font-black text-slate-900 mb-6">Feature Toggles</h3>
                 <ToggleCard 
                    title="System Maintenance Mode" 
                    description="Turn on to disable all client-side app functionality (mobile & web) for routine updates. Only Admins can log in."
                    icon={AlertTriangle}
                    color="text-rose-500"
                    enabled={mtEnabled}
                    onChange={() => setMtEnabled(!mtEnabled)}
                 />
                 <ToggleCard 
                    title="Global Referral Boost" 
                    description="Temporarily double rewards for all referrals across the platform."
                    icon={Globe}
                    color="text-amber-500"
                    enabled={refEnabled}
                    onChange={() => setRefEnabled(!refEnabled)}
                 />
              </div>

              <div className="h-px bg-slate-100 my-8" />

              <div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      <Shield className="text-primary" size={20} /> Authentication Parameters
                  </h3>
                  <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Session Timeout (Mins)</label>
                              <input className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" defaultValue="1440" />
                          </div>
                          <div className="space-y-3">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Max Concurrent Logins</label>
                              <input className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" defaultValue="2" />
                          </div>
                      </div>
                      <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-2xl flex gap-3 text-amber-700 shadow-sm items-start">
                          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                          <p className="text-sm font-medium leading-relaxed">
                              <b>Critical Warning:</b> Modifying authentication parameters will immediately force-logout all active sessions, including other administrators. Proceed with extreme caution during peak hours.
                          </p>
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* TAB: INFRASTRUCTURE */}
          {activeTab === 'INFRASTRUCTURE' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 
                 {/* Server Load Monitoring */}
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-white">
                    <h3 className="text-xl font-black flex items-center gap-2"><Activity size={24} className="text-emerald-400"/> Server Telemetry</h3>
                    <p className="text-xs font-bold text-slate-400 mb-8">Real-time cluster health and resource allocation.</p>
                    
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                             <span>CPU Utilization (Cluster A)</span>
                             <span className="text-amber-400">76% / 100%</span>
                          </div>
                          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: '76%' }} />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                             <span>Memory Heap (Redis instances)</span>
                             <span className="text-emerald-400">42% / 100%</span>
                          </div>
                          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: '42%' }} />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                             <span>Live Signaling WebSockets</span>
                             <span className="text-primary mt-1 px-3 py-1 bg-primary/20 rounded-lg shadow-inner">2,804 Active Conns</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* API & Version Control */}
                 <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem]">
                       <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4"><Zap size={20} className="text-amber-500" /> Webhook & API Gateway</h3>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-bold text-slate-700">Payment Gateway Routing</span>
                             <select className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 outline-none">
                                <option>Razorpay Primary</option>
                                <option>Stripe Backup</option>
                             </select>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-bold text-slate-700">Video CDN Pipeline</span>
                             <select className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 outline-none">
                                <option>AWS CloudFront (Default)</option>
                                <option>Akamai (Low Latency)</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem]">
                       <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4"><Smartphone size={20} className="text-primary" /> App Version Control</h3>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black tracking-widest uppercase text-slate-400">Min iOS Version</label>
                              <input className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm" defaultValue="2.1.4" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black tracking-widest uppercase text-slate-400">Min Android Version</label>
                              <input className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm" defaultValue="3.0.2" />
                           </div>
                       </div>
                       <p className="text-[10px] font-bold text-rose-500 mt-3">* Clients below these versions will be forced to update from the App Store.</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ToggleCard 
                     title="User Data Protection (Strict GDPR)" 
                     description="Anonymize student PII in logs, prevent unmasked data extraction via API."
                     icon={Lock}
                     color="text-emerald-500"
                     enabled={gdprEnabled}
                     onChange={() => setGdprEnabled(!gdprEnabled)}
                  />
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white text-rose-500 rounded-xl shadow-sm"><ShieldAlert size={20}/></div>
                        <div>
                           <h5 className="font-bold text-rose-900 text-sm">Fraud & Login Rules</h5>
                           <p className="text-xs text-rose-600 mt-0.5">Rules auto-block VPN/Proxies.</p>
                        </div>
                     </div>
                     <button className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors">Edit Logic</button>
                  </div>
               </div>

               <div className="border border-slate-200 rounded-[2rem] bg-white overflow-hidden flex flex-col min-h-[400px]">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 text-slate-900">
                     <div>
                       <h3 className="font-black flex items-center gap-2"><Eye size={18} className="text-primary"/> System-wide Audit Logs</h3>
                       <p className="text-xs font-bold text-slate-500 mt-1">Immutable ledger of platform access and configurational mutations.</p>
                     </div>
                     <button className="px-5 py-2.5 bg-white border border-slate-200 shadow-sm text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">Export CSV</button>
                  </div>
                  <div className="flex-1 overflow-x-auto min-w-full">
                     <DataTable columns={auditColumns} data={auditLogs} gridTemplateColumns="1fr 1.5fr 2fr 1.5fr 1.5fr 1fr" />
                  </div>
               </div>
            </div>
          )}

          {/* TAB: AI ENGINE CONTROL */}
          {activeTab === 'AI_ENGINE' && (
            <div className="space-y-10 max-w-5xl animate-in fade-in slide-in-from-left-4 duration-500">
              
              {/* Master Switch */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] text-white shadow-xl">
                 <div className="flex items-start gap-4">
                    <div className="p-4 bg-primary/20 rounded-2xl text-primary mt-1 backdrop-blur-sm"><Bot size={32} /></div>
                    <div>
                       <h3 className="text-2xl font-black tracking-tight">AI Tutor Engine</h3>
                       <p className="text-sm font-bold text-slate-400 mt-2 max-w-lg leading-relaxed">
                          Master toggle for the LLM-powered virtual assistant. When disabled, all student queries will strictly bypass the AI and immediately seek human intervention.
                       </p>
                    </div>
                 </div>
                 <button 
                    onClick={() => setAiEnabled(!aiEnabled)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all",
                      aiEnabled ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    )}
                 >
                    {aiEnabled ? 'Engine Active' : 'Engine Offline'}
                 </button>
              </div>

              {/* Engine Tuning - Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-100 transition-opacity" style={{ opacity: aiEnabled ? 1 : 0.5, pointerEvents: aiEnabled ? 'auto' : 'none' }}>
                 
                 {/* Quality Control */}
                 <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] space-y-8">
                    <div className="flex items-center gap-3">
                       <Sliders className="text-primary" size={24} />
                       <h4 className="text-xl font-black text-slate-900">Response Tuning</h4>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Creativity (Temperature)</label>
                          <span className="text-sm font-black text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200">0.2 Strict</span>
                       </div>
                       <div className="h-4 bg-slate-200 rounded-full relative overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-primary w-1/4 rounded-full" />
                       </div>
                       <p className="text-[10px] font-bold text-slate-400">Lower values force factual accuracy. Higher values allow creative conversational flow.</p>
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">Operational Mode</label>
                       <div className="grid grid-cols-2 gap-3">
                          <button className="py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl text-sm shadow-sm transition-all focus:outline-none">
                             Pedagogic (Tutor)
                          </button>
                          <button className="py-3 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold rounded-xl text-sm transition-all focus:outline-none">
                             Direct Answer
                          </button>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400">Tutor mode guides the student to the answer via Socratic questioning.</p>
                    </div>
                 </div>

                 {/* Fallback Logic */}
                 <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] space-y-8">
                    <div className="flex items-center gap-3">
                       <UserCog className="text-amber-500" size={24} />
                       <h4 className="text-xl font-black text-slate-900">Human Fallback Routing</h4>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">Automated Turn Limit</label>
                        <div className="flex items-center gap-4 bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                           <input type="number" defaultValue={5} className="w-full font-black text-slate-900 outline-none bg-transparent" />
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Messages</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400">Route to human if AI cannot resolve the doubt within this interactions.</p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">Confidence Threshold</label>
                        <div className="flex items-center gap-4 bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                           <input type="number" defaultValue={85} className="w-full font-black text-slate-900 outline-none bg-transparent" />
                           <span className="text-xs font-black text-primary">%</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400">Internal AI confidence needed to respond. Below this, it routes immediately.</p>
                    </div>
                 </div>

              </div>

            </div>
          )}

          {/* TAB: TRAINING DATA (KNOWLEDGE BASE) */}
          {activeTab === 'TRAINING_DATA' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 
                 {/* Upload Panel */}
                 <div className="lg:col-span-1 border-2 border-dashed border-slate-300 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer min-h-[400px]">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-slate-200/50 mb-6 text-primary">
                       <UploadCloud size={32} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Upload Corpus</h4>
                    <p className="text-sm font-bold text-slate-500 mb-8 max-w-[200px]">
                       Drag & drop PDF, DOCX, or CSV files to inject new context to the AI.
                    </p>
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">
                       Browse Files
                    </button>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-6">Max 50MB per file</p>
                 </div>

                 {/* KB List */}
                 <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                          <Database size={20} className="text-primary"/> Active Knowledge Base
                       </h3>
                       <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500">3 Files Indexed</span>
                    </div>
                    <div className="flex-1 overflow-x-auto min-w-full">
                       <DataTable columns={kbColumns} data={kbFiles} gridTemplateColumns="2.5fr 1fr 1.5fr 1.5fr 1fr" />
                    </div>
                 </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
