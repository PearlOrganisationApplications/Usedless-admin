import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, History, TrendingUp } from 'lucide-react';
import { cn } from '@/utils';

interface TeacherWalletCardProps {
  teacherId: string;
  initialBalance: number;
  initialRate: number;
}

export const TeacherWalletCard = ({
  teacherId,
  initialBalance,
  initialRate,
}: TeacherWalletCardProps) => {
  const [balance] = useState(initialBalance);
  const [rate] = useState(initialRate);

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 overflow-hidden relative group">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/20 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -ml-24 -mb-24" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <Wallet size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Teacher Wallet</p>
              <h3 className="text-lg font-black">Financial Overview</h3>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <History size={20} className="text-white/60" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Available Balance</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black">${balance.toLocaleString()}</h2>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <TrendingUp size={12} /> +12.5%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Hourly Rate</p>
              <h4 className="text-xl font-black">${rate}/hr</h4>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Pending</p>
              <h4 className="text-xl font-black text-orange-400">$1,240</h4>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              <ArrowUpRight size={16} />
              Payout
            </button>
            <button className="flex-1 py-4 bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              <CreditCard size={16} />
              Settings
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Recent Transactions</p>
          <div className="space-y-4">
            {[
              { label: 'Session #2481', amount: '+ $45.00', type: 'in' },
              { label: 'Platform Fee', amount: '- $4.50', type: 'out' }
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    tx.type === 'in' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {tx.type === 'in' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                  </div>
                  <span className="text-xs font-bold text-white/80">{tx.label}</span>
                </div>
                <span className={cn(
                  "text-xs font-black",
                  tx.type === 'in' ? "text-emerald-400" : "text-white/60"
                )}>{tx.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
