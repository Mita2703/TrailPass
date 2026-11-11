import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, ChevronLeft, ChevronRight, Clock, Mountain as MountainIcon,
  CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp,
  ArrowRight, Filter, Info, Sparkles
} from 'lucide-react';
import { MOUNTAINS } from '../data/index';

// Month definitions for selection
interface MonthOption {
  id: string; // e.g. "2026-10"
  label: string; // e.g. "Oktober 2026"
  year: number;
  month: number; // 0-indexed (9 = Oct)
  days: number;
  seasonTag: string;
}

const MONTHS: MonthOption[] = [
  { id: '2026-09', label: 'September 2026', year: 2026, month: 8, days: 30, seasonTag: 'Musim Kemarau' },
  { id: '2026-10', label: 'Oktober 2026', year: 2026, month: 9, days: 31, seasonTag: 'Musim Peralihan' },
  { id: '2026-11', label: 'November 2026', year: 2026, month: 10, days: 30, seasonTag: 'Bulan Ini' },
  { id: '2026-12', label: 'Desember 2026', year: 2026, month: 11, days: 31, seasonTag: 'Libur Akhir Tahun (Peak)' },
  { id: '2027-01', label: 'Januari 2027', year: 2027, month: 0, days: 31, seasonTag: 'Musim Penghujan' },
  { id: '2027-02', label: 'Februari 2027', year: 2027, month: 1, days: 28, seasonTag: 'Pemulihan Ekosistem' },
];

