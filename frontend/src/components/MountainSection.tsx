import React, { useState } from 'react';
import { MOUNTAINS_DATA } from '../data/mountains';
import { MountainCard } from './MountainCard';
import { Mountain } from '../types';
import { Compass, Search } from 'lucide-react';

interface MountainSectionProps {
  onOpenDetail: (mountain: Mountain) => void;
}

export const MountainSection: React.FC<MountainSectionProps> = ({ onOpenDetail }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const regions = ['Semua', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Nusa Tenggara'];

  const filteredMountains = MOUNTAINS_DATA.filter((m) => {
    const matchRegion = selectedRegion === 'Semua' || m.region === selectedRegion;
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <section id="gunung" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Destinasi Terpopuler
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Jelajahi Puncak Impianmu
          </h2>
          <p className="mt-2 text-base text-stone-600 max-w-xl">
            Pilih gunung favoritmu, pelajari regulasi SIMAKSI, dan temukan jalur pendakian yang sesuai
            dengan pengalamanmu.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari gunung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-sm"
          />
        </div>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedRegion === reg
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Mountain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredMountains.map((mountain) => (
          <MountainCard
            key={mountain.id}
            mountain={mountain}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </section>
  );
};
