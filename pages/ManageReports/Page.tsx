"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Pencil, Search, Calendar as CalendarIcon, FileText, CheckCircle2,
  Clock, XCircle, Loader2, ImageIcon, Trash2, CalendarDays, ListPlus, Download
} from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";
import { format, eachDayOfInterval, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { manage_waste } from "@/api/controller/wasteController";
import { wasteService } from "@/api/controller/waste_service";

const ManageReportsTable = ({ data, refreshParent, initialDate }: any) => {
  const [wasteData, setWasteData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState("");

  // 1. STATE FOR CALENDAR (VIEW PREVIOUS DATA)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate || new Date());

  // State for Dropdowns
  const [areas, setAreas] = useState<string[]>([]);
  const [wasteTypes, setWasteTypes] = useState<any[]>([]);

  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editConfirm, setEditConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [manualDate, setManualDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [manualEntries, setManualEntries] = useState([{ waste_type: "", quantity: "", unit: "kg", area: "" }]);

  const [bulkConfig, setBulkConfig] = useState({
    waste_type: "",
    unit: "kg",
    area: "",
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  });
  const [dailyQuantities, setDailyQuantities] = useState<Record<string, string>>({});
  const [editSelectedData, setEditSelectedData] = useState<any>({});

  // Fetch Areas and Waste Types
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [areasRes, typesRes] = await Promise.all([
          manage_waste.getLocationAreas(data?.[0]?.id),
          manage_waste.getWasteTypes()
        ]);
        setAreas(Array.isArray(areasRes) ? areasRes : []);
        setWasteTypes(Array.isArray(typesRes) ? typesRes : []);
      } catch (e) {
        console.error("Initialization error", e);
      }
    };
    if (data?.[0]?.id) fetchInitialData();
  }, [data]);

  // FETCH DATA BASED ON SELECTED DATE
  const handleData = useCallback(async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const allWastes = await manage_waste.getAllWaste(dateStr);
      const targetLocation = data?.[0]?.name?.toLowerCase();
      const filtered = allWastes.filter((item: any) => item.location?.toLowerCase() === targetLocation);
      setWasteData(filtered);
    } catch (e) { setWasteData([]); }
    finally { setLoading(false); }
  }, [data, selectedDate]);

  useEffect(() => { handleData(); }, [handleData]);

  // 2. PDF DOWNLOAD IMPLEMENTATION
  const handleDownloadPDF = () => {
    if (filteredData.length === 0) return toast.error("No data available to download");

    const doc = new jsPDF("p", "mm", "a4");
    const locationName = data?.[0]?.name || "Unknown Location";
    const reportDate = selectedDate ? format(selectedDate, "PPPP") : format(new Date(), "PPPP");

    // Header styling
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Waste Collection Report", 14, 15);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Location: ${locationName.toUpperCase()}`, 14, 22);
    doc.text(`Date: ${reportDate}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Waste Type", "Quantity", "Unit", "Area", "Status", "Time"]],
      body: filteredData.map(i => [
        i.waste_type,
        i.quantity,
        i.unit,
        i.area || "N/A",
        i.status.toUpperCase(),
        i.waste_time
      ]),
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }, // Blue-600
      alternateRowStyles: { fillColor: [245, 247, 250] },
      styles: { fontSize: 9 }
    });

    doc.save(`Waste_Report_${locationName.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.pdf`);
    toast.success("PDF Downloaded successfully");
  };

  // --- SUBMIT HANDLERS ---
  const handleManualSubmit = async () => {
    const validEntries = manualEntries.filter(e => e.waste_type && e.quantity);
    if (validEntries.length === 0) return toast.error("Please enter valid records");
    setActionLoading(true);
    const payload = {
      date: manualDate,
      location: data[0].name,
      waste_entries: validEntries.map(e => ({ ...e, quantity: Number(e.quantity) }))
    };
    const success = await manage_waste.storeManualWaste(payload);
    if (success) {
      setManualModalOpen(false);
      setManualEntries([{ waste_type: "", quantity: "", unit: "kg", area: "" }]);
      handleData();
      refreshParent();
    }
    setActionLoading(false);
  };

  const dateList = useMemo(() => {
    try {
      return eachDayOfInterval({ start: parseISO(bulkConfig.start_date), end: parseISO(bulkConfig.end_date) });
    } catch (e) { return []; }
  }, [bulkConfig.start_date, bulkConfig.end_date]);

  const handleBulkSubmit = async () => {
    if (!bulkConfig.waste_type) return toast.error("Please select a waste type");
    const entries = dateList
      .filter(date => dailyQuantities[format(date, "yyyy-MM-dd")])
      .map(date => {
        const ds = format(date, "yyyy-MM-dd");
        return {
          waste_type: bulkConfig.waste_type,
          quantity: Number(dailyQuantities[ds]),
          unit: bulkConfig.unit,
          area: bulkConfig.area || null,
          waste_time: ds
        };
      });
    if (entries.length === 0) return toast.error("Enter quantity for at least one day");
    setActionLoading(true);
    const payload = { date: bulkConfig.start_date, location: data[0].name, waste_entries: entries };
    const success = await manage_waste.storeManualWaste(payload);
    if (success) {
      setBulkModalOpen(false);
      setDailyQuantities({});
      handleData();
      refreshParent();
    }
    setActionLoading(false);
  };

  const handleEdit = async (editData: any) => {
    setActionLoading(true);
    let success: boolean = false;
    if(editData.status==="pending"){
      console.log("editData",editData);
      editData.status = "approved";
       success = await manage_waste.updateWasteRecord(editData.id, editData);
    }else{
      console.log("editData2",editData);
       success = await manage_waste.updateWasteRecord(editData.id, editData);
    }
    
    if (success) { handleData(); refreshParent(); setEditConfirm(false); }
    setActionLoading(false);
  };

  const filteredData = wasteData.filter(i => (i.waste_type || "").toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="w-full space-y-6">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search current logs..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {/* CALENDAR DATE PICKER (Implement #1) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-slate-200">
                <CalendarIcon size={18} className="mr-2 text-blue-600" />
                {selectedDate ? format(selectedDate, "PP") : "Pick Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="end">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>

          {/* PDF DOWNLOAD (Implement #2) */}
          <Button onClick={handleDownloadPDF} variant="outline" className="rounded-2xl h-12 px-6 font-bold border-slate-200 hover:bg-slate-50">
            <FileText size={18} className="mr-2 text-indigo-600" /> PDF
          </Button>

          <Button onClick={() => setManualModalOpen(true)} className="bg-blue-600 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all">
            <ListPlus size={18} className="mr-2" /> Manual Entry
          </Button>

          <Button onClick={() => setBulkModalOpen(true)} className="bg-green-600 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-green-100 active:scale-95 transition-all">
            <CalendarDays size={18} className="mr-2" /> Bulk Range
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="text-center">Image</TableHead>
              <TableHead>Waste Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Area</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="py-24 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Fetching {selectedDate ? format(selectedDate, "PP") : "logs"}...</TableCell></TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-24 text-center">
                  <div className="flex flex-col items-center opacity-40">
                    <CalendarIcon size={48} className="mb-2" />
                    <p className="font-bold">No records found for this date.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">
                    {item.image_urls?.[0] ? <img src={item.image_urls[0]} className="h-10 w-10 rounded-xl object-cover mx-auto shadow-sm" alt="" /> : <ImageIcon className="mx-auto text-slate-200" />}
                  </TableCell>
                  <TableCell className="font-bold uppercase text-xs">{item.waste_type}</TableCell>
                  <TableCell className="font-bold">{item.quantity} <span className="text-[10px] text-slate-400">{item.unit}</span></TableCell>
                  <TableCell className="text-sm">{item.area || "N/A"}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-bold uppercase",
                      item.status === 'approved' ? 'bg-green-100 text-green-700' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700')}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" onClick={() => { setEditSelectedData(item); setEditConfirm(true); }}><Pencil size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MODAL: MANUAL ENTRY --- */}
      <Dialog open={manualModalOpen} onOpenChange={setManualModalOpen}>
        <DialogContent className="max-w-4xl bg-white rounded-[2.5rem] p-0 border-none shadow-2xl">
          <div className="bg-blue-600 p-8 text-white rounded-t-[2.5rem]">
            <DialogTitle className="text-2xl font-black">Manual Entry</DialogTitle>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold">DATE FOR RECORDS</Label>
              <Input type="date" value={manualDate} onChange={e => setManualDate(e.target.value)} className="h-12 rounded-xl" />
            </div>
            {manualEntries.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="col-span-4">
                  <select
                    title="Select Waste Type"
                    className="w-full h-10 bg-white border rounded-lg px-2 text-sm"
                    value={row.waste_type}
                    onChange={e => { const n = [...manualEntries]; n[idx].waste_type = e.target.value; setManualEntries(n); }}
                  >
                    <option value="">Select Waste Type</option>
                    {wasteTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><Input type="number" placeholder="Qty" value={row.quantity} onChange={e => { const n = [...manualEntries]; n[idx].quantity = e.target.value; setManualEntries(n); }} /></div>
                <div className="col-span-2"><Input placeholder="Unit" value={row.unit} onChange={e => { const n = [...manualEntries]; n[idx].unit = e.target.value; setManualEntries(n); }} /></div>
                <div className="col-span-3">
                  <select title="Select Area" className="w-full h-10 bg-white border rounded-lg px-2 text-sm" value={row.area} onChange={e => { const n = [...manualEntries]; n[idx].area = e.target.value; setManualEntries(n); }}>
                    <option value="">Select Area</option>
                    {areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="col-span-1"><Button variant="ghost" onClick={() => setManualEntries(manualEntries.filter((_, i) => i !== idx))}><Trash2 size={16} className="text-red-500" /></Button></div>
              </div>
            ))}
            <Button variant="outline" className="rounded-xl border-dashed border-2 hover:bg-slate-50 transition-all" onClick={() => setManualEntries([...manualEntries, { waste_type: "", quantity: "", unit: "kg", area: "" }])}>+ Add More Row</Button>
          </div>
          <DialogFooter className="p-6 bg-slate-50 rounded-b-[2.5rem]">
            <Button className="bg-blue-600 text-white px-10 h-12 rounded-xl font-bold" onClick={handleManualSubmit} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="animate-spin" /> : "Save Records"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: BULK RANGE ENTRY --- */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden">
          <div className="bg-green-600 p-8 text-white">
            <DialogTitle className="text-2xl font-black">Bulk Range Entry</DialogTitle>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="grid grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold">WASTE TYPE</Label>
                <select
                  title="Select Waste Type"
                  className="w-full h-10 border rounded-lg px-3 text-sm bg-white"
                  value={bulkConfig.waste_type}
                  onChange={e => setBulkConfig({ ...bulkConfig, waste_type: e.target.value })}
                >
                  <option value="">Select Waste Type</option>
                  {wasteTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-1"><Label className="text-[10px] font-bold">UNIT</Label><Input placeholder="kg" value={bulkConfig.unit} onChange={e => setBulkConfig({ ...bulkConfig, unit: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-[10px] font-bold">AREA</Label>
                <select title="Select Area" className="w-full h-10 border rounded-lg px-3 text-sm bg-white" value={bulkConfig.area} onChange={e => setBulkConfig({ ...bulkConfig, area: e.target.value })}>
                  <option value="">Select Area</option>
                  {areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-[10px] font-bold">START DATE</Label><Input type="date" value={bulkConfig.start_date} onChange={e => setBulkConfig({ ...bulkConfig, start_date: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-[10px] font-bold">END DATE</Label><Input type="date" value={bulkConfig.end_date} onChange={e => setBulkConfig({ ...bulkConfig, end_date: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              {dateList.map((date) => {
                const ds = format(date, "yyyy-MM-dd");
                return (
                  <div key={ds} className="p-3 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:border-green-200">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">{format(date, "MMM dd, EEE")}</p>
                    <Input type="number" placeholder="0.00" value={dailyQuantities[ds] || ""} onChange={e => setDailyQuantities({ ...dailyQuantities, [ds]: e.target.value })} className="h-8 text-sm" />
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter className="p-6 bg-slate-50 border-t">
            <Button className="bg-green-600 text-white px-10 h-12 rounded-xl font-bold" onClick={handleBulkSubmit} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="animate-spin" /> : "Save Bulk Records"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- EDIT MODAL --- */}
      <Dialog open={editConfirm} onOpenChange={setEditConfirm}>
        <DialogContent className="max-w-md bg-white rounded-4xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white"><DialogTitle className="text-xl font-black">Edit Record</DialogTitle></div>
          <div className="p-8 space-y-6">
            <div className="space-y-1"><Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Status</Label>
              <select title="Select Status" className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-indigo-100" value={editSelectedData.status} onChange={e => setEditSelectedData({ ...editSelectedData, status: e.target.value })}>
                <option value="approved">Approved</option><option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</Label><Input type="number" className="h-12 rounded-2xl bg-slate-50 border-none" value={editSelectedData.quantity} onChange={e => setEditSelectedData({ ...editSelectedData, quantity: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit</Label><Input className="h-12 rounded-2xl bg-slate-50 border-none uppercase" value={editSelectedData.unit} onChange={e => setEditSelectedData({ ...editSelectedData, unit: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50">
            <Button onClick={() => handleEdit(editSelectedData)} disabled={actionLoading} className="bg-indigo-600 text-white w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs">
              {actionLoading ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageReportsTable;