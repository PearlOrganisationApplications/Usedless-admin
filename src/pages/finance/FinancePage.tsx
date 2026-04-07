import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';
import { Wallet, ArrowDownCircle, ArrowUpCircle, CheckCircle, Clock, Zap, Settings, ShieldCheck, History, Landmark, CreditCard, Filter, Search } from 'lucide-react';
import { cn } from '@/utils';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

export const FinancePage = () => {
  const [activeTab, setActiveTab] = useState<'TRANSACTIONS' | 'WITHDRAWALS' | 'CONFIG'>('TRANSACTIONS');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeWithdrawal, setActiveWithdrawal] = useState<any>(null);
  const [autoIMPS, setAutoIMPS] = useState(false);
  const [minWithdrawal, setMinWithdrawal] = useState(500);

  const transactions = [
    { id: '1', name: 'Dr. Amit Trivedi', amount: '₹12,400', type: 'PAYOUT', status: 'SUCCESS', date: '2026-03-28' },
    { id: '2', name: 'Sneh Lata', amount: '₹8,900', type: 'PAYOUT', status: 'SUCCESS', date: '2026-03-27' },
    { id: '3', name: 'Rahul Malhotra', amount: '+₹1,500', type: 'RECHARGE', status: 'SUCCESS', date: '2026-03-28' },
    { id: '4', name: 'Ishani Patel', amount: '+₹2,500', type: 'RECHARGE', status: 'SUCCESS', date: '2026-03-28' },
  ];

  const withdrawals = [
    { id: 'W-901', teacher: 'Vikram Singh', amount: '₹15,000', bank: 'HDFC (**** 8291)', status: 'PENDING', time: '2 hours ago' },
    { id: 'W-902', teacher: 'Priya Verma', amount: '₹4,200', bank: 'ICICI (**** 1022)', status: 'PENDING', time: '5 hours ago' },
    { id: 'W-903', teacher: 'Anil Kapoor', amount: '₹12,800', bank: 'SBI (**** 4432)', status: 'APPROVED', time: '1 day ago' },
  ];

  const transColumns = [
    { 
      header: 'Entity / Name', 
      accessor: 'name' as const,
      render: (val: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            item.type === 'PAYOUT' ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-500"
          )}>
            {item.type === 'PAYOUT' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
          </div>
          <span className="font-bold text-slate-900">{val}</span>
        </div>
      )
    },
    { header: 'Type', accessor: 'type' as const },
    { 
      header: 'Amount', 
      accessor: 'amount' as const,
      render: (val: string, item: any) => (
        <span className={cn(
          "font-mono font-black",
          item.type === 'PAYOUT' ? "text-slate-900" : "text-emerald-600"
        )}>
          {val}
        </span>
      )
    },
    { header: 'Status', accessor: 'status' as const },
    { header: 'Date', accessor: 'date' as const },
  ];

  const withColumns = [
    { 
        header: 'ID', 
        accessor: 'id' as const,
        render: (val: string) => <span className="font-mono text-[10px] font-black text-slate-400">#{val}</span>
    },
    { 
      header: 'Teacher', 
      accessor: 'teacher' as const,
      render: (val: string) => <span className="font-bold text-slate-900">{val}</span>
    },
    { header: 'Amount', accessor: 'amount' as const, render: (val: string) => <span className="font-black text-slate-900">{val}</span> },
    { header: 'Bank Details', accessor: 'bank' as const },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      render: (val: string) => (
        <span className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase",
          val === 'PENDING' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
        )}>
          {val}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      render: (val: string, item: any) => (
        item.status === 'PENDING' && (
          <button 
            onClick={() => { setActiveWithdrawal(item); setIsConfirmOpen(true); }}
            className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
          >
            Approve IMPS
          </button>
        )
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Payouts Disbursed</p>
          <h3 className="text-4xl font-black mt-2">₹1,24,800</h3>
          <div className="mt-6 flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <Zap size={14} className="fill-current" />
            +12% vs last month
          </div>
          <Wallet size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition-all">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Pending Withdrawals</p>
            <h3 className="text-4xl font-black mt-2 text-slate-900">02</h3>
          </div>
          <p className="text-emerald-600 text-xs font-bold mt-4 flex items-center gap-2">
            <History size={14} />
            Total: ₹19,200
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Monthly Platform Revenue</p>
            <h3 className="text-4xl font-black mt-2 text-primary tracking-tighter">₹4.2M</h3>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-primary rounded-full w-3/4" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
         <div className="flex border-b border-slate-100 px-8">
            {[
              { id: 'TRANSACTIONS', label: 'Transaction Logs', icon: History },
              { id: 'WITHDRAWALS', label: 'Withdrawal Requests', icon: CreditCard },
              { id: 'CONFIG', label: 'Payout Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-8 py-6 text-sm font-black uppercase tracking-widest transition-all relative",
                  activeTab === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
              </button>
            ))}
         </div>

         <div className="p-8">
            {activeTab === 'TRANSACTIONS' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4 flex-1 max-w-sm relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input placeholder="Search logs..." className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-50">
                        <Filter size={16} /> Filter
                    </button>
                </div>
                <div className="h-[25rem] overflow-x-auto min-w-full">
                    <DataTable columns={transColumns} data={transactions} gridTemplateColumns="2.5fr 1fr 1fr 1fr 1fr" />
                </div>
              </div>
            )}

            {activeTab === 'WITHDRAWALS' && (
               <div className="h-[30rem] overflow-x-auto min-w-full">
                  <DataTable columns={withColumns} data={withdrawals} gridTemplateColumns="0.5fr 1.5fr 1fr 2fr 1fr 1.5fr" />
               </div>
            )}

            {activeTab === 'CONFIG' && (
               <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex items-center gap-4">
                           <div className="p-4 bg-white rounded-2xl text-primary shadow-sm"><Landmark size={24} /></div>
                           <div>
                              <h4 className="font-black text-slate-900">Auto IMPS Payout</h4>
                              <p className="text-xs text-slate-500 font-bold">Instantly process withdrawals via API</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => setAutoIMPS(!autoIMPS)}
                          className={cn("w-14 h-8 rounded-full transition-all relative", autoIMPS ? "bg-primary" : "bg-slate-200")}
                        >
                           <div className={cn("w-6 h-6 bg-white rounded-full absolute top-1 transition-all", autoIMPS ? "left-7" : "left-1")} />
                        </button>
                     </div>

                     <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex items-center gap-4">
                           <div className="p-4 bg-white rounded-2xl text-primary shadow-sm"><ShieldCheck size={24} /></div>
                           <div>
                              <h4 className="font-black text-slate-900">Minimum Withdrawal Limit</h4>
                              <p className="text-xs text-slate-500 font-bold">Standard limit for all teachers</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200">
                            <span className="font-black text-primary">₹</span>
                            <input 
                              type="number" 
                              value={minWithdrawal} 
                              onChange={(e) => setMinWithdrawal(parseInt(e.target.value))}
                              className="w-16 font-black text-slate-900 outline-none text-right"
                            />
                        </div>
                     </div>
                  </div>
                  <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                     <CheckCircle size={18} />
                     Apply Global Config
                  </button>
               </div>
            )}
         </div>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => setIsConfirmOpen(false)}
        title="Approve Withdrawal?"
        message={`Are you sure you want to approve the withdrawal request for ${activeWithdrawal?.teacher} for the amount of ${activeWithdrawal?.amount}? This will trigger an IMPS transfer.`}
      />
    </div>
  );
};
