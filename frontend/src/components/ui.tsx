// Shared UI components

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { HikingStatus } from '../data/index';

// ── Status Badge ──────────────────────────────────────────
export const StatusBadge: React.FC<{ status: HikingStatus; className?: string }> = ({ status, className = '' }) => {
  if (status === 'OPEN') return (
    <span className={`badge-open ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Buka
    </span>
  );
  if (status === 'LIMITED') return (
    <span className={`badge-limited ${className}`}>
      <AlertTriangle className="w-3 h-3" />
      Terbatas
    </span>
  );
  return (
    <span className={`badge-closed ${className}`}>
      <XCircle className="w-3 h-3" />
      Tutup
    </span>
  );
};

// ── Quota Bar ─────────────────────────────────────────────
export const QuotaBar: React.FC<{ available: number; total: number; status: HikingStatus }> = ({ available, total, status }) => {
  const pct = total > 0 ? (available / total) * 100 : 0;
  const color = status === 'OPEN' ? 'bg-emerald-500' : status === 'LIMITED' ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-charcoal font-medium">{available.toLocaleString('id-ID')} tersedia</span>
        <span className="text-muted">/{total.toLocaleString('id-ID')}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.max(pct, status === 'CLOSED' ? 0 : 2)}%` }} />
      </div>
    </div>
  );
};

// ── Difficulty Badge ─────────────────────────────────────
export const DifficultyBadge: React.FC<{ level: string }> = ({ level }) => {
  const cls = level === 'Mudah' ? 'difficulty-easy' : level === 'Sedang' ? 'difficulty-medium' : level === 'Menantang' ? 'difficulty-hard' : 'difficulty-extreme';
  return <span className={cls}>{level}</span>;
};

// ── Section Header ────────────────────────────────────────
export const SectionHeader: React.FC<{ label?: string; title: string; subtitle?: string; center?: boolean; className?: string }> = ({ label, title, subtitle, center, className = '' }) => (
  <div className={`${center ? 'text-center' : ''} ${className}`}>
    {label && <div className={`section-label mb-2 ${center ? 'mx-auto w-fit' : ''}`}>{label}</div>}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal leading-tight mb-1.5">{title}</h2>
    {subtitle && <p className="text-muted text-sm sm:text-base max-w-2xl leading-relaxed" style={center ? { marginLeft: 'auto', marginRight: 'auto' } : {}}>{subtitle}</p>}
  </div>
);

// ── Empty State ───────────────────────────────────────────
export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#F8F9F5] border border-black/5 flex items-center justify-center mb-4 text-muted">
      {icon}
    </div>
    <h3 className="text-base font-bold text-charcoal mb-2">{title}</h3>
    <p className="text-sm text-muted max-w-xs mb-5">{description}</p>
    {action}
  </div>
);

// ── Booking Status Badge ─────────────────────────────────
export const BookingStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING_PAYMENT: { label: 'Menunggu Pembayaran', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    PROCESSING: { label: 'Diproses', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    PAID: { label: 'Terbayar', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    CANCELLED: { label: 'Dibatalkan', cls: 'bg-red-50 text-red-700 border-red-200' },
    COMPLETED: { label: 'Selesai', cls: 'bg-[#173F35]/10 text-[#173F35] border-[#173F35]/20' },
  };
  const cfg = map[status] ?? { label: status, cls: 'bg-gray-50 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

// ── Loading Spinner ───────────────────────────────────────
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12';
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${s} border-2 border-[#B8D986] border-t-[#173F35] rounded-full animate-spin`} />
    </div>
  );
};
