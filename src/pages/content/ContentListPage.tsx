// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { DataTable } from '@/components/tables/DataTable';
// import { contentApi, ContentType, ContentResponse } from '@/services/api/content.api';
// import { subjectApi } from '@/services/api/subjects.api';
// import { Plus, Loader2, FileVideo, FileText, ImageIcon, Trash2, X, Upload, ExternalLink } from 'lucide-react';
// import { cn } from '@/utils';
// import { motion, AnimatePresence } from 'framer-motion';

// interface ContentTableItem extends ContentResponse {
//   id: string;
// }

// export const ContentListPage = () => {
//   const [activeType, setActiveType] = useState<ContentType>('VIDEO');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newContent, setNewContent] = useState({
//     subjectId: '',
//     title: '',
//     description: '',
//     contentType: 'VIDEO' as ContentType,
//     file: null as File | null,
//     chapterName: '',
//     chapterNumber: 1,
//     accessPlan: 'BASIC' as 'BASIC' | 'PREMIUM'
//   });

//   const queryClient = useQueryClient();

//   // Fetch subjects for the dropdown
//   const { data: subjects = [] } = useQuery({
//     queryKey: ['subjects'],
//     queryFn: subjectApi.getAll,
//   });

//   // Fetch content based on active tab
//   const { data: contentList = [], isLoading } = useQuery<ContentTableItem[]>({
//     queryKey: ['content', activeType],
//     queryFn: async () => {
//       const data = await contentApi.getByType(activeType);
//       return data.map(item => ({ ...item, id: item._id }));
//     },
//   });

//   const uploadMutation = useMutation({
//     mutationFn: contentApi.upload,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['content', activeType] });
//       setIsModalOpen(false);
//       resetForm();
//       alert('Content uploaded successfully!');
//     },
//     onError: (error: any) => {
//       console.error('Upload failed:', error);
//       alert(error.response?.data?.message || 'Upload failed. Please try again.');
//     }
//   });

//   const resetForm = () => {
//     setNewContent({
//       subjectId: '',
//       title: '',
//       description: '',
//       contentType: activeType,
//       file: null,
//       chapterName: '',
//       chapterNumber: 1,
//       accessPlan: 'BASIC'
//     });
//   };

//   const columns: { header: string; accessor: keyof ContentTableItem; render?: (val: any, item: ContentTableItem) => React.ReactNode }[] = [
//     { 
//       header: 'Title', 
//       accessor: 'title' as const,
//       render: (val: string, item: ContentTableItem) => (
//         <div className="flex items-center gap-3">
//           <div className={cn(
//             "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm",
//             item.contentType === 'VIDEO' ? "bg-red-500" : 
//             item.contentType === 'PDF' ? "bg-orange-500" : "bg-blue-500"
//           )}>
//              {item.contentType === 'VIDEO' ? <FileVideo size={20} /> : 
//               item.contentType === 'PDF' ? <FileText size={20} /> : <ImageIcon size={20} />}
//           </div>
//           <div>
//             <p className="font-bold text-slate-900 line-clamp-1">{val}</p>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CH {item.chapterNumber}: {item.chapterName}</p>
//           </div>
//         </div>
//       )
//     },
//     { 
//       header: 'Subject & Plan', 
//       accessor: 'subjectId' as const,
//       render: (val: string, item: ContentTableItem) => {
//         const subject = subjects.find(s => s.id === val);
//         return (
//           <div className="flex flex-col">
//             <span className="text-xs font-bold text-slate-700">{subject?.name || 'Unknown'}</span>
//             <span className={cn(
//               "text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit mt-1",
//               item.accessPlan === 'BASIC' ? "bg-slate-100 text-slate-500" : "bg-primary/10 text-primary"
//             )}>
//               {item.accessPlan}
//             </span>
//           </div>
//         );
//       }
//     },
//     { 
//       header: 'URL', 
//       accessor: 'id' as const,
//       render: (_: any, item: ContentTableItem) => {
//         const url = item.videoUrl || item.pdfUrl || item.imageUrl;
//         return (
//           <a 
//             href={url} 
//             target="_blank" 
//             rel="noreferrer"
//             className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group"
//           >
//             <span>View File</span>
//             <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//           </a>
//         );
//       }
//     },
//     {
//       header: 'Upload Date',
//       accessor: 'createdAt' as const,
//       render: (val: string) => (
//         <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
//           {new Date(val).toLocaleDateString(undefined, { dateStyle: 'medium' })}
//         </div>
//       )
//     }
//   ];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newContent.file) {
//       alert('Please select a file to upload');
//       return;
//     }
//     uploadMutation.mutate(newContent as any);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setNewContent(prev => ({ ...prev, file: e.target.files![0] }));
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900">Content Management</h2>
//           <p className="text-slate-500 text-sm">Upload and organize learning materials across subjects.</p>
//         </div>
//         <button 
//           onClick={() => {
//             resetForm();
//             setIsModalOpen(true);
//           }}
//           className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
//         >
//           <Plus size={18} />
//           Upload Material
//         </button>
//       </div>

