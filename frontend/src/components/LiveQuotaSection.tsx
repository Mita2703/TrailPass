import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle, XCircle, MinusCircle, ArrowRight, Users, Clock } from 'lucide-react';
import { LiveQuotaItem, HikingStatus } from '../types';
import { LIVE_QUOTA_DATA } from '../data/quotaData';

const StatusBadge: React.FC<{ status: HikingStatus; label: string }> = ({ status, label }) => {
  const config = {
    TERSEDIA: {
      dot: 'bg-emerald-500',
      pill: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle,
      pulse: true,
    },
    KUOTA_TERBATAS: {
      dot: 'bg-amber-500',
      pill: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertCircle,
      pulse: false,
    },
    PENUH: {
      dot: 'bg-red-500',
      pill: 'bg-red-50 text-red-800 border-red-200',
      icon: XCircle,
      pulse: false,
    },
    DITUTUP: {
      dot: 'bg-stone-400',
      pill: 'bg-stone-100 text-stone-600 border-stone-200',
      icon: MinusCircle,
      pulse: false,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${config.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.pulse ? 'animate-pulse' : ''}`} />
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const QuotaBar: React.FC<{ available: number; total: number; status: HikingStatus }> = ({
  available,
  total,
  status,
}) => {
  const pct = total > 0 ? Math.round((available / total) * 100) : 0;
  const barColor =
    status === 'TERSEDIA'
      ? 'bg-emerald-500'
      : status === 'KUOTA_TERBATAS'
      ? 'bg-amber-500'
      : status === 'PENUH'
      ? 'bg-red-400'
      : 'bg-stone-300';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-stone-700">
          {available.toLocaleString('id-ID')} tersedia
        </span>
        <span className="text-stone-400">{total.toLocaleString('id-ID')} total</span>
      </div>
      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[10px] text-stone-400">{pct}% kapasitas tersisa</div>
    </div>
  );
};

const QuotaCard: React.FC<{ item: LiveQuotaItem }> = ({ item }) => {
  return (
    <div className={`group bg-white rounded-2xl border p-4 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 ${
      item.status === 'DITUTUP' ? 'border-stone-200 opacity-70' :
      item.status === 'PENUH' ? 'border-red-100' :
      item.status === 'KUOTA_TERBATAS' ? 'border-amber-100' :
      'border-emerald-100/80'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-extrabold text-stone-900 leading-tight">{item.mountainName}</h3>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">{item.trailName}</p>
        </div>
        <StatusBadge status={item.status} label={item.statusLabel} />
      </div>

      {item.status !== 'DITUTUP' && (
        <div className="mb-3">
          <QuotaBar available={item.availableQuota} total={item.totalQuota} status={item.status} />
        </div>
      )}

      {item.status === 'DITUTUP' && (
        <div className="mb-3 py-2 px-3 bg-stone-50 rounded-xl text-xs text-stone-500 font-medium">
          Jalur tidak dapat dipesan saat ini
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
          <Clock className="w-3 h-3" />
          Diperbarui {item.lastUpdated}
        </div>
        {item.bookingAvailable ? (
          <button className="flex items-center gap-1 text-[11px] font-bold text-[#114232] hover:text-lime-700 group/btn transition-colors">
            Pesan Sekarang
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-stone-400">Tidak tersedia</span>
        )}
      </div>
    </div>
  );
};

export const LiveQuotaSection: React.FC = () => {
  const displayItems = LIVE_QUOTA_DATA.slice(0, 6);
  const lastUpdated = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <section id="kuota" className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3.5 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Live Update</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0C2B1E] leading-tight tracking-tight mb-3">
              Pantau Kuota, Rencanakan Petualangan.
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              Temukan informasi ketersediaan kuota dan status jalur pendakian sebelum berangkat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-soft">
              <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
              <span>Terakhir diperbarui: <span className="font-bold text-stone-700">{lastUpdated} WIB</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { status: 'TERSEDIA' as HikingStatus, label: 'Tersedia', color: 'bg-emerald-500' },
            { status: 'KUOTA_TERBATAS' as HikingStatus, label: 'Kuota Terbatas', color: 'bg-amber-500' },
            { status: 'PENUH' as HikingStatus, label: 'Penuh', color: 'bg-red-400' },
            { status: 'DITUTUP' as HikingStatus, label: 'Ditutup', color: 'bg-stone-400' },
          ].map((item) => (
            <div key={item.status} className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {displayItems.map((item) => (
            <QuotaCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => document.getElementById('gunung')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2.5 bg-[#114232] hover:bg-[#0c3125] text-white font-bold px-7 py-3.5 rounded-xl shadow-md shadow-[#114232]/20 hover:shadow-lg transition-all group border border-emerald-700/40 text-sm"
          >
            <Users className="w-4 h-4 text-lime-400" />
            Lihat Semua Kuota &amp; Destinasi
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
