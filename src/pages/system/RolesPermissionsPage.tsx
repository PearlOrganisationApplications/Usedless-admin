import React, { useState, useEffect } from 'react';
import { 
  Lock, ShieldCheck, Key, Plus, 
  Trash2, Edit2, Loader2, Save,
  CheckCircle2, AlertTriangle, ChevronRight,
  Settings, Globe, Smartphone, Eye
} from 'lucide-react';
import { permissionApi, Role, Permission } from '@/services/api/permissions.api';
import { cn } from '@/utils';

export const RolesPermissionsPage = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<any | null>(null);
  
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await permissionApi.getAll();
      // Handle response structure
      const data = res.data?.data || res.data || [];
      setRoles(data);
      if (data.length > 0 && !activeRole) {
        setActiveRole(data[0]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName) return;
    try {
      setIsLoading(true);
      await permissionApi.createRole({ name: newRoleName, permissions: [] });
      setNewRoleName('');
      setIsCreatingRole(false);
      fetchData();
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const togglePermission = async (permId: string, actionKey: 'create' | 'read' | 'update' | 'delete') => {
      if (!activeRole) return;
      
      // Find current permission in active role
      const rolePerm = activeRole.permissions?.find((p: any) => p._id === permId || p.id === permId);
      const currentActions = rolePerm?.actions || { create: false, read: false, update: false, delete: false };
      
      const newActions = {
          ...currentActions,
          [actionKey]: !currentActions[actionKey]
      };

      try {
          await permissionApi.updateActions(activeRole._id || activeRole.id, permId, newActions);
          // Refresh data to show changes
          fetchData();
      } catch (error) {
          console.error('Error updating permission actions:', error);
      }
  };

  if (isLoading && roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-bold uppercase tracking-widest text-xs">Synchronizing Access Clusters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Lock className="text-amber-400" size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Roles & Permissions</h2>
          </div>
          <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
            Define system-wide access control lists. Manage specific action permissions (CRUD) for every module across different organizational roles.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Roles Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" /> Authority Roles
              </h3>
              <button 
                onClick={() => setIsCreatingRole(true)}
                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                title="Create New Role"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {isCreatingRole && (
                <div className="p-2 space-y-2 bg-slate-50 rounded-xl border border-primary/20 animate-in slide-in-from-top-2">
                   <input 
                      autoFocus
                      className="w-full px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Role Name (e.g. MODERATOR)"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateRole()}
                   />
                   <div className="flex gap-2">
                      <button onClick={handleCreateRole} className="flex-1 py-1.5 bg-primary text-white text-[10px] font-black uppercase rounded-lg">Confirm</button>
                      <button onClick={() => setIsCreatingRole(false)} className="flex-1 py-1.5 bg-slate-200 text-slate-600 text-[10px] font-black uppercase rounded-lg">Cancel</button>
                   </div>
                </div>
              )}

              {roles.map((role) => (
                <button
                  key={role.id || role._id}
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group",
                    activeRole?._id === role._id || activeRole?.id === role.id 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 translate-x-2" 
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        activeRole?._id === role._id ? "bg-primary animate-pulse" : "bg-slate-300 group-hover:bg-slate-400"
                    )} />
                    <span className="text-sm font-black tracking-tight">{role.name}</span>
                  </div>
                  <ChevronRight size={16} className={cn(
                      "transition-transform",
                      activeRole?._id === role._id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                  )} />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex gap-3 text-amber-700">
             <AlertTriangle size={20} className="shrink-0 mt-0.5" />
             <p className="text-[10px] font-bold leading-relaxed">
               <b>Modification Warning:</b> Changes to role permissions propagate globally in real-time. Ensure least-privilege principles are maintained.
             </p>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="lg:col-span-8 space-y-6">
          {activeRole ? (
             <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                   <div>
                      <h3 className="text-xl font-black text-slate-900">{activeRole.name} Matrix</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">Configuring granular access for {activeRole.permissions?.length || 0} active modules.</p>
                   </div>
                   <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Live Environment
                   </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                   <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                         <div className="col-span-6">Module Node</div>
                         <div className="col-span-6 grid grid-cols-4 text-center">
                            <span>Create</span>
                            <span>Read</span>
                            <span>Update</span>
                            <span>Delete</span>
                         </div>
                      </div>

                      {(activeRole.permissions || []).map((perm: any) => (
                         <div 
                           key={perm._id || perm.id} 
                           className="grid grid-cols-12 gap-4 px-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl items-center hover:bg-white hover:border-primary/20 transition-all group"
                         >
                            <div className="col-span-6 flex items-center gap-3">
                               <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-primary transition-colors">
                                  <Globe size={16} />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-800">{perm.name}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permissions Set</p>
                               </div>
                            </div>
                            <div className="col-span-6 grid grid-cols-4">
                               {['create', 'read', 'update', 'delete'].map((action: any) => (
                                  <div key={action} className="flex justify-center">
                                     <button 
                                       onClick={() => togglePermission(perm._id || perm.id, action)}
                                       className={cn(
                                          "w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center",
                                          perm.actions?.[action] 
                                            ? "bg-primary border-primary text-white" 
                                            : "border-slate-200 text-transparent hover:border-slate-300"
                                       )}
                                     >
                                         <Plus size={14} className={perm.actions?.[action] ? "rotate-45" : ""} />
                                     </button>
                                  </div>
                               ))}
                            </div>
                         </div>
                      ))}
                      
                      {(!activeRole.permissions || activeRole.permissions.length === 0) && (
                        <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem]">
                           <Key size={48} className="mx-auto text-slate-300 mb-4" />
                           <p className="text-sm font-bold text-slate-400">No permission nodes mapped to this role cluster.</p>
                           <button className="mt-4 text-xs font-black text-primary uppercase tracking-widest">Inject Base Permissions</button>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-[3rem] p-12 text-center">
               <ShieldCheck size={64} className="text-slate-200 mb-6" />
               <h3 className="text-xl font-bold text-slate-400">Select a cluster to manage</h3>
               <p className="text-sm text-slate-400 max-w-xs mt-2">Pick an organizational role from the sidebar to modify its system-wide permissions matrix.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