//       {/* Type Tabs */}
//       <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
//         {(['VIDEO', 'PDF', 'IMAGE'] as ContentType[]).map((type) => (
//           <button
//             key={type}
//             onClick={() => setActiveType(type)}
//             className={cn(
//               "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
//               activeType === type 
//                 ? "bg-white text-primary shadow-sm" 
//                 : "text-slate-400 hover:text-slate-600"
//             )}
//           >
//             {type}S
//           </button>
//         ))}
//       </div>

//       <div className="h-[calc(100vh-20rem)]">
//         <DataTable
//           columns={columns}
//           data={contentList}
//           isLoading={isLoading}
//           gridTemplateColumns="3fr 1.5fr 1.5fr 1.5fr"
//         />
//       </div>

//       {/* Upload Content Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsModalOpen(false)}
//               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
//             />
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
//             >
//               <div className="p-8 max-h-[90vh] overflow-y-auto">
//                 <div className="flex items-center justify-between mb-8">
//                   <div>
//                     <h3 className="text-xl font-black text-slate-900">Upload New Material</h3>
//                     <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Choose {activeType} to upload</p>
//                   </div>
//                   <button 
//                     onClick={() => setIsModalOpen(false)}
//                     className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
//                       <input 
//                         required
//                         type="text"
//                         value={newContent.title}
//                         onChange={e => setNewContent(s => ({ ...s, title: e.target.value }))}
//                         placeholder="e.g. Chapter 2: Introduction to Chemistry"
//                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
//                       />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
//                       <select 
//                         required
//                         value={newContent.subjectId}
//                         onChange={e => setNewContent(s => ({ ...s, subjectId: e.target.value }))}
//                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
//                       >
//                         <option value="">Select a subject</option>
//                         {subjects.map(s => (
//                           <option key={s.id} value={s.id}>{s.name} - Class {s.className} ({s.board})</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-1.5">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
//                     <textarea 
//                       required
//                       value={newContent.description}
//                       onChange={e => setNewContent(s => ({ ...s, description: e.target.value }))}
//                       placeholder="Detailed information about this material..."
//                       rows={2}
//                       className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chapter Name</label>
//                       <input 
//                         required
//                         type="text"
//                         value={newContent.chapterName}
//                         onChange={e => setNewContent(s => ({ ...s, chapterName: e.target.value }))}
//                         placeholder="e.g. Economic"
//                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
//                       />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chapter Number</label>
//                       <input 
//                         required
//                         type="number"
//                         min="1"
//                         value={newContent.chapterNumber}
//                         onChange={e => setNewContent(s => ({ ...s, chapterNumber: Number(e.target.value) }))}
//                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content Type</label>
//                       <select 
//                         required
//                         value={newContent.contentType}
//                         onChange={e => setNewContent(s => ({ ...s, contentType: e.target.value as ContentType }))}
//                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
//                       >
//                         <option value="VIDEO">VIDEO</option>
//                         <option value="PDF">PDF</option>
//                         <option value="IMAGE">IMAGE</option>
//                       </select>
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Plan</label>
//                       <select 
//                         required
//                         value={newContent.accessPlan}
//                         onChange={e => setNewContent(s => ({ ...s, accessPlan: e.target.value as 'BASIC' | 'PREMIUM' }))}
//                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
//                       >
//                         <option value="BASIC">BASIC</option>
//                         <option value="PREMIUM">PREMIUM (Paid Only)</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-1.5">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File Attachment</label>
//                     <div className="relative">
//                       <input 
//                         type="file" 
//                         onChange={handleFileChange}
//                         className="hidden" 
//                         id="materialFile" 
//                       />
//                       <label 
//                         htmlFor="materialFile" 
//                         className={cn(
//                           "w-full py-8 bg-slate-50 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-slate-100 transition-all flex flex-col items-center justify-center gap-3",
//                           newContent.file ? "border-emerald-200" : "border-slate-200"
//                         )}
//                       >
//                         {newContent.file ? (
//                           <>
//                             <div className="bg-emerald-500 text-white p-2 rounded-xl">
//                               <Loader2 className="animate-pulse" size={24} />
//                             </div>
//                             <span className="text-sm font-bold text-emerald-600 line-clamp-1">{newContent.file.name}</span>
//                           </>
//                         ) : (
//                           <>
//                             <Upload className="text-slate-300" size={32} />
//                             <span className="text-sm font-bold text-slate-400">Click to browse or drag {activeType} file</span>
//                           </>
//                         )}
//                       </label>
//                     </div>
//                   </div>

