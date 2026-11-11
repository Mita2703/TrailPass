import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Map, Award, Calendar, Mountain, CheckCircle2, Camera,
  Plus, Filter, Image, ChevronRight, Share2, ShieldCheck
} from 'lucide-react';
import { DEMO_PROFILE } from '../../data/index';

interface JourneyEntry {
  id: string;
  mountainName: string;
  elevation: number;
  trailName: string;
  date: string;
  year: number;
  bookingCode: string;
  checkInTime: string;
  checkOutTime: string;
  status: 'COMPLETED_VERIFIED';
  photos: string[];
  notes?: string;
}

const DEMO_JOURNEYS: JourneyEntry[] = [
  {
    id: 'j-01',
    mountainName: 'Gunung Gede Pangrango',
    elevation: 2958,
    trailName: 'Jalur Cibodas (TNGGP)',
    date: '20 - 21 Oktober 2026',
    year: 2026,
    bookingCode: 'TRP-2610-GDE-0045',
    checkInTime: '20 Okt 2026, 06:15 WIB (Pos Cibodas)',
    checkOutTime: '21 Okt 2026, 14:30 WIB (Pos Cibodas)',
    status: 'COMPLETED_VERIFIED',
    notes: 'Camp di Kandang Badak, sunrise di Surya Kencana kabut tipis sangat mempesona.',
    photos: [
      'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 'j-02',
    mountainName: 'Gunung Merbabu',
    elevation: 3145,
    trailName: 'Jalur Selo (Boyolali)',
    date: '14 - 15 Agustus 2026',
    year: 2026,
    bookingCode: 'TRP-2608-MRB-0112',
    checkInTime: '14 Agu 2026, 08:00 WIB (Pos Selo)',
    checkOutTime: '15 Agu 2026, 13:10 WIB (Pos Selo)',
    status: 'COMPLETED_VERIFIED',
    notes: 'Pemandangan Gunung Merapi dari Sabana 2 sangat gagah di cuaca cerah Agustus.',
    photos: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 'j-03',
    mountainName: 'Gunung Prau',
    elevation: 2565,
    trailName: 'Jalur Patak Banteng (Wonosobo)',
    date: '10 - 11 Mei 2025',
    year: 2025,
    bookingCode: 'TRP-2505-PRU-0943',
    checkInTime: '10 Mei 2025, 14:00 WIB (Basecamp Patak Banteng)',
    checkOutTime: '11 Mei 2025, 10:20 WIB (Basecamp Patak Banteng)',
    status: 'COMPLETED_VERIFIED',
    notes: 'Golden sunrise Dieng terbaik bersama sahabat. Dingin mencapai 5 derajat celcius.',
    photos: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    ],
  },
];

