'use client';

/**
 * SkeletonLoader components - Skeleton loading states for various UI elements
 */

/**
 * CardSkeleton - Loading skeleton for dashboard cards
 */
export function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-3 bg-slate-200 rounded w-24" />
        <div className="h-8 w-8 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-9 bg-slate-200 rounded w-16 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-32" />
    </div>
  );
}

/**
 * TableRowSkeleton - Loading skeleton for table rows
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-3">
          <div className="h-4 bg-slate-200 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * ListItemSkeleton - Loading skeleton for list items
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200 rounded w-3/4" />
        <div className="h-2 bg-slate-200 rounded w-1/2" />
      </div>
      <div className="h-3 bg-slate-200 rounded w-12" />
    </div>
  );
}

/**
 * ChartSkeleton - Loading skeleton for charts
 */
export function ChartSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
          <div className="h-3 bg-slate-200 rounded w-48" />
        </div>
      </div>
      <div className="space-y-3 mt-6">
        {[60, 80, 40, 90, 50].map((height, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 bg-slate-200 rounded w-16" />
            <div className="flex-1 h-3 bg-slate-200 rounded" style={{ width: `${height}%` }} />
            <div className="h-3 bg-slate-200 rounded w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * FormSkeleton - Loading skeleton for forms
 */
export function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-24" />
          <div className="h-10 bg-slate-200 rounded w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <div className="h-10 bg-slate-200 rounded flex-1" />
        <div className="h-10 bg-slate-200 rounded flex-1" />
      </div>
    </div>
  );
}
