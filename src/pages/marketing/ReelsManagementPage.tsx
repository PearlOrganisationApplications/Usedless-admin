import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reelsApi, Reel } from '@/services/api/reels.api';
import { 
  Clapperboard, Check, X, Star, 
  Trash2, ShieldAlert, TrendingUp, 
  Eye, Heart, Calendar, Filter,
  Search, Award, Play
} from 'lucide-react';
import { cn } from '@/utils';

export const ReelsManagementPage = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

  const { data: reels = [], isLoading } = useQuery({
    queryKey: ['reels'],
    queryFn: reelsApi.getAll
  });

  const filteredReels = reels.filter(r => filter === 'ALL' || r.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
         <div className="absolute -right-4 -top-4 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 rotate-12">
            <Clapperboard size={200} />
         </div>
         <div className="relative z-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               Short Content Engine <Clapperboard className="text-primary" size={32} />
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-xl mt-1">
               Moderate student & teacher reels, boost trending content, and manage featured promotions.
            </p>
         </div>
         <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 relative z-10">
            {[
              { id: 'ALL', label: 'All Content' },
              { id: 'PENDING', label: 'Review Queue' },
              { id: 'APPROVED', label: 'Published' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id as any)}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                  filter === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {t.label}
              </button>
            ))}
         </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-2">
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
               <input 
                  placeholder="Search reels by title, tag, or teacher..." 
                  className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
               />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-all shadow-sm">
               <Filter size={20} />
            </button>
         </div>
         <div className="flex items-center gap-2">
            <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
               <Award size={16} /> Featured Teacher: Dr. Amit Trivedi
            </div>
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
               Update Promotion
            </button>
         </div>
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-8">
         {isLoading ? (
            [1,2,3,4,5].map(i => <div key={i} className="aspect-[9/16] bg-slate-100 rounded-[2rem] animate-pulse" />)
         ) : filteredReels.map((reel) => (
            <div key={reel.id} className="group relative aspect-[9/16] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all hover:-translate-y-2 border-4 border-white">
               {/* Thumbnail & Overlay */}
               <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
               
               {/* Play Icon (Hover) */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500 border border-white/30">
                     <Play size={32} fill="currentColor" />
                  </div>
               </div>

               {/* Stats & Badge */}
               <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={cn(
                     "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md",
                     reel.status === 'PENDING' ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  )}>
                     {reel.status}
                  </span>
                  {reel.isTrending && (
                     <span className="bg-primary/20 text-primary-foreground border border-primary/30 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 backdrop-blur-md">
                        <TrendingUp size={12} /> Trending
                     </span>
                  )}
               </div>

               {/* Delete Action (Always available for admin) */}
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2.5 bg-rose-500/20 hover:bg-rose-500 text-white rounded-xl backdrop-blur-md transition-all border border-rose-500/30">
                     <Trash2 size={16} />
                  </button>
               </div>

               {/* Info & Metadata */}
               <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                  <div>
                     <h4 className="text-lg font-black text-white leading-tight mb-1">{reel.title}</h4>
                     <p className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Award size={12} className="text-primary" /> {reel.teacherName}
                     </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-white/80">
                     <div className="flex gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-black">
                           <Eye size={16} className="text-primary" /> {reel.views}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-black">
                           <Heart size={14} className="text-rose-500" /> {reel.likes}
                        </span>
                     </div>
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {new Date(reel.createdAt).toLocaleDateString()}
                     </span>
                  </div>

                  {/* Contextual Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                     {reel.status === 'PENDING' ? (
                        <>
                           <button className="py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                              <Check size={14} /> Approve
                           </button>
                           <button className="py-2.5 bg-white/10 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/20 hover:border-rose-500 flex items-center justify-center gap-2 backdrop-blur-sm">
                              <X size={14} /> Reject
                           </button>
                        </>
                     ) : (
                        <>
                           <button className={cn(
                              "py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                              reel.isTrending ? "bg-amber-500 text-white" : "bg-white/10 text-white border border-white/20"
                           )}>
                              <Star size={14} fill={reel.isTrending ? "currentColor" : "none"} /> 
                              {reel.isTrending ? "Trending" : "Boost"}
                           </button>
                           <button className="py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                              <TrendingUp size={14} /> Promote
                           </button>
                        </>
                     )}
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Safety / Compliance Banner */}
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl text-rose-500 border border-rose-100 shadow-sm">
               <ShieldAlert size={24} />
            </div>
            <div>
               <h4 className="font-black text-slate-900 mb-0.5">Content Compliance Notice</h4>
               <p className="text-slate-500 text-sm font-medium">All flagged inappropriate content is automatically hidden from users. Review the report details before taking deletion action.</p>
            </div>
         </div>
         <button className="px-6 py-3 bg-white text-rose-600 border border-rose-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm">
            View Flagged Content (12)
         </button>
      </div>
    </div>
  );
};
