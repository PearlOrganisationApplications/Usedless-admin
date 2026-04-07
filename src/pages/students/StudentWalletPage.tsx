import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, Gift, Coins, TrendingUp, Award, Users, Percent, Plus, Minus, History } from 'lucide-react';
import { StudentWalletCard } from '@/components/finance/StudentWalletCard';
import { cn } from '@/utils';

const students = [
  { id: 'S-1001', name: 'Rahul Malhotra', points: 2400, cashback: 150, referrals: 3, plan: 'Premium Plus' },
  { id: 'S-1002', name: 'Ishani Patel', points: 850, cashback: 50, referrals: 1, plan: 'Standard' },
  { id: 'S-1003', name: 'Aryan Khan', points: 4200, cashback: 380, referrals: 7, plan: 'Premium' },
  { id: 'S-1004', name: 'Sanya Mirza', points: 120, cashback: 0, referrals: 0, plan: 'Free Trial' },
];

export const StudentWalletPage = () => {
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [search, setSearch] = useState('');

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student Wallets</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage reward points, cashback, and referral earnings.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Points in Circulation', value: '1.2M', icon: Coins, color: 'bg-amber-50 text-amber-500 hover:border-amber-200' },
          { label: 'Cashback Paid (Month)', value: '₹58,400', icon: Award, color: 'bg-emerald-50 text-emerald-500 hover:border-emerald-200' },
          { label: 'Active Referrers', value: '842', icon: Users, color: 'bg-primary/10 text-primary hover:border-primary/20' },
          { label: 'Avg. Points / Student', value: '1,850', icon: TrendingUp, color: 'bg-slate-100 text-slate-600 hover:border-slate-300' },
        ].map((stat, i) => (
          <div key={i} className={cn("bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center group transition-all cursor-default", stat.color)}>
            <div className={cn("p-4 rounded-[1.5rem] mb-4 group-hover:scale-110 transition-transform", stat.color)}>
              <stat.icon size={28} />
            </div>
            <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Student List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={cn(
                  "w-full flex items-center gap-4 p-5 text-left transition-all",
                  selectedStudent.id === student.id
                    ? "bg-primary/5 border-l-4 border-primary"
                    : "hover:bg-slate-50 border-l-4 border-transparent"
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-black text-xl flex items-center justify-center flex-shrink-0">
                  {student.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 text-sm truncate">{student.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{student.id}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Coins size={12} className="text-amber-500" />
                    <span className="font-black text-slate-700 text-sm">{student.points.toLocaleString()}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-md",
                    student.plan === 'Premium Plus' ? "bg-slate-900 text-white" :
                    student.plan === 'Premium' ? "bg-primary/10 text-primary" :
                    student.plan === 'Standard' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {student.plan}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Card */}
        <div className="xl:col-span-2">
          <StudentWalletCard
            studentId={selectedStudent.id}
            initialPoints={selectedStudent.points}
          />
        </div>
      </div>
    </div>
  );
};
