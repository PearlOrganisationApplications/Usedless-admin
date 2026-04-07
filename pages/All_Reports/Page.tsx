"use client";
import React, { useState } from "react";
import { Pencil, QrCode, Trash2, MapPin, Tag } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import QrModal from "@/components/Modal/QrModal";

export default function All_Reports_Table({ active, data = [], setEditItem, setOpenModal, setSelectedId, handleDelete }: any) {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const role = typeof window !== "undefined" ? localStorage.getItem("role")?.toLowerCase() : null;
  const isAdmin = role === "admin" || role === "administrator";


  
  return (
    <div className="w-full rounded-[2.5rem] border border-slate-100 p-6 bg-white mt-4 shadow-xl shadow-slate-200/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 border-none">
            <TableHead className="w-20px font-black text-[10px] uppercase tracking-widest text-slate-400 pl-8">#</TableHead>
            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
              {active ? "Place / Location Details" : "Waste Material Type"}
            </TableHead>
            <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item: any, index: number) => (
              <TableRow key={item.id || index} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                <TableCell className="text-slate-300 font-bold pl-8">{(index + 1).toString().padStart(2, '0')}</TableCell>
                <TableCell>
                  <div className="font-black text-slate-800 uppercase text-xs">{item.name || "Unnamed"}</div>
                  {active && item.areas && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.areas.map((area: any, i: number) => (
                        <span key={i} className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                          {typeof area === 'string' ? area : area.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {!active && item.category_name && (
                    <div className="mt-1">
                      <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">
                        {item.category_name}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex gap-2 justify-end">
                    {active && (
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-600 transition-all" onClick={() => { setSelectedItem(item); setQrModalOpen(true); }} title="QR Code"><QrCode size={16} /></button>
                    )}
                    {isAdmin && (
                      <>
                        <button title="btn" className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all" onClick={() => { setSelectedId(item.id); setEditItem(item); setOpenModal(true); }}><Pencil size={16} /></button>
                        <button title="btn" className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={3} className="text-center py-24 text-slate-300 font-black uppercase tracking-widest text-xs">No Data Available</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      {qrModalOpen && <QrModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} item={selectedItem} />}
    </div>
  );
}