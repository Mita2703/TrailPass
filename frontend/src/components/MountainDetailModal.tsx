import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { Mountain, TrailInfo } from '../types';

interface MountainDetailModalProps {
  mountain: Mountain | null;
  onClose: () => void;
  onStartBooking: (mountain: Mountain, trail: TrailInfo, date: string) => void;
}

export const MountainDetailModal: React.FC<MountainDetailModalProps> = ({
  mountain,
  onClose,
  onStartBooking,
}) => {
  if (!mountain) return null;

  const [selectedTrail, setSelectedTrail] = useState<TrailInfo>(mountain.trails[0] || null);
  const [activeTab, setActiveTab] = useState<'jalur' | 'simaksi' | 'galeri'>('jalur');

  // Generate 14 days calendar starting today
  const today = new Date();
  const calendarDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    // Mock quota calculation based on day
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const remaining = isWeekend ? Math.max(0, 45 - i * 3) : Math.max(10, 120 - i * 4);
    const total = 150;
    return {
      date: dateStr,
      dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('id-ID', { month: 'short' }),
      remaining,
      total,
      isAvailable: remaining > 0,
      isWeekend,
    };
  });

  const [selectedDate, setSelectedDate] = useState<string>(calendarDays[1]?.date || calendarDays[0].date);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header Cover */}
        <div className="relative h-60 sm:h-72 w-full shrink-0">
          <img
            src={mountain.imageUrl}
            alt={mountain.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Info */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                {mountain.region}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-lime-400 text-stone-900">
                {mountain.elevation.toLocaleString('id-ID')} mdpl
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/80 text-white">
                {mountain.activeParkName}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">{mountain.name}</h2>
            <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
              <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span>{mountain.location}</span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50 shrink-0">
          {[
            { id: 'jalur', label: 'Jalur & Kalender Kuota' },
            { id: 'simaksi', label: 'Ketentuan SIMAKSI' },
            { id: 'galeri', label: 'Tentang & Fasilitas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'jalur' && (
            <div>
              {/* Status Note Banner */}
              {mountain.statusNote && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>{mountain.statusNote}</p>
                </div>
              )}

              {/* Step 1: Select Trail */}
              <h4 className="text-sm font-extrabold text-stone-900 mb-3 uppercase tracking-wider">
                1. Pilih Jalur Pendakian
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {mountain.trails.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrail(t)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedTrail?.id === t.id
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-stone-900 text-sm">{t.name}</h5>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-100 text-stone-600">
                        {t.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 mb-2">{t.basecamp}</p>
                    <div className="flex items-center gap-3 text-[11px] text-stone-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Compass className="w-3 h-3 text-emerald-700" />
                        {t.lengthKm} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-700" />
                        {t.estimatedHours}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 2: Interactive Quota Calendar */}
              <h4 className="text-sm font-extrabold text-stone-900 mb-3 uppercase tracking-wider">
                2. Pilih Tanggal Pendakian & Cek Kuota
              </h4>
              <p className="text-xs text-stone-500 mb-3">
                Warna menandakan ketersediaan kuota: Hijau (&gt;50%), Kuning (&lt;50%), Merah (Penuh).
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mb-6">
                {calendarDays.map((d) => {
                  const isSelected = selectedDate === d.date;
                  const ratio = d.remaining / d.total;

                  let badgeColor = 'bg-emerald-50 border-emerald-300 text-emerald-900';
                  let barColor = 'bg-emerald-500';

                  if (d.remaining === 0) {
                    badgeColor = 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-60';
                    barColor = 'bg-stone-300';
                  } else if (ratio < 0.3) {
                    badgeColor = 'bg-red-50 border-red-300 text-red-900';
                    barColor = 'bg-red-500';
                  } else if (ratio < 0.6) {
                    badgeColor = 'bg-amber-50 border-amber-300 text-amber-900';
                    barColor = 'bg-amber-500';
                  }

                  return (
                    <button
                      key={d.date}
                      disabled={!d.isAvailable}
                      onClick={() => setSelectedDate(d.date)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${badgeColor} ${
                        isSelected ? 'ring-2 ring-emerald-700 border-emerald-700 shadow-md scale-105' : ''
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                        {d.dayName}
                      </span>
                      <span className="text-lg font-extrabold my-0.5">{d.dayNumber}</span>
                      <span className="text-[10px] font-bold block mb-1.5">{d.monthName}</span>

                      {/* Quota indicator */}
                      <span className="text-[10px] font-bold">
                        {d.remaining === 0 ? 'Penuh' : `Sisa ${d.remaining}`}
                      </span>
                      <div className="w-full bg-stone-200/80 h-1 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${barColor}`}
                          style={{ width: `${Math.round(ratio * 100)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'simaksi' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider mb-2">
                  Syarat & Ketentuan Masuk Kawasan
                </h4>
                <p className="text-xs text-stone-600 mb-4">
                  Setiap pendaki wajib melengkapi dokumen berikut sebelum proses validasi di pos gerbang.
                </p>
                <div className="space-y-2.5">
                  {mountain.simaksiRequirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
                <span className="font-bold block">E-SIMAKSI Resmi TrailPass:</span>
                <p>
                  Tiket yang diterbitkan mencakup nomor registrasi resmi Taman Nasional, asuransi kecelakaan
                  pendakian, dan deposit sampah yang dapat diklaim saat kepulangan.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'galeri' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider mb-2">
                  Deskripsi Lengkap
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {mountain.longDescription}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider mb-3">
                  Fitur & Objek Menarik
                </h4>
                <div className="flex flex-wrap gap-2">
                  {mountain.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider mb-3">
                  Galeri Foto
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mountain.gallery.map((img, i) => (
                    <div key={i} className="h-32 rounded-2xl overflow-hidden border border-stone-200">
                      <img src={img} alt="Galeri" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Action */}
        <div className="p-5 border-t border-stone-200 bg-stone-50 shrink-0 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-stone-500 block font-medium">Jalur & Tanggal Terpilih:</span>
            <span className="text-xs sm:text-sm font-extrabold text-stone-900">
              {selectedTrail?.name} • {selectedDate}
            </span>
          </div>

          <button
            onClick={() => onStartBooking(mountain, selectedTrail, selectedDate)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-emerald-800 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95"
          >
            <span>Lanjut Pemesanan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
