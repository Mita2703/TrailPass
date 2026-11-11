import React from 'react';
import { MapPin, Mountain as MountainIcon, Compass, ArrowRight } from 'lucide-react';
import { Mountain } from '../types';

interface MountainCardProps {
  mountain: Mountain;
  onOpenDetail: (mountain: Mountain) => void;
}

export const MountainCard: React.FC<MountainCardProps> = ({ mountain, onOpenDetail }) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Cover Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={mountain.imageUrl}
          alt={mountain.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white border border-white/20">
            {mountain.region}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-lime-400 text-stone-900 shadow-md">
            {mountain.elevation.toLocaleString('id-ID')} mdpl
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-extrabold leading-tight">{mountain.name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-white/80 mt-1">
            <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
            <span className="truncate">{mountain.location}</span>
          </div>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {mountain.description}
          </p>

          {/* Quick specs */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-2xl mb-4 text-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-stone-400 block text-[10px]">Jalur Resmi</span>
                <span className="font-bold text-stone-800">{mountain.trailsCount} Jalur</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MountainIcon className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-stone-400 block text-[10px]">Tiket Mulai</span>
                <span className="font-bold text-stone-800">
                  Rp {mountain.startingPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onOpenDetail(mountain)}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800 transition-all flex items-center justify-center gap-2 group/btn"
        >
          <span>Pilih Jalur & Cek Kuota</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