export const MonthlyQuotaSection: React.FC = () => {
  // Default to November 2026 (Current) or Oktober 2026
  const [selectedMonthId, setSelectedMonthId] = useState<string>('2026-10');
  const [selectedMountainFilter, setSelectedMountainFilter] = useState<string>('ALL');
  const [expandedTrailId, setExpandedTrailId] = useState<string | null>(null);
  const [hoveredDayInfo, setHoveredDayInfo] = useState<{ day: number; available: number; total: number; status: string } | null>(null);

  const currentMonth = MONTHS.find((m) => m.id === selectedMonthId) || MONTHS[1];

  // Helper to switch months smoothly
  const handlePrevMonth = () => {
    const idx = MONTHS.findIndex((m) => m.id === selectedMonthId);
    if (idx > 0) {
      setSelectedMonthId(MONTHS[idx - 1].id);
      setExpandedTrailId(null);
    }
  };

  const handleNextMonth = () => {
    const idx = MONTHS.findIndex((m) => m.id === selectedMonthId);
    if (idx < MONTHS.length - 1) {
      setSelectedMonthId(MONTHS[idx + 1].id);
      setExpandedTrailId(null);
    }
  };

  // Generate realistic monthly data for each trail
  const monthlyData = useMemo(() => {
    return MOUNTAINS.flatMap((mountain) => {
      return mountain.trails.map((trail) => {
        const uniqueKey = `${mountain.id}-${trail.id}`;
        const dailyCap = trail.quota.total;
        const totalMonthly = dailyCap * currentMonth.days;

        // Specific mountain logic based on seasons & regulations
        let isClosedMonth = false;
        let closedReason = '';

        if (mountain.id === 'semeru') {
          isClosedMonth = true;
          closedReason = 'Ditutup (Aktivitas Vulkanik / Rekomendasi PVMBG)';
        } else if (mountain.id === 'rinjani' && (currentMonth.month === 0 || currentMonth.month === 1)) {
          // Rinjani closed Jan-Feb for ecosystem recovery
          isClosedMonth = true;
          closedReason = 'Ditutup (Pemulihan Ekosistem Tahunan TNGR & Cuaca Ekstrem)';
        } else if (mountain.id === 'gede-pangrango' && currentMonth.month === 0) {
          isClosedMonth = true;
          closedReason = 'Ditutup Berkala (Pemulihan Ekosistem Flora Fauna TNGGP)';
        }

        // Generate day-by-day availability
        const daysArray = Array.from({ length: currentMonth.days }, (_, i) => {
          const dayNum = i + 1;
          const dayOfWeek = (new Date(currentMonth.year, currentMonth.month, dayNum).getDay()); // 0 = Sun, 6 = Sat, 5 = Fri
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 5;

          if (isClosedMonth) {
            return { day: dayNum, available: 0, total: dailyCap, status: 'CLOSED' };
          }

          // Generate realistic variation
          // Seeded pseudorandom based on trail, month, day
          const seed = (mountain.name.length * 17 + trail.name.length * 31 + currentMonth.month * 13 + dayNum * 7);
          const ratio = isWeekend
            ? ((seed % 40) + 5) / 100 // weekends 5% - 45% remaining
            : ((seed % 50) + 40) / 100; // weekdays 40% - 90% remaining

          // Peak month in December has less quota
          const decFactor = currentMonth.month === 11 ? 0.7 : 1.0;
          let avail = Math.round(dailyCap * ratio * decFactor);

          // Force some weekend days to 0 (Habis) in popular trails
          if (isWeekend && dayNum > 10 && dayNum < 25 && (trail.id === 'selo' || trail.id === 'gunung-putri')) {
            if (dayNum % 3 === 0) avail = 0;
            else if (dayNum % 2 === 0) avail = Math.min(avail, 8);
          }

          avail = Math.max(0, Math.min(avail, dailyCap));
          let dayStatus: 'OPEN' | 'LIMITED' | 'FULL' | 'CLOSED' = 'OPEN';
          if (avail === 0) dayStatus = 'FULL';
          else if (avail < dailyCap * 0.2) dayStatus = 'LIMITED';

          return { day: dayNum, available: avail, total: dailyCap, status: dayStatus };
        });

        const totalAvailable = isClosedMonth
          ? 0
          : daysArray.reduce((acc, curr) => acc + curr.available, 0);

        const fillPercent = isClosedMonth
          ? 0
          : Math.round(((totalMonthly - totalAvailable) / totalMonthly) * 100);

        let overallStatus: 'OPEN' | 'LIMITED' | 'CLOSED' = 'OPEN';
        if (isClosedMonth) overallStatus = 'CLOSED';
        else if (totalAvailable < totalMonthly * 0.25) overallStatus = 'LIMITED';

        return {
          id: uniqueKey,
          mountainName: mountain.name,
          mountainSlug: mountain.slug,
          trailName: trail.name,
          trailId: trail.id,
          basecamp: trail.basecamp,
          dailyCap,
          totalMonthly,
          totalAvailable,
          totalBooked: totalMonthly - totalAvailable,
          fillPercent,
          overallStatus,
          closedReason,
          daysArray,
        };
      });
    });
  }, [selectedMonthId, currentMonth]);

  // Filter by mountain
  const filteredData = useMemo(() => {
    if (selectedMountainFilter === 'ALL') return monthlyData;
    return monthlyData.filter((item) => item.mountainSlug === selectedMountainFilter);
  }, [monthlyData, selectedMountainFilter]);

  // Aggregate stats for current month
  const aggregateStats = useMemo(() => {
    const totalSlots = filteredData.reduce((acc, curr) => acc + curr.totalMonthly, 0);
    const availableSlots = filteredData.reduce((acc, curr) => acc + curr.totalAvailable, 0);
    const openTrails = filteredData.filter((t) => t.overallStatus !== 'CLOSED').length;
    return {
      totalSlots,
      availableSlots,
      bookedSlots: totalSlots - availableSlots,
      openTrails,
      totalTrails: filteredData.length,
    };
  }, [filteredData]);

  const updatedAt = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section id="monitoring-kuota" className="section bg-white border-t border-black/5">
      <div className="container-main">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="section-label mb-3 inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#173F35]" />
              Sistem Kuota Terintegrasi E-SIMAKSI
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-charcoal leading-tight mb-2">
              Pantau Ketersediaan Kuota per Bulan.
            </h2>
            <p className="text-muted text-base max-w-xl">
              Pilih bulan keberangkatan untuk melihat rekap kuota jalur secara transparan, akurat, dan terhubung langsung ke balai pengelola.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs text-muted bg-offwhite border border-black/8 rounded-xl px-3.5 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sinkronisasi Terakhir: <strong className="text-charcoal">{updatedAt} WIB</strong></span>
          </div>
        </div>

        {/* Month Selector Bar with Smooth Animation */}
        <div className="card p-3 sm:p-4 mb-6 bg-gradient-to-r from-offwhite via-white to-offwhite border border-black/5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            {/* Prev Button */}
            <button
              onClick={handlePrevMonth}
              disabled={selectedMonthId === MONTHS[0].id}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-charcoal hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-xs font-bold"
              aria-label="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Bulan Lalu</span>
            </button>

            {/* Month Carousel Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1">
              {MONTHS.map((m) => {
                const isSelected = m.id === selectedMonthId;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMonthId(m.id);
                      setExpandedTrailId(null);
                    }}
                    className={`group relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#173F35] text-white shadow-md shadow-[#173F35]/20 scale-[1.02]'
                        : 'bg-white text-muted hover:text-charcoal border border-black/5 hover:border-black/15'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{m.label}</span>
                      <span className={`text-[9px] font-normal transition-colors ${isSelected ? 'text-[#B8D986]' : 'text-muted'}`}>
                        {m.seasonTag}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-[#B8D986] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextMonth}
              disabled={selectedMonthId === MONTHS[MONTHS.length - 1].id}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-charcoal hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-xs font-bold"
              aria-label="Bulan Berikutnya"
            >
              <span className="hidden sm:inline">Bulan Depan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Monthly Summary Statistics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          <div className="card p-4 bg-offwhite border border-black/5">
            <span className="text-[11px] text-muted font-semibold block uppercase">Bulan Terpilih</span>
            <span className="text-base sm:text-lg font-extrabold text-charcoal block mt-0.5">
              {currentMonth.label}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">{currentMonth.days} Hari Operasional</span>
          </div>

          <div className="card p-4 bg-offwhite border border-black/5">
            <span className="text-[11px] text-muted font-semibold block uppercase">Total Kuota Tersedia</span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-700 block mt-0.5">
              {aggregateStats.availableSlots.toLocaleString('id-ID')} Slot
            </span>
            <span className="text-[10px] text-muted">Dari {aggregateStats.totalSlots.toLocaleString('id-ID')} kuota</span>
          </div>

          <div className="card p-4 bg-offwhite border border-black/5">
            <span className="text-[11px] text-muted font-semibold block uppercase">Slot Terpesan</span>
            <span className="text-base sm:text-lg font-extrabold text-[#173F35] block mt-0.5">
              {aggregateStats.bookedSlots.toLocaleString('id-ID')} Orang
            </span>
            <span className="text-[10px] text-muted">Telah booking resmi</span>
          </div>

          <div className="card p-4 bg-offwhite border border-black/5">
            <span className="text-[11px] text-muted font-semibold block uppercase">Jalur Beroperasi</span>
            <span className="text-base sm:text-lg font-extrabold text-charcoal block mt-0.5">
              {aggregateStats.openTrails} / {aggregateStats.totalTrails} Jalur
            </span>
            <span className="text-[10px] text-muted">Status resmi taman nasional</span>
          </div>
        </div>

        {/* Mountain Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <span className="text-xs font-bold text-muted flex items-center gap-1 pl-1">
            <Filter className="w-3 h-3 text-muted" /> Filter:
          </span>
          <button
            onClick={() => setSelectedMountainFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedMountainFilter === 'ALL'
                ? 'bg-[#173F35] text-white'
                : 'bg-white text-muted hover:text-charcoal border border-black/5'
            }`}
          >
            Semua Gunung
          </button>
          {MOUNTAINS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMountainFilter(m.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMountainFilter === m.slug
                  ? 'bg-[#173F35] text-white shadow-sm'
                  : 'bg-white text-muted hover:text-charcoal border border-black/5'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Quota Table / Accordion with Smooth Animation */}
        <div className="card overflow-hidden border border-black/5 shadow-card transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-offwhite/80 border-b border-black/5 text-xs text-muted uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-5 text-left">Gunung</th>
                  <th className="py-3.5 px-5 text-left">Jalur Pendakian</th>
                  <th className="py-3.5 px-5 text-left">
                    Kuota Bulan {currentMonth.label.split(' ')[0]}
                  </th>
                  <th className="py-3.5 px-5 text-left">Status Operasional</th>
                  <th className="py-3.5 px-5 text-right">Rincian & Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredData.map((item) => {
                  const isExpanded = expandedTrailId === item.id;
                  const isClosed = item.overallStatus === 'CLOSED';
                  const isLimited = item.overallStatus === 'LIMITED';

                  return (
                    <React.Fragment key={item.id}>
                      {/* Main Table Row */}
                      <tr
                        onClick={() => setExpandedTrailId(isExpanded ? null : item.id)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded ? 'bg-forest-50/40' : 'hover:bg-offwhite/60'
                        }`}
                      >
                        {/* Gunung */}
                        <td className="py-4 px-5">
                          <div className="font-extrabold text-charcoal flex items-center gap-2">
                            <MountainIcon className="w-4 h-4 text-[#173F35]" />
                            {item.mountainName}
                          </div>
                          <span className="text-[11px] text-muted">
                            Kapasitas: {item.dailyCap} kuota/hari
                          </span>
                        </td>

                        {/* Jalur */}
                        <td className="py-4 px-5">
                          <div className="font-semibold text-charcoal">{item.trailName}</div>
                          <div className="text-[11px] text-muted flex items-center gap-1">
                            Basecamp: {item.basecamp}
                          </div>
                        </td>

                        {/* Quota Progress */}
                        <td className="py-4 px-5 min-w-[220px]">
                          {!isClosed ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-charcoal">
                                  {item.totalAvailable.toLocaleString('id-ID')} slot tersisa
                                </span>
                                <span className="text-[11px] text-muted font-medium">
                                  / {item.totalMonthly.toLocaleString('id-ID')}
                                </span>
                              </div>

                              {/* Animated Progress Bar */}
                              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                                    isLimited ? 'bg-amber-400' : 'bg-emerald-500'
                                  }`}
                                  style={{
                                    width: `${Math.max(4, Math.round((item.totalAvailable / item.totalMonthly) * 100))}%`,
                                  }}
                                />
                              </div>

                              <div className="flex justify-between text-[10px] text-muted">
                                <span>{Math.round((item.totalAvailable / item.totalMonthly) * 100)}% kuota tersedia</span>
                                <span>{item.totalBooked.toLocaleString('id-ID')} terisi</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-red-700 bg-red-50/80 px-3 py-1.5 rounded-lg border border-red-200/60 font-medium">
                              0 slot tersedia bulan ini
                            </div>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-5">
                          {isClosed ? (
                            <span className="badge-closed">
                              <XCircle className="w-3 h-3" />
                              Ditutup
                            </span>
                          ) : isLimited ? (
                            <span className="badge-limited">
                              <AlertTriangle className="w-3 h-3" />
                              Kuota Terbatas
                            </span>
                          ) : (
                            <span className="badge-open">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Buka Normal
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedTrailId(isExpanded ? null : item.id);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-[#173F35] transition-colors"
                            >
                              <span>{isExpanded ? 'Tutup Kalender' : 'Cek Kalender'}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {!isClosed && (
                              <Link
                                to={`/booking/${item.mountainSlug}/${item.trailId}`}
                                onClick={(e) => e.stopPropagation()}
                                className="btn-primary text-xs py-1.5 px-3 rounded-lg"
                              >
                                Booking
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Daily Calendar Breakdown (Smooth Accordion) */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b border-black/10">
                            <div className="bg-gradient-to-b from-emerald-50/30 to-offwhite p-5 sm:p-6 space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3">
                                <div>
                                  <h4 className="text-sm font-extrabold text-charcoal flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-[#173F35]" />
                                    Kalender Ketersediaan Kuota Harian — {item.mountainName} ({item.trailName})
                                  </h4>
                                  <p className="text-xs text-muted mt-0.5">
                                    Periode: <strong className="text-charcoal">{currentMonth.label}</strong> (Kapasitas harian: {item.dailyCap} pendaki)
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 text-[11px] text-muted">
                                  <span className="flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300 inline-block" />
                                    Tersedia
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 inline-block" />
                                    Terbatas (&lt;20%)
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded bg-red-100 border border-red-300 inline-block" />
                                    Habis (0)
                                  </span>
                                </div>
                              </div>

                              {isClosed ? (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
                                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="font-bold">Pemberitahuan Penutupan Jalur:</strong>
                                    <p className="mt-0.5">{item.closedReason}</p>
                                    <p className="text-[11px] text-red-600 mt-1">
                                      Pemesanan tiket untuk jalur ini dinonaktifkan sepanjang bulan {currentMonth.label}.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {/* Calendar Grid 1..Days */}
                                  <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-11 gap-2">
                                    {item.daysArray.map((dayItem) => {
                                      const isFull = dayItem.status === 'FULL';
                                      const isLim = dayItem.status === 'LIMITED';

                                      return (
                                        <div
                                          key={dayItem.day}
                                          onMouseEnter={() =>
                                            setHoveredDayInfo({
                                              day: dayItem.day,
                                              available: dayItem.available,
                                              total: dayItem.total,
                                              status: dayItem.status,
                                            })
                                          }
                                          className={`relative p-2.5 rounded-xl border text-center transition-all duration-200 ${
                                            isFull
                                              ? 'bg-red-50 border-red-200 text-red-900 opacity-60'
                                              : isLim
                                              ? 'bg-amber-50 border-amber-200 text-amber-900 hover:scale-105 hover:shadow-sm'
                                              : 'bg-white border-emerald-200 text-emerald-950 hover:scale-105 hover:shadow-sm'
                                          }`}
                                        >
                                          <div className="text-[10px] text-muted font-semibold">
                                            Tgl {dayItem.day}
                                          </div>
                                          <div className="text-xs font-black mt-0.5">
                                            {isFull ? '0' : dayItem.available}
                                          </div>
                                          <div className="text-[9px] mt-0.5 font-medium leading-none">
                                            {isFull ? (
                                              <span className="text-red-600">Habis</span>
                                            ) : isLim ? (
                                              <span className="text-amber-700">Sisa Sedikit</span>
                                            ) : (
                                              <span className="text-emerald-700">Slot Ada</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Calendar Bottom Bar / Quick Booking */}
                                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-black/5 text-xs">
                                    <div className="text-muted flex items-center gap-1.5">
                                      <Info className="w-3.5 h-3.5 text-[#173F35]" />
                                      {hoveredDayInfo ? (
                                        <span>
                                          Tanggal <strong>{hoveredDayInfo.day} {currentMonth.label}</strong>: Tersisa{' '}
                                          <strong className="text-charcoal">{hoveredDayInfo.available}</strong> dari {hoveredDayInfo.total} kuota.
                                        </span>
                                      ) : (
                                        <span>Arahkan kursor ke tanggal di atas untuk melihat rincian sisa kuota harian.</span>
                                      )}
                                    </div>

                                    <Link
                                      to={`/booking/${item.mountainSlug}/${item.trailId}`}
                                      className="btn-lime text-xs py-2 px-5 font-bold flex items-center gap-1.5 shadow-sm"
                                    >
                                      Pesan Tiket {item.mountainName}
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted">
            Butuh informasi peraturan & syarat pendakian lengkap?{' '}
            <Link to="/gunung" className="font-bold text-[#173F35] hover:underline">
              Jelajahi halaman detail masing-masing gunung →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
