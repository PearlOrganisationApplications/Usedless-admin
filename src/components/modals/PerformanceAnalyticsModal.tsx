import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Star, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
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

export const PerformanceAnalyticsModal = ({
  isOpen,
  onClose,
  teacherName,
  analytics,
}: PerformanceAnalyticsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Performance Metrics</h3>
                  <p className="text-slate-500 text-sm font-medium">Detailed analytics for {teacherName}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-xl text-amber-600 shadow-sm">
                      <Star size={20} fill="currentColor" />
                    </div>
                    <span className="text-xs font-black text-amber-800 uppercase tracking-widest">Average Rating</span>
                  </div>
                  <h4 className="text-4xl font-black text-amber-900">{analytics.rating.toFixed(1)}</h4>
                  <p className="text-amber-700/60 text-xs font-bold mt-2">Based on last 50 sessions</p>
                </div>

                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">Success Rate</span>
                  </div>
                  <h4 className="text-4xl font-black text-emerald-900">{analytics.sessionSuccessRate}</h4>
                  <p className="text-emerald-700/60 text-xs font-bold mt-2">Completed vs Cancelled</p>
                </div>

                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                      <Clock size={20} />
                    </div>
                    <span className="text-xs font-black text-blue-800 uppercase tracking-widest">Response Time</span>
                  </div>
                  <h4 className="text-4xl font-black text-blue-900">{analytics.responseTime}</h4>
                  <p className="text-blue-700/60 text-xs font-bold mt-2">Average time to accept</p>
                </div>

                <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-xl text-red-600 shadow-sm">
                      <AlertTriangle size={20} />
                    </div>
                    <span className="text-xs font-black text-red-800 uppercase tracking-widest">Complaints</span>
                  </div>
                  <h4 className="text-4xl font-black text-red-900">{analytics.complaintCount}</h4>
                  <p className="text-red-700/60 text-xs font-bold mt-2">Total reported issues</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" />
                  MONTHLY TREND
                </h4>
                <div className="h-32 flex items-end gap-2 px-2">
                  {[40, 70, 45, 90, 65, 85, 100, 75, 60, 95, 80, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className={cn(
                          "w-full rounded-t-lg transition-colors",
                          h > 80 ? "bg-primary" : "bg-primary/40"
                        )}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Jan</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Jun</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Dec</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
