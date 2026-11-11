import React, { useState } from 'react';
import { MapPin, ArrowRight, Mountain as MtnIcon, CheckCircle, XCircle, AlertCircle, MinusCircle } from 'lucide-react';
import { Mountain, HikingStatus } from '../types';
import { MOUNTAINS_DATA } from '../data/mountains';

const StatusBadge: React.FC<{ status: HikingStatus }> = ({ status }) => {
  const cfg = {
    TERSEDIA: { label: 'Tersedia', cls: 'bg-emerald-500 text-white', Icon: CheckCircle },
    KUOTA_TERBATAS: { label: 'Kuota Terbatas', cls: 'bg-amber-400 text-amber-950', Icon: AlertCircle },
    PENUH: { label: 'Penuh', cls: 'bg-red-500 text-white', Icon: XCircle },
    DITUTUP: { label: 'Ditutup', cls: 'bg-stone-400 text-white', Icon: MinusCircle },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${cfg.cls}`}>
      <cfg.Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

const MountainCard: React.FC<{ mountain: Mountain }> = ({ mountain }) => {
  const [imgError, setImgError] = useState(false);

  const startingPriceFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(mountain.startingPrice);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft hover:shadow-elevated transition-all duration-400 hover:-translate-y-1 cursor-pointer flex flex-col">
      {/* Image Area */}
      <div className="relative h-52 overflow-hidden bg-stone-100">
        {!imgError ? (
          <img
            src={mountain.imageUrl}
            alt={`Foto ${mountain.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-700">
            <MtnIcon className="w-16 h-16 text-white/40" />
          </div>
        )}
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            <MtnIcon className="w-3 h-3 text-lime-400" />
            {mountain.elevation.toLocaleString('id-ID')} mdpl
          </div>
          <StatusBadge status={mountain.status} />
        </div>

        {/* Bottom overlay — appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-[#0C2B1E] font-extrabold text-xs py-2.5 rounded-xl transition-colors">
            Lihat Detail &amp; Pesan
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1.5">
            <MapPin className="w-3 h-3 text-stone-400" />
            <span className="font-medium truncate">{mountain.location}</span>
          </div>

          <h3 className="text-base font-extrabold text-[#0C2B1E] mb-1 leading-tight group-hover:text-[#114232] transition-colors">
            {mountain.name}
          </h3>
          {mountain.alias && (
            <p className="text-xs text-lime-700 font-semibold mb-2 italic">"{mountain.alias}"</p>
          )}

          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 mb-4">
            {mountain.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div>
            <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wide mb-0.5">
              Mulai dari
            </div>
            <div className="text-sm font-extrabold text-[#114232]">
              {startingPriceFormatted}
              <span className="text-xs text-stone-400 font-medium ml-1">/orang</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wide mb-0.5">
              Jalur Resmi
            </div>
            <div className="text-sm font-extrabold text-stone-800">
              {mountain.trailsCount} Jalur
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturedMountainsSection: React.FC = () => {
  return (
    <section id="gunung" className="py-16 md:py-24 bg-brand-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#114232]/8 border border-[#114232]/15 rounded-full px-4 py-1.5 mb-5">
            <MtnIcon className="w-3.5 h-3.5 text-[#114232]" />
            <span className="text-xs font-bold text-[#114232] uppercase tracking-widest">Destinasi Pilihan</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0C2B1E] tracking-tight mb-4">
            Temukan Gunung Impianmu.
          </h2>
          <p className="text-stone-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Beragam destinasi pendakian, satu platform untuk setiap petualangan.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {MOUNTAINS_DATA.map((mountain) => (
            <MountainCard key={mountain.id} mountain={mountain} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2.5 bg-white hover:bg-stone-50 text-[#114232] font-bold border-2 border-[#114232]/20 hover:border-[#114232]/40 px-7 py-3.5 rounded-xl transition-all group shadow-soft text-sm">
            <MtnIcon className="w-4 h-4 text-[#114232]" />
            Jelajahi Semua Gunung
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
