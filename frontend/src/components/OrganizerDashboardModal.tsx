import React, { useState } from 'react';
import {
  X,
  Users,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  DollarSign,
  Send,
} from 'lucide-react';

interface OrganizerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export const OrganizerDashboardModal: React.FC<OrganizerDashboardModalProps> = ({
  isOpen,
  onClose,
  userRole = 'organizer',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'advisory' | 'climbers' | 'refunds'>('overview');

  // Advisory toggle state
  const [advisoryStatus, setAdvisoryStatus] = useState<'open' | 'limited' | 'closed'>('open');
  const [advisoryReason, setAdvisoryReason] = useState('Angin kencang dan potensi badai');
  const [advisorySuccess, setAdvisorySuccess] = useState<string | null>(null);

  const handleUpdateAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvisorySuccess(`Status jalur berhasil diperbarui menjadi: ${advisoryStatus.toUpperCase()}`);
    setTimeout(() => setAdvisorySuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-stone-900 flex items-center justify-center font-extrabold">
              TP
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold">
                {userRole === 'admin' ? 'Dashboard Super Admin' : 'Portal Pengelola & Taman Nasional'}
              </h3>
              <span className="text-xs text-lime-400 font-semibold">
                Balai TN Gunung Rinjani & Gede Pangrango
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 shrink-0 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Ringkasan & Statistik' },
            { id: 'advisory', label: 'Pengaturan Status Jalur (Advisory)' },
            { id: 'climbers', label: 'Pendaki di Gunung (Overdue Alert)' },
            { id: 'refunds', label: 'Monitoring & Verifikasi' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-700 text-emerald-800 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Pendaki di Jalur</span>
                  </div>
                  <span className="text-2xl font-extrabold text-stone-900 block">142</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Masuk hari ini</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Booking Masuk</span>
                  </div>
                  <span className="text-2xl font-extrabold text-stone-900 block">38</span>
                  <span className="text-[10px] text-blue-700 font-medium">Dalam 24 jam terakhir</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Pendaki Terlambat</span>
                  </div>
                  <span className="text-2xl font-extrabold text-amber-700 block">1</span>
                  <span className="text-[10px] text-amber-800 font-medium">&gt; 3 Hari di Rinjani</span>
                </div>

                <div className="p-4 rounded-2xl bg-lime-50 border border-lime-300">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Pendapatan Bulan Ini</span>
                  </div>
                  <span className="text-lg font-extrabold text-stone-900 block truncate">
                    Rp 48.250.000
                  </span>
                  <span className="text-[10px] text-emerald-800 font-medium">Settlement Midtrans</span>
                </div>
              </div>

              {/* Recent Bookings table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                    Daftar Transaksi Terbaru
                  </h4>
                  <span className="text-[11px] text-stone-500 font-medium">Real-time sync</span>
                </div>
                <div className="divide-y divide-stone-100 text-xs">
                  {[
                    {
                      code: 'TP-RNJ-8821',
                      leader: 'Arya Pratama',
                      mountain: 'Rinjani (Sembalun)',
                      amount: 'Rp 42.500',
                      status: 'paid',
                    },
                    {
                      code: 'TP-GDP-4019',
                      leader: 'Dian Nugraha',
                      mountain: 'Gede Pangrango (Cibodas)',
                      amount: 'Rp 87.500',
                      status: 'paid',
                    },
                    {
                      code: 'TP-PRU-1123',
                      leader: 'Rizal Fahmi',
                      mountain: 'Prau (Patak Banteng)',
                      amount: 'Rp 62.500',
                      status: 'completed',
                    },
                  ].map((row) => (
                    <div key={row.code} className="p-3.5 flex items-center justify-between hover:bg-stone-50">
                      <div>
                        <span className="font-mono font-bold text-stone-900 block">{row.code}</span>
                        <span className="text-stone-500 text-[11px]">
                          {row.leader} • {row.mountain}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-stone-800 block">{row.amount}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {row.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADVISORY */}
          {activeTab === 'advisory' && (
            <form onSubmit={handleUpdateAdvisory} className="space-y-5">
              <div>
                <h4 className="text-sm font-extrabold text-stone-900 mb-1">
                  Kontrol Status Jalur & Penutupan Darurat
                </h4>
                <p className="text-xs text-stone-500">
                  Mengubah status jalur akan langsung memperbarui banner publik, kalender kuota, dan
                  mengirimkan notifikasi penutupan ke pendaki terdampak.
                </p>
              </div>

              {advisorySuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{advisorySuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'open', label: 'Buka Normal', color: 'emerald', desc: 'Pendakian beroperasi sesuai kuota' },
                  { id: 'limited', label: 'Terbatas (Pos 2/3)', color: 'amber', desc: 'Pendakian hanya sampai pos tertentu' },
                  { id: 'closed', label: 'Tutup Total (Emergency)', color: 'red', desc: 'Jalur ditutup demi keselamatan' },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setAdvisoryStatus(s.id as any)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      advisoryStatus === s.id
                        ? s.id === 'closed'
                          ? 'border-red-600 bg-red-50/50 shadow-sm'
                          : s.id === 'limited'
                          ? 'border-amber-600 bg-amber-50/50 shadow-sm'
                          : 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-extrabold text-xs block mb-1">{s.label}</span>
                    <span className="text-[11px] text-stone-500 leading-tight block">{s.desc}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Alasan & Keterangan Pengumuman
                </label>
                <textarea
                  rows={3}
                  value={advisoryReason}
                  onChange={(e) => setAdvisoryReason(e.target.value)}
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Simpan Perubahan Status Jalur</span>
              </button>
            </form>
          )}

          {/* TAB 3: CLIMBERS & OVERDUE */}
          {activeTab === 'climbers' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">Peringatan Overdue Pendaki:</span>
                  <p>
                    Sistem otomatis mendeteksi pendaki yang belum checkout melewati batas maksimal durasi
                    (max duration days) aturan gunung untuk tindakan tim SAR/Ranger.
                  </p>
                </div>
              </div>

              <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100 text-xs">
                <div className="p-4 bg-red-50/50 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 mb-1 inline-block">
                      OVERDUE 14 JAM
                    </span>
                    <h5 className="font-bold text-stone-900">Surya Saputra (Leader)</h5>
                    <p className="text-[11px] text-stone-500">
                      Gunung Rinjani • Check-in: 2026-11-08 (Maksimal 3 Hari)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-stone-500 block">Kontak Darurat:</span>
                    <span className="font-bold text-stone-800 font-mono">08123456789 (Bpk Hendra)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REFUNDS */}
          {activeTab === 'refunds' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-extrabold text-stone-900 uppercase tracking-wider">
                Pengajuan Reschedule & Refund
              </h4>
              <p className="text-stone-500">
                Verifikasi pengajuan pengembalian dana akibat penutupan jalur darurat cuaca ekstrem.
              </p>

              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-stone-900 block">TP-RNJ-7712</span>
                  <span className="text-stone-500">
                    Alasan: Jalur ditutup cuaca badai • Nominal: Rp 75.000
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-[11px]">
                    Setujui Refund
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-700 font-bold text-[11px]">
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
