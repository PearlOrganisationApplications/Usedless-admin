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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="p-6 space-y-6">

      <div className="max-w-8xl mx-auto w-full  px-4">
       <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md">

    {/* Decorative half-curve on the right corner */}
    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-10" />

    {/* Thin accent bar on top */}
    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />

    <div className="relative flex items-center justify-between gap-4 px-6 py-6 sm:px-8">
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

        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
            Manage Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage waste collection reports
          </p>
        </div>
      </div>

      
    </div>
  </div>
</div>
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full mb-15 mt-15">
      <div className="relative w-full md:w-1/2 ">
          <Search className="absolute left-3 top-2.5 text-gray-500  " size={20} />
          <input type="text" placeholder="Search by location..." className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none" value={searchText} onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }} />
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
          {paginatedData?.map((item, index) => (
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
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span className="px-4 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Manage_reports;