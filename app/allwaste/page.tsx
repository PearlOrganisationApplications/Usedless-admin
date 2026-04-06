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

  /**
   * REPLACED window.confirm with a custom Confirmation Toast
   */
  const handleBulkUpdate = (action: 'approve' | 'reject') => {
    if (selectedIds.length === 0) return;

    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <div className="flex items-center gap-2 text-gray-800">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <span className="font-medium">Confirm Action</span>
        </div>
        <p className="text-sm text-gray-600">
          Are you sure you want to <span className="font-bold">{action}</span> {selectedIds.length} items?
        </p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeBulkUpdate(action);
            }}
            className={`px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors ${action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            Yes, Confirm
          </button>
        </div>
      </div>
    ), {
      duration: 6000, // Stays open longer so user can read it
      position: 'top-center',
      style: {
        minWidth: '320px',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        background: '#fff',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      }
    });
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
      {/* 
        IMPORTANT: Only keep this Toaster here if you don't have one in layout.tsx.
        If you see two toasts at once, delete this line. 
      */}
      {/* <Toaster position="top-center" reverseOrder={false} /> */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Waste Collection Logs</h2>
          <p className="text-sm text-gray-500">Total Records Found: {filteredRecords.length}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
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

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="text-blue-700 text-sm font-medium">
            {selectedIds.length} items selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkUpdate('approve')}
              disabled={processing}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Approve Selected
            </button>
            <button
              onClick={() => handleBulkUpdate('reject')}
              disabled={processing}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Reject Selected
            </button>
          </div>
        </div>
      )}

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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center">Loading Records...</td></tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        title='table'
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
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
    </div>
  );
};

export default AllWastePage;