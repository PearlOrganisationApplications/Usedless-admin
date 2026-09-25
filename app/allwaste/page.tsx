"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { fetchAllWaste, updateWasteStatus } from '@/api/controller/all_wastes';
import { ChevronLeft, ChevronRight, Search, X, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
// 1. Import toast and Toaster
import toast, { Toaster } from 'react-hot-toast';

const AllWastePage = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const itemsPerPage = 20;
  const [selectedWaste, setSelectedWaste] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const result = await fetchAllWaste();
      if (result.status && Array.isArray(result.data)) {
        setAllData(result.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load waste records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const filteredRecords = useMemo(() => {
    return allData.filter((item) => {
      const matchesStatus = statusFilter === "" || item.status?.toLowerCase() === statusFilter.toLowerCase();
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        item.waste_type?.toLowerCase().includes(searchStr) ||
        item.location?.toLowerCase().includes(searchStr) ||
        item.area?.toLowerCase().includes(searchStr);
      return matchesStatus && matchesSearch;
    });
  }, [allData, searchTerm, statusFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map(item => item.id));
    }
  };

  /**
   * ACTUAL ACTION LOGIC
   * This is separated so it can be called AFTER the user confirms in the toast.
   */
  const executeBulkUpdate = async (action: 'approve' | 'reject') => {
    setProcessing(true);
    const updatePromise = Promise.all(selectedIds.map(id => updateWasteStatus(id, action)));

    toast.promise(updatePromise, {
      loading: `${action === 'approve' ? 'Approving' : 'Rejecting'} ${selectedIds.length} items...`,
      success: () => {
        setSelectedIds([]);
        loadInitialData();
        return `Successfully ${action}d items.`;
      },
      error: "Failed to update items. Please try again.",
    }, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });

    try {
      await updatePromise;
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkUpdate = (action: 'approve' | 'reject') => {
    if (selectedIds.length === 0) return;
    setConfirmAction(action);
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">


      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md w-full">
          {/* Decorative half-curve */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-10 " />

          {/* Thin accent bar */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />

          <div className="relative flex items-center justify-between gap-4 px-6 py-6 sm:px-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
                Waste Collection Logs
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Total Records Found: {filteredRecords.length}
              </p>
            </div>
            <div className="flex items-center gap-4">

              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-sm shadow-blue-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>



            </div>
          </div>
        </div>

        <div className="flex flex-col  bg-gray-100 sm:flex-row items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            {['', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setCurrentPage(1); setSelectedIds([]); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${statusFilter === s ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {s === '' ? 'All' : s}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            {searchTerm && (
              <button
                title="Clear Search"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

     

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">
                  <input
                    title='table'
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-2 py-4 text-xs font-bold text-gray-500 uppercase">S.No</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Waste Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date/Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center">Loading Records...</td></tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        title='table'
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => {
                          if (!selectedIds.includes(item.id)) {
                            toggleSelect(item.id);
                            setShowActionModal(true);
                          } else {
                            toggleSelect(item.id);
                          }
                        }}
                      />
                    </td>
                    <td className="px-2 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.waste_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.quantity} {item.unit}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.location}</div>
                      <div className="text-xs text-gray-400">{item.area}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.waste_time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedWaste(item)} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-6 py-20 text-center text-gray-500">No results found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between bg-white">
          <button
            onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); setSelectedIds([]); }}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page <b>{currentPage}</b> of <b>{totalPages || 1}</b></span>
          <button
            onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); setSelectedIds([]); }}
            disabled={currentPage >= totalPages || loading}
            className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {selectedWaste && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Waste Record
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Waste submission details
                </p>
              </div>

              <button
                onClick={() => setSelectedWaste(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full
                     bg-white border border-gray-200 text-gray-500
                     hover:bg-gray-100 hover:text-redDelete this place?-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">

              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Basic Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <p className="text-xs text-gray-500 mb-1">Waste Type</p>
                    <p className="font-semibold text-gray-800">
                      {selectedWaste.waste_type || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <p className="font-semibold text-gray-800">
                      {selectedWaste.quantity || "0"} {selectedWaste.unit || ""}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="font-semibold text-gray-800">
                      {selectedWaste.location || "N/A"}
                    </p>

                    {selectedWaste.area && (
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedWaste.area}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <p className="text-xs text-gray-500 mb-1">Status</p>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${selectedWaste.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : selectedWaste.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {selectedWaste.status || "N/A"}
                    </span>
                  </div>

                </div>
              </div>

              {/* Submission Details */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Submission Details
                </h4>

                <div className="bg-gray-50 rounded-xl border divide-y">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-4">
                    <span className="text-sm text-gray-500">
                      Date & Time
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {selectedWaste.waste_time || "N/A"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-4">
                    <span className="text-sm text-gray-500">
                      Submitted By
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {selectedWaste.user?.first_name || ""}
                      {" "}
                      {selectedWaste.user?.last_name || ""}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-4">
                    <span className="text-sm text-gray-500">
                      Contact Number
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {selectedWaste.user?.number || "N/A"}
                    </span>
                  </div>

                </div>
              </div>

              {/* Environmental Impact */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Environmental Impact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* Landfill */}
                  <div className="rounded-xl border bg-blue-50 p-4">
                    <p className="text-xs text-blue-600 font-medium mb-2">
                      Landfill Saved
                    </p>

                    <p className="text-xl font-bold text-blue-800">
                      {selectedWaste.calculations?.landfill_saved_cubic_yards ?? 0}
                    </p>

                    <p className="text-xs text-blue-600 mt-1">
                      cubic yards
                    </p>
                  </div>

                  {/* Trees */}
                  <div className="rounded-xl border bg-green-50 p-4">
                    <p className="text-xs text-green-600 font-medium mb-2">
                      Trees Saved
                    </p>

                    <p className="text-xl font-bold text-green-800">
                      {selectedWaste.calculations?.trees_saved ?? 0}
                    </p>

                    <p className="text-xs text-green-600 mt-1">
                      trees
                    </p>
                  </div>

                  {/* CO2 */}
                  <div className="rounded-xl border bg-purple-50 p-4">
                    <p className="text-xs text-purple-600 font-medium mb-2">
                      CO₂ Reduced
                    </p>

                    <p className="text-xl font-bold text-purple-800">
                      {selectedWaste.calculations?.mtco2_emission_reduced ?? 0}
                    </p>

                    <p className="text-xs text-purple-600 mt-1">
                      MT CO₂
                    </p>
                  </div>

                </div>
              </div>

              {/* Images */}
              {selectedWaste.image_urls?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Waste Images
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedWaste.image_urls.map(
                      (url: string, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden border bg-gray-50"
                        >
                          <img
                            src={url}
                            alt={`Waste ${i + 1}`}
                            className="w-full h-36 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end">
              <button
                onClick={() => setSelectedWaste(null)}
                className="px-5 py-2.5 rounded-lg bg-gray-800 text-white
                     text-sm font-medium hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Confirm Action</h3>
                <p className="text-xs text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you want to{" "}
              <span className={`font-bold ${confirmAction === "approve" ? "text-green-600" : "text-red-600"}`}>
                {confirmAction}
              </span>{" "}
              <span className="font-semibold text-gray-800">{selectedIds.length}</span> selected item
              {selectedIds.length > 1 ? "s" : ""}?
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const action = confirmAction;
                  setConfirmAction(null);
                  executeBulkUpdate(action);
                }}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm ${confirmAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                Yes, {confirmAction === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showActionModal && selectedIds.length > 0 && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
            <CheckCircle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold">
              Waste Action
            </h3>
            <p className="text-sm text-blue-100">
              {selectedIds.length} item
              {selectedIds.length > 1 ? "s" : ""} selected
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="mb-5 text-center text-sm text-gray-600">
          What would you like to do with the selected waste record
          {selectedIds.length > 1 ? "s" : ""}?
        </p>

        <div className="grid grid-cols-2 gap-3">

          {/* Approve */}
          <button
            onClick={() => {
              setShowActionModal(false);
              executeBulkUpdate("approve");
            }}
            disabled={processing}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-green-700 transition hover:bg-green-100 disabled:opacity-50"
          >
            <CheckCircle className="h-7 w-7" />
            <span className="font-bold">Approve</span>
            <span className="text-xs text-green-600">
              Approve selected
            </span>
          </button>

          {/* Reject */}
          <button
            onClick={() => {
              setShowActionModal(false);
              executeBulkUpdate("reject");
            }}
            disabled={processing}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-700 transition hover:bg-red-100 disabled:opacity-50"
          >
            <XCircle className="h-7 w-7" />
            <span className="font-bold">Reject</span>
            <span className="text-xs text-red-600">
              Reject selected
            </span>
          </button>

        </div>

        {/* Cancel */}
        <button
          onClick={() => {
            setShowActionModal(false);
            setSelectedIds([]);
          }}
          className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AllWastePage;