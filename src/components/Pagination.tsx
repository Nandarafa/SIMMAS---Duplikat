import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span>Menampilkan {startItem}-{endItem} dari {totalItems} data</span>
        <span className="mx-2 text-slate-300">|</span>
        <span>Baris per halaman:</span>
        <select
          value={itemsPerPage}
          onChange={e => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4 text-slate-600" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        </button>
        
        <span className="px-3 py-1 text-xs font-semibold text-slate-700">
          {currentPage} / {totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
