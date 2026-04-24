import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';
import { subjectApi, Subject } from '@/services/api/subjects.api';
import { Plus, Loader2, BookOpen, Trash2, X } from 'lucide-react';
import { cn } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const SubjectListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    className: '',
    board: '',
    thumbnail: ''
  });

  const queryClient = useQueryClient();

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: subjectApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsModalOpen(false);
      setNewSubject({ name: '', className: '', board: '', thumbnail: '' });
      alert('Subject created successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create subject:', error);
      alert(error.response?.data?.message || 'Failed to create subject. Please try agains.');
    }
  });

  const columns = [
    { 
      header: 'Subject Name', 
      accessor: 'name' as const,
      render: (val: string, item: Subject) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
             <BookOpen size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900 capitalize">{val}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.board}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Class', 
      accessor: 'className' as const,
      render: (val: string) => (
        <div className="px-3 py-1 bg-slate-100 rounded-lg inline-block font-bold text-slate-600 text-xs">
          Class {val}
        </div>
      )
    },
    { 
      header: 'Thumbnail', 
      accessor: 'thumbnail' as const,
      render: (val: string) => (
         <span className="text-xs font-medium text-slate-500 italic">{val || 'No Thumbnail'}</span>
      )
    },
    {
      header: 'Created At',
      accessor: 'createdAt' as const,
      render: (val: string) => (
        <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
          {new Date(val).toLocaleDateString(undefined, { dateStyle: 'medium' })}
        </div>
      )
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newSubject);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Subject Management</h2>
          <p className="text-slate-500 text-sm">Create and organize subjects across different classes and boards.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} />
          Add Subject
        </button>
      </div>

      <div className="h-[calc(100vh-16rem)]">
        <DataTable
          columns={columns}
          data={subjects}
          isLoading={isLoading}
          gridTemplateColumns="2.5fr 1fr 1fr 1fr"
        />
      </div>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Add New Subject</h3>
                    <p className="text-sm text-slate-400 font-bold">Fill in the details below</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
                    <input 
                      required
                      type="text"
                      value={newSubject.name}
                      onChange={e => setNewSubject(s => ({ ...s, name: e.target.value }))}
                      placeholder="e.g. Mathematics, Physics..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class</label>
                      <input 
                        required
                        type="text"
                        value={newSubject.className}
                        onChange={e => setNewSubject(s => ({ ...s, className: e.target.value }))}
                        placeholder="e.g. 10, 12, MSc..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Board</label>
                      <input 
                        required
                        type="text"
                        value={newSubject.board}
                        onChange={e => setNewSubject(s => ({ ...s, board: e.target.value }))}
                        placeholder="e.g. CBSE, ICSE..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thumbnail/Icon Ref</label>
                    <input 
                      required
                      type="text"
                      value={newSubject.thumbnail}
                      onChange={e => setNewSubject(s => ({ ...s, thumbnail: e.target.value }))}
                      placeholder="e.g. Mathematics Icon"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={createMutation.isPending}
                      type="submit"
                      className="flex-1 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Create Subject'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
