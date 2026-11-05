'use client';
import { cn } from '../../lib/utils';
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ 
  columns, 
  data, 
  loading,
  onRowClick,
  actions = true,
  pagination = true,
  selectedIds = [],
  onToggleSelectAll,
  onToggleSelectRow
}) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {onToggleSelectAll !== undefined && (
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={onToggleSelectAll}
                    className="rounded-sm border-gray-300 text-polaris-primary focus:ring-polaris-primary cursor-pointer" 
                  />
                </th>
              )}
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={cn(
                    "px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
                    col.align === 'right' && "text-right"
                  )}
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                   <td colSpan={columns.length + 2} className="px-6 py-6 bg-card">
                      <div className="h-4 bg-muted rounded-sm w-full" />
                   </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-12 text-center text-muted-foreground italic">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr 
                  key={row._id || row.id || idx} 
                  className="hover:bg-muted/50 transition-colors group cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {onToggleSelectAll !== undefined && (
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(row._id || row.id)}
                        onChange={() => onToggleSelectRow?.(row._id || row.id)}
                        className="rounded-sm border-gray-300 text-polaris-primary focus:ring-polaris-primary cursor-pointer" 
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td 
                      key={col.key} 
                      className={cn(
                        "px-6 py-4 text-sm text-foreground",
                        col.align === 'right' && "text-right"
                      )}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="p-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-muted">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">1</span> of <span className="font-semibold text-foreground">10</span>
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-border bg-background rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1.5 border border-border bg-background rounded-md text-sm font-medium hover:bg-muted text-foreground">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
