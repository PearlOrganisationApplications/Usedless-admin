import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi, Teacher } from '@/services/api/teachers.api';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, 
  ShieldAlert, Calendar, Camera, BookOpen,
  TrendingUp, MessageSquare, Timer, Zap,
  Loader2, Save, Ban, RotateCcw, Star, FileText, Shield
} from 'lucide-react';
import { cn } from '@/utils';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { PerformanceAnalyticsModal } from '@/components/modals/PerformanceAnalyticsModal';
import { TeacherWalletCard } from '@/components/finance/TeacherWalletCard';

export const TeacherDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{title: string, message: string, onConfirm: () => void} | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState<Partial<Teacher>>({});

  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherApi.getById(id!),
    enabled: !!id
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Teacher>) => teacherApi.updateProfile(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', id] });
      setIsEditing(false);
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: Teacher['status'] | 'APPROVED' | 'BANNED' | 'REJECTED' }) => {
        if (status === 'ACTIVE') return teacherApi.approve(id!);
        if (status === 'SUSPENDED') return teacherApi.suspend(id!);
        if (status === 'BANNED') return teacherApi.ban(id!);
        if (status === 'REJECTED') return teacherApi.reject(id!);
        return teacherApi.updateStatus(id!, status as Teacher['status']);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teacher', id] })
  });

  const docMutation = useMutation({
    mutationFn: ({ docId, status }: { docId: string, status: 'VERIFIED' | 'REJECTED' }) => 
        teacherApi.verifyDocument(id!, docId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teacher', id] })
  });

  const availabilityMutation = useMutation({
    mutationFn: async ({ isOnline, autoAssign }: { isOnline?: boolean, autoAssign?: boolean }) => {
        if (isOnline !== undefined) await teacherApi.updateAvailability(id!, isOnline);
        if (autoAssign !== undefined) await teacherApi.toggleAutoAssign(id!, autoAssign);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teacher', id] })
  });

  const onboardingMutation = useMutation({
    mutationFn: (step: Teacher['onboardingStep']) => teacherApi.updateOnboardingStep(id!, step),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teacher', id] })
  });

  if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  if (!teacher) return <div>Teacher not found</div>;

  const handleAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmAction({ title, message, onConfirm });
    setIsConfirmOpen(true);
  };

  const handleSaveProfile = () => {
    updateMutation.mutate(editedTeacher);
  };

  const startEditing = () => {
    setEditedTeacher({
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        expertise: teacher.expertise,
        bio: teacher.bio,
        experienceYears: teacher.experienceYears
    });
    setIsEditing(true);
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
                onClick={handleSaveProfile}
                disabled={updateMutation.isPending}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/10 flex items-center gap-2"
              >
                {updateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleAction('Suspend Teacher', 'Are you sure you want to suspend this teacher? They will not be able to join sessions.', () => statusMutation.mutate({ status: 'SUSPENDED' }))}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <ShieldAlert size={18} />
                Suspend
              </button>
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

      {/* Profile & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Info & Docs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-orange-100 flex items-center justify-center text-4xl font-black text-orange-600">
                {teacher.name[0]}
              </div>
              <div className={cn(
                "absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-4 border-white",
                teacher.isOnline ? "bg-green-500 text-white" : "bg-slate-400 text-white"
              )}>
                {teacher.isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Full Name</label>
                        <input 
                            value={editedTeacher.name} 
                            onChange={e => setEditedTeacher({...editedTeacher, name: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Email Address</label>
                        <input 
                            value={editedTeacher.email} 
                            onChange={e => setEditedTeacher({...editedTeacher, email: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary"
                        />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Primary Subject</label>
                        <input 
                            value={editedTeacher.subject} 
                            onChange={e => setEditedTeacher({...editedTeacher, subject: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Experience (Years)</label>
                        <input 
                            type="number"
                            value={editedTeacher.experienceYears} 
                            onChange={e => setEditedTeacher({...editedTeacher, experienceYears: parseInt(e.target.value)})}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary"
                        />
                    </div>
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Bio / Description</label>
                      <textarea 
                          value={editedTeacher.bio} 
                          onChange={e => setEditedTeacher({...editedTeacher, bio: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary min-h-[80px]"
                      />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-black text-slate-900">{teacher.name}</h1>
                    <div className="flex gap-2">
                        {teacher.isExperienceVerified && (
                             <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                                <ShieldAlert size={12} /> VERIFIED EXP.
                             </span>
                        )}
                        <span className={cn(
                        "px-3 py-1 rounded-xl text-xs font-black uppercase tracking-tighter",
                        teacher.status === 'ACTIVE' ? "bg-emerald-100 text-emerald-700" : 
                        teacher.status === 'PENDING' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                        )}>
                        {teacher.status}
                        </span>
                    </div>
                  </div>
                  <p className="text-slate-500 mt-1 font-medium">{teacher.email}</p>
                  <p className="text-slate-600 mt-4 text-sm leading-relaxed">{teacher.bio}</p>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                      <BookOpen size={16} className="text-primary" />
                      <span className="text-xs font-bold text-slate-700">{teacher.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                      <Timer size={16} className="text-orange-500" />
                      <span className="text-xs font-bold text-slate-700">{teacher.sessionsCount} Sessions</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                      <Zap size={16} className="text-blue-500" />
                      <span className="text-xs font-bold text-slate-700">{teacher.experienceYears} Years Exp.</span>
                    </div>
                  </div>
                  {teacher.expertise.length > 0 && (
                      <div className="mt-4 flex gap-2">
                          {teacher.expertise.map(exp => (
                              <span key={exp} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                  {exp}
                              </span>
                          ))}
                      </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Onboarding Pipeline */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <RotateCcw size={18} className="text-primary" />
                ONBOARDING PIPELINE
              </h3>
              <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg">
                STEP: {teacher.onboardingStep}
              </span>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 -z-0" />
                {['REGISTRATION', 'DOCUMENTS', 'DEMO_SESSION', 'APPROVAL'].map((step, idx) => {
                    const steps = ['REGISTRATION', 'DOCUMENTS', 'DEMO_SESSION', 'APPROVAL'];
                    const currentIdx = steps.indexOf(teacher.onboardingStep);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500",
                                isCompleted ? "bg-emerald-500 text-white" : 
                                isCurrent ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : 
                                "bg-slate-200 text-slate-400"
                            )}>
                                {isCompleted ? <CheckCircle size={20} /> : <span className="text-xs font-black">{idx + 1}</span>}
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-tighter mt-3",
                                isCurrent ? "text-primary" : "text-slate-400"
                            )}>{step.replace('_', ' ')}</span>
                        </div>
                    );
                })}
              </div>

              {/* Step Content */}
              <div className="min-h-[200px] flex flex-col justify-center">
                  {teacher.onboardingStep === 'DOCUMENTS' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-slate-800">Pending Document Verification</h4>
                        <span className="text-xs font-bold text-slate-400">{teacher.documents.filter(d => d.status === 'VERIFIED').length} / {teacher.documents.length} Verified</span>
                      </div>
                      {teacher.documents.map((doc: any) => (
                        <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-2 rounded-lg border",
                                doc.status === 'VERIFIED' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                                doc.status === 'REJECTED' ? "bg-red-50 border-red-100 text-red-600" :
                                "bg-white border-slate-100 text-primary"
                            )}>
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{doc.type}</p>
                              <div className="flex gap-2 items-center">
                                <button className="text-[10px] font-bold text-primary hover:underline">View Document</button>
                                <span className="text-[10px] text-slate-300">•</span>
                                <span className={cn(
                                    "text-[10px] font-black uppercase",
                                    doc.status === 'VERIFIED' ? "text-emerald-500" :
                                    doc.status === 'REJECTED' ? "text-red-500" : "text-amber-500"
                                )}>{doc.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                             {doc.status !== 'VERIFIED' && (
                                <button 
                                    onClick={() => docMutation.mutate({ docId: doc.id, status: 'VERIFIED' })}
                                    className="p-2 bg-white hover:bg-emerald-50 text-emerald-600 border border-slate-100 rounded-xl transition-colors"
                                    title="Approve"
                                >
                                    <CheckCircle size={18} />
                                </button>
                             )}
                             {doc.status !== 'REJECTED' && (
                                <button 
                                    onClick={() => docMutation.mutate({ docId: doc.id, status: 'REJECTED' })}
                                    className="p-2 bg-white hover:bg-red-50 text-red-500 border border-slate-100 rounded-xl transition-colors"
                                    title="Reject"
                                >
                                    <XCircle size={18} />
                                </button>
                             )}
                          </div>
                        </div>
                      ))}
                      {teacher.documents.every(d => d.status === 'VERIFIED') && (
                          <button 
                            onClick={() => onboardingMutation.mutate('DEMO_SESSION')}
                            className="w-full mt-6 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                          >
                              Proceed to Demo Session <Zap size={18} />
                          </button>
                      )}
                    </div>
                  )}

                  {teacher.onboardingStep === 'DEMO_SESSION' && (
                      <div className="text-center space-y-6">
                          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto text-orange-600">
                             <Calendar size={40} />
                          </div>
                          <div>
                              <h4 className="text-xl font-black text-slate-900">Demo Session Required</h4>
                              <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">This teacher is ready for a demo session. Schedule and review their teaching style to proceed.</p>
                          </div>
                          <div className="flex gap-4 max-w-sm mx-auto">
                              <button className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50">
                                  Schedule Demo
                              </button>
                              <button 
                                onClick={() => onboardingMutation.mutate('APPROVAL')}
                                className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800"
                              >
                                  Mark as Completed
                              </button>
                          </div>
                      </div>
                  )}

                  {teacher.onboardingStep === 'APPROVAL' && (
                       <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto text-emerald-600">
                                <Shield size={40} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900">Final Approval</h4>
                                <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">All checks passed. You can now approve this teacher to join the platform or reject if not suitable.</p>
                            </div>
                            <div className="flex gap-4 max-w-sm mx-auto">
                                <button 
                                    onClick={() => handleAction('Reject Teacher', 'Are you sure you want to reject this teacher application?', () => statusMutation.mutate({ status: 'REJECTED' }))}
                                    className="flex-1 py-4 border border-red-200 text-red-500 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-50"
                                >
                                    Reject Application
                                </button>
                                <button 
                                    onClick={() => handleAction('Approve Teacher', 'Approve this teacher and make them ACTIVE on the platform?', () => statusMutation.mutate({ status: 'ACTIVE' }))}
                                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
                                >
                                    Approve & Active
                                </button>
                            </div>
                       </div>
                  )}

                  {teacher.onboardingStep === 'REGISTRATION' && (
                       <div className="text-center text-slate-400 font-bold py-12">
                           Teacher is currently completing registration...
                       </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Analytics & Control */}
        <div className="space-y-8">
          {/* Performance Stats */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-primary" />
              PERFORMANCE ANALYTICS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase">Avg. Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <h4 className="text-xl font-black text-slate-900">{teacher.analytics.rating}</h4>
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase">Success Rate</p>
                <h4 className="text-xl font-black text-emerald-600 mt-1">{teacher.analytics.sessionSuccessRate}</h4>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase">Resp. Time</p>
                <h4 className="text-xl font-black text-blue-600 mt-1">{teacher.analytics.responseTime}</h4>
              </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase">Complaints</p>
                <h4 className="text-xl font-black text-red-500 mt-1">{teacher.analytics.complaintCount}</h4>
              </div>
            </div>
            <button 
                onClick={() => setIsAnalyticsOpen(true)}
                className="w-full py-3 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
            >
              View Detailed Metrics
            </button>
          </div>

          {/* Availability Control */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 flex items-center gap-2 mb-6">
              <Zap size={20} className="text-orange-500" />
              AVAILABILITY CONTROL
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Force Online Status</p>
                    <p className="text-[10px] text-slate-500">Override system auto-assign</p>
                  </div>
                  <button 
                    disabled={availabilityMutation.isPending}
                    onClick={() => availabilityMutation.mutate({ isOnline: !teacher.isOnline })}
                    className={cn(
                        "w-12 h-6 rounded-full relative transition-all duration-300",
                        teacher.isOnline ? "bg-green-500" : "bg-slate-300",
                        availabilityMutation.isPending && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                        "w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300", 
                        teacher.isOnline ? "left-7" : "left-1"
                    )} />
                  </button>
               </div>

               <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div>
                    <p className="text-sm font-bold text-primary">Auto-Assign System</p>
                    <p className="text-[10px] text-primary/60">Automated session matching</p>
                  </div>
                  <button 
                    disabled={availabilityMutation.isPending}
                    onClick={() => availabilityMutation.mutate({ autoAssign: !teacher.autoAssign })}
                    className={cn(
                        "w-12 h-6 rounded-full relative transition-all duration-300",
                        teacher.autoAssign ? "bg-primary" : "bg-slate-300",
                        availabilityMutation.isPending && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                        "w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300", 
                        teacher.autoAssign ? "left-7" : "left-1"
                    )} />
                  </button>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Slots</h4>
                    <span className="text-[10px] font-bold text-primary">Monday</span>
               </div>
               <div className="space-y-2">
                 {[
                   { time: '10:00 - 12:00', status: 'Booked' },
                   { time: '14:00 - 16:00', status: 'Available' },
                   { time: '18:00 - 20:00', status: 'Available' }
                 ].map((slot, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-primary/20 transition-colors">
                     <span className="text-xs font-bold text-slate-700">{slot.time}</span>
                     <span className={cn(
                       "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md",
                       slot.status === 'Booked' ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"
                     )}>{slot.status}</span>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-4 py-3 border border-dashed border-slate-200 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2">
                 <Calendar size={16} />
                 Manage All Schedule Slots
               </button>
            </div>
          </div>

          {/* Teacher Wallet */}
          <TeacherWalletCard
            teacherId={teacher.id}
            initialBalance={32400}
            initialRate={12}
          />
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmAction?.onConfirm || (() => {})}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
      />

      <PerformanceAnalyticsModal 
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        teacherName={teacher.name}
        analytics={teacher.analytics}
      />
    </div>
  );
};
