import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '@/services/api/teachers.api';
import { 
  ArrowLeft, Save, Loader2, UserPlus, Phone, Mail, Lock, 
  MapPin, GraduationCap, Briefcase, FileText, Camera, Upload,
  ChevronRight, ChevronLeft, CheckCircle2
} from 'lucide-react';
import { cn } from '@/utils';

export const AddTeacherPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Details
    fullName: '',
    email: '',
    mobile: '',
    gender: 'Male',
    dob: '',
    password: '',
    profilePic: null as File | null,
    
    // Address
    street: '',
    city: '',
    state: '',
    pincode: '',
    
    // Qualifications
    degree: '',
    college: '',
    passingYear: '',
    teachingQualification: '',
    bed: false,
    certifications: [] as File[],
    
    // Experience
    expYears: 0,
    expMonths: 0,
    teachingMode: 'online',
    typeOfExperience: 'school',
    resume: null as File | null,
    shortSummary: '',
    subjects: '',
    classRange: '',
    individualClasses: '',
    teachingBoards: '',
    teachingLanguages: '',
    
    // Documents
    aadharCard: null as File | null,
    experienceDoc: null as File | null,
    qualificationCert: null as File | null,
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => teacherApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      navigate('/teachers');
    },
    onError: (error: any) => {
      console.error('Registration failed details:', error.response?.data);
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      alert(serverMessage || 'Registration failed. Please check all fields and try again.');
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      if (field === 'certifications') {
        setFormData(prev => ({ ...prev, certifications: Array.from(e.target.files!) }));
      } else {
        setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    
    // Construct nested objects as required by API
    const basicDetails = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      gender: formData.gender,
      dob: formData.dob,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        coordinates: { lat: 28.61, lng: 77.2 } // Default coordinates
      }
    };

    const qualificationDetails = {
      degree: formData.degree,
      college: formData.college,
      passingYear: formData.passingYear,
      teachingQualification: formData.teachingQualification,
      bed: formData.bed,
      certifications: [] // Files sent separately
    };

    const experienceDetails = {
      experience: {
        years: Number(formData.expYears),
        months: Number(formData.expMonths)
      },
      teachingMode: formData.teachingMode,
      typeOfExperience: formData.typeOfExperience,
      shortSummary: formData.shortSummary,
      subjects: formData.subjects.split(',').map(s => s.trim()),
      classes: {
        range: formData.classRange,
        individual: formData.individualClasses.split(',').map(c => c.trim())
      },
      teachingBoards: formData.teachingBoards.split(',').map(b => b.trim()),
      teachingLanguages: formData.teachingLanguages.split(',').map(l => l.trim()),
      documents: {
        aadharCard: null,
        experienceDoc: null,
        qualificationCert: null
      }
    };

    data.append('BasicDetails', JSON.stringify(basicDetails));
    data.append('QualificationDetails', JSON.stringify(qualificationDetails));
    data.append('ExperienceDetails', JSON.stringify(experienceDetails));
    data.append('password', formData.password);
    data.append('role', 'TEACHER');

    if (formData.profilePic) data.append('profilePic', formData.profilePic);
    if (formData.resume) data.append('resume', formData.resume);
    if (formData.aadharCard) data.append('aadharCard', formData.aadharCard);
    if (formData.experienceDoc) data.append('experienceDoc', formData.experienceDoc);
    if (formData.qualificationCert) data.append('qualificationCert', formData.qualificationCert);
    
    formData.certifications.forEach(file => {
      data.append('certifications', file);
    });

    mutation.mutate(data);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12 px-4">
      {[1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-300",
              step === i ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" : 
              step > i ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
            )}>
              {step > i ? <CheckCircle2 size={20} /> : i}
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              step === i ? "text-primary" : "text-slate-400"
            )}>
              {i === 1 ? 'Basic' : i === 2 ? 'Address' : i === 3 ? 'Education' : 'Experience'}
            </span>
          </div>
          {i < 4 && <div className={cn("h-0.5 flex-1 mx-4 rounded-full", step > i ? "bg-emerald-500" : "bg-slate-100")} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/teachers')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Directory
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-black text-slate-900">Register New Teacher</h2>
          <p className="text-slate-500 text-sm">Step {step} of 4: {step === 1 ? 'Personal Information' : step === 2 ? 'Address Details' : step === 3 ? 'Qualifications' : 'Teaching Experience'}</p>
        </div>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <UserPlus size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                <input 
                  required
                  type="tel"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="9999999999"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input 
                  required
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                <input 
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profile Picture</label>
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden">
                  {formData.profilePic ? (
                    <img src={URL.createObjectURL(formData.profilePic)} alt="Preview" className="w-full h-full object-cover" />
                  ) : <Camera size={24} />}
                </div>
                <div className="flex-1">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'profilePic')}
                    className="hidden" 
                    id="profilePic" 
                  />
                  <label htmlFor="profilePic" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-all inline-flex items-center gap-2">
                    <Upload size={14} /> Choose Image
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1">JPG, PNG or WEBP. Max 2MB.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Address Details</h3>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
              <input 
                type="text"
                value={formData.street}
                onChange={e => setFormData({ ...formData, street: e.target.value })}
                placeholder="e.g. 123 Main St, MG Road"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                <input 
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Delhi"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                <input 
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Delhi"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                <input 
                  type="text"
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="110001"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Qualifications</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Highest Degree</label>
                <input 
                  type="text"
                  value={formData.degree}
                  onChange={e => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. BSc, B.Tech"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College/University</label>
                <input 
                  type="text"
                  value={formData.college}
                  onChange={e => setFormData({ ...formData, college: e.target.value })}
                  placeholder="Delhi University"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Passing Year</label>
                <input 
                  type="text"
                  value={formData.passingYear}
                  onChange={e => setFormData({ ...formData, passingYear: e.target.value })}
                  placeholder="2018"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teaching Qualification</label>
                <input 
                  type="text"
                  value={formData.teachingQualification}
                  onChange={e => setFormData({ ...formData, teachingQualification: e.target.value })}
                  placeholder="e.g. B.Ed, MSc"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <input 
                type="checkbox"
                id="bed"
                checked={formData.bed}
                onChange={e => setFormData({ ...formData, bed: e.target.checked })}
                className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="bed" className="text-sm font-bold text-slate-700">I have completed B.Ed</label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Certifications (Multiple)</label>
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <input 
                  type="file" 
                  multiple
                  onChange={e => handleFileChange(e, 'certifications')}
                  className="hidden" 
                  id="certifications" 
                />
                <label htmlFor="certifications" className="w-full py-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-all flex flex-col items-center gap-2">
                  <Upload size={20} className="text-primary" />
                  <span>{formData.certifications.length > 0 ? `${formData.certifications.length} files selected` : 'Click to upload certifications'}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Experience & Documents</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Years</label>
                <input 
                  type="number"
                  value={formData.expYears}
                  onChange={e => setFormData({ ...formData, expYears: Number(e.target.value) })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Months</label>
                <input 
                  type="number"
                  value={formData.expMonths}
                  onChange={e => setFormData({ ...formData, expMonths: Number(e.target.value) })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teaching Mode</label>
                <select 
                  value={formData.teachingMode}
                  onChange={e => setFormData({ ...formData, teachingMode: e.target.value })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type of Experience</label>
                <select 
                  value={formData.typeOfExperience}
                  onChange={e => setFormData({ ...formData, typeOfExperience: e.target.value })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                >
                  <option value="school">School</option>
                  <option value="coaching">Coaching</option>
                  <option value="private">Private Tutoring</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subjects (Comma separated)</label>
              <input 
                type="text"
                value={formData.subjects}
                onChange={e => setFormData({ ...formData, subjects: e.target.value })}
                placeholder="Math, Science, Physics"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Range</label>
                <input 
                  type="text"
                  value={formData.classRange}
                  onChange={e => setFormData({ ...formData, classRange: e.target.value })}
                  placeholder="e.g. 6-10"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teaching Boards</label>
                <input 
                  type="text"
                  value={formData.teachingBoards}
                  onChange={e => setFormData({ ...formData, teachingBoards: e.target.value })}
                  placeholder="CBSE, ICSE"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Summary</label>
              <textarea 
                value={formData.shortSummary}
                onChange={e => setFormData({ ...formData, shortSummary: e.target.value })}
                placeholder="Briefly describe your teaching style and experience..."
                rows={3}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resume (PDF/Doc)</label>
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <input type="file" onChange={e => handleFileChange(e, 'resume')} className="hidden" id="resume" />
                  <label htmlFor="resume" className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <FileText size={16} className="text-primary" />
                    {formData.resume ? formData.resume.name : 'Upload Resume'}
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aadhar Card</label>
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <input type="file" onChange={e => handleFileChange(e, 'aadharCard')} className="hidden" id="aadharCard" />
                  <label htmlFor="aadharCard" className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Upload size={16} className="text-primary" />
                    {formData.aadharCard ? formData.aadharCard.name : 'Upload Aadhar'}
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Document</label>
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <input type="file" onChange={e => handleFileChange(e, 'experienceDoc')} className="hidden" id="experienceDoc" />
                  <label htmlFor="experienceDoc" className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Upload size={16} className="text-primary" />
                    {formData.experienceDoc ? formData.experienceDoc.name : 'Upload Experience Doc'}
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qualification Certificate</label>
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <input type="file" onChange={e => handleFileChange(e, 'qualificationCert')} className="hidden" id="qualificationCert" />
                  <label htmlFor="qualificationCert" className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Upload size={16} className="text-primary" />
                    {formData.qualificationCert ? formData.qualificationCert.name : 'Upload Certificate'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          {step > 1 ? (
            <button 
              type="button"
              onClick={prevStep}
              className="px-8 py-4 border border-slate-200 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <ChevronLeft size={20} /> Previous
            </button>
          ) : <div />}

          {step < 4 ? (
            <button 
              type="button"
              onClick={nextStep}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all"
            >
              Next Step <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={mutation.isPending}
              className="px-12 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              Complete Registration
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
