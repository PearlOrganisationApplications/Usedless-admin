import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Shield, Mail, 
  Trash2, Edit2, Loader2, Search,
  Filter, CheckCircle2, XCircle
} from 'lucide-react';
import { adminApi, Admin } from '@/services/api/admins.api';
import { permissionApi, Role } from '@/services/api/permissions.api';
import { DataTable } from '@/components/tables/DataTable';
import { cn } from '@/utils';

export const AdminManagementPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    actions: {
      create: true,
      read: true,
      update: true,
      delete: true
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [adminsRes, rolesRes] = await Promise.all([
        adminApi.getAll(),
        permissionApi.getAll()
      ]);
      
      const rawAdmins = adminsRes.data?.data || adminsRes.data || [];
      const normalizedAdmins = rawAdmins.map((admin: any) => ({
          ...admin,
          id: admin._id || admin.id,
          // Extract role name if it's an object
          roleName: (typeof admin.role === 'object' && admin.role !== null) ? admin.role.name : admin.role
      }));

      setAdmins(normalizedAdmins);
      setRoles(rolesRes.data?.data || rolesRes.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // 1. Role name for permission node (now from hardcoded enum)
      const roleName = formData.role || "STAFF";

      // 2. Create permissions node first as requested
      const permissionRes = await permissionApi.createRole({
        name: roleName,
        // @ts-ignore
        module: "admin",
        actions: formData.actions
      } as any);

      const permissionId = permissionRes.data?.data?._id || permissionRes.data?._id || permissionRes.data?.id;

      if (!permissionId) {
        throw new Error("Failed to create permissions: ID not returned from system");
      }

      // 3. Create the admin account
      await adminApi.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role_: permissionId
      });

      setIsModalOpen(false);
      setFormData({ 
        name: '', 
        email: '', 
        password: '', 
        role: '',
        actions: { create: true, read: true, update: true, delete: true }
      });
      fetchData();
    } catch (error) {
      console.error('Error creating admin/permissions:', error);
      alert('Failed to complete administrative provisioning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Admin Name', 
      accessor: 'name' as const,
      render: (val: string, item: Admin) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            {val?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-bold text-slate-900">{val || 'Anonymous'}</p>
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">ID: {item.id?.toString().slice(-6) || 'N/A'}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Email / Account', 
      accessor: 'email' as const,
      render: (val: string) => (
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Mail size={14} className="text-slate-400" />
          {val}
        </div>
      )
    },
    { 
      header: 'System Role', 
      accessor: 'roleName' as any,
      render: (val: any) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black tracking-widest uppercase border border-slate-200">
          {val || 'STAFF'}
        </span>
      )
    },
    { 
      header: 'Created On', 
      accessor: 'createdAt' as const,
      render: (val: string) => <span className="text-xs font-bold text-slate-500">{val ? new Date(val).toLocaleDateString() : 'N/A'}</span>
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      render: () => (
        <div className="flex items-center gap-2">
           <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-primary rounded-lg transition-colors"><Edit2 size={16}/></button>
           <button className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Shield className="text-primary" size={24} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Admin Management</h2>
            </div>
            <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
              Provision new administrative accounts, assign granular resource access, and monitor workspace permission hierarchies.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:-translate-y-0.5 whitespace-nowrap"
          >
            <UserPlus size={18} />
            Create New Admin
          </button>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      </div>

      {/* Main Table */}
      <div className="min-h-[500px]">
        <DataTable 
          columns={columns as any} 
          data={admins as any} 
          gridTemplateColumns="2fr 2fr 1fr 1fr 1fr" 
          isLoading={isLoading} 
        />
      </div>

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <UserPlus className="text-primary" size={24} /> Provision Admin
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><XCircle size={24}/></button>
            </div>
            <form onSubmit={handleCreateAdmin} className="p-8 space-y-6">
               <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                    <input 
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="admin@vlm.academy"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Initial Password</label>
                      <input 
                        required
                        type="password"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Access Role</label>
                      <select 
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="">Select Role</option>
                        {["SUPER_ADMIN", "MANAGER", "SUPPORT", "FINANCE", "MARKETING"].map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 block mb-4">Module Permissions (Admin Module)</label>
                    <div className="grid grid-cols-2 gap-4">
                      {(['create', 'read', 'update', 'delete'] as const).map(action => (
                        <label key={action} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={formData.actions[action]}
                            onChange={(e) => setFormData({
                              ...formData, 
                              actions: { ...formData.actions, [action]: e.target.checked }
                            })}
                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                          />
                          <span className="text-sm font-bold text-slate-600 capitalize group-hover:text-slate-900 transition-colors">{action}</span>
                        </label>
                      ))}
                    </div>
                  </div>
               </div>

               <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Authorize Admin"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
