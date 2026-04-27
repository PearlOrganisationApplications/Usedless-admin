import api from './axios';

export type ContentType =
  | 'ALL'
  | 'PDF'
  | 'VIDEO'
  | 'PYQ'
  | 'QUESTION_BANK'
  | 'TEXTBOOK'
  | 'SAMPLE_PAPER'
  | 'WORKSHEET'
  | 'REVISION_NOTES'
  | 'FORMULA_SHEET'
  | 'MOCK_TEST'
  | 'CHAPTER_SUMMARY'
  | 'ASSIGNMENTS'
  | 'IMPORTANT_QUESTIONS';


export interface ContentResponse {
  _id: string;
  subjectId: string;
  title: string;
  description: string;
  chapterName: string;
  chapterNumber: number;
  contentType: ContentType;
  videoUrl?: string;
  pdfUrl?: string;
  imageUrl?: string;
  className: string;
  board: string;
  accessPlan: 'BASIC' | 'PREMIUM';
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentPayload {
  subjectId: string;
  title: string;
  description: string;
  contentType: ContentType;
  file: File;
  chapterName: string;
  chapterNumber: number;
  accessPlan: 'BASIC' | 'PREMIUM';
}

export const contentApi = {
  getByType: async (type: ContentType): Promise<ContentResponse[]> => {
    try {
      const query = type === 'ALL' ? '' : `?type=${type}`;

      const response = await api.get<{
        success: boolean;
        data: ContentResponse[];
      }>(`/admin/content/get-materials${query}`);

      return response.data.data || [];
    } catch (error) {
      console.error('Fetch failed:', error);
      throw error;
    }
  },

  upload: async (data: CreateContentPayload): Promise<ContentResponse> => {
    try {
      const formData = new FormData();

      formData.append('subjectId', data.subjectId);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('contentType', data.contentType); // file type
      formData.append('file', data.file);
      formData.append('chapterName', data.chapterName);
      formData.append('chapterNumber', String(data.chapterNumber));
      formData.append('accessPlan', data.accessPlan);

      const res = await api.post('/admin/content/upload/material', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return res.data.data;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    await api.delete(`/admin/content/material/${id}`);
  }
};