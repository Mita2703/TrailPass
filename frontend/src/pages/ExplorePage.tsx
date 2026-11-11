import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mountain, Filter, MapPin, ArrowRight } from 'lucide-react';
import { MOUNTAINS } from '../data/index';
import { StatusBadge, SectionHeader } from '../components/ui';
import { Footer } from '../components/Footer';

type FilterStatus = 'ALL' | 'OPEN' | 'LIMITED' | 'CLOSED';

export const ExplorePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [provinceFilter, setProvinceFilter] = useState('ALL');

  const provinces = ['ALL', ...Array.from(new Set(MOUNTAINS.map((m) => m.province)))];

  const filtered = MOUNTAINS.filter((m) => {
    const matchQuery = m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.location.toLowerCase().includes(query.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchProvince = provinceFilter === 'ALL' || m.province === provinceFilter;
    return matchQuery && matchStatus && matchProvince;
  });

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Page header */}
      <div className="bg-[#173F35] pt-24 pb-12">
        <div className="container-main">
          <div className="max-w-2xl">
            <div className="section-label mb-4 bg-[#B8D986]/20 text-[#B8D986] border-[#B8D986]/30">Destinasi Pendakian</div>
            <h1 className="text-4xl font-extrabold text-white mb-3">Jelajahi Gunung di Indonesia.</h1>
            <p className="text-white/60 text-base">
              Temukan destinasi pendakian yang tepat untukmu. Pantau kuota, baca panduan, dan pesan tiket resmi.
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="bg-white border-b border-black/5 sticky top-16 z-30 shadow-sm">
        <div className="container-main py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 bg-offwhite border border-black/8 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama gunung atau lokasi..."
                className="flex-1 text-sm bg-transparent outline-none text-charcoal placeholder:text-muted"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="text-sm border border-black/8 rounded-xl px-4 py-2.5 bg-white text-charcoal outline-none cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">Buka</option>
              <option value="LIMITED">Terbatas</option>
              <option value="CLOSED">Tutup</option>
            </select>

            {/* Province filter */}
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="text-sm border border-black/8 rounded-xl px-4 py-2.5 bg-white text-charcoal outline-none cursor-pointer"
            >
              {provinces.map((p) => (
                <option key={p} value={p}>{p === 'ALL' ? 'Semua Provinsi' : p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-main py-10">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-muted">
            Menampilkan <span className="font-semibold text-charcoal">{filtered.length}</span> gunung
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Mountain className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-charcoal font-semibold mb-1">Gunung tidak ditemukan</p>
            <p className="text-muted text-sm">Coba ubah kata kunci atau filter pencarianmu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((m) => (
              <Link key={m.id} to={`/gunung/${m.slug}`} className="card-hover group block">
                <div className="relative h-52 overflow-hidden">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
                  <div className="absolute top-3 left-3"><StatusBadge status={m.status} /></div>
                  <div className="absolute bottom-3 left-3 text-white/90 text-xs font-medium flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5" />
                    {m.elevation.toLocaleString('id-ID')} mdpl
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-extrabold text-charcoal mb-1 group-hover:text-[#173F35] transition-colors">{m.name}</h3>
                  <div className="flex items-center gap-1 text-muted text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    {m.location}
                  </div>
                  <p className="text-sm text-muted line-clamp-2 mb-4">{m.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-black/5">
                    <span className="text-xs text-muted">{m.trails.length} jalur resmi</span>
                    <span className="text-xs text-[#173F35] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
