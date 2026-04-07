import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';
import { gamificationApi, McqTest } from '@/services/api/gamification.api';
import { 
  Plus, Upload, Calendar, BarChart, 
  Settings, Trash2, Edit3, CheckCircle2,
  AlertCircle, FileDown, Activity
} from 'lucide-react';
import { cn } from '@/utils';

export const McqManagementPage = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  
  const { data: mcqs = [], isLoading } = useQuery({
    queryKey: ['mcqs'],
    queryFn: gamificationApi.getAllMcqs
  });

  const columns = [
    { 
      header: 'Title', 
      accessor: 'title' as const,
      render: (val: string, item: McqTest) => (
        <div>
          <p className="font-bold text-slate-900">{val}</p>
          <p className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</p>
        </div>
      )
    },
    { 
      header: 'Difficulty', 
      accessor: 'difficulty' as const,
      render: (val: string) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
          val === 'EASY' ? "bg-emerald-100 text-emerald-700" : 
          val === 'MEDIUM' ? "bg-amber-100 text-amber-700" : 
          "bg-rose-100 text-rose-700"
        )}>
          {val}
        </span>
      )
    },
    { 
      header: 'Questions', 
      accessor: 'questionCount' as const,
      render: (val: number) => (
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-slate-400" />
          <span className="font-medium">{val} Qs</span>
        </div>
      )
    },
    { 
      header: 'Scheduled For', 
      accessor: 'scheduledAt' as const,
      render: (val: string) => (
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={14} />
          <span>{new Date(val).toLocaleDateString()}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      render: (val: string) => (
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full",
            val === 'ACTIVE' ? "bg-green-500 animate-pulse" : 
            val === 'SCHEDULED' ? "bg-blue-500" : "bg-slate-400"
          )} />
          <span className="text-xs font-bold capitalize">{val.toLowerCase()}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      render: (id: string) => (
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all">
            <Edit3 size={16} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await gamificationApi.bulkUploadQuestions(file);
      queryClient.invalidateQueries({ queryKey: ['mcqs'] });
      // Show success toast here if toast system exists
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">MCQ Control Center</h2>
          <p className="text-slate-500 font-medium">Create, schedule, and manage competitive MCQ tests for students.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-700 cursor-pointer hover:bg-slate-200 transition-all border border-slate-200",
            isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
          )}>
            <Upload size={18} />
            {isUploading ? 'Uploading...' : 'Bulk Upload (CSV)'}
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:translate-y-0">
            <Plus size={20} />
            New MCQ Test
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Tests', value: '12', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg. Difficulty', value: 'Medium', icon: BarChart, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Questions', value: '1,240', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/5' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 transition-all hover:border-primary/20 group">
            <div className={cn("p-4 rounded-xl transition-colors group-hover:scale-110 duration-300", stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="h-[calc(100vh-28rem)] min-h-[500px]">
        <DataTable
          columns={columns}
          data={mcqs}
          isLoading={isLoading}
          gridTemplateColumns="2.5fr 1fr 1fr 1fr 1fr 100px"
        />
      </div>

      {/* Info Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
          <Settings size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={18} className="text-primary" />
            <h4 className="font-bold text-lg">Did you know?</h4>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Difficulty scaling automatically adjusts question weightage based on student performance in previous tests. 
            Ensure your CSV follows the standard question format for successful bulk imports.
          </p>
        </div>
        <button className="relative z-10 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 border border-white/10">
          <FileDown size={16} />
          Download CSV Template
        </button>
      </div>
    </div>
  );
};
