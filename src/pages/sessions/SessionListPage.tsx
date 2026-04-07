import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { sessionsApi, Session } from '@/services/api/sessions.api';
import { DataTable } from '@/components/tables/DataTable';
import { Calendar, Clock, Star, PlayCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/utils';

export const SessionListPage = () => {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionsApi.getAll
  });

  const columns = [
    { 
      header: 'Session ID', 
      accessor: 'id' as const,
      render: (val: string) => <span className="font-mono text-xs font-bold text-slate-500">#{val}</span>
    },
    { 
      header: 'Student', 
      accessor: 'studentName' as const,
      render: (val: string) => (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                {val[0]}
            </div>
            <span className="font-bold text-slate-900">{val}</span>
        </div>
      )
    },
    { header: 'Teacher', accessor: 'teacherName' as const },
    { header: 'Subject', accessor: 'subject' as const },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      render: (val: string) => (
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase",
          val === 'LIVE' ? "bg-red-100 text-red-600 animate-pulse" : 
          val === 'COMPLETED' ? "bg-emerald-100 text-emerald-600" : 
          val === 'SCHEDULED' ? "bg-blue-100 text-blue-600" : 
          "bg-slate-100 text-slate-500 line-through"
        )}>
          {val}
        </span>
      )
    },
    { 
      header: 'Start Time', 
      accessor: 'startTime' as const,
      render: (val: string) => (
        <div className="flex items-center gap-2 text-slate-500">
          <Clock size={14} />
          <span className="text-xs font-medium">{new Date(val).toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Rating',
      accessor: 'rating' as const,
      render: (val?: number) => (
        val ? (
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star size={14} fill="currentColor" />
            {val.toFixed(1)}
          </div>
        ) : <span className="text-slate-300">-</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Session Engine</h2>
        <p className="text-slate-500 text-sm">Monitor live sessions and review past interactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                  <PlayCircle size={24} />
              </div>
              <div>
                  <h4 className="text-2xl font-black text-slate-900">12</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Now</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={24} />
              </div>
              <div>
                  <h4 className="text-2xl font-black text-slate-900">1,248</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Calendar size={24} />
              </div>
              <div>
                  <h4 className="text-2xl font-black text-slate-900">42</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scheduled</p>
              </div>
          </div>
      </div>

      <div className="h-[calc(100vh-25rem)]">
        <DataTable
          columns={columns}
          data={sessions}
          isLoading={isLoading}
          gridTemplateColumns="0.8fr 1.5fr 1.5fr 1.2fr 1fr 1.8fr 0.8fr"
        />
      </div>
    </div>
  );
};
