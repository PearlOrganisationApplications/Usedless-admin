import React, { useState } from 'react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Settings, Plus, Minus, AlertCircle, Save } from 'lucide-react';
import { cn } from '@/utils';

interface TeacherWalletProps {
  teacherId: string;
  initialBalance: number;
  initialRate: number;
}

export const TeacherWalletCard = ({ teacherId, initialBalance, initialRate }: TeacherWalletProps) => {
  const [balance, setBalance] = useState(initialBalance);
  const [rate, setRate] = useState(initialRate);
  const [isFrozen, setIsFrozen] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'BONUS' | 'PENALTY'>('BONUS');

  const handleAdjustment = () => {
    const amt = parseFloat(adjustmentAmount);
    if (isNaN(amt)) return;
    setBalance(prev => adjustmentType === 'BONUS' ? prev + amt : prev - amt);
    setAdjustmentAmount('');
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="p-8 bg-slate-900 text-white relative flex justify-between items-start">
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Available Balance</p>
          <h3 className="text-4xl font-black mt-2">₹{balance.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-2">
             <span className={cn(
               "px-2 py-0.5 rounded-full text-[10px] font-black uppercase",
               isFrozen ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
             )}>
                {isFrozen ? 'Wallet Frozen' : 'Active'}
             </span>
          </div>
        </div>
        <Wallet size={100} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
        <button 
          onClick={() => setIsFrozen(!isFrozen)}
          className={cn(
            "relative z-10 p-3 rounded-2xl transition-all",
            isFrozen ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "bg-white/10 text-white hover:bg-white/20"
          )}
        >
          <FreezeIce size={24} />
        </button>
      </div>

      <div className="p-8 space-y-8">
        {/* Rate Control */}
        <div>
            <div className="flex justify-between items-center mb-4 text-nowrap">
                <h4 className="font-black text-slate-900 flex items-center gap-2">
                    <Settings size={18} className="text-primary" />
                    Earnings Configuration
                </h4>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Rate/Min:</span>
                    <input 
                        type="number" 
                        value={rate} 
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-12 bg-transparent font-black text-slate-900 outline-none text-right"
                    />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">₹</span>
                </div>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Adjust the per-minute payout rate for this teacher. Changes apply to future sessions.</p>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Adjustments */}
        <div className="space-y-4">
            <h4 className="font-black text-slate-900 flex items-center gap-2">
                <ArrowUpRight size={18} className="text-primary" />
                Bonus & Penalties
            </h4>
            <div className="flex gap-2">
                <button 
                  onClick={() => setAdjustmentType('BONUS')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    adjustmentType === 'BONUS' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400"
                  )}
                >
                    Bonus
                </button>
                <button 
                  onClick={() => setAdjustmentType('PENALTY')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    adjustmentType === 'PENALTY' ? "bg-red-50 text-red-600 border border-red-100" : "bg-slate-50 text-slate-400"
                  )}
                >
                    Penalty
                </button>
            </div>
            <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <input 
                        type="number"
                        placeholder="Amount (₹)"
                        value={adjustmentAmount}
                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    />
                </div>
                <button 
                  onClick={handleAdjustment}
                  disabled={!adjustmentAmount}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-slate-800"
                >
                    Apply
                </button>
            </div>
        </div>

        <div className="pt-4 flex gap-4">
             <button className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                <Save size={16} />
                Save Changes
             </button>
        </div>
      </div>
    </div>
  );
};

// Lucide Ice/Freeze fallback if not in current version
const FreezeIce = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="M2 12h20"/><path d="m19.07 4.93-14.14 14.14"/>
    </svg>
);
