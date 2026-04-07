import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api/admins.api';
import { useAuthStore } from '@/store/auth.store';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await adminApi.login(email, password);
      // Handle both { token, admin } and { data: { token, admin } }
      const resData = response.data?.data || response.data;
      const token = resData.token || resData.accessToken || resData.access_token;
      
      const rawUser = resData.admin || resData.user || resData;
      
      // Normalize user role and permissions
      const adminUser = {
        id: rawUser._id || rawUser.id || '123',
        name: rawUser.name || 'Admin',
        // If role is an object { name, ... }, take name. If string but ID-like, fallback.
        role: (typeof rawUser.role === 'object' ? rawUser.role.name : 
               (typeof rawUser.role === 'string' && rawUser.role.length > 20 ? 'SUPER_ADMIN' : rawUser.role)) || 'SUPER_ADMIN',
        permissions: Array.isArray(rawUser.permissions) ? rawUser.permissions : [
            'STUDENT_VIEW', 'STUDENT_EDIT', 
            'TEACHER_VIEW', 'TEACHER_APPROVE', 'TEACHER_EDIT',
            'SESSION_VIEW', 'SESSION_MONITOR',
            'FINANCE_VIEW', 'PAYOUT_APPROVE',
            'SUPPORT_VIEW', 'CAMPAIGN_CREATE',
            'CONTENT_MODERATE',
            'SYSTEM_SETTINGS_UPDATE'
        ]
      };
      
      console.log('Login successful, setting auth:', { adminUser, token });
      
      if (!token) {
          throw new Error('No authentication token received');
      }

      setAuth(adminUser, token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="email"
            required
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-800"
            placeholder="admin@vlm.academy"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            required
            className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-800"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Login to Workspace"}
      </button>
      
      <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
        By continuing, you agree to VLM Academy's <br /> 
        <span className="text-primary font-medium hover:underline cursor-pointer">Security Policies</span> & <span className="text-primary font-medium hover:underline cursor-pointer">Terms of Service</span>
      </p>
    </form>
  );
};
