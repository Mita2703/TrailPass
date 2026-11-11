import React from 'react';
import { Mountain, ArrowRight, TrendingUp, MapPin, ChevronRight } from 'lucide-react';
import { SearchWidget } from './SearchWidget';
import { SearchFormData } from '../types';

interface HeroSectionProps {
  onSearch: (data: SearchFormData) => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExplore }) => {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      {/* Background Mountain Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=2000&q=85"
          alt="Pemandangan pegunungan Indonesia"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay — bottom-heavy for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050f0a] via-[#0a1f14]/80 to-[#0a1f14]/30" />
        {/* Subtle left-side gradient for copy */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050f0a]/70 via-transparent to-transparent" />
      </div>

      {/* Floating Stats Bar (top overlay) */}
      <div className="absolute top-24 right-4 sm:right-6 lg:right-8 z-10 hidden md:flex flex-col gap-2">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Live Kuota</span>
          </div>
          <div className="text-2xl font-extrabold">6 Gunung</div>
          <div className="text-xs text-white/60 mt-0.5">Aktif di TrailPass hari ini</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-lime-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Populer Minggu Ini</span>
          </div>
          <div className="text-sm font-bold">Gunung Prau</div>
          <div className="text-xs text-white/60">Jalur Patak Banteng — 180 Kuota</div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 md:pb-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-lime-400" />
            <span className="text-xs font-bold text-white/90 uppercase tracking-widest">
              Jelajahi Alam Indonesia
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-5">
            Petualangan
            <br />
            <span className="text-lime-400">Dimulai</span> dari
            <br />
            Satu Tiket.
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8 max-w-xl font-medium">
            Jelajahi berbagai gunung di Indonesia, cek kuota pendakian secara{' '}
            <span className="text-white/90 font-semibold">real-time</span>, dan pesan tiket dengan
            lebih mudah dalam satu platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10 sm:mb-12">
            <button
              onClick={onExplore}
              className="flex items-center gap-2.5 bg-lime-400 hover:bg-lime-300 active:scale-95 text-[#0C2B1E] font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-lime-500/30 hover:shadow-lime-400/40 transition-all group text-sm"
            >
              <Mountain className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Jelajahi Gunung
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                document.getElementById('alur')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Pelajari Cara Kerjanya
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {[
              { label: 'Gunung Terdaftar', value: '6+' },
              { label: 'Jalur Resmi', value: '19 Jalur' },
              { label: 'Transaksi Aman', value: 'Midtrans' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                <span className="text-xs text-white/50 font-medium">{stat.label}:</span>
                <span className="text-xs text-white/90 font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search Widget */}
        <div className="mt-8 sm:mt-10">
          <SearchWidget onSearch={onSearch} />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-50 hover:opacity-80 transition-opacity cursor-pointer"
        onClick={() => document.getElementById('kuota')?.scrollIntoView({ behavior: 'smooth' })}>
        <span className="text-[10px] text-white font-semibold uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border border-white/40 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
