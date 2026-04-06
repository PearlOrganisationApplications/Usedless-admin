"use client";

import { useEffect, useState } from "react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { dashboardService } from "@/api/controller/dashboardService";
import { handle_client } from "@/api/controller/clientController";
import {
  Download, Loader2, Trash2, Trees,
  CloudSun, Users, LogIn, MapPin,
  ChevronDown, ChevronUp, MapPinOff, Info
} from "lucide-react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "6 Month", value: "6month" },
  { label: "Year", value: "year" },
];

const COLORS = [
  "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#F97316", "#14B8A6", "#64748B"
];

export default function Dashboard() {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isClientUser, setIsClientUser] = useState(false);

  // Identity & Location States
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("all");
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("all");

  // Analytics Data States
  const [pieData, setPieData] = useState<any[]>([]);
  const [dryWasteOnly, setDryWasteOnly] = useState<any[]>([]);
  const [allWasteTypes, setAllWasteTypes] = useState<any[]>([]);
  const [ecoSummary, setEcoSummary] = useState({ landfill: 0, trees: 0, mtco2: 0 });

  // Missed Punches
  const [missedPunches, setMissedPunches] = useState<{ count: number, locations: string[] }>({
    count: 0,
    locations: []
  });
  const [showMissedDetails, setShowMissedDetails] = useState(false);

  // Initial Data Load
  useEffect(() => {
    const rawRole = (localStorage.getItem("role") || "").toLowerCase();
    if (rawRole === "admin" || rawRole === "administrator") {
      dashboardService.getClients().then(setClients);
      dashboardService.getLocations().then(setLocations);
      dashboardService.getMissedPunches().then((data) => {
        if (data?.status === "success") {
          setMissedPunches({ count: data.missed_count, locations: data.missed_locations });
        }
      });
    }
  }, []);

  // Main Data Fetching Logic
  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const role = localStorage.getItem("role") || "administrator";
        let data;
        if (selectedLocationId !== "all") {
          
          data = await dashboardService.getLocationAnalytics(selectedLocationId);
        } else {
         
          data = await dashboardService.getDashboardData(filter, role, selectedClientId);
        }
         console.log("API DATA all:", data);
        setIsClientUser(data.isClient);
        setPieData(data.pieData);
        setDryWasteOnly(data.dryWasteOnly);
        setAllWasteTypes(data.allWasteTypes);
        setEcoSummary(data.ecoSummary);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [filter, selectedClientId, selectedLocationId]);

  // --- PDF GENERATION ---
  const generateReportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const themeGreen: [number, number, number] = [45, 90, 39];
    const lightGreen: [number, number, number] = [235, 245, 233];

    const locName = locations.find(l => l.id == selectedLocationId)?.name || "Global Network Summary";
    const totalQty = allWasteTypes.reduce((acc, curr) => acc + curr.value, 0).toFixed(2);

    // --- PAGE 1 HEADER ---
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Waste Management Report", 15, 20);

    doc.setFillColor(themeGreen[0], themeGreen[1], themeGreen[2]);
    doc.rect(15, 28, pageWidth - 30, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text("Waste Generation & Processing Summary", 20, 33.5);

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text(`Site Name: ${locName}`, 15, 45);
    doc.text(`Location ID: ${selectedLocationId}`, 15, 51);
    doc.text(`Total Waste Generated (kg): ${totalQty}`, 15, 57);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 45);
    doc.text(`Filter: ${filter.toUpperCase()}`, 140, 51);

    doc.setTextColor(themeGreen[0], themeGreen[1], themeGreen[2]);
    doc.setFontSize(12);
    doc.text("Waste Generation Overview", 15, 72);

    const tableData = allWasteTypes.map(item => [
      item.name,
      `${item.value.toFixed(2)} kg`,
      `${((item.value / (parseFloat(totalQty) || 1)) * 100).toFixed(1)}%`
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["Waste Category", "Quantity", "Share %"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: themeGreen },
      styles: { fontSize: 9 },
      margin: { bottom: 30 } // Leave space for footer
    });

    // --- SMART POSITIONING FOR IMPACT BOX ---
    let finalY = (doc as any).lastAutoTable.finalY;

    // If the table ended too low (near the footer at 285), move the box to a new page
    if (finalY > 230) {
      doc.addPage();
      finalY = 20;
    }

    const boxY = finalY + 10;
    doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
    doc.roundedRect(15, boxY, pageWidth - 30, 30, 3, 3, "F");

    doc.setTextColor(themeGreen[0], themeGreen[1], themeGreen[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("ENVIRONMENTAL IMPACT METRICS (APPROVED)", 20, boxY + 8);

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    // Adjusted coordinates to prevent horizontal overlap
    doc.text(`Landfill Saved: ${ecoSummary.landfill.toFixed(2)} kg`, 20, boxY + 18);
    doc.text(`Trees Saved: ${ecoSummary.trees.toFixed(2)}`, 80, boxY + 18);
    doc.text(`Carbon Reduced: ${ecoSummary.mtco2.toFixed(3)} MTCO2`, 135, boxY + 18);

    // --- FOOTER (Page 1) ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated via Waste Dashboard | Professional Environment Report", 15, pageHeight - 10);

    // --- PAGE 2 ---
    doc.addPage();
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(20);
    doc.text("Environmental Impact & Compliance", 15, 20);

    doc.setFillColor(themeGreen[0], themeGreen[1], themeGreen[2]);
    doc.rect(15, 28, pageWidth - 30, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text("Recycling & Channelization Details", 20, 33.5);

    autoTable(doc, {
      startY: 45,
      head: [["Waste Stream", "Processing methods", "Authorized Disposal"]],
      body: [
        ["Wet Waste", "Composting / Biogas", "Organic Manure"],
        ["Dry Waste", "Baling & Segregation", "Authorized Recyclers"],
        ["Biomedical", "Incineration", "State Board Approved"],
        ["Hazardous", "Secured Landfill", "Authorized TSDF"]
      ],
      headStyles: { fillColor: themeGreen }
    });

    let currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.setTextColor(themeGreen[0], themeGreen[1], themeGreen[2]);
    doc.setFontSize(14);
    doc.text("Compliance Declaration", 15, currentY);
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text("Management confirms that waste collection and recycling processes follow", 15, currentY + 8);
    doc.text("all current Solid Waste Management (SWM) Rules and local authority guidelines.", 15, currentY + 13);

    doc.text("- Recycling Certificates Available", 20, currentY + 25);
    doc.text("- Audit Ready Documentation", 20, currentY + 31);
    doc.text("- Tracking Records Maintained", 110, currentY + 25);
    doc.text("- Environmental Reporting Standard", 110, currentY + 31);

    // Bottom Banner
    doc.setFillColor(themeGreen[0], themeGreen[1], themeGreen[2]);
    doc.rect(0, pageHeight - 22, pageWidth, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("ViaGreen Environmental Solutions | www.viagreen.com", 15, pageHeight - 10);

    doc.save(`Waste_Report_${locName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleIdentitySwitch = async () => {
    if (selectedClientId === "all") return;
    setLoginLoading(true);
    await handle_client.generateTempLoginLink(Number(selectedClientId));
    setLoginLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">

      {/* HEADER SECTION */}
      <div className="flex flex-wrap justify-between items-center mb-10 gap-4 bg-white p-5 rounded-4xl shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100">
              <MapPin size={16} className="text-blue-600 mr-2" />
              <select
                aria-label="Select Location"
                title="Select Location"
                value={selectedLocationId}
                onChange={(e) => {
                  setSelectedLocationId(e.target.value);
                  setSelectedClientId("all");
                }}
                className="bg-transparent text-xs font-black text-blue-900 outline-none cursor-pointer py-1 pr-2 uppercase tracking-tight"
              >
                <option value="all">Global View (All Sites)</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {!isClientUser && selectedLocationId === "all" && (
            <div className="flex items-center gap-2">
              <div className="relative flex items-center bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                <Users size={16} className="text-slate-400 mr-2" />
                <select
                  aria-label="Select Client"
                  title="Select Client"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer py-1.5 pr-2"
                >
                  <option value="all">All Clients</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.first_name} {client.last_name}</option>
                  ))}
                </select>
              </div>
              {selectedClientId !== "all" && (
                <button onClick={handleIdentitySwitch} className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm">
                  {loginLoading ? <Loader2 size={12} className="animate-spin" /> : <LogIn size={12} />}
                  LOGIN AS CLIENT
                </button>
              )}
            </div>
          )}

          {selectedLocationId === "all" && (
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f.value ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:bg-white/50"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={generateReportPDF}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase hover:bg-black transition-all shadow-lg active:scale-95"
        >
          <Download size={14} /> Download PDF
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      )}

      {/* ALERT SECTION */}
      {!isClientUser && missedPunches.count > 0 && selectedLocationId === "all" && (
        <div className="bg-red-50 border border-red-100 rounded-[2.5rem] shadow-sm overflow-hidden mb-10 transition-all">
          <button onClick={() => setShowMissedDetails(!showMissedDetails)} className="w-full flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-2.5 rounded-xl text-white shadow-md"><MapPinOff size={22} /></div>
              <div>
                <h3 className="text-red-900 font-black uppercase text-sm tracking-tight">{missedPunches.count} Sites missed today</h3>
                <p className="text-red-600/70 text-[10px] font-bold uppercase">Click to view details</p>
              </div>
            </div>
            <div className="bg-white p-2 rounded-full text-red-500 border border-red-100">
              {showMissedDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>
          {showMissedDetails && (
            <div className="px-6 pb-8 border-t border-red-100 pt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {missedPunches.locations.map((loc, i) => (
                <div key={i} className="bg-white border border-red-100 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span> {loc}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="bg-white rounded-[2.5rem] border-t-[6px] border-emerald-500 shadow-sm p-8 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="max-w-xs text-center lg:text-left">
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Sustainability Impact</h2>
            <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Calculated based on {selectedLocationId === "all" ? "global" : "site"} metrics</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 w-full lg:w-auto">
            <ImpactBox icon={<Trash2 size={24} />} label="Landfill Saved" value={ecoSummary.landfill.toFixed(2)} unit="kg" />
            <ImpactBox icon={<Trees size={24} />} label="Trees Saved" value={ecoSummary.trees.toFixed(2)} unit="Trees" />
            <ImpactBox icon={<CloudSun size={24} />} label="CO2 Reduced" value={ecoSummary.mtco2.toFixed(3)} unit="Tons" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Waste Category Ratio</h3>
              <Info size={14} className="text-slate-300" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(v: any) => [`${parseFloat(v).toFixed(1)} kg`, 'Quantity']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center flex-wrap gap-4 mt-4">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Waste Type Breakdown</h3>
              <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase">Unit: kg</div>
            </div>
            <div className="h-[300px]">
              {allWasteTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={allWasteTypes.slice(0, 10)}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={25}>
                      {allWasteTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">No data found</div>
              )}
            </div>
          </div>
        </div>

        {/* FULL WIDTH GRAPH */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="mb-10 flex flex-col items-center text-center">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Full Site Analysis Breakdown</h3>
            <div className="h-1.5 w-16 bg-blue-600 mt-3 rounded-full"></div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allWasteTypes} margin={{ bottom: 80 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-90} textAnchor="end" interval={0} tick={{ fontSize: 8, fontWeight: 800, fill: '#64748b' }} height={100} axisLine={false} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
                  {allWasteTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpactBox({ icon, label, value, unit }: any) {
  return (
    <div className="bg-slate-50 rounded-3xl border border-white flex items-center p-5 min-w-[220px] gap-4 shadow-sm group hover:scale-105 transition-transform duration-300">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-800 tracking-tight">{value}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
}