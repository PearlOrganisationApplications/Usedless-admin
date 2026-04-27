import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/tables/DataTable';
import { contentApi, ContentType } from '@/services/api/content.api';
import { subjectApi } from '@/services/api/subjects.api';
import {
  Plus,
  Loader2,
  FileVideo,
  FileText,
  ImageIcon,
  X,
  Upload,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const CONTENT_CATEGORIES: ContentType[] = [
  'ALL',
  'PDF',
  'VIDEO',
  'PYQ',
  'QUESTION_BANK',
  'TEXTBOOK',
  'SAMPLE_PAPER',
  'WORKSHEET',
  'REVISION_NOTES',
  'FORMULA_SHEET',
  'MOCK_TEST',
  'CHAPTER_SUMMARY',
  'ASSIGNMENTS',
  'IMPORTANT_QUESTIONS'
];

export const ContentListPage = () => {
  const [activeType, setActiveType] = useState<ContentType>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newContent, setNewContent] = useState({
    subjectId: '',
    title: '',
    description: '',
    contentType: 'PYQ' as ContentType, // ✅ now real category
    file: null as File | null,
    chapterName: '',
    chapterNumber: 1,
    accessPlan: 'BASIC' as 'BASIC' | 'PREMIUM'
  });

  const queryClient = useQueryClient();

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectApi.getAll
  });

  const { data: contentList = [], isLoading } = useQuery({
    queryKey: ['content', activeType],
    queryFn: async () => {
      const data = await contentApi.getByType(activeType);
      return data.map((i: any) => ({ ...i, id: i._id }));
    }
  });

  const uploadMutation = useMutation({
    mutationFn: contentApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const resetForm = () => {
    setNewContent({
      subjectId: '',
      title: '',
      description: '',
      contentType: 'PYQ',
      file: null,
      chapterName: '',
      chapterNumber: 1,
      accessPlan: 'BASIC'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.file) return alert('Select file');
    uploadMutation.mutate(newContent as any);
  };

  return (
    <div className="space-y-6 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Content Management</h2>
          <p className="text-sm text-gray-500">Manage all learning materials</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
           className="bg-primary text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
          >
          <Plus size={16} /> Upload
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        {CONTENT_CATEGORIES.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              "px-3 py-1 rounded-full text-xs transition",
              activeType === type
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            {type.replaceAll('_', ' ')}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <DataTable
        data={contentList}
        isLoading={isLoading}
        gridTemplateColumns="2fr 1fr 1fr 1fr"
        columns={[
          {
            header: 'Content',
            accessor: 'title',
            render: (_: any, item: any) => (
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{item.title}</span>
                <span className="text-xs text-gray-500">
                  {item.subjectId?.name} • Class {item.className}
                </span>
              </div>
            )
          },

          {
            header: 'TYPE',
            accessor: 'category',
            render: (_: any, item: any) => (
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                {item.contentType.replaceAll('_', ' ')}
              </span>
            )
          },

          {
            header: 'Plan',
            accessor: 'accessPlan',
            render: (_: any, item: any) => (
              <span
                className={cn(
                  "px-2 py-1 text-xs rounded-full",
                  item.accessPlan === 'PREMIUM'
                    ? "bg-purple-100 text-purple-700"
                    : "bg-green-100 text-green-700"
                )}
              >
                {item.accessPlan}
              </span>
            )
          },

          {
            header: 'File',
            accessor: 'file',
            render: (_: any, item: any) => {
              const url = item.videoUrl || item.fileUrl;

              const Icon =
                item.contentType === 'VIDEO'
                  ? FileVideo
                  : item.contentType === 'PDF'
                    ? FileText
                    : ImageIcon;

              return (
                <a
                  href={url}
                  target="_blank"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <Icon size={16} />
                  View
                  <ExternalLink size={14} />
                </a>
              );
            }
          }
        ]}
      />

      {/* EMPTY STATE */}
      {!isLoading && contentList.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No content found
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">

            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsModalOpen(false)}
            />

            {/* MODAL */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl w-[520px] z-10 shadow-xl space-y-4"
            >

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Upload Content</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">

                {/* SUBJECT */}
                <select
                  className="w-full border p-2 rounded-lg"
                  value={newContent.subjectId}
                  onChange={e =>
                    setNewContent(s => ({ ...s, subjectId: e.target.value }))
                  }
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} (Class {sub.className})
                    </option>
                  ))}
                </select>

                {/* TITLE */}
                <input
                  className="w-full border p-2 rounded-lg"
                  placeholder="Title"
                  value={newContent.title}
                  onChange={e =>
                    setNewContent(s => ({ ...s, title: e.target.value }))
                  }
                  required
                />

                {/* DESCRIPTION */}
                <textarea
                  className="w-full border p-2 rounded-lg"
                  placeholder="Description"
                  value={newContent.description}
                  onChange={e =>
                    setNewContent(s => ({ ...s, description: e.target.value }))
                  }
                />

                {/* CATEGORY (CONTENT TYPE LIKE PYQ, NOTES) */}
                <select
                  className="w-full border p-2 rounded-lg"
                  value={newContent.contentType}
                  onChange={e =>
                    setNewContent(s => ({
                      ...s,
                      contentType: e.target.value as ContentType
                    }))
                  }
                >
                  {CONTENT_CATEGORIES.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>
                      {c.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>


                {/* CHAPTER NAME */}
                <input
                  className="w-full border p-2 rounded-lg"
                  placeholder="Chapter Name"
                  value={newContent.chapterName}
                  onChange={e =>
                    setNewContent(s => ({
                      ...s,
                      chapterName: e.target.value
                    }))
                  }
                />

                {/* CHAPTER NUMBER */}
                <input
                  type="number"
                  className="w-full border p-2 rounded-lg"
                  placeholder="Chapter Number"
                  value={newContent.chapterNumber}
                  onChange={e =>
                    setNewContent(s => ({
                      ...s,
                      chapterNumber: Number(e.target.value)
                    }))
                  }
                />

                {/* ACCESS PLAN */}
                <select
                  className="w-full border p-2 rounded-lg"
                  value={newContent.accessPlan}
                  onChange={e =>
                    setNewContent(s => ({
                      ...s,
                      accessPlan: e.target.value as 'BASIC' | 'PREMIUM'
                    }))
                  }
                >
                  <option value="BASIC">BASIC</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>

                {/* FILE UPLOAD */}
                <label className="border-dashed border-2 p-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-gray-50">
                  <Upload size={20} />
                  <span className="text-sm text-gray-500">
                    Click to upload file
                  </span>

                  {newContent.file && (
                    <span className="text-xs mt-1 text-green-600">
                      {newContent.file.name}
                    </span>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files) {
                        setNewContent(s => ({
                          ...s,
                          file: e.target.files![0]
                        }));
                      }
                    }}
                    required
                  />
                </label>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg flex justify-center items-center gap-2"
                >
                  {uploadMutation.isPending && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  Upload Content
                </button>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
