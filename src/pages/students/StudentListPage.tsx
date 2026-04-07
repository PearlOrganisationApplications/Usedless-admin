import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';
import { studentApi, Student } from '@/services/api/students.api';
import { UserPlus, Filter, MoreHorizontal, ShieldAlert, Ban, CheckCircle } from 'lucide-react';
import { cn } from '@/utils';

export const StudentListPage = () => {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentApi.getAll
  });

  const columns = [
    { 
      header: 'Student Name', 
      accessor: 'name' as const,
      render: (val: string, item: Student) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
            {val[0]}
          </div>
          <div>
            <p className="font-medium text-slate-900">{val}</p>
            <p className="text-xs text-slate-500">{item.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Class', accessor: 'class' as const },
    { 
      header: 'Status', 
      accessor: 'status' as const,
      render: (val: string) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-xs font-bold",
          val === 'ACTIVE' ? "bg-green-100 text-green-700" : 
          val === 'SUSPENDED' ? "bg-amber-100 text-amber-700" : 
          "bg-red-100 text-red-700"
        )}>
          {val}
        </span>
      )
    },
    { header: 'Last Active', accessor: 'lastActive' as const },
    { header: 'Study Time', accessor: 'totalStudyTime' as const },
    {
      header: 'Actions',
      accessor: 'id' as const,
      render: (id: string) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors">
            <ShieldAlert size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
            <Ban size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
          <p className="text-slate-500 text-sm">Manage and monitor all student accounts and their progress.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          <UserPlus size={18} />
          Add New Student
        </button>
      </div>

      <div className="h-[calc(100vh-16rem)]">
        <DataTable
          columns={columns}
          data={students}
          isLoading={isLoading}
          gridTemplateColumns="3fr 1fr 1fr 1fr 1fr 1fr"
        />
      </div>
    </div>
  );
};
