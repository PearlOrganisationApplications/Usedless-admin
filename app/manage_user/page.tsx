"use client";

import React, { useEffect, useState } from "react";
import { handle_user } from "../../api/controller/mange_user";
import { 
  Loader2, Mail, Phone, User, Lock, Unlock, 
  Building2, MapPin 
} from "lucide-react";

export default function ManageUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await handle_user.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleToggleStatus = async (userId: number, currentIsActive: number) => {
    const newStatus = currentIsActive === 1 ? 0 : 1;
    setStatusLoading(userId);
    
    try {
      await handle_user.toggleUserStatus(userId, newStatus);
      // Clean UI Update: Update only the specific user in local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: newStatus } : u))
      );
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setStatusLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFB]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-[#FAFAFB] min-h-screen">
      {/* Header */}
      <div className="mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Users</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Internal User List & Status
          </p>
        </div>
        <div className="bg-blue-50 px-6 py-2 rounded-2xl">
            <span className="text-blue-600 font-bold text-sm">{users.length} Total Users</span>
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user) => (
          <div
            key={user.id}
            className={`bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all relative flex flex-col justify-between ${
              user.is_active === 0 ? "opacity-80" : ""
            }`}
          >
            <div>
                {/* Status Strip */}
                <div className={`absolute top-0 left-0 w-full h-1 rounded-t-[2.5rem] ${user.is_active === 1 ? 'bg-green-500' : 'bg-red-500'}`} />

                <div className="flex justify-between items-start mb-6 pt-2">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                    user.is_active === 1 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                }`}>
                    <User size={28} />
                </div>

                <button
                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                    disabled={statusLoading === user.id}
                    className={`p-3 rounded-xl transition-all ${
                    user.is_active === 1
                        ? "text-gray-400 hover:bg-red-50 hover:text-red-500"
                        : "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                    }`}
                >
                    {statusLoading === user.id ? (
                    <Loader2 size={20} className="animate-spin" />
                    ) : user.is_active === 1 ? (
                    <Unlock size={20} />
                    ) : (
                    <Lock size={20} /> 
                    )}
                </button>
                </div>

                <div className="space-y-1 mb-6">
                <h3 className={`text-xl font-black truncate ${user.is_active === 0 ? "text-gray-400" : "text-gray-800"}`}>
                    {user.first_name} {user.last_name}
                </h3>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                    <Building2 size={14} /> {user.organization || "No Organization"}
                </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-gray-500 text-sm font-medium truncate">
                        <Mail size={16} className="text-gray-300 flex-shrink-0" /> 
                        {user.email || "No Email"}
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                        <Phone size={16} className="text-gray-300 flex-shrink-0" /> {user.number}
                    </div>
                </div>

                {/* Assigned Locations */}
                <div className="mt-6 pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <MapPin size={12} className="text-blue-600" /> Assigned Locations
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {user.locations && user.locations.length > 0 ? (
                            user.locations.map((loc: any) => (
                                <span 
                                    key={loc.location_id} 
                                    className="text-[9px] font-black uppercase tracking-tight bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100"
                                >
                                    {loc.location_name}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] font-bold text-gray-300 italic">No locations</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Entries</p>
                    <p className="text-lg font-black text-gray-700">{user.total_entries || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Qty (kg)</p>
                    <p className="text-lg font-black text-gray-700">{Math.round(user.total_quantity || 0)}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold">No users found.</p>
        </div>
      )}
    </div>
  );
}