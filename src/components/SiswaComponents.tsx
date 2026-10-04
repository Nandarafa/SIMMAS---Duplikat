'use client';

import { AlertCircle, CheckCircle, Clock, Eye, Trash2, Plus, Send, Edit2 } from 'lucide-react';
import React from 'react';

// Status Badge Component
export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const statusConfig: Record<string, { bg: string; text: string; dot: string; display: string }> = {
    approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-600', display: '✓ Disetujui' },
    revision: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-600', display: '⚠ Revisi' },
    pending: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-600', display: '○ Pending' },
    hadir: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-600', display: 'Hadir' },
    ditolak: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-600', display: 'Ditolak' },
    aktif: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-600', display: 'Aktif' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {label || config.display}
    </span>
  );
}

// Alert Card Component
export function AlertCard({ type = 'warning', title, message, action, actionLabel }: 
  { type?: 'warning' | 'info' | 'error' | 'success'; title: string; message: string; action?: () => void; actionLabel?: string }) {
  const typeConfig: Record<string, { bg: string; border: string; icon: string; text: string; textMain: string; button: string }> = {
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: 'text-yellow-600', text: 'text-yellow-700', textMain: 'text-yellow-900', button: 'bg-yellow-600 hover:bg-yellow-700' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', text: 'text-blue-700', textMain: 'text-blue-900', button: 'bg-blue-600 hover:bg-blue-700' },
    error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', text: 'text-red-700', textMain: 'text-red-900', button: 'bg-red-600 hover:bg-red-700' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', text: 'text-emerald-700', textMain: 'text-emerald-900', button: 'bg-emerald-600 hover:bg-emerald-700' },
  };

  const config = typeConfig[type];

  return (
    <div className={`card ${config.bg} border ${config.border} mb-6`}>
      <div className="flex gap-3">
        <AlertCircle className={`h-5 w-5 ${config.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`font-bold ${config.textMain}`}>{title}</h3>
          <p className={`text-sm ${config.text} mt-1`}>{message}</p>
          {action && (
            <button 
              onClick={action}
              className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.button} text-white text-sm font-semibold`}
            >
              <AlertCircle className="h-3.5 w-3.5" />
              {actionLabel || 'Action'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
export function StatCard({ icon: Icon, label, value, color = 'blue' }: 
  { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; color?: 'blue' | 'emerald' | 'yellow' | 'red' }) {
  const colorConfig: Record<string, string> = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };

  return (
    <div className="card">
      <div className="flex justify-between">
        <span className="text-xs uppercase font-bold text-slate-400">{label}</span>
        <Icon className={`h-5 w-5 ${colorConfig[color]}`} />
      </div>
      <p className="text-2xl font-extrabold mt-4">{value}</p>
    </div>
  );
}

// Info Row Component
export function InfoRow({ label, value, className = '' }: { label: string; value: string | React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">{label}</p>
      <p className="font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

// Journal Card Component
export function JournalCard({ journal, onView, onDelete }: 
  { journal: any; onView?: () => void; onDelete?: () => void }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs text-slate-500">{journal.date}</p>
          <h3 className="font-semibold mt-1">{journal.division}</h3>
        </div>
        <StatusBadge status={journal.status} />
      </div>
      <p className="text-sm text-slate-600 mb-3">{journal.activity_description}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Durasi: <span className="font-semibold">{journal.duration}</span>
        </p>
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={onView}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
            >
              <Eye className="h-3.5 w-3.5" />
              Lihat
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Attendance Row Component
export function AttendanceRow({ attendance }: { attendance: any }) {
  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="py-3 px-4 text-slate-900">{attendance.date}</td>
      <td className="py-3 px-4">
        <StatusBadge status={attendance.status} label="Hadir" />
      </td>
      <td className="py-3 px-4 text-slate-600">{attendance.check_in}</td>
      <td className="py-3 px-4 text-slate-600">{attendance.check_out || '-'}</td>
      <td className="py-3 px-4">
        <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100">
          <Eye className="h-3.5 w-3.5" />
          Lihat
        </button>
      </td>
    </tr>
  );
}

// Modal Component
export function Modal({ isOpen, onClose, title, children, footer }: 
  { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 className="font-bold text-lg">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="p-6 border-t bg-slate-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Form Input Component
export function FormInput({ label, name, type = 'text', placeholder, value, onChange, required = false }: 
  { label: string; name: string; type?: string; placeholder?: string; value: string; onChange: (val: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-semibold">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field mt-1"
        required={required}
      />
    </div>
  );
}

// Form Textarea Component
export function FormTextarea({ label, name, placeholder, value, onChange, required = false, rows = 4 }: 
  { label: string; name: string; placeholder?: string; value: string; onChange: (val: string) => void; required?: boolean; rows?: number }) {
  return (
    <div>
      <label className="text-sm font-semibold">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field mt-1 resize-none"
        required={required}
        rows={rows}
      />
    </div>
  );
}

// Section Card Component
export function SectionCard({ title, icon: Icon, children }: 
  { title: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="card">
      {title && (
        <h2 className="font-bold flex items-center gap-2 mb-6">
          {Icon && <Icon className="h-5 w-5 text-blue-600" />}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
