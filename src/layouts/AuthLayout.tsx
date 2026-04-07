import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-widest">VLM <span className="text-primary">ACADEMY</span></h1>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-semibold">Master Admin Dashboard</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
