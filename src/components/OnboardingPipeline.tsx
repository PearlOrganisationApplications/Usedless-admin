import React from 'react';
import { CheckCircle2, RotateCcw, FileText, Video, CheckCircle } from 'lucide-react';
import { cn } from '@/utils';

export type OnboardingStep = 'REGISTRATION' | 'DOCUMENTS' | 'DEMO_SESSION' | 'APPROVAL';

interface OnboardingPipelineProps {
  currentStep: OnboardingStep;
  onStepClick?: (step: OnboardingStep) => void;
  isVerified: boolean;
}

const steps: { id: OnboardingStep; label: string; icon: any }[] = [
  { id: 'REGISTRATION', label: 'REGISTRATION', icon: CheckCircle2 },
  { id: 'DOCUMENTS', label: 'DOCUMENTS', icon: FileText },
  { id: 'DEMO_SESSION', label: 'DEMO SESSION', icon: Video },
  { id: 'APPROVAL', label: 'APPROVAL', icon: CheckCircle },
];

export const OnboardingPipeline: React.FC<OnboardingPipelineProps> = ({ 
  currentStep, 
  onStepClick,
  isVerified 
}) => {
  const getStepIndex = (step: OnboardingStep) => steps.findIndex(s => s.id === step);
  const currentIndex = isVerified ? 4 : getStepIndex(currentStep);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <RotateCcw size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Onboarding Pipeline</h2>
        </div>
        <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
          Step: {isVerified ? 'COMPLETED' : currentStep.replace('_', ' ')}
        </div>
      </div>

      <div className="p-12">
        <div className="relative flex items-center justify-between max-w-4xl mx-auto">
          {/* Progress Line */}
          <div className="absolute left-0 top-5 w-full h-0.5 bg-slate-100 -z-0" />
          <div 
            className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-500 -z-0" 
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentIndex === index;
            const isCompleted = currentIndex > index;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
                <button
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!onStepClick}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg",
                    isCompleted ? "bg-primary text-white shadow-primary/20" :
                    isActive ? "bg-white border-4 border-primary text-primary scale-110 shadow-primary/10" :
                    "bg-white border-2 border-slate-100 text-slate-300"
                  )}
                >
                  {isCompleted ? <CheckCircle2 size={24} /> : <span className="text-lg font-black">{index + 1}</span>}
                </button>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest text-center",
                  isCompleted || isActive ? "text-primary" : "text-slate-400"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center space-y-4">
          <p className="text-slate-400 font-black text-xl tracking-tight">
            {isVerified ? (
              "Teacher has successfully completed onboarding!"
            ) : currentIndex === 0 ? (
              "Teacher is currently completing registration..."
            ) : currentIndex === 1 ? (
              "Reviewing and verifying documents..."
            ) : currentIndex === 2 ? (
              "Scheduling demo session with the teacher..."
            ) : (
              "Final review before platform approval..."
            )}
          </p>
          
          {!isVerified && (
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {currentIndex === 0 && ['Full Name', 'Email', 'Mobile', 'Password'].map(item => (
                <span key={item} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg border border-slate-200 uppercase tracking-widest">{item}</span>
              ))}
              {currentIndex === 1 && ['Aadhar Card', 'Resume', 'Qualification Cert', 'Exp Doc'].map(item => (
                <span key={item} className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg border border-amber-100 uppercase tracking-widest">{item}</span>
              ))}
              {currentIndex === 2 && ['Demo Link', 'Subject Knowledge', 'Communication'].map(item => (
                <span key={item} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-widest">{item}</span>
              ))}
              {currentIndex === 3 && ['Background Check', 'Final Interview', 'Contract'].map(item => (
                <span key={item} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">{item}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
