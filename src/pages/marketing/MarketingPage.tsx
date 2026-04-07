import React, { useState } from 'react';
import { 
  Megaphone, Send, Target, Users, Zap, Filter, Smartphone, 
  Mail, MessageSquare, Ticket, Percent, Clock, Gift, 
  Activity, TrendingUp, UserCheck, AlertTriangle, Layers, BarChart3
} from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import { cn } from '@/utils';

export const MarketingPage = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'FUNNEL' | 'OFFERS'>('CAMPAIGNS');

  const campaigns = [
    { id: '1', name: 'Spring Sale 2026', type: 'PROMOTION', channel: 'EMAIL', target: 'INACTIVE', reach: '12,500', conversion: '4.2%', status: 'ACTIVE' },
    { id: '2', name: 'New Teacher Boost', type: 'ACQUISITION', channel: 'PUSH', target: 'ALL_USERS', reach: '45,000', conversion: '2.5%', status: 'DRAFT' },
    { id: '3', name: 'Exam Prep Demo', type: 'ENGAGEMENT', channel: 'WHATSAPP', target: 'WEAK_MATH', reach: '8,400', conversion: '18.9%', status: 'COMPLETED' },
    { id: '4', name: 'High-Value Retention', type: 'RETENTION', channel: 'SMS', target: 'PREMIUM', reach: '1,200', conversion: '32.1%', status: 'ACTIVE' },
  ];

  const campaignColumns = [
    { 
      header: 'Campaign Name', 
      accessor: 'name' as const,
      render: (val: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl text-white shadow-md",
            item.channel === 'EMAIL' ? 'bg-blue-500 shadow-blue-500/20' : 
            item.channel === 'WHATSAPP' ? 'bg-emerald-500 shadow-emerald-500/20' : 
            item.channel === 'SMS' ? 'bg-slate-700 shadow-slate-700/20' : 
            'bg-indigo-500 shadow-indigo-500/20'
          )}>
            {item.channel === 'EMAIL' ? <Mail size={16} /> : 
             item.channel === 'WHATSAPP' ? <MessageSquare size={16} /> : 
             item.channel === 'SMS' ? <Smartphone size={16} /> : <Send size={16} />}
          </div>
          <div>
            <p className="font-bold text-slate-900">{val}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.type}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Target Segment', 
      accessor: 'target' as const,
      render: (val: string) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
          {val.replace('_', ' ')}
        </span>
      )
    },
    { header: 'Reach', accessor: 'reach' as const, render: (val: string) => <span className="font-bold text-slate-900">{val}</span> },
    { header: 'Conv. Rate', accessor: 'conversion' as const, render: (val: string) => <span className="font-black text-emerald-600">{val}</span> },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      render: (val: string) => (
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full",
            val === 'ACTIVE' ? "bg-green-500 animate-pulse" : 
            val === 'DRAFT' ? "bg-amber-500" : "bg-slate-400"
          )} />
          <span className="text-xs font-bold capitalize">{val.toLowerCase()}</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Megaphone className="text-primary" size={24} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Marketing Control Panel</h2>
            </div>
            <p className="text-slate-400 font-medium max-w-xl leading-relaxed">
              Orchestrate multi-channel growth campaigns, deeply segment your audience, build promotional offers, and track conversion funnels in real-time.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5 whitespace-nowrap">
            <Send size={18} />
            Launch Campaign
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <Target size={200} className="absolute -right-16 -bottom-16 opacity-5 rotate-12 pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-4 md:px-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'CAMPAIGNS', label: 'Campaign Center', icon: Send },
            { id: 'FUNNEL', label: 'Funnel Tracking', icon: BarChart3 },
            { id: 'OFFERS', label: 'Offer Engine', icon: Ticket },
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

        <div className="p-8">
          
          {/* TAB: CAMPAIGNS */}
          {activeTab === 'CAMPAIGNS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Campaign Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl text-blue-500 shadow-sm"><Users size={24}/></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Audience</p><h4 className="text-2xl font-black text-slate-900 mt-1">142,800</h4></div>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl text-primary shadow-sm"><Activity size={24}/></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg. Conversion</p><h4 className="text-2xl font-black text-slate-900 mt-1">8.4%</h4></div>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl text-amber-500 shadow-sm"><Zap size={24}/></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Overall ROI</p><h4 className="text-2xl font-black text-slate-900 mt-1">3.4x</h4></div>
                </div>
              </div>

              {/* Targeting Filter UI Preview */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                 <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <Filter size={18} className="text-primary"/>
                    <h3 className="font-bold">Audience Targeting Filters</h3>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    {['Class 10th', 'Weak Subject: Math', 'Inactive > 30 Days', 'High-Value Premium', 'Top Spenders', 'Exam Prep Seekers'].map(tag => (
                      <span key={tag} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
                        + {tag}
                      </span>
                    ))}
                 </div>
              </div>

              {/* Campaigns Table */}
              <div className="h-[25rem] overflow-x-auto min-w-full border border-slate-200 rounded-[2rem]">
                <DataTable columns={campaignColumns} data={campaigns} gridTemplateColumns="2.5fr 1.5fr 1fr 1fr 1fr" />
              </div>
            </div>
          )}

          {/* TAB: FUNNEL TRACKING */}
          {activeTab === 'FUNNEL' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Acquisition Funnel</h3>
                <p className="text-sm font-bold text-slate-500">Tracking the user journey from App Install to Paid Conversion</p>
              </div>

              {/* Funnel Visualization */}
              <div className="max-w-4xl mx-auto space-y-4">
                
                {/* Stage 1: Install */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-48 text-right md:pr-4">
                     <p className="font-bold text-slate-900">App Installs</p>
                     <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Top of Funnel</p>
                  </div>
                  <div className="flex-1 bg-slate-50 h-16 rounded-2xl border border-slate-100 flex items-center relative overflow-hidden group">
                     <div className="absolute inset-y-0 left-0 bg-blue-100 border-r border-blue-200 transition-all duration-1000" style={{ width: '100%' }}></div>
                     <span className="relative z-10 ml-6 font-black text-blue-700">120,400 Users</span>
                  </div>
                  <div className="w-24 text-center">
                     <span className="font-black text-xl text-slate-900">100%</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center md:justify-start md:pl-56">
                  <div className="w-0.5 h-6 bg-slate-200 relative">
                     <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-slate-200 rotate-45" />
                  </div>
                </div>

                {/* Stage 2: Signup */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-48 text-right md:pr-4">
                     <p className="font-bold text-slate-900">Signed Up</p>
                     <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Verified Accounts</p>
                  </div>
                  <div className="flex-1 bg-slate-50 h-16 rounded-2xl border border-slate-100 flex items-center relative overflow-hidden">
                     <div className="absolute inset-y-0 left-0 bg-primary/20 border-r border-primary/30 transition-all duration-1000" style={{ width: '65%' }}></div>
                     <span className="relative z-10 ml-6 font-black text-primary">78,260 Users</span>
                  </div>
                  <div className="w-24 text-center">
                     <span className="font-black text-xl text-slate-600">65%</span>
                     <p className="text-[10px] font-bold text-rose-500 uppercase">-35% Drop</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center md:justify-start md:pl-56">
                  <div className="w-0.5 h-6 bg-slate-200 relative">
                     <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-slate-200 rotate-45" />
                  </div>
                </div>

                {/* Stage 3: Paid Conversion */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-48 text-right md:pr-4">
                     <p className="font-bold text-emerald-600">Paid Conversion</p>
                     <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Revenue Generating</p>
                  </div>
                  <div className="flex-1 bg-slate-50 h-16 rounded-2xl border border-slate-100 flex items-center relative overflow-hidden">
                     <div className="absolute inset-y-0 left-0 bg-emerald-100 border-r border-emerald-200 transition-all duration-1000" style={{ width: '12%' }}></div>
                     <span className="relative z-10 ml-6 font-black text-emerald-700">14,448 Users</span>
                  </div>
                  <div className="w-24 text-center">
                     <span className="font-black text-xl text-emerald-600">12%</span>
                     <p className="text-[10px] font-bold text-rose-500 uppercase">-81% Drop</p>
                  </div>
                </div>
              </div>

              {/* Retention Chart Placeholder */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp size={18} className="text-primary"/> 30-Day Retention Rate</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1">Average user engagement post-signup</p>
                    </div>
                    <span className="px-4 py-2 bg-white rounded-xl text-sm font-black text-emerald-600 border border-slate-200 shadow-sm">+8% MoM</span>
                 </div>
                 <div className="h-48 flex items-end justify-between gap-2 px-4">
                    {[100, 85, 75, 70, 68, 65, 62, 60, 58, 55, 54, 52].map((val, i) => (
                      <div key={i} className="w-full bg-slate-200 rounded-t-lg relative group">
                        <div 
                          className="absolute bottom-0 w-full bg-primary/60 rounded-t-lg transition-all duration-700 group-hover:bg-primary"
                          style={{ height: `${val}%` }}
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">Day {i*2 || 1}</div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* TAB: OFFERS */}
          {activeTab === 'OFFERS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Coupon Engine */}
                <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm"><Ticket size={24} /></div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Coupon Engine</h3>
                      <p className="text-xs font-bold text-slate-500">Manage promo codes and discounts</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black">25%</div>
                        <div>
                          <p className="font-bold text-slate-900 uppercase">SPRING2026</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valid till April 30</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black">₹500</div>
                        <div>
                          <p className="font-bold text-slate-900 uppercase">NEWUSER500</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First purchase only</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-300 text-slate-500 rounded-2xl font-bold hover:border-primary hover:text-primary transition-colors">
                    + Generate New Coupon
                  </button>
                </div>

                {/* Cashback & Offers */}
                <div className="space-y-6">
                  {/* Cashback */}
                  <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                         <div className="p-3 bg-white text-amber-500 rounded-2xl shadow-sm"><Percent size={24} /></div>
                         <div>
                            <h4 className="font-black text-slate-900 text-lg">Cashback Campaigns</h4>
                            <p className="text-xs font-bold text-slate-500 max-w-[200px] mt-1">Reward users with wallet credits for subscription renewals.</p>
                         </div>
                      </div>
                      <button className="w-14 h-8 rounded-full bg-primary relative transition-all shadow-md shadow-primary/20">
                        <div className="w-6 h-6 bg-white rounded-full absolute top-1 left-7 shadow-sm" />
                      </button>
                    </div>
                    <div className="mt-6 flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Rate:</span>
                      <input type="number" defaultValue={10} className="w-16 font-black text-slate-900 outline-none text-right bg-transparent" />
                      <span className="font-black text-slate-900">%</span>
                    </div>
                  </div>

                  {/* Limited Time Offers */}
                  <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                         <div className="p-3 bg-white text-emerald-500 rounded-2xl shadow-sm"><Clock size={24} /></div>
                         <div>
                            <h4 className="font-black text-slate-900 text-lg">Limited Time Offers (LTO)</h4>
                            <p className="text-xs font-bold text-slate-500 max-w-[200px] mt-1">Enable flash sales with countdown timers on the app.</p>
                         </div>
                      </div>
                      <button className="w-14 h-8 rounded-full bg-slate-200 relative transition-all">
                        <div className="w-6 h-6 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                      </button>
                    </div>
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
