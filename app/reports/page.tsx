"use client";

import { handle_location } from "@/api/controller/all_reports";
import AddUpdateModal from "@/components/Modal/AddUpdateModal";
import All_Reports_Table from "@/pages/All_Reports/Page";
import { useEffect, useState } from "react";
import { Loader2, MapPin, Tag } from "lucide-react";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [role, setRole] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"location" | "waste">("location");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<number | string | undefined>();
  const [categories, setCategories] = useState([]);

  const isAdmin = role === "admin" || role === "administrator";

  useEffect(() => {
    const savedRole = localStorage.getItem("role")?.toLowerCase() || "";
    setRole(savedRole);
  }, []);

  const fetchData = async () => {
    if (!role) return;
    setLoading(true);
    try {
      if (isAdmin) {
        const [result, cats] = await Promise.all([
          handle_location.getAdminData(activeTab === "location"),
          handle_location.getCategories()
        ]);
        setData(result || []);
        setCategories(cats);
      } else {
        const rawData = await handle_location.getClientData(activeTab === "location");
        if (activeTab === "waste") {
          const flattenedWastes: any[] = [];
          rawData.forEach((loc: any) => {
            if (loc.wastes) {
              loc.wastes.forEach((waste: any) => {
                flattenedWastes.push({
                  ...waste,
                  name: waste.waste_type || waste.name || "Unknown",
                  location_name: loc.location || loc.location_name || "Unknown"
                });
              });
            }
          });
          setData(flattenedWastes);
        } else {
          setData(rawData);
        }
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [activeTab, role]);

  const confirmDelete = (id: any) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-gray-800">
          Delete this {activeTab === "location" ? "place" : "waste type"}?
        </span>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg">Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await handle_location.deleteLocation(id, activeTab === "location");
              fetchData();
            }}
            className="px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-lg"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center', style: { borderRadius: '20px', padding: '16px', border: '1px solid #fee2e2' } });
  };

  return (
    <div className="mx-auto w-[100%] sm:w-[90%] pb-10">
      {/* Attractive segmented filter toggle */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md mb-4 p-4">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-10" />
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />

        <div className="relative flex items-center px-6 py-5 sm:px-8">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">
            All Reports
          </h1>
        </div>
      </div>
      <div className="mt-6 inline-flex w-full sm:w-auto items-center gap-1 bg-slate-100 rounded-full p-1.5 shadow-inner shadow-slate-200/50">
        <button
          type="button"
          onClick={() => setActiveTab("location")}
          className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
            activeTab === "location"
              ? "bg-blue-700 text-white shadow-lg shadow-blue-700/30"
              : "text-slate-400 hover:text-slate-600 hover:bg-white/60"
          }`}
        >
          <MapPin size={14} className={activeTab === "location" ? "opacity-100" : "opacity-50"} />
          {isAdmin ? "Manage Places" : "Client Locations"}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("waste")}
          className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
            activeTab === "waste"
              ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30"
              : "text-slate-400 hover:text-slate-600 hover:bg-white/60"
          }`}
        >
          <Tag size={14} className={activeTab === "waste" ? "opacity-100" : "opacity-50"} />
          {isAdmin ? "Manage Waste Types" : "Client Waste Types"}
        </button>
      </div>

      <div className="mt-8 flex justify-end mb-3">
        {isAdmin && (
          <button className="bg-gray-600 font-bold py-2 px-5 rounded-lg text-white hover:bg-gray-700" onClick={() => { setEditItem(null); setSelectedId(undefined); setOpenModal(true); }}>
            {activeTab === "location" ? "+ Add Place" : "+ Add Waste Type"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-700 w-10 h-10" /></div>
      ) : (
        <All_Reports_Table
          data={data}
          active={activeTab === "location"}
          isAdmin={isAdmin}
          role={role}
          setEditItem={setEditItem}
          setOpenModal={setOpenModal}
          setSelectedId={setSelectedId}
          handleDelete={(id: any) => confirmDelete(id)}
        />
      )}

      {isAdmin && (
        <AddUpdateModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          active={activeTab === "location"}
          editItem={editItem}
          categories={categories}
          onSubmit={async (payload) => {
            await handle_location.add_Location({ ...payload, active: activeTab === "location", selectedId: selectedId || editItem?.id });
            setOpenModal(false);
            fetchData();
          }}
          refreshCategories={async () => setCategories(await handle_location.getCategories())}
        />
      )}
    </div>
  );
}