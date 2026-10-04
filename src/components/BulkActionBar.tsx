import { X, RefreshCw, Trash2 } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onChangeStatus?: () => void;
  onDelete: () => void;
}

export default function BulkActionBar({ selectedCount, onClear, onChangeStatus, onDelete }: BulkActionBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
        <button onClick={onClear} className="hover:bg-slate-800 p-1.5 rounded-lg transition">
          <X className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold">{selectedCount} dipilih</span>
        <div className="h-4 w-px bg-slate-700" />
        {onChangeStatus && (
          <button
            onClick={onChangeStatus}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Ubah Status
          </button>
        )}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Hapus
        </button>
      </div>
    </div>
  );
}
