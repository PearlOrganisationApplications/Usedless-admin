import React, { useState } from 'react';
import { 
  BarChart2, LineChart, PieChart, Users, TrendingUp, 
  Activity, GraduationCap, DollarSign, Brain, Clock, 
  BookOpen, Target, Wallet, ArrowUpRight, ArrowDownRight,
  Layers, Zap, Calendar
} from 'lucide-react';
import { cn } from '@/utils';
import { DataTable } from '@/components/tables/DataTable';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, isPositive, colorClass }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md group">
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 mt-2">{value}</h3>
        <p className="text-xs font-bold text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className={cn("p-3 rounded-2xl text-white shadow-lg", colorClass)}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 relative z-10">
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold",
        isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
      <span className="text-xs font-bold text-slate-400">vs last month</span>
    </div>
  </div>
);

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'BUSINESS' | 'LEARNING' | 'FINANCIALS'>('BUSINESS');

  const payoutData = [
    { id: 'TRX-9921', teacher: 'Dr. Amit Trivedi', amount: '₹14,500', status: 'PROCESSED', date: 'Today, 09:41 AM' },
    { id: 'TRX-9922', teacher: 'Vikram Singh', amount: '₹8,200', status: 'PENDING', date: 'Today, 10:15 AM' },
    { id: 'TRX-9923', teacher: 'Sneha Patel', amount: '₹22,100', status: 'PROCESSED', date: 'Yesterday' },
  ];

  return (
    <div className="space-y-8 p-1">
      
      {/* Global Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900 p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <BarChart2 className="text-emerald-400" size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Analytics Command Center</h2>
          </div>
          <p className="text-slate-400 font-medium max-w-xl leading-relaxed">
            Real-time telemetry across all operational dimensions. Monitor business growth, analyze learning efficacy, and track financial distributions.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-sm">
           <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg">Last 30 Days</button>
           <button className="px-4 py-2 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors">Quarterly</button>
           <button className="px-4 py-2 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors">YTD</button>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <LineChart size={240} className="absolute -right-20 -bottom-20 opacity-5 rotate-12 pointer-events-none" />
      </div>

      {/* Main Tab Navigation */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 md:px-8 overflow-x-auto no-scrollbar bg-white sticky top-0 z-20">
          {[
            { id: 'BUSINESS', label: 'Business Metrics', icon: TrendingUp },
            { id: 'LEARNING', label: 'Learning Analytics', icon: Brain },
            { id: 'FINANCIALS', label: 'Financial Reports', icon: DollarSign },
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

        <div className="p-8 flex-1">
          
          {/* TAB: BUSINESS METRICS */}
          {activeTab === 'BUSINESS' && (
            <div className="space-y-8">
              {/* DAU / MAU & ARPU Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Daily Active Users (DAU)" 
                  value="42.5K" 
                  subtitle="Unique sessions today"
                  icon={Users} 
                  trend="12.5%" 
                  isPositive={true}
                  colorClass="bg-blue-500 shadow-blue-500/30"
                />
                <StatCard 
                  title="Monthly Active Users" 
                  value="1.2M" 
                  subtitle="30-day rolling aggregate"
                  icon={Target} 
                  trend="8.1%" 
                  isPositive={true}
                  colorClass="bg-indigo-500 shadow-indigo-500/30"
                />
                <StatCard 
                  title="Avg. Revenue Per User" 
                  value="₹840" 
                  subtitle="Blended ARPU"
                  icon={Zap} 
                  trend="2.4%" 
                  isPositive={true}
                  colorClass="bg-amber-500 shadow-amber-500/30"
                />
              </div>

              {/* Revenue Dashboard */}
              <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Revenue Trajectory</h3>
                    <p className="text-xs font-bold text-slate-500">Trailing 12-month recurring vs. one-off revenue</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Subscriptions</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400" /> One-off Classes</div>
                  </div>
                </div>

                {/* Mock Area Chart */}
                <div className="h-64 flex items-end justify-between gap-1">
                   {[40, 45, 42, 55, 60, 58, 70, 75, 82, 80, 95, 100].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end h-full gap-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}: ₹{(val * 4.2).toFixed(1)}L
                        </div>
                        {/* One-off Revenue (Top segment) */}
                        <div 
                          className="w-full bg-emerald-400/80 rounded-t-sm transition-all duration-700 group-hover:bg-emerald-400 group-hover:brightness-110"
                          style={{ height: `${val * 0.3}%` }}
                        />
                        {/* Subscriber Revenue (Bottom segment) */}
                        <div 
                          className="w-full bg-primary/80 transition-all duration-700 group-hover:bg-primary group-hover:brightness-110"
                          style={{ height: `${val * 0.7}%` }}
                        />
                        <span className="text-center text-[10px] font-bold text-slate-400 mt-2 block w-full truncate">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                        </span>
                      </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: LEARNING METRICS */}
          {activeTab === 'LEARNING' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Doubts per Student & Session Duration */}
                 <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex items-center justify-between">
                       <div>
                         <p className="text-[10px] font-black tracking-widest uppercase text-blue-500">Resolve Efficiency</p>
                         <h3 className="text-4xl font-black text-blue-900 mt-1">4.2 <span className="text-lg font-bold text-blue-400">doubts / student</span></h3>
                         <p className="text-xs font-bold text-blue-600/80 mt-2">-12% (Fewer unresolved queries)</p>
                       </div>
                       <BookOpen size={60} className="text-blue-200" />
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center justify-between">
                       <div>
                         <p className="text-[10px] font-black tracking-widest uppercase text-emerald-500">Avg. Session Duration</p>
                         <h3 className="text-4xl font-black text-emerald-900 mt-1">48m <span className="text-lg font-bold text-emerald-400">12s</span></h3>
                         <p className="text-xs font-bold text-emerald-600/80 mt-2">+4m (Increased engagement)</p>
                       </div>
                       <Clock size={60} className="text-emerald-200" />
                    </div>
                 </div>

                 {/* Teacher Performance Charts */}
                 <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem]">
                   <h3 className="text-xl font-black text-slate-900">Top Rated Instructors</h3>
                   <p className="text-xs font-bold text-slate-500 mb-6">Based on post-session student feedback scoring</p>
                   
                   <div className="space-y-5">
                      {[
                        { name: 'Dr. Amit Trivedi', score: 4.9, fill: '98%', color: 'bg-primary' },
                        { name: 'Anjali Sharma', score: 4.8, fill: '96%', color: 'bg-primary/80' },
                        { name: 'Rahul Malhotra', score: 4.6, fill: '92%', color: 'bg-primary/60' },
                        { name: 'Sneha Patel', score: 4.5, fill: '90%', color: 'bg-primary/40' },
                      ].map((t, idx) => (
                        <div key={idx} className="space-y-2">
                           <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>{t.name}</span>
                              <span className="flex items-center gap-1 text-amber-500">★ {t.score.toFixed(1)}</span>
                           </div>
                           <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all duration-1000", t.color)} style={{ width: t.fill }} />
                           </div>
                        </div>
                      ))}
                   </div>
                 </div>
              </div>

              {/* Subject Demand Heatmap */}
              <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Subject Demand Heatmap</h3>
                    <p className="text-xs font-bold text-slate-500">Booking density by Subject and Grade Level</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                     Low
                     <div className="flex gap-1">
                        <div className="w-4 h-4 bg-primary/10 rounded" />
                        <div className="w-4 h-4 bg-primary/40 rounded" />
                        <div className="w-4 h-4 bg-primary/70 rounded" />
                        <div className="w-4 h-4 bg-primary rounded" />
                     </div>
                     High
                  </div>
                </div>

                <div className="overflow-x-auto">
                   <div className="min-w-[600px]">
                      {/* X-axis headers */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                         <div /> {/* Empty corner */}
                         {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer'].map(sub => (
                           <div key={sub} className="text-center text-[10px] font-black uppercase text-slate-400">{sub}</div>
                         ))}
                      </div>

                      {/* Y-axis rows */}
                      {[
                        { grade: 'Class 8', values: [20, 10, 10, 40, 70, 30] },
                        { grade: 'Class 9', values: [40, 50, 40, 60, 50, 40] },
                        { grade: 'Class 10', values: [80, 70, 60, 50, 40, 30] },
                        { grade: 'Class 11', values: [100, 90, 80, 50, 20, 80] },
                        { grade: 'Class 12', values: [100, 100, 90, 70, 30, 90] },
                        { grade: 'JEE/NEET', values: [100, 100, 100, 100, 10, 10] },
                      ].map((row, i) => (
                        <div key={i} className="grid grid-cols-7 gap-2 mb-2">
                           <div className="flex items-center justify-end text-xs font-bold text-slate-600 pr-4">{row.grade}</div>
                           {row.values.map((opacity, j) => (
                             <div 
                               key={j} 
                               className="h-10 rounded-lg transition-transform hover:scale-105 cursor-pointer relative group"
                               style={{ backgroundColor: `rgba(var(--primary), ${opacity / 100})` }}
                             >
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
                             </div>
                           ))}
                        </div>
                      ))}
                   </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB: FINANCIAL REPORTS */}
          {activeTab === 'FINANCIALS' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Total Revenue & Profit Margin */}
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-white">
                    <h3 className="text-xl font-black">Financial Health</h3>
                    <p className="text-xs font-bold text-slate-400 mb-8">Platform profitability and net revenue distribution</p>

                    <div className="space-y-6">
                       <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                          <div>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Platform Revenue (YTD)</p>
                             <h4 className="text-3xl font-black text-white mt-1">₹4.24 Crores</h4>
                          </div>
                       </div>
                       <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                          <div>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Teacher Payouts</p>
                             <h4 className="text-2xl font-black text-rose-400 mt-1">-₹1.80 Crores</h4>
                          </div>
                       </div>
                       <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                          <div>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Costs & Marketing</p>
                             <h4 className="text-2xl font-black text-amber-400 mt-1">-₹0.94 Crores</h4>
                          </div>
                       </div>
                       <div className="flex justify-between items-end pt-2">
                          <div>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Profit Margin</p>
                             <h4 className="text-4xl font-black text-emerald-400 mt-1">35.4%</h4>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-xl text-xs font-bold">
                             <TrendingUp size={16} /> +4.2% YoY
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Simulated Profit Margin Pie Chart Replacement */}
                 <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden">
                    <PieChart size={280} className="text-slate-200 stroke-[1] absolute -right-10 opacity-30 rotate-12" />
                    <div className="relative z-10 w-full">
                       <h3 className="text-xl font-black text-slate-900 text-center">Cost Distribution</h3>
                       <div className="mt-8 space-y-4 max-w-sm mx-auto">
                          <div className="flex items-center justify-between text-sm font-bold">
                             <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500" /> Platform Net</div>
                             <span>35.4%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm font-bold">
                             <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-rose-500" /> Teacher Payouts</div>
                             <span>42.5%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm font-bold">
                             <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-amber-500" /> OpEx & Ads</div>
                             <span>22.1%</span>
                          </div>
                          
                          <div className="h-6 w-full rounded-full flex overflow-hidden mt-6 border border-white shadow-sm gap-0.5">
                             <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: '35.4%'}}/>
                             <div className="bg-rose-500 h-full transition-all duration-1000 delay-100" style={{width: '42.5%'}}/>
                             <div className="bg-amber-500 h-full transition-all duration-1000 delay-200" style={{width: '22.1%'}}/>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Payout Reports Quick List */}
              <div className="bg-white border border-slate-200 p-8 rounded-[2rem]">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Recent Payout Settlements</h3>
                      <p className="text-xs font-bold text-slate-500">Automated IMPS disbursement logs</p>
                    </div>
                    <button className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50">View All</button>
                 </div>
                 
                 <div className="space-y-3">
                    {payoutData.map((trx) => (
                      <div key={trx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs",
                              trx.status === 'PROCESSED' ? "bg-emerald-500" : "bg-amber-500"
                            )}>
                               ₹
                            </div>
                            <div>
                               <p className="font-bold text-slate-900">{trx.teacher}</p>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{trx.id} • {trx.date}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-slate-900">{trx.amount}</p>
                            <p className={cn(
                               "text-[10px] font-black uppercase tracking-widest mt-1",
                               trx.status === 'PROCESSED' ? "text-emerald-500" : "text-amber-500"
                            )}>{trx.status}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
