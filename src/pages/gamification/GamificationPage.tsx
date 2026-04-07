import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationApi, Badge, SpinReward } from '@/services/api/gamification.api';
import { 
  Trophy, Award, RefreshCcw, Plus,
  Settings2, Sparkles, Zap, ShieldCheck,
  Percent, Coins, Gift, Info
} from 'lucide-react';
import { cn } from '@/utils';

export const GamificationPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges' | 'spin'>('leaderboard');

  const { data: badges = [] } = useQuery({
    queryKey: ['badges'],
    queryFn: gamificationApi.getBadges
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ['spinRewards'],
    queryFn: gamificationApi.getSpinRewards
  });

  const resetMutation = useMutation({
    mutationFn: gamificationApi.resetLeaderboard,
    onSuccess: () => {
      // Show success toast
    }
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Sparkles size={160} className="text-primary animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
               Gamification Engine <Sparkles className="text-primary" size={28} />
            </h2>
            <p className="text-slate-400 font-medium text-lg max-w-xl">
              Drive engagement through competitive leaderboards, unique rewards, and randomized spin-to-win mechanics.
            </p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            {[
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'badges', label: 'Badges', icon: Award },
              { id: 'spin', label: 'Spin & Win', icon: RefreshCcw },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Leaderboard Section */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col items-center justify-center text-center py-20 min-h-[400px]">
            <div className="h-24 w-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4 animate-bounce duration-[2000ms]">
               <Trophy size={48} />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Weekly Leaderboard Reset</h3>
              <p className="text-slate-500 font-medium">
                Resetting the leaderboard will archive current rankings and clear point balances for the new session. This action cannot be undone.
              </p>
            </div>
            <button 
              onClick={() => resetMutation.mutate()}
              disabled={resetMutation.isPending}
              className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-rose-600 transition-all active:scale-95 group"
            >
              <RefreshCcw size={20} className={cn("group-hover:rotate-180 transition-transform duration-500", resetMutation.isPending && "animate-spin")} />
              {resetMutation.isPending ? 'Resetting...' : 'RESET ALL RANKINGS NOW'}
            </button>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-4">
              <Info size={14} /> Last Reset: 2026-03-23 00:00:00
            </p>
          </div>
        )}

        {/* Badges Section */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Active Achievement Badges <span className="p-1 px-2.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-500">{badges.length}</span>
              </h3>
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                <Plus size={18} />
                Create New Badge
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(badges) && badges.map((badge) => (
                <div key={badge.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-primary/20 hover:shadow-md group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Award size={32} />
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                      <Settings2 size={16} />
                    </button>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{badge.name}</h4>
                  <p className="text-slate-500 text-sm mb-4 font-medium leading-relaxed">{badge.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 p-2 px-3 rounded-lg border border-primary/10 w-fit">
                    <Zap size={12} /> {badge.requirement}
                  </div>
                </div>
              ))}
              {/* Mock Badges */}
              {[
                { name: 'Speed Demon', desc: 'Complete 10 MCQs in under 5 minutes.', req: '10 Fast Completions' },
                { name: 'Consistent Learner', desc: 'Maintain a 5-day study streak.', req: '5-Day Streak' },
                { name: 'Perfect Score', desc: 'Get 100% in any HARD difficulty MCQ.', req: '100% Difficulty: HARD' },
              ].map((m, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm opacity-60">
                   <div className="h-16 w-16 bg-slate-100 rounded-2xl mb-4" />
                   <h4 className="text-lg font-black text-slate-900 mb-1">{m.name}</h4>
                   <p className="text-slate-500 text-sm mb-4">{m.desc}</p>
                   <div className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 p-2 px-3 rounded-lg w-fit">{m.req}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spin & Win Section */}
        {activeTab === 'spin' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Spin & Win Probability Engine</h3>
                <p className="text-slate-500 text-sm font-medium">Configure the likelihood of each reward tier. Ensure total equals 100%.</p>
              </div>
              <div className={cn(
                "px-4 py-2 rounded-xl font-black flex items-center gap-2",
                "bg-emerald-50 text-emerald-600 border border-emerald-100"
              )}>
                <ShieldCheck size={18} /> Valid Distribution (100%)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { label: '50 Reward Points', prob: 45, icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: '100 Reward Points', prob: 25, icon: Coins, color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: 'Exclusive Badge', prob: 10, icon: Award, color: 'text-primary', bg: 'bg-primary/5' },
                { label: 'Better Luck Next Time', prob: 15, icon: Gift, color: 'text-slate-400', bg: 'bg-slate-50' },
                { label: 'Premium Membership (1 Day)', prob: 5, icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              ].map((reward, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", reward.bg)}>
                        <reward.icon size={18} className={reward.color} />
                      </div>
                      <span className="font-bold text-slate-700">{reward.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         value={reward.prob} 
                         className="w-16 p-2 text-center border border-slate-200 rounded-lg font-black text-slate-800"
                       />
                       <Percent size={14} className="text-slate-400" />
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", reward.color.replace('text', 'bg'))}
                      style={{ width: `${reward.prob}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button className="bg-primary text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-1">
                Save Probability Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