//                   <div className="pt-4 flex gap-3">
//                     <button 
//                       type="button"
//                       onClick={() => setIsModalOpen(false)}
//                       className="flex-1 py-3 border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
//                     >
//                       Cancel
//                     </button>
//                     <button 
//                       disabled={uploadMutation.isPending}
//                       type="submit"
//                       className="flex-1 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                     >
//                       {uploadMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Start Upload'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };


import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';
import { contentApi, ContentType, ContentResponse } from '@/services/api/content.api';
import { subjectApi } from '@/services/api/subjects.api';
import { Plus, Loader2, FileVideo, FileText, ImageIcon, Trash2, X, Upload, ExternalLink } from 'lucide-react';
import { cn } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentTableItem extends ContentResponse {
  id: string;
}

export const ContentListPage = () => {
  const [activeType, setActiveType] = useState<ContentType>('VIDEO');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    subjectId: '',
    title: '',
    description: '',
    contentType: 'VIDEO' as ContentType,
    file: null as File | null,
    chapterName: '',
    chapterNumber: 1,
    accessPlan: 'BASIC' as 'BASIC' | 'PREMIUM'
  });

  const queryClient = useQueryClient();

  // Fetch subjects for the dropdown
  const { data: apiSubjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectApi.getAll,
  });

  // Mock subjects for testing as requested
  const mockSubjects = [
    { id: '69e89c03a0a8c41dbf3c3c60', name: 'Chemistry', className: '10', board: 'CBSE' },
    { id: 'test-bio', name: 'Biology', className: '12', board: 'ICSE' },
    { id: 'test-math', name: 'Mathematics', className: '9', board: 'State Board' }
  ];

  const subjects = [...apiSubjects, ...mockSubjects];

  // Fetch content based on active tab
  const { data: contentList = [], isLoading } = useQuery<ContentTableItem[]>({
    queryKey: ['content', activeType],
    queryFn: async () => {
      const data = await contentApi.getByType(activeType);
      return data.map(item => ({ ...item, id: item._id }));
    },
  });

  const uploadMutation = useMutation({
    mutationFn: contentApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', activeType] });
      setIsModalOpen(false);
      resetForm();
      alert('Content uploaded successfully!');
    },
    onError: (error: any) => {
      console.error('Upload failed:', error);
      alert(error.response?.data?.message || 'Upload failed. Please try again.');
    }
  });

  const resetForm = () => {
    setNewContent({
      subjectId: '',
      title: '',
      description: '',
      contentType: activeType,
      file: null,
      chapterName: '',
      chapterNumber: 1,
      accessPlan: 'BASIC'
    });
  };

  const columns: { header: string; accessor: keyof ContentTableItem; render?: (val: any, item: ContentTableItem) => React.ReactNode }[] = [
    { 
      header: 'Title', 
      accessor: 'title' as const,
      render: (val: string, item: ContentTableItem) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm",
            item.contentType === 'VIDEO' ? "bg-red-500" : 
            item.contentType === 'PDF' ? "bg-orange-500" : "bg-blue-500"
          )}>
             {item.contentType === 'VIDEO' ? <FileVideo size={20} /> : 
              item.contentType === 'PDF' ? <FileText size={20} /> : <ImageIcon size={20} />}
          </div>
          <div>
            <p className="font-bold text-slate-900 line-clamp-1">{val}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CH {item.chapterNumber}: {item.chapterName}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Subject & Plan', 
      accessor: 'subjectId' as const,
      render: (val: string, item: ContentTableItem) => {
        const subject = subjects.find(s => s.id === val);
        return (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">{subject?.name || 'Unknown'}</span>
            <span className={cn(
              "text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit mt-1",
              item.accessPlan === 'BASIC' ? "bg-slate-100 text-slate-500" : "bg-primary/10 text-primary"
            )}>
              {item.accessPlan}
            </span>
          </div>
        );
      }
    },
    { 
      header: 'URL', 
      accessor: 'id' as const,
      render: (_: any, item: ContentTableItem) => {
        const url = item.videoUrl || item.pdfUrl || item.imageUrl;
        return (
          <a 
            href={url} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group"
          >
            <span>View File</span>
            <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        );
      }
    },
    {
      header: 'Upload Date',
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
    if (!newContent.file) {
      alert('Please select a file to upload');
      return;
    }
    uploadMutation.mutate(newContent as any);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewContent(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Content Management</h2>
          <p className="text-slate-500 text-sm">Upload and organize learning materials across subjects.</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} />
          Upload Material
        </button>
      </div>

      {/* Type Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {(['VIDEO', 'PDF', 'IMAGE'] as ContentType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeType === type 
                ? "bg-white text-primary shadow-sm" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {type}S
          </button>
        ))}
      </div>

      <div className="h-[calc(100vh-20rem)]">
        <DataTable
          columns={columns}
          data={contentList}
          isLoading={isLoading}
          gridTemplateColumns="3fr 1.5fr 1.5fr 1.5fr"
        />
      </div>

      {/* Upload Content Modal */}
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
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Upload New Material</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Choose {activeType} to upload</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                      <input 
                        required
                        type="text"
                        value={newContent.title}
                        onChange={e => setNewContent(s => ({ ...s, title: e.target.value }))}
                        placeholder="e.g. Chapter 2: Introduction to Chemistry"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                      <select 
                        required
                        value={newContent.subjectId}
                        onChange={e => setNewContent(s => ({ ...s, subjectId: e.target.value }))}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      >
                        <option value="">Select a subject</option>
                        {subjects.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - Class {s.className} ({s.board})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      required
                      value={newContent.description}
                      onChange={e => setNewContent(s => ({ ...s, description: e.target.value }))}
                      placeholder="Detailed information about this material..."
                      rows={2}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chapter Name</label>
                      <input 
                        required
                        type="text"
                        value={newContent.chapterName}
                        onChange={e => setNewContent(s => ({ ...s, chapterName: e.target.value }))}
                        placeholder="e.g. Economic"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chapter Number</label>
                      <input 
                        required
                        type="number"
                        min="1"
                        value={newContent.chapterNumber}
                        onChange={e => setNewContent(s => ({ ...s, chapterNumber: Number(e.target.value) }))}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content Type</label>
                      <select 
                        required
                        value={newContent.contentType}
                        onChange={e => setNewContent(s => ({ ...s, contentType: e.target.value as ContentType }))}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      >
                        <option value="VIDEO">VIDEO</option>
                        <option value="PDF">PDF</option>
                        <option value="IMAGE">IMAGE</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Plan</label>
                      <select 
                        required
                        value={newContent.accessPlan}
                        onChange={e => setNewContent(s => ({ ...s, accessPlan: e.target.value as 'BASIC' | 'PREMIUM' }))}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      >
                        <option value="BASIC">BASIC</option>
                        <option value="PREMIUM">PREMIUM (Paid Only)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File Attachment</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="hidden" 
                        id="materialFile" 
                      />
                      <label 
                        htmlFor="materialFile" 
                        className={cn(
                          "w-full py-8 bg-slate-50 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-slate-100 transition-all flex flex-col items-center justify-center gap-3",
                          newContent.file ? "border-emerald-200" : "border-slate-200"
                        )}
                      >
                        {newContent.file ? (
                          <>
                            <div className="bg-emerald-500 text-white p-2 rounded-xl">
                              <Loader2 className="animate-pulse" size={24} />
                            </div>
                            <span className="text-sm font-bold text-emerald-600 line-clamp-1">{newContent.file.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="text-slate-300" size={32} />
                            <span className="text-sm font-bold text-slate-400">Click to browse or drag {activeType} file</span>
                          </>
                        )}
                      </label>
                    </div>
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
                      disabled={uploadMutation.isPending}
                      type="submit"
                      className="flex-1 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {uploadMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Start Upload'}
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
