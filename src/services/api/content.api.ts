import api from './axios';

export type ContentType = 'VIDEO' | 'PDF' | 'IMAGE';

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
      const response = await api.get<{ success: boolean; data: ContentResponse[] }>(`/admin/content/view-content?contentType=${type}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Failed to fetch ${type} content:`, error);
      throw error;
    }
  },

  upload: async (data: CreateContentPayload): Promise<ContentResponse> => {
    try {
      const formData = new FormData();
      formData.append('subjectId', data.subjectId);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('contentType', data.contentType);
      formData.append('file', data.file);
      formData.append('chapterName', data.chapterName);
      formData.append('chapterNumber', String(data.chapterNumber));
      formData.append('accessPlan', data.accessPlan);

      const response = await api.post<{ success: boolean; message: string; data: ContentResponse }>(
        '/admin/content/upload/material',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to upload content:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    // Adding delete placeholder for consistency
    await api.delete(`/admin/content/material/${id}`);
  }
};
