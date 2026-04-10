import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api/axios';
import { teacherApi, Teacher } from '@/services/api/teachers.api';
import { socketService } from '@/socket/socket.service';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, 
  ShieldAlert, Calendar, BookOpen,
  TrendingUp, Timer, Zap,
  Loader2, Save, RotateCcw, Star, FileText, Shield,
  Phone, Mail, MapPin, GraduationCap, Briefcase, Eye
} from 'lucide-react';
import { cn } from '@/utils';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

import { OnboardingPipeline, OnboardingStep } from '@/components/OnboardingPipeline';

export const TeacherDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{title: string, message: string, onConfirm: () => void} | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState<any>({});
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('REGISTRATION');

  useEffect(() => {
    const handleUpdate = (data: any) => {
      // If the update is for the current teacher, invalidate the query
      if (data?.id === id || !data?.id) {
        console.log('TeacherDetailsPage: Real-time update received for teacher:', id);
        queryClient.invalidateQueries({ queryKey: ['teacher', id] });
      }
    };

    socketService.on('teacherUpdated', handleUpdate);

    return () => {
      socketService.off('teacherUpdated');
    };
  }, [id, queryClient]);

  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherApi.getById(id!),
    enabled: !!id
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('TeacherDetailsPage: Starting update mutation with data:', data);
      const formData = new FormData();
      formData.append('BasicDetails', JSON.stringify(data.BasicDetails));
      formData.append('QualificationDetails', JSON.stringify(data.QualificationDetails));
      formData.append('ExperienceDetails', JSON.stringify(data.ExperienceDetails));
      
      console.log('TeacherDetailsPage: Calling api.put directly to /teachers/' + id);
      const response = await api({
        method: 'put',
        url: `/teachers/${id}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      console.log('TeacherDetailsPage: Update successful');
      queryClient.invalidateQueries({ queryKey: ['teacher', id] });
      setIsEditing(false);
      alert('Teacher updated successfully!');
    },
    onError: (error: any) => {
      console.error('TeacherDetailsPage: Update failed', error);
      const errorData = error.response?.data;
      console.error('TeacherDetailsPage: Error response data:', errorData);
      
      // If it's HTML, it might be a 404/405 from the server
      if (typeof errorData === 'string' && errorData.includes('<!DOCTYPE html>')) {
        alert('Update failed: Server returned an error page. This usually means the endpoint or method is incorrect.');
      } else {
        alert('Update failed: ' + (errorData?.message || 'Check console for details'));
      }
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      console.log('TeacherDetailsPage: Starting verify mutation for id:', id);
      const response = await api({
        method: 'put',
        url: `/teachers/${id}`,
        data: { isVerified: true },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      console.log('TeacherDetailsPage: Verification successful');
      queryClient.invalidateQueries({ queryKey: ['teacher', id] });
    },
    onError: (error: any) => {
      console.error('TeacherDetailsPage: Verification failed', error);
      alert('Verification failed. Check console for details.');
    }
  });

  if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  if (!teacher) return <div>Teacher not found</div>;

  const handleAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmAction({ title, message, onConfirm });
    setIsConfirmOpen(true);
  };

  const startEditing = () => {
    setEditedTeacher({
      BasicDetails: { ...teacher.raw.BasicDetails },
      ExperienceDetails: { ...teacher.raw.ExperienceDetails },
      QualificationDetails: { ...teacher.raw.QualificationDetails }
    });
    setIsEditing(true);
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setEditedTeacher((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/teachers')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Directory
        </button>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => updateMutation.mutate(editedTeacher)}
                disabled={updateMutation.isPending}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/10 flex items-center gap-2"
              >
                {updateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </>
          ) : (
            <>
              {!teacher.isVerified && onboardingStep === 'APPROVAL' && (
                <button 
                  onClick={() => handleAction('Verify Teacher', 'Approve this teacher and mark them as verified on the platform?', () => verifyMutation.mutate())}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/10"
                >
                  <CheckCircle size={18} />
                  Approve & Make Active
                </button>
              )}
              {!teacher.isVerified && onboardingStep !== 'APPROVAL' && (
                <button 
                  onClick={() => {
                    const steps: OnboardingStep[] = ['REGISTRATION', 'DOCUMENTS', 'DEMO_SESSION', 'APPROVAL'];
                    const nextIdx = steps.indexOf(onboardingStep) + 1;
                    if (nextIdx < steps.length) setOnboardingStep(steps[nextIdx]);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/10"
                >
                  Next Onboarding Step
                </button>
              )}
              <button 
                onClick={startEditing}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10 flex items-center gap-2"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Info & Docs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className={cn(
            "bg-white p-8 rounded-3xl border shadow-sm flex gap-8 transition-all duration-300",
            isEditing ? "border-primary ring-4 ring-primary/5" : "border-slate-200"
          )}>
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-3xl bg-orange-100 flex items-center justify-center text-4xl font-black text-orange-600 overflow-hidden">
                {teacher.profilePic ? (
                  <img src={teacher.profilePic} alt={teacher.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : teacher.name[0]}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <div className="flex-1 mr-4">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">Full Name</label>
                    <input 
                      type="text"
                      value={editedTeacher.BasicDetails?.fullName || ''}
                      onChange={e => handleInputChange('BasicDetails', 'fullName', e.target.value)}
                      className="w-full text-2xl font-black text-slate-900 bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                      placeholder="Enter full name"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl font-black text-slate-900">{teacher.name}</h1>
                )}
                <span className={cn(
                  "px-3 py-1 rounded-xl text-xs font-black uppercase tracking-tighter shrink-0",
                  teacher.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {teacher.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shrink-0 border border-slate-100">
                      <Mail size={18} />
                    </div>
                    {isEditing ? (
                      <input 
                        type="email"
                        value={editedTeacher.BasicDetails?.email || ''}
                        onChange={e => handleInputChange('BasicDetails', 'email', e.target.value)}
                        className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full text-sm font-bold shadow-sm"
                      />
                    ) : (
                      <span className="font-bold text-slate-700">{teacher.email}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shrink-0 border border-slate-100">
                      <Phone size={18} />
                    </div>
                    {isEditing ? (
                      <input 
                        type="tel"
                        value={editedTeacher.BasicDetails?.mobile || ''}
                        onChange={e => handleInputChange('BasicDetails', 'mobile', e.target.value)}
                        className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full text-sm font-bold shadow-sm"
                      />
                    ) : (
                      <span className="font-bold text-slate-700">{teacher.phone}</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shrink-0 border border-slate-100">
                      <MapPin size={18} />
                    </div>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editedTeacher.BasicDetails?.address?.street || ''}
                        onChange={e => {
                          const newAddress = { ...editedTeacher.BasicDetails.address, street: e.target.value };
                          handleInputChange('BasicDetails', 'address', newAddress);
                        }}
                        className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full text-sm font-bold shadow-sm"
                      />
                    ) : (
                      <span className="font-bold text-slate-700">
                        {teacher.raw.BasicDetails?.address ? `${teacher.raw.BasicDetails.address.street}, ${teacher.raw.BasicDetails.address.city}, ${teacher.raw.BasicDetails.address.state} - ${teacher.raw.BasicDetails.address.pincode}` : 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-xs font-bold text-slate-700">{teacher.subject}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                  <Zap size={16} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-700">{teacher.experienceYears} Years Exp.</span>
                </div>
                {teacher.raw.ExperienceDetails.teachingMode && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                    <Briefcase size={16} className="text-orange-500" />
                    <span className="text-xs font-bold text-slate-700 uppercase">{teacher.raw.ExperienceDetails.teachingMode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Qualifications & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={cn(
              "bg-white p-6 rounded-3xl border shadow-sm transition-all duration-300",
              isEditing ? "border-primary ring-4 ring-primary/5" : "border-slate-200"
            )}>
              <h3 className="font-black text-slate-900 flex items-center gap-2 mb-6">
                <GraduationCap size={20} className="text-primary" />
                QUALIFICATIONS
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Degree</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedTeacher.QualificationDetails?.degree || ''}
                      onChange={e => handleInputChange('QualificationDetails', 'degree', e.target.value)}
                      className="text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full shadow-sm"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{teacher.raw.QualificationDetails?.degree || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">College/University</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedTeacher.QualificationDetails?.college || ''}
                      onChange={e => handleInputChange('QualificationDetails', 'college', e.target.value)}
                      className="text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full shadow-sm"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{teacher.raw.QualificationDetails?.college || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Passing Year</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedTeacher.QualificationDetails?.passingYear || ''}
                      onChange={e => handleInputChange('QualificationDetails', 'passingYear', e.target.value)}
                      className="text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full shadow-sm"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{teacher.raw.QualificationDetails?.passingYear || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className={cn(
              "bg-white p-6 rounded-3xl border shadow-sm transition-all duration-300",
              isEditing ? "border-primary ring-4 ring-primary/5" : "border-slate-200"
            )}>
              <h3 className="font-black text-slate-900 flex items-center gap-2 mb-6">
                <Briefcase size={20} className="text-primary" />
                EXPERIENCE
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subjects (Comma Separated)</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedTeacher.ExperienceDetails?.subjects?.join(', ') || ''}
                      onChange={e => handleInputChange('ExperienceDetails', 'subjects', e.target.value.split(',').map((s: string) => s.trim()))}
                      className="text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full shadow-sm"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.subjects.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Languages (Comma Separated)</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedTeacher.ExperienceDetails?.teachingLanguages?.join(', ') || ''}
                      onChange={e => handleInputChange('ExperienceDetails', 'teachingLanguages', e.target.value.split(',').map((s: string) => s.trim()))}
                      className="text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full shadow-sm"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.raw.ExperienceDetails?.teachingLanguages?.map(l => (
                        <span key={l} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">{l}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Boards (Comma Separated)</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedTeacher.ExperienceDetails?.teachingBoards?.join(', ') || ''}
                      onChange={e => handleInputChange('ExperienceDetails', 'teachingBoards', e.target.value.split(',').map((s: string) => s.trim()))}
                      className="text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary w-full shadow-sm"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.raw.ExperienceDetails?.teachingBoards?.map(b => (
                        <span key={b} className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-bold">{b}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 flex items-center gap-2 mb-6">
              <FileText size={20} className="text-primary" />
              VERIFICATION DOCUMENTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teacher.documents.map(doc => (
                <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{doc.type}</span>
                    <span className={cn(
                      "text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md",
                      doc.status === 'VERIFIED' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    )}>{doc.status}</span>
                  </div>
                  {doc.url ? (
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                    >
                      <Eye size={14} /> View Document
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Not Uploaded</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Quick Actions */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 flex items-center gap-2 mb-4">
              <Shield size={20} className="text-primary" />
              ADMIN SUMMARY
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "{teacher.bio}"
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Joined Platform</span>
                <span className="text-xs font-bold text-slate-700">{new Date(teacher.raw.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Last Updated</span>
                <span className="text-xs font-bold text-slate-700">{new Date(teacher.raw.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">User ID</span>
                <span className="text-xs font-mono text-[10px] text-slate-500">{teacher.raw.userId._id}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-900/20">
            <h3 className="font-black flex items-center gap-2 mb-6">
              <Zap size={20} className="text-primary" />
              QUICK ACTIONS
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleAction('Reset Password', 'Send a password reset link to the teacher?', () => {})}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Reset Password
              </button>
              <button 
                onClick={() => handleAction('Contact Teacher', 'Open email client to message this teacher?', () => window.location.href = `mailto:${teacher.email}`)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Message Teacher
              </button>
              <button 
                onClick={() => handleAction('Suspend Account', 'Temporarily disable this teacher\'s access?', () => {})}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Pipeline */}
      <OnboardingPipeline 
        currentStep={onboardingStep} 
        onStepClick={(step) => setOnboardingStep(step)}
        isVerified={teacher.isVerified}
      />

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmAction?.onConfirm || (() => {})}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
      />
    </div>
  );
};

