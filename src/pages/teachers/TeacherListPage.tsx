import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';
import { teacherApi, Teacher } from '@/services/api/teachers.api';
import { Star, Eye, FileText, Trash2, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/utils';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { socketService } from '@/socket/socket.service';

export const TeacherListPage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'onboarding'>('onboarding');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUpdate = () => {
      console.log('TeacherListPage: Real-time update received');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    };

    socketService.on('teacherUpdated', handleUpdate);
    socketService.on('teacherCreated', handleUpdate);
    socketService.on('teacherDeleted', handleUpdate);

    return () => {
      socketService.off('teacherUpdated');
      socketService.off('teacherCreated');
      socketService.off('teacherDeleted');
    };
  }, [queryClient]);

  const { data: teachers = [], isLoading } = useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: teacherApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teacherApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsDeleteModalOpen(false);
    }
  });

  const filteredTeachers = teachers.filter((t: Teacher) => 
    activeTab === 'active' ? t.isVerified : !t.isVerified
  );

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTeacherToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    { 
      header: 'Teacher', 
      accessor: 'name' as const,
      render: (val: string, item: Teacher) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-orange-100 flex items-center justify-center font-bold text-orange-600 overflow-hidden">
            {item.profilePic ? (
              <img src={item.profilePic} alt={val} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : val[0]}
          </div>
          <div>
            <p className="font-bold text-slate-900">{val}</p>
            <p className="text-xs text-slate-500">{item.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Expertise', 
      accessor: 'subject' as const,
      render: (val: string, item: Teacher) => (
        <div className="flex flex-col">
          <span className="font-medium">{val}</span>
          <span className="text-[10px] text-slate-400">{item.subjects.slice(1).join(', ')}</span>
        </div>
      )
    },
    { 
      header: 'Experience', 
      accessor: 'experienceYears' as const,
      render: (val: number) => (
        <div className="font-bold text-slate-700">
          {val} Years
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'isVerified' as const,
      render: (val: boolean) => (
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", val ? "bg-green-500" : "bg-amber-500 animate-pulse")} />
          <span className="text-xs font-medium text-slate-600">{val ? "Verified" : "Pending"}</span>
        </div>
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
          <button 
            onClick={(e) => handleDeleteClick(id, e)}
            className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
            title="Delete Teacher"
          >
            <Trash2 size={16} />
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
          <p className="text-slate-500 text-sm">Real-time control over the VLM Academy teaching staff.</p>
        </div>
        <button 
          onClick={() => navigate('/teachers/add')}
          className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Teacher
        </button>
      </div>

      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('active')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            activeTab === 'active' ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          Verified Teachers
        </button>
        <button 
          onClick={() => setActiveTab('onboarding')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            activeTab === 'onboarding' ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          Onboarding Queue {teachers.filter(t => !t.isVerified).length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-primary text-white text-[10px] rounded-full">
              {teachers.filter(t => !t.isVerified).length}
            </span>
          )}
        </button>
      </div>

      <div className="h-[calc(100vh-20rem)]">
        <DataTable
          columns={columns}
          data={filteredTeachers}
          isLoading={isLoading}
          gridTemplateColumns="3fr 2fr 1.5fr 1.5fr 1.5fr"
        />
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => teacherToDelete && deleteMutation.mutate(teacherToDelete)}
        title="Delete Teacher"
        message="Are you sure you want to remove this teacher from the platform? This action cannot be undone."
      />
    </div>
  );
};

