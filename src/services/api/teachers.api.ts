import api from './axios';

export interface TeacherResponse {
  _id: string;
  userId: {
    _id: string;
    phone: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  BasicDetails?: {
    fullName: string;
    email: string;
    mobile: string;
    gender: string;
    dob: string;
    profilePic: string | null;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  QualificationDetails: {
    degree?: string;
    college?: string;
    passingYear?: string;
    teachingQualification?: string;
    bed?: boolean;
    certifications: string[];
  };
  ExperienceDetails: {
    experience?: {
      years: number;
      months: number;
    };
    subjects: string[];
    teachingLanguages: string[];
    teachingBoards: string[];
    classes: {
      range?: string;
      individual: string[];
    };
    documents: {
      aadharCard: string | null;
      experienceDoc: string | null;
      qualificationCert: string | null;
    };
    resume: string | null;
    shortSummary?: string;
    teachingMode?: string;
  };
  isVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Unified Teacher interface for the UI
export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  subjects: string[];
  experienceYears: number;
  isVerified: boolean;
  status: 'ACTIVE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  bio: string;
  profilePic: string | null;
  onboardingStep: 'REGISTRATION' | 'DOCUMENTS' | 'DEMO_SESSION' | 'APPROVAL';
  documents: {
    id: string;
    type: string;
    status: 'VERIFIED' | 'PENDING';
    url: string | null;
  }[];
  raw: TeacherResponse; // Keep raw data for updates
}

const mapResponseToTeacher = (res: TeacherResponse): Teacher => {
  const name = res.BasicDetails?.fullName || 'Unnamed Teacher';
  const email = res.BasicDetails?.email || res.userId?.email || 'No Email';
  const phone = res.BasicDetails?.mobile || res.userId?.phone || 'No Phone';
  const subjects = res.ExperienceDetails?.subjects || [];
  const years = res.ExperienceDetails?.experience?.years || 0;
  const docs = res.ExperienceDetails?.documents || { aadharCard: null, experienceDoc: null, qualificationCert: null };

  return {
    id: res._id,
    name,
    email,
    phone,
    subject: subjects[0] || 'Not Specified',
    subjects,
    experienceYears: years,
    isVerified: !!res.isVerified,
    status: (res.status as any) || (res.isVerified ? 'ACTIVE' : 'PENDING'),
    bio: res.ExperienceDetails?.shortSummary || 'No bio provided.',
    profilePic: res.BasicDetails?.profilePic || null,
    onboardingStep: res.isVerified ? 'APPROVAL' : 'DOCUMENTS',
    documents: [
      { id: 'aadhar', type: 'Aadhar Card', status: docs.aadharCard ? 'VERIFIED' : 'PENDING', url: docs.aadharCard },
      { id: 'exp', type: 'Experience Doc', status: docs.experienceDoc ? 'VERIFIED' : 'PENDING', url: docs.experienceDoc },
      { id: 'qual', type: 'Qualification Cert', status: docs.qualificationCert ? 'VERIFIED' : 'PENDING', url: docs.qualificationCert }
    ],
    raw: res
  };
};

export const teacherApi = {
  getAll: async (params?: { search?: string, page?: number, limit?: number }): Promise<Teacher[]> => {
    try {
      const response = await api.get<TeacherResponse[]>('/teachers', { params });
      console.log('API Response:', response.data);
      return response.data.map(mapResponseToTeacher);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Teacher> => {
    // The API doesn't seem to have a direct GET /teachers/:id based on the prompt, 
    // but usually it does. If not, we'd fetch all and find.
    // Assuming GET /teachers/:id exists.
    const response = await api.get<TeacherResponse>(`/teachers/${id}`);
    return mapResponseToTeacher(response.data);
  },

  register: async (data: any): Promise<void> => {
    try {
      console.log('Registering teacher with data:', data);
      const isFormData = data instanceof FormData;
      await api({
        method: 'post',
        url: '/teachers/register',
        data: data,
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('API Register Error:', error);
      throw error;
    }
  },

  update: async (id: string, data: any): Promise<void> => {
    try {
      const isFormData = data instanceof FormData;
      await api({
        method: 'put',
        url: `/teachers/${id}`,
        data: data,
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('API Update Error:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/teachers/${id}`);
  },

  // Mocking these as they might be part of the update API or separate endpoints
  verify: async (id: string): Promise<void> => {
    await api({
      method: 'put',
      url: `/teachers/${id}`,
      data: { isVerified: true },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }
};
