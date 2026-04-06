"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ManageReportsTable from "../../pages/ManageReports/Page";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Search, Loader2, Calendar as CalendarIcon, FilterX } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { manage_waste } from "@/api/controller/wasteController";

const ADMIN_ROLES = ["admin", "administrator"];

const Manage_reports = () => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any[] | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [isTodayOnly, setIsTodayOnly] = useState(false);

  const fetchReports = useCallback(async (dateObj?: Date) => {
    setLoading(true);
    try {
      const dateString = dateObj ? format(dateObj, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");

      const [locationsFromSummary, allWastes] = await Promise.all([
        manage_waste.getLocationSummary(dateString),
        manage_waste.getAllWaste(dateString)
      ]);

      const mergedData = [...locationsFromSummary];

      allWastes.forEach((waste: any) => {
        const locName = waste.location?.toLowerCase();
        const exists = mergedData.find(item => item.name?.toLowerCase() === locName);

        if (!exists) {
          const placeWastes = allWastes.filter((w: any) => w.location?.toLowerCase() === locName);
          mergedData.push({
            id: waste.location_id || waste.id,
            name: waste.location,
            counts: {
              today: placeWastes.length,
              approved: placeWastes.filter((w: any) => w.status === "approved").length,
              rejected: placeWastes.filter((w: any) => w.status === "rejected").length,
              pending: placeWastes.filter((w: any) => w.status === "pending").length,
            }
          });
        }
      });

      setData(mergedData);
    } catch (error) {
      toast.error("Error fetching reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role")?.toLowerCase();
      if (role && !ADMIN_ROLES.includes(role)) {
        router.replace("/");
        return;
      }
    }
    fetchReports(filterDate);
  }, [filterDate, fetchReports, router]);

  const handleOpenModal = (report: any) => {
    setSelectedReport([report]);
    setOpen(true);
  };

  const filteredData = data.filter((item) =>
    item?.name?.toLowerCase()?.includes(searchText.toLowerCase())
  );



  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-4 max-w-6xl mx-auto w-full">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          <input type="text" placeholder="Search by location..." className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant={isTodayOnly ? "default" : "outline"} className={cn("rounded-lg h-10 px-4", isTodayOnly && "bg-blue-600 text-white")} onClick={() => { const next = !isTodayOnly; setIsTodayOnly(next); if (next) setFilterDate(new Date()); else setFilterDate(undefined); }}>Today</Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-lg h-10 flex gap-2">
                <CalendarIcon size={18} /> {filterDate ? format(filterDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={filterDate} onSelect={(d) => { setFilterDate(d); setIsTodayOnly(false); }} initialFocus />
            </PopoverContent>
          </Popover>
          {(filterDate || isTodayOnly) && (
            <Button variant="outline" className="text-red-500 h-10 w-10 p-0 border-none shadow-none hover:bg-red-50" onClick={() => { setIsTodayOnly(false); setFilterDate(undefined); }}>
              <FilterX size={20} />
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Syncing dashboard...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData?.map((item, index) => (
            <Card key={index} className="rounded-2xl shadow-md border bg-white pt-5">
              <CardContent className="p-5 space-y-3">
                <p className="text-lg font-semibold">📍 Place: {item?.name?.toUpperCase()}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Total Reports</span>
                    <span className="font-bold text-gray-800">{item.counts?.today ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-50 p-2 rounded-lg text-green-700">
                    <span className="text-sm font-medium">Approved</span>
                    <span className="font-bold">{item.counts?.approved ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center bg-red-50 p-2 rounded-lg text-red-700">
                    <span className="text-sm font-medium">Rejected</span>
                    <span className="font-bold">{item.counts?.rejected ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center bg-yellow-50 p-2 rounded-lg text-yellow-700">
                    <span className="text-sm font-medium">Pending</span>
                    <span className="font-bold">{item.counts?.pending ?? 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button className="w-full rounded-xl bg-slate-900 text-white" onClick={() => handleOpenModal(item)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-xl font-bold">Waste Collection Details</DialogTitle>
            <DialogDescription>Reviewing records for {selectedReport?.[0]?.name}</DialogDescription>
          </DialogHeader>
          <div className="p-6">
            {selectedReport && selectedReport.length > 0 && (
              <ManageReportsTable
                data={selectedReport}
                refreshParent={() => fetchReports(filterDate)}
                initialDate={filterDate}
              />
            )}
          </div>
          <DialogFooter className="p-6 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Manage_reports;