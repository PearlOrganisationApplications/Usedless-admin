import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Search, Download, 
  Filter, MoreVertical, ArrowUp, ArrowDown 
} from 'lucide-react';
import { cn } from '@/utils';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  gridTemplateColumns: string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  gridTemplateColumns,
  onRowClick,
  isLoading
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = (data || []).filter(item => 
    item && Object.values(item).some(val => 
      val !== null && val !== undefined && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToCSV = () => {
    const headers = columns.map(c => c.header).join(',');
    const rows = filteredData.map(item => 
      columns.map(c => {
        const val = item[c.accessor];
        return typeof val === 'object' ? JSON.stringify(val) : String(val);
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search all records..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-white transiton-colors"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Header */}
      <div 
        className="grid px-6 py-3 bg-slate-50 border-b border-slate-200 gap-4"
        style={{ gridTemplateColumns }}
      >
        {columns.map((col, k) => (
          <div key={k} className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            {col.header}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-slate-100/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div 
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "grid px-6 py-4 border-b border-slate-100 last:border-0 items-center gap-4 transition-colors",
                onRowClick ? "cursor-pointer hover:bg-slate-50/80" : "hover:bg-slate-50/30"
              )}
              style={{ gridTemplateColumns }}
            >
              {columns.map((col, k) => (
                <div key={k} className="text-sm text-slate-700 truncate">
                  {col.render ? col.render(item[col.accessor], item) : String(item[col.accessor])}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="p-20 text-center text-slate-400">
            No records found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white text-sm">
        <p className="text-slate-500">
          Showing <span className="font-medium">{filteredData.length}</span> results
        </p>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-30" disabled>
            <ChevronLeft size={18} />
          </button>
          {[1, 2, 3].map(p => (
            <button key={p} className={cn(
              "w-8 h-8 rounded-lg font-medium",
              p === 1 ? "bg-primary text-white" : "hover:bg-slate-100 text-slate-600"
            )}>
              {p}
            </button>
          ))}
          <button className="p-2 hover:bg-slate-100 rounded-lg">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
