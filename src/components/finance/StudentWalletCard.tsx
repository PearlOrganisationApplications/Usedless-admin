import React, { useState } from 'react';
import { Gift, Coins, Share2, History, Plus, Minus, AlertCircle, Percent } from 'lucide-react';
import { cn } from '@/utils';

interface StudentWalletProps {
  studentId: string;
  initialPoints: number;
}

export const StudentWalletCard = ({ studentId, initialPoints }: StudentWalletProps) => {
  const [points, setPoints] = useState(initialPoints);
  const [pointsAdjustment, setPointsAdjustment] = useState('');
  const [cashbackActive, setCashbackActive] = useState(true);

  const handlePointAdjustment = (type: 'ADD' | 'DEDUCT') => {
    const amt = parseInt(pointsAdjustment);
    if (isNaN(amt)) return;
    setPoints(prev => type === 'ADD' ? prev + amt : prev - amt);
    setPointsAdjustment('');
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="p-8 bg-primary text-white relative">
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-primary-foreground/60 text-[10px] font-black uppercase tracking-widest">Reward Points</p>
                <h3 className="text-4xl font-black mt-2 flex items-center gap-3">
                    <Coins size={32} className="text-primary-foreground/40" />
                    {points.toLocaleString()}
                </h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Gift size={24} />
            </div>
        </div>
        <div className="mt-8 flex gap-6 relative z-10">
            <div>
                <p className="text-primary-foreground/40 text-[10px] font-black uppercase tracking-widest">Referral Earnings</p>
                <p className="font-black text-lg mt-1">₹4,250</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
                <p className="text-primary-foreground/40 text-[10px] font-black uppercase tracking-widest">Active Cashback</p>
                <p className="font-black text-lg mt-1">5%</p>
            </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Points Management */}
        <div className="space-y-4">
            <h4 className="font-black text-slate-900 flex items-center gap-2">
                <Coins size={18} className="text-primary" />
                Manage Reward Points
            </h4>
            <div className="flex gap-2">
                <input 
                    type="number"
                    placeholder="Points"
                    value={pointsAdjustment}
                    onChange={(e) => setPointsAdjustment(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
                <button 
                  onClick={() => handlePointAdjustment('ADD')}
                  className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={20} />
                </button>
                <button 
                  onClick={() => handlePointAdjustment('DEDUCT')}
                  className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                    <Minus size={20} />
                </button>
            </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Global Controls */}
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-primary shadow-sm"><Percent size={16} /></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Cashback Logic</p>
                        <p className="font-black text-slate-900 text-xs mt-1">Enabled on all packs</p>
                    </div>
                </div>
                <button 
                  onClick={() => setCashbackActive(!cashbackActive)}
                  className={cn(
                    "w-12 h-7 rounded-full transition-all relative",
                    cashbackActive ? "bg-emerald-500" : "bg-slate-300"
                  )}
                >
                   <div className={cn(
                     "w-5 h-5 bg-white rounded-full absolute top-1 transition-all",
                     cashbackActive ? "left-6" : "left-1"
                   )} />
                </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-primary shadow-sm"><Share2 size={16} /></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Referral Program</p>
                        <p className="font-black text-slate-900 text-xs mt-1">₹500 Reward / Referral</p>
                    </div>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                    Settings
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