export const HikingJourneyPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [activeView, setActiveView] = useState<'TIMELINE' | 'GRID'>('TIMELINE');

  const filteredJourneys = DEMO_JOURNEYS.filter((j) => {
    if (selectedYear === 'ALL') return true;
    return j.year === selectedYear;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F35] bg-[#B8D986]/30 px-3 py-1 rounded-full mb-1">
            <Award className="w-3.5 h-3.5" /> Jurnal Pendakian Resmi
          </div>
          <h1 className="text-xl font-extrabold text-charcoal">My Hiking Journey</h1>
          <p className="text-xs text-muted">
            Riwayat petualangan dan puncak yang telah tervalidasi QR Code masuk & keluar di basecamp.
          </p>
        </div>

        <button
          onClick={() => alert('Foto dokumentasi pribadi dapat diunggah pada setiap catatan perjalanan pendakian yang telah tuntas.')}
          className="btn-primary text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          Tambah Dokumentasi
        </button>
      </div>

      {/* Summary Stats & Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 bg-gradient-to-br from-[#173F35] to-[#285C4A] text-white">
          <span className="text-xs text-[#B8D986] font-bold block mb-1">Total Puncak Tuntas</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{DEMO_PROFILE.totalHikes}</span>
            <span className="text-xs text-white/70">Pendakian Tervalidasi</span>
          </div>
          <p className="text-[11px] text-white/60 mt-2">
            Hanya dihitung setelah pemindaian QR Check-in & Check-out di pos pendakian resmi.
          </p>
        </div>

        <div className="card p-5">
          <span className="text-xs text-muted font-bold block mb-1">Gunung yang Pernah Dikunjungi</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-charcoal">{DEMO_PROFILE.mountainsVisited.length}</span>
            <span className="text-xs text-muted">Gunung Berbeda</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {DEMO_PROFILE.mountainsVisited.map((m, idx) => (
              <span key={idx} className="text-[10px] font-semibold bg-offwhite px-2 py-0.5 rounded text-charcoal border border-black/5">
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <span className="text-xs text-muted font-bold block mb-1">Status Verifikasi</span>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span className="text-sm font-bold text-charcoal">100% Legal E-SIMAKSI</span>
          </div>
          <p className="text-[11px] text-muted mt-3">
            Seluruh jejak pendakian terhubung langsung dengan sistem Balai Taman Nasional & Perhutani.
          </p>
        </div>
      </div>

      {/* Controls: Year filter & View switch */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-muted mr-1">Tahun:</span>
          {(['ALL', 2026, 2025] as const).map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedYear === yr
                  ? 'bg-[#173F35] text-white shadow-sm'
                  : 'bg-white text-muted hover:text-charcoal border border-black/5'
              }`}
            >
              {yr === 'ALL' ? 'Semua Tahun' : yr}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-black/5 text-xs">
          <button
            onClick={() => setActiveView('TIMELINE')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              activeView === 'TIMELINE' ? 'bg-offwhite text-charcoal' : 'text-muted'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveView('GRID')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              activeView === 'GRID' ? 'bg-offwhite text-charcoal' : 'text-muted'
            }`}
          >
            Grid Destinasi
          </button>
        </div>
      </div>

      {/* Timeline View */}
      {activeView === 'TIMELINE' && (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
          {filteredJourneys.map((item) => (
            <div key={item.id} className="relative group">
              {/* Bullet circle */}
              <div className="absolute -left-6 sm:-left-8 top-4 w-4 h-4 rounded-full bg-[#173F35] border-4 border-white shadow-sm flex items-center justify-center" />

              <div className="card p-6 border border-black/5 hover:shadow-card-hover transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#173F35] bg-[#B8D986]/20 px-2.5 py-0.5 rounded-full">
                      {item.year}
                    </span>
                    <h3 className="text-base font-extrabold text-charcoal">{item.mountainName}</h3>
                    <span className="text-xs text-muted">({item.elevation} mdpl)</span>
                  </div>
                  <span className="badge-open text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tervalidasi Check-In & Out
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">Jalur & Tanggal</span>
                    <p className="font-bold text-charcoal mt-0.5">{item.trailName}</p>
                    <p className="text-muted mt-0.5">{item.date}</p>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">Verifikasi Basecamp</span>
                    <p className="text-charcoal mt-0.5">Masuk: <span className="font-medium">{item.checkInTime}</span></p>
                    <p className="text-charcoal mt-0.5">Keluar: <span className="font-medium">{item.checkOutTime}</span></p>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">Catatan Pendaki</span>
                    <p className="text-charcoal italic mt-0.5 leading-relaxed">"{item.notes}"</p>
                  </div>
                </div>

                {/* Personal Photos Gallery */}
                {item.photos.length > 0 && (
                  <div className="pt-3 border-t border-black/5">
                    <span className="text-[11px] font-bold text-muted flex items-center gap-1.5 mb-2.5">
                      <Image className="w-3.5 h-3.5" /> Dokumentasi Pribadi ({item.photos.length} Foto)
                    </span>
                    <div className="flex items-center gap-3 overflow-x-auto pb-1">
                      {item.photos.map((photo, i) => (
                        <div key={i} className="w-36 h-24 rounded-xl overflow-hidden shrink-0 border border-black/5 shadow-sm group/img relative">
                          <img
                            src={photo}
                            alt={`Dokumentasi ${item.mountainName} ${i + 1}`}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => alert('Fitur unggah foto dokumentasi perjalanan.')}
                        className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#173F35] flex flex-col items-center justify-center text-muted hover:text-[#173F35] transition-colors shrink-0"
                      >
                        <Plus className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-semibold">Tambah</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {activeView === 'GRID' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJourneys.map((item) => (
            <div key={item.id} className="card overflow-hidden hover:shadow-card-hover transition-all">
              <div className="h-44 relative overflow-hidden">
                <img
                  src={item.photos[0] || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80'}
                  alt={item.mountainName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="badge-open text-[10px] bg-white/90 text-emerald-800">
                    {item.year}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-base font-extrabold">{item.mountainName}</h3>
                  <p className="text-xs text-white/80">{item.elevation} mdpl • {item.trailName}</p>
                </div>
              </div>
              <div className="p-4 text-xs space-y-2">
                <p className="text-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-muted" /> {item.date}
                </p>
                <p className="text-charcoal italic line-clamp-2">"{item.notes}"</p>
                <div className="pt-2 border-t border-black/5 flex justify-between items-center text-[10px] text-muted">
                  <span>Kode: {item.bookingCode}</span>
                  <span className="text-emerald-700 font-bold">QR Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
