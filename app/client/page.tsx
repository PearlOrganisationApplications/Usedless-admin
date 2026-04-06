"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  UserPlus, Loader2, Check, ChevronDown, Search, X,
  Mail, Phone, Lock, Unlock, MapPin, Edit2, Users, Trash2, Calendar, ChevronRight, User, ExternalLink, Info
} from "lucide-react";
import { handle_client } from "../../api/controller/clientController";
import apiClient from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";

const ClientPage = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState<number | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUserWasteOpen, setIsUserWasteOpen] = useState(false);

  const [isLocViewOpen, setIsLocViewOpen] = useState(false);
  const [viewingClientLocs, setViewingClientLocs] = useState<{ name: string, locations: any[] } | null>(null);

  const [detailsTab, setDetailsTab] = useState<"users" | "wastes">("users");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsData, setDetailsData] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  const [userWasteLoading, setUserWasteLoading] = useState(false);
  const [userWasteData, setUserWasteData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [locSearchTerm, setLocSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [editLocationIds, setEditLocationIds] = useState<number[]>([]);

  // ADDED password TO INITIAL STATE
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "", number: "", password: "", organization: "", location_ids: [] as number[]
  });

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [clientRes, locRes] = await Promise.all([
        apiClient.get(ENDPOINTS.CLIENT.GET_ALL),
        apiClient.get(ENDPOINTS.LOCATION.ADMIN)
      ]);
      if (clientRes.data?.status) setClients(clientRes.data.data);
      if (locRes.data?.status) setLocations(locRes.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleLoginAsClient = async (e: React.MouseEvent, clientId: number) => {
    e.stopPropagation();
    const isSuccess = await handle_client.generateTempLoginLink(clientId);
    if (isSuccess) {
      window.location.href = "/";
    }
  };

  const toggleLocation = (id: number) => {
    setFormData((prev) => {
      const exists = prev.location_ids.includes(id);
      return exists ? { ...prev, location_ids: prev.location_ids.filter(i => i !== id) } : { ...prev, location_ids: [...prev.location_ids, id] };
    });
  };

  const toggleEditLocation = (id: number) => {
    setEditLocationIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleOpenDetails = async (client: any) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
    fetchTabContent(client.id, "users");
  };

  const fetchTabContent = async (clientId: number, tab: "users" | "wastes") => {
    setDetailsLoading(true);
    setDetailsTab(tab);
    try {
      const data = tab === "users" ? await handle_client.getCollectorUsers(clientId) : await handle_client.getCollectorWastes(clientId);
      setDetailsData(data);
    } catch (e) { setDetailsData([]); } finally { setDetailsLoading(false); }
  };

  const handleUserClick = async (user: any) => {
    setSelectedUser(user);
    setIsUserWasteOpen(true);
    setUserWasteLoading(true);
    try {
      const data = await handle_client.getUserWasteHistory(user.id);
      setUserWasteData(data);
    } catch (err) { setUserWasteData([]); } finally { setUserWasteLoading(false); }
  };

  const handleToggleStatus = async (clientId: number, currentStatus: number) => {
    setStatusLoading(clientId);
    await handle_client.toggleClientStatus(clientId, currentStatus === 1 ? 0 : 1);
    fetchInitialData();
    setStatusLoading(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.location_ids.length === 0) return alert("Select at least one location");
    setFormSubmitting(true);
    const result = await handle_client.createClient(formData);
    if (result) {
      setIsModalOpen(false);
      setFormData({ first_name: "", last_name: "", email: "", number: "", password: "", organization: "", location_ids: [] });
      fetchInitialData();
    }
    setFormSubmitting(false);
  };

  const handleUpdateLocations = async () => {
    if (!editingClient) return;
    setFormSubmitting(true);
    const result = await handle_client.updateClientLocations(editingClient.id, editLocationIds);
    if (result) {
      setIsEditModalOpen(false);
      fetchInitialData();
    }
    setFormSubmitting(false);
  };

  const filteredClients = useMemo(() => {
    return clients.filter((c) =>
      `${c.first_name} ${c.last_name} ${c.organization}`.toLowerCase().includes(clientSearchTerm.toLowerCase())
    );
  }, [clients, clientSearchTerm]);

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => loc.name.toLowerCase().includes(locSearchTerm.toLowerCase()));
  }, [locations, locSearchTerm]);

  return (
    <div className="p-6 md:p-10 bg-[#FAFAFB] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Client Directory</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Manage System Collectors</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input
              id="mainSearch"
              type="text"
              title="Search Clients"
              className="w-full pl-12 pr-5 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-blue-100 focus:bg-white transition-all"
              placeholder="Search clients..."
              value={clientSearchTerm}
              onChange={(e) => setClientSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <UserPlus size={18} /> Register
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => handleOpenDetails(client)}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-xl font-black uppercase truncate max-w-[180px] ${client.is_active === 0 ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {client.first_name} {client.last_name}
                    </h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{client.organization}</p>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* <button
                      type="button"
                      onClick={(e) => handleLoginAsClient(e, client.id)}
                      className="p-3 rounded-2xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      title="Login to Dashboard"
                    >
                      <ExternalLink size={16} />
                    </button> */}
                    <button
                      type="button"
                      onClick={() => { setEditingClient(client); setEditLocationIds(client.locations?.map((l: any) => l.id) || []); setIsEditModalOpen(true); }}
                      className="p-3 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Edit Locations"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(client.id, client.is_active)}
                      disabled={statusLoading === client.id}
                      title={client.is_active === 1 ? "Block Client" : "Unblock Client"}
                      className={`p-3 rounded-2xl transition-all ${client.is_active === 1 ? "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500" : "bg-red-100 text-red-600 shadow-lg shadow-red-50"}`}
                    >
                      {statusLoading === client.id ? <Loader2 size={16} className="animate-spin" /> : client.is_active === 1 ? <Unlock size={16} /> : <Lock size={16} />}
                    </button>
                  </div>
                </div>

                <div
                  className="mt-4 flex flex-wrap gap-1.5 min-h-7"
                  onClick={(e) => {
                    if (client.locations?.length > 0) {
                      e.stopPropagation();
                      setViewingClientLocs({
                        name: `${client.first_name} ${client.last_name}`,
                        locations: client.locations
                      });
                      setIsLocViewOpen(true);
                    }
                  }}
                >
                  {client.locations?.slice(0, 2).map((loc: any) => (
                    <span key={loc.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-500 uppercase rounded-lg">
                      <MapPin size={8} /> {loc.name}
                    </span>
                  ))}
                  {client.locations?.length > 2 && (
                    <span className="px-2.5 py-1 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg shadow-md shadow-blue-100 hover:bg-blue-700 transition-colors">
                      +{client.locations.length - 2} more
                    </span>
                  )}
                  {(!client.locations || client.locations.length === 0) && (
                    <span className="text-[9px] font-black text-gray-300 uppercase">No locations assigned</span>
                  )}
                </div>

                <div className="mt-6 space-y-3 border-t pt-6">
                  <div className="flex items-center gap-3 text-gray-500 text-[11px] font-bold truncate">
                    <Mail size={14} className="text-gray-300" /> {client.email || 'N/A'}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-[11px] font-bold">
                    <Phone size={14} className="text-gray-300" /> {client.number}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-50">
                <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${client.is_active === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {client.is_active === 1 ? "Active" : "Blocked"}
                </span>
                <span className="text-[9px] text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View History <ChevronRight size={10} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL: VIEW ALL LOCATIONS --- */}
      {isLocViewOpen && viewingClientLocs && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Assigned Locations</h2>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{viewingClientLocs.name}</p>
              </div>
              <button
                type="button"
                title="Close"
                onClick={() => setIsLocViewOpen(false)}
                className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                {viewingClientLocs.locations.map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-800 uppercase">{loc.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">ID: {loc.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 bg-gray-50/50 border-t">
              <button
                onClick={() => setIsLocViewOpen(false)}
                className="w-full py-4 bg-white border border-gray-200 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-colors shadow-sm"
              >
                Close List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: DETAILS --- */}
      {isDetailsOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-10 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-800 uppercase">{selectedClient?.first_name} {selectedClient?.last_name}</h2>
                <p className="text-xs font-bold text-blue-600 uppercase">{selectedClient?.organization}</p>
              </div>
              <button type="button" title="Close" onClick={() => setIsDetailsOpen(false)} className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500">
                <X size={24} />
              </button>
            </div>
            <div className="flex bg-gray-50 p-2 m-8 rounded-2xl gap-2">
              <button type="button" onClick={() => fetchTabContent(selectedClient.id, "users")} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 ${detailsTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>
                <Users size={16} /> Assigned Users
              </button>
              <button type="button" onClick={() => fetchTabContent(selectedClient.id, "wastes")} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 ${detailsTab === 'wastes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>
                <Trash2 size={16} /> Waste History
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 pt-0 custom-scrollbar">
              {detailsLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div> :
                detailsTab === 'users' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailsData?.map((u: any) => (
                      <div key={u.id} onClick={() => handleUserClick(u)} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-blue-500 hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">{u.first_name?.[0]}</div>
                          <div><p className="text-sm font-black text-gray-800 uppercase">{u.first_name} {u.last_name}</p><p className="text-[10px] font-bold text-gray-400">{u.number}</p></div>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-10">
                    {detailsData?.map((group: any) => (
                      <div key={group.waste_type_id} className="space-y-4">
                        <div className="flex items-center gap-3"><h4 className="text-xs font-black text-gray-800 uppercase">{group.waste_type_name}</h4><div className="h-px flex-1 bg-gray-100"></div></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.wastes.map((w: any) => (
                            <div key={w.id} className="bg-white border border-gray-100 p-5 rounded-4xl shadow-sm">
                              <div className="flex justify-between items-start mb-4">
                                <div><p className="text-lg font-black text-gray-800">{w.quantity} <span className="text-[10px] text-gray-300 uppercase">{w.unit}</span></p><p className="text-[9px] font-bold text-blue-500 uppercase flex items-center gap-1"><MapPin size={10} /> {w.location_name}</p></div>
                                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${w.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{w.status}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 pt-4 border-t"><Calendar size={12} /> {new Date(w.waste_time).toLocaleDateString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: USER WASTE --- */}
      {isUserWasteOpen && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-100">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800 uppercase">{selectedUser?.first_name} {selectedUser?.last_name}</h2>
                  <p className="text-[10px] font-black text-blue-600 uppercase">Individual Collection History</p>
                </div>
              </div>
              <button type="button" title="Close" onClick={() => setIsUserWasteOpen(false)} className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {userWasteLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                  <span className="text-[10px] font-black text-gray-400 uppercase">Compiling Records...</span>
                </div>
              ) : (
                <div className="space-y-12">
                  {userWasteData.length > 0 ? (
                    userWasteData.map((group: any) => (
                      <div key={group.waste_type_id} className="space-y-6">
                        <div className="flex items-center gap-4">
                          <h4 className="text-sm font-black text-gray-800 uppercase">{group.waste_type_name}</h4>
                          <div className="h-px flex-1 bg-gray-100"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {group.wastes.map((w: any) => (
                            <div key={w.id} className="bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-sm">
                              <div className="flex justify-between items-start mb-6">
                                <div><p className="text-2xl font-black text-gray-800">{w.quantity} <span className="text-[10px] text-gray-400 uppercase">{w.unit}</span></p><span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1.5"><MapPin size={12} /> {w.location_name}</span></div>
                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${w.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{w.status}</span>
                              </div>
                              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[10px] font-bold text-gray-400"><Calendar size={12} /> {new Date(w.waste_time).toLocaleDateString()}</div><div className="text-[10px] font-black text-gray-300">#{w.id}</div></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-[3rem]">
                      <Trash2 className="text-gray-200 mb-4" size={48} /><p className="text-sm font-black text-gray-400 uppercase">No history found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: REGISTRATION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center bg-white px-10 py-8 border-b border-gray-100">
              <h2 className="text-2xl font-black text-gray-800 uppercase flex items-center gap-3"><UserPlus className="text-blue-600" /> Onboard Client</h2>
              <button type="button" title="Close" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <form id="client-form" onSubmit={onSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: "First Name", name: "first_name" },
                  { label: "Last Name", name: "last_name" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Number", name: "number" },
                  { label: "Password", name: "password", type: "password" } // ADDED PASSWORD FIELD
                ].map((input) => (
                  <div key={input.name} className="space-y-1">
                    <label htmlFor={input.name} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{input.label}</label>
                    <input
                      required
                      id={input.name}
                      title={input.label}
                      placeholder={`Enter ${input.label}`}
                      type={input.type || "text"}
                      name={input.name}
                      value={(formData as any)[input.name]}
                      onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none text-sm font-bold shadow-sm"
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <label htmlFor="organization" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organization</label>
                  <input
                    required
                    id="organization"
                    name="organization"
                    title="Organization"
                    placeholder="Company Name"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none text-sm font-bold shadow-sm"
                  />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assign Locations</label>
                  <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold">{formData.location_ids.length > 0 ? `${formData.location_ids.length} Selected` : "Select Locations"}</span>
                    <ChevronDown size={18} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-50 left-0 right-0 bottom-full mb-3 bg-white border border-gray-200 rounded-3xl shadow-2xl p-4">
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                        <input
                          id="locSearch"
                          title="Search Locations"
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-gray-100"
                          placeholder="Search..."
                          value={locSearchTerm}
                          onChange={(e) => setLocSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                        {filteredLocations.map((loc: any) => (
                          <button key={loc.id} type="button" onClick={() => toggleLocation(loc.id)} className={`w-full flex items-center justify-between p-3 rounded-xl ${formData.location_ids.includes(loc.id) ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                            <span className="text-xs font-bold">{loc.name}</span>
                            {formData.location_ids.includes(loc.id) && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
            <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-gray-400 font-black uppercase text-[11px]">Cancel</button>
              <button form="client-form" disabled={formSubmitting} type="submit" className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase text-[11px] shadow-xl shadow-blue-100">
                {formSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Complete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT LOCATIONS --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-8 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-800 uppercase">Update Locations</h2>
              <button type="button" title="Close" onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  id="editLocSearch"
                  title="Search Locations"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold border border-gray-100 outline-none"
                  placeholder="Search..."
                  value={locSearchTerm}
                  onChange={(e) => setLocSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                {filteredLocations.map((loc: any) => (
                  <button key={loc.id} type="button" onClick={() => toggleEditLocation(loc.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl border ${editLocationIds.includes(loc.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-100 text-gray-700'}`}>
                    <span className="text-xs font-bold">{loc.name}</span>
                    {editLocationIds.includes(loc.id) && <Check size={16} />}
                  </button>
                ))}
              </div>
              <button type="button" onClick={handleUpdateLocations} disabled={formSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[11px] shadow-xl shadow-blue-100">
                {formSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPage;