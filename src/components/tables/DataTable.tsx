import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  gridTemplateColumns: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  gridTemplateColumns,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div 
        className="grid border-b border-slate-100 bg-slate-50/50 px-6 py-4"
        style={{ gridTemplateColumns }}
      >
        {columns.map((col, idx) => (
          <div key={idx} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {col.header}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 font-bold">
            No records found.
          </div>
        ) : (
          data.map((item) => (
            <div 
              key={item.id}
              className="grid px-6 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors items-center"
              style={{ gridTemplateColumns }}
            >
              {columns.map((col, idx) => (
                <div key={idx} className="text-sm font-medium text-slate-600">
                  {col.render ? col.render(item[col.accessor], item) : (item[col.accessor] as React.ReactNode)}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
