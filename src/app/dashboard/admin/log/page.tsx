'use client';

import { useState } from 'react';
import { FileText, Search, Download, X, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import Pagination from '@/components/Pagination';
import Toast from '@/components/Toast';

interface LogEntry {
  id: string;
  tanggal: string;
  waktu: string;
  tipe: 'INFO' | 'WARN' | 'ERROR';
  aksi: string;
  target: string;
  role: string;
  ip: string;
}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const SAMPLE_LOGS: LogEntry[] = Array.from({ length: 30 }, (_, i) => ({
  id: generateId(),
  tanggal: '30 Sep 2026',
  waktu: `${String(13 - Math.floor(i / 5)).padStart(2, '0')}:${String(Math.abs(12 - (i % 5) * 2)).padStart(2, '0')}`,
  tipe: 'INFO',
  aksi: i === 0 ? 'SETTINGS_UPDATED' : 'LOGIN_SUCCESS',
  target: i === 0 ? 'settings@simmas.sch.id' : i % 3 === 1 ? 'guru@simmas.sch.id' : 'admin@simmas.sch.id',
  role: i % 3 === 1 ? 'admin' : 'admin',
  ip: `127.0.0.1`,
}));

const typeColors: Record<string, string> = {
  INFO: 'bg-blue-100 text-blue-700',
  WARN: 'bg-amber-100 text-amber-700',
  ERROR: 'bg-red-100 text-red-700',
};

/* ── Detail modal ── */
function LogDetailModal({ log, onClose }: { log: LogEntry; onClose: () => void }) {
  const json = JSON.stringify(
    {
      id: log.id,
      timestamp: `2026-09-30T${log.waktu}:38.078769+00:00`,
      level: log.tipe,
      actionType: log.aksi,
      actor: {
        role: log.role,
        identifier: log.target,
      },
      target: 'AUTH',
      metadata: {
        passwordLength: 11,
      },
      ipAddress: log.ip,
    },
    null,
    2
  );

  // Simple syntax highlight: strings cyan, keys white, numbers/booleans orange
  const highlighted = json
    .replace(/("[\w@.\-/]+")\s*:/g, '<span class="text-white font-semibold">$1</span>:')
    .replace(/:\s*(".*?")/g, ': <span class="text-cyan-400">$1</span>')
    .replace(/:\s*(\d+)/g, ': <span class="text-orange-400">$1</span>');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">Detail Log Activity</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeColors[log.tipe]}`}>
              {log.tipe}
            </span>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* ID subtitle */}
        <div className="px-5 py-2 border-b border-slate-100 bg-slate-50">
          <p className="text-[11px] text-slate-400 font-mono">ID: {log.id}</p>
        </div>

        {/* Dark JSON block */}
        <div className="p-4">
          <div className="bg-[#0d1117] rounded-xl p-4 overflow-x-auto max-h-80 overflow-y-auto">
            <pre
              className="text-[12px] leading-relaxed font-mono text-slate-300 whitespace-pre"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLogPage() {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [logs, setLogs] = useState(SAMPLE_LOGS);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = logs.filter(l =>
    (!search || l.aksi.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase())) &&
    (filterLevel === 'all' || l.tipe === filterLevel)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handleClearLog = () => {
    setLogs([]);
    setShowClearConfirm(false);
    setToast({ type: 'success', message: 'Semua log aktivitas berhasil dihapus!' });
  };

  return (
    <AdminLayout title="Log Aktivitas & Audit">
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Log Aktivitas &amp; Audit
          </h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari aksi atau user..."
                className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-56"
              />
            </div>
            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="all">Semua Level →</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
            <div className="ml-auto flex items-center gap-2">
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
              >
                <Trash2 className="h-3.5 w-3.5" />Clear Log
              </button>
              <button className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 px-3.5 py-2 rounded-xl text-xs font-semibold transition">
                <Download className="h-3.5 w-3.5" />Download Log
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Waktu</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Level</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Pengguna</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">IP Address</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-xs text-slate-500">
                      {log.tanggal}<br />{log.waktu}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeColors[log.tipe] || 'bg-slate-100 text-slate-600'}`}>
                        {log.tipe}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs font-semibold text-slate-800 font-mono">{log.aksi}</td>
                    <td className="py-3 px-3 text-xs text-slate-600">
                      {log.target}<br />
                      <span className="text-slate-400">{log.role}</span>
                    </td>
                    <td className="py-3 px-3 text-xs font-mono text-slate-500">{log.ip}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
                      >
                        Periksa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Detail log modal */}
      {selectedLog && (
        <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}

      {/* Clear log confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Hapus Semua Log</h3>
              </div>
              <button onClick={() => setShowClearConfirm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 mb-4">
                Anda akan menghapus <strong>semua log aktivitas</strong> yang tercatat dalam sistem.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <span className="text-red-600 font-bold text-xs mt-0.5">⚠</span>
                <p className="text-xs text-red-700">
                  <strong>Peringatan:</strong> Tindakan ini tidak dapat dibatalkan. Semua riwayat aktivitas akan hilang permanen.
                </p>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3 border-t border-slate-100 pt-4">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm">
                Batal
              </button>
              <button onClick={handleClearLog} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition">
                Hapus Semua Log
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
