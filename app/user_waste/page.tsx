"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Loader2, MapPin, Scale, Clock, 
  CheckCircle2, AlertCircle, Timer, Box, Check, X, RotateCcw 
} from "lucide-react";
import { manage_waste } from "@/api/controller/manage_waste";

const UserWastePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => { fetchWasteData(); }, []);

  const fetchWasteData = async () => {
    try {
      setLoading(true);
      const result = await manage_waste.getUserWaste();
      setData(result);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleStatusChange = async (wasteId: number, newStatus: "approved" | "rejected" | "pending") => {
    setActionLoading(wasteId);
    try {
      const result = await manage_waste.updateWasteStatus(wasteId, newStatus);
      if (result) {
        // Update local state for all locations
        setData(prevData => prevData.map(location => ({
          ...location,
          wastes: location.wastes.map((w: any) => 
            w.id === wasteId ? { ...w, status: newStatus } : w
          )
        })));
      }
    } catch (error) { console.error(error); } finally { setActionLoading(null); }
  };

  const globalStats = useMemo(() => {
    let stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
    data.forEach(loc => {
        // Since we update status locally, we recalculate from the actual wastes array
        loc.wastes.forEach((w:any) => {
            stats.total++;
            if(w.status === 'approved') stats.approved++;
            else if(w.status === 'rejected') stats.rejected++;
            else stats.pending++;
        });
    });
    return stats;
  }, [data]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      <p className="text-gray-500 font-bold">Refreshing records...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#FAFAFB] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Waste Management</h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Update status at any time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Entries", val: globalStats.total, icon: Box, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending", val: globalStats.pending, icon: Timer, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Approved", val: globalStats.approved, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Rejected", val: globalStats.rejected, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm">
            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}><stat.icon size={20} /></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-800">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="space-y-10">
        {data.map((location) => (
          <div key={location.location_id}>
            <div className="flex items-center gap-3 mb-6">
               <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100"><MapPin className="text-blue-600" size={18} /></div>
               <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">{location.location_name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {location.wastes.map((waste: any) => (
                <div key={waste.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:border-blue-100 transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        waste.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        waste.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {waste.status}
                      </span>
                      
                      {/* ACTION BUTTONS: Always visible, buttons for current status are hidden/disabled */}
                      <div className="flex gap-1.5">
                           {/* Reset to Pending */}
                           {waste.status !== "pending" && (
                             <button 
                              disabled={actionLoading === waste.id}
                              onClick={() => handleStatusChange(waste.id, "pending")}
                              className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-amber-500 hover:text-white transition-all"
                              title="Set to Pending"
                             >
                              {actionLoading === waste.id ? <Loader2 size={12} className="animate-spin"/> : <RotateCcw size={12} />}
                             </button>
                           )}

                           {/* Approve Button */}
                           {waste.status !== "approved" && (
                             <button 
                              disabled={actionLoading === waste.id}
                              onClick={() => handleStatusChange(waste.id, "approved")}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                              title="Approve"
                             >
                              {actionLoading === waste.id ? <Loader2 size={12} className="animate-spin"/> : <Check size={12} />}
                             </button>
                           )}

                           {/* Reject Button */}
                           {waste.status !== "rejected" && (
                             <button 
                              disabled={actionLoading === waste.id}
                              onClick={() => handleStatusChange(waste.id, "rejected")}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                              title="Reject"
                             >
                              {actionLoading === waste.id ? <Loader2 size={12} className="animate-spin"/> : <X size={12} />}
                             </button>
                           )}
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-gray-800 uppercase mb-4">{waste.waste_type}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gray-500"><Scale size={14} className="text-blue-500" /><span className="text-xs font-bold">{waste.quantity} {waste.unit}</span></div>
                      <div className="flex items-center gap-3 text-gray-400"><MapPin size={14}/><span className="text-[10px] font-medium truncate">{waste.area}</span></div>
                      <div className="flex items-center gap-3 text-gray-400"><Clock size={14}/><span className="text-[10px] font-medium">{new Date(waste.waste_time).toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-50 grid grid-cols-3 gap-2">
                    <div className="text-center"><p className="text-[8px] font-black text-gray-400 uppercase">Landfill</p><p className="text-[10px] font-bold text-gray-700">{waste.landfill_saved}t</p></div>
                    <div className="text-center border-x border-gray-100"><p className="text-[8px] font-black text-gray-400 uppercase">Trees</p><p className="text-[10px] font-bold text-gray-700">{waste.trees_saved}</p></div>
                    <div className="text-center"><p className="text-[8px] font-black text-gray-400 uppercase">MTCO2</p><p className="text-[10px] font-bold text-gray-700">{waste.mtco2_reduced}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWastePage;