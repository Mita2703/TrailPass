import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, ChevronDown, Check, Mountain as MountainIcon } from 'lucide-react';
import { MOUNTAINS_DATA } from '../data/mountains';
import { SearchFormData } from '../types';

interface SearchWidgetProps {
  onSearch: (data: SearchFormData) => void;
  className?: string;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch, className = '' }) => {
  // Today + 3 days as default
  const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [selectedMountainId, setSelectedMountainId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);
  const [hikersCount, setHikersCount] = useState<number>(2);
  const [isMountainDropdownOpen, setIsMountainDropdownOpen] = useState(false);
  const [isHikerDropdownOpen, setIsHikerDropdownOpen] = useState(false);

  const selectedMountain = MOUNTAINS_DATA.find((m) => m.id === selectedMountainId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      mountainId: selectedMountainId,
      date: selectedDate,
      hikersCount,
    });
  };

  const handleSelectPopular = (id: string) => {
    setSelectedMountainId(id);
    setIsMountainDropdownOpen(false);
  };

  return (
    <div className={`relative bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-elevated border border-stone-200/80 transition-all ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center">
          {/* Field 1: Mountain Selection */}
          <div className="relative md:col-span-4">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 px-3">
              Destinasi Gunung
            </label>
            <div
              onClick={() => {
                setIsMountainDropdownOpen(!isMountainDropdownOpen);
                setIsHikerDropdownOpen(false);
              }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-stone-50 border border-stone-200/60 cursor-pointer transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#114232] flex items-center justify-center shrink-0 group-hover:bg-[#114232] group-hover:text-white transition-colors">
                <MountainIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-stone-900 truncate">
                  {selectedMountain ? selectedMountain.name : 'Pilih Gunung'}
                </p>
                <p className="text-xs text-stone-500 truncate">
                  {selectedMountain ? `${selectedMountain.location} • ${selectedMountain.elevation} mdpl` : 'Cari taman nasional & jalur'}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isMountainDropdownOpen ? 'rotate-180 text-emerald-800' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isMountainDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-2xl p-2 z-50 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Pilih Gunung Tersedia
                </div>
                {MOUNTAINS_DATA.map((mountain) => (
                  <button
                    key={mountain.id}
                    type="button"
                    onClick={() => handleSelectPopular(mountain.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-stone-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={mountain.imageUrl}
                        alt={mountain.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-[#114232]">
                            {mountain.name}
                          </span>
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded font-medium">
                            {mountain.elevation} mdpl
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 block">
                          {mountain.region} • {mountain.trailsCount} Jalur
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          mountain.status === 'TERSEDIA'
                            ? 'bg-emerald-50 text-emerald-700'
                            : mountain.status === 'KUOTA_TERBATAS'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {mountain.status === 'TERSEDIA' ? 'Tersedia' : mountain.status === 'KUOTA_TERBATAS' ? 'Terbatas' : 'Tutup'}
                      </span>
                      {selectedMountainId === mountain.id && (
                        <Check className="w-4 h-4 text-emerald-700" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Field 2: Hiking Date */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 px-3">
              Tanggal Pendakian
            </label>
            <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-stone-50 border border-stone-200/60 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#114232] flex items-center justify-center shrink-0 group-hover:bg-[#114232] group-hover:text-white transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-sm font-bold text-stone-900 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none cursor-pointer"
                />
                <p className="text-xs text-stone-500">Cek kuota pada tanggal ini</p>
              </div>
            </div>
          </div>

          {/* Field 3: Hikers Count */}
          <div className="relative md:col-span-2">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 px-3">
              Jumlah Pendaki
            </label>
            <div
              onClick={() => {
                setIsHikerDropdownOpen(!isHikerDropdownOpen);
                setIsMountainDropdownOpen(false);
              }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-stone-50 border border-stone-200/60 cursor-pointer transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#114232] flex items-center justify-center shrink-0 group-hover:bg-[#114232] group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-stone-900">
                  {hikersCount} Orang
                </p>
                <p className="text-xs text-stone-500">1 Rombongan</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isHikerDropdownOpen ? 'rotate-180 text-emerald-800' : ''}`} />
            </div>

            {/* Stepper Dropdown */}
            {isHikerDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-bold text-stone-500 mb-2">Pilih Jumlah Anggota</div>
                <div className="flex items-center justify-between gap-3 bg-stone-50 p-2 rounded-xl">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHikersCount(Math.max(1, hikersCount - 1));
                    }}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold text-[#0C2B1E]">{hikersCount} Pendaki</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHikersCount(Math.min(10, hikersCount + 1));
                    }}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100"
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] text-stone-400 mt-2">Maks. 10 pendaki per pendaftaran rombongan.</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-3 pt-1 md:pt-0">
            <button
              type="submit"
              className="w-full h-[52px] bg-[#114232] hover:bg-[#0c3125] text-white font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-[#114232]/30 hover:shadow-glow-lime active:scale-[0.99] transition-all group border border-emerald-600/30"
            >
              <Search className="w-4 h-4 text-lime-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Cari Pendakian</span>
            </button>
          </div>
        </div>
      </form>

      {/* Popular Mountain Quick Filters */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-stone-400 text-[11px] font-semibold flex items-center gap-1">
          <MapPin className="w-3 h-3 text-stone-400" />
          Paling sering dicari:
        </span>
        {['rinjani', 'merbabu', 'prau', 'gede-pangrango', 'bromo'].map((id) => {
          const m = MOUNTAINS_DATA.find((item) => item.id === id);
          if (!m) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelectPopular(id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedMountainId === id
                  ? 'bg-[#114232] text-lime-300 font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {m.name.replace('Gunung ', '')}
            </button>
          );
        })}
      </div>
    </div>
  );
};
