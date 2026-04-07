import React from 'react';
import { X, TrendingUp, Star, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils';

interface PerformanceAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  analytics: {
    rating: number;
    sessionSuccessRate: string;
    responseTime: string;
    complaintCount: number;
  };
}

export const PerformanceAnalyticsModal = ({ isOpen, onClose, teacherName, analytics }: PerformanceAnalyticsModalProps) => {
  if (!isOpen) return null;

  const stats = [
    { label: 'Avg Rating', value: analytics.rating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Success Rate', value: analytics.sessionSuccessRate, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Resp. Time', value: analytics.responseTime, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Complaints', value: analytics.complaintCount, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  const chartData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 25 },
    { day: 'Fri', count: 20 },
    { day: 'Sat', count: 8 },
    { day: 'Sun', count: 5 },
  ];

  const maxCount = Math.max(...chartData.map(d => d.count));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">Performance Analytics</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Detailed metrics for {teacherName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all border border-transparent hover:border-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="p-5 rounded-3xl border border-slate-100 bg-white hover:border-primary/20 transition-colors group">
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-xl font-black text-slate-900 mt-1">{stat.value}</h4>
              </div>
            ))}
          </div>

          {/* Sessions Trend Chart (Custom SVG Implementation) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-900 flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    Weekly Session Volume
                </h4>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Sessions</span>
                    </div>
                </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-2 px-2">
                {chartData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                        <div className="relative w-full flex justify-center">
                            <div 
                                className="w-full max-w-[40px] bg-slate-100 rounded-t-xl group-hover:bg-primary transition-all duration-500 relative"
                                style={{ height: `${(data.count / maxCount) * 160}px` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {data.count} Sessions
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase">{data.day}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-4">
             <button className="flex-1 py-4 bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest transition-all">
                Download Report
             </button>
             <button 
                onClick={onClose}
                className="flex-1 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
             >
                Close Metrics
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
