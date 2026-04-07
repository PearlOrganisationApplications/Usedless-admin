import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';
import { teacherApi, Teacher } from '@/services/api/teachers.api';
import { Star, UserCheck, Shield, Eye, FileText, Calendar } from 'lucide-react';
import { cn } from '@/utils';

export const TeacherListPage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'onboarding'>('active');
  const navigate = useNavigate();

  const { data: teachers = [], isLoading } = useQuery<Teacher[]>({
  queryKey: ['teachers'],
  queryFn: teacherApi.getAll,
  });

  const filteredTeachers = (teachers as Teacher[]).filter((t: Teacher) => 
    activeTab === 'active' ? (t.status === 'ACTIVE' || t.status === 'SUSPENDED') : t.status === 'PENDING'
  );

  const columns = [
    { 
      header: 'Teacher', 
      accessor: 'name' as const,
      render: (val: string, item: Teacher) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-orange-100 flex items-center justify-center font-bold text-orange-600">
            {val[0]}
          </div>
          <div>
            <p className="font-bold text-slate-900">{val}</p>
            <p className="text-xs text-slate-500">{item.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Expertise', accessor: 'subject' as const },
    { 
      header: 'Rating', 
      accessor: 'rating' as const,
      render: (val: number) => (
        <div className="flex items-center gap-1.5 font-bold text-amber-600">
          <Star size={14} fill="currentColor" />
          {val > 0 ? val.toFixed(1) : 'NEW'}
        </div>
      )
    },
    {
      header: 'Availability',
      accessor: 'isOnline' as const,
      render: (val: boolean) => (
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", val ? "bg-green-500 animate-pulse" : "bg-slate-300")} />
          <span className="text-xs font-medium text-slate-600">{val ? "Online" : "Offline"}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      render: (val: string) => (
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase",
          val === 'ACTIVE' ? "bg-emerald-100 text-emerald-700" : 
          val === 'PENDING' ? "bg-blue-100 text-blue-700" : 
          "bg-slate-100 text-slate-700"
        )}>
          {val}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      render: (id: string) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/teachers/${id}`)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <FileText size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Teacher Management</h2>
          <p className="text-slate-500 text-sm">Control onboarding, availability, and performance.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('active')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            activeTab === 'active' ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          Active Teachers
        </button>
        <button 
          onClick={() => setActiveTab('onboarding')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            activeTab === 'onboarding' ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          Onboarding Queue {(teachers as Teacher[]).filter((t: Teacher) => t.isVerified === false).length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-primary text-white text-[10px] rounded-full">
              {(teachers as Teacher[]).filter((t: Teacher) => t.isVerified === false).length}
            </span>
          )}
        </button>
      </div>

      <div className="h-[calc(100vh-20rem)]">
        <DataTable
          columns={columns}
          data={filteredTeachers}
          isLoading={isLoading}
          gridTemplateColumns="3fr 1.5fr 1fr 1.5fr 1fr 1.5fr"
        />
      </div>
    </div>
  );
};
