import React, { useState } from 'react';
import {
  X,
  QrCode,
  Search,
  CheckCircle2,
  LogOut,
  LogIn,
} from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [searchCode, setSearchCode] = useState<string>('TP-RNJ-8821');
  const [scanResolved, setScanResolved] = useState<boolean>(true);
  const [checkinSuccess, setCheckinSuccess] = useState<string | null>(null);

  // Mock booking data for scanner
  const mockBooking = {
    bookingCode: searchCode || 'TP-RNJ-8821',
    mountainName: 'Gunung Rinjani',
    trailName: 'Jalur Sembalun',
    climbDate: '2026-11-15',
    leaderName: 'Arya Pratama',
    leaderPhone: '081298765432',
    status: 'paid',
    members: [
      { id: 'm-1', name: 'Arya Pratama (Leader)', nik: '3201011995081200', status: 'not_entered' },
      { id: 'm-2', name: 'Bagas Aditya', nik: '3201011996042100', status: 'not_entered' },
    ],
  };

  const [members, setMembers] = useState(mockBooking.members);

  const handleToggleMember = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'climbing' ? 'exited' : 'climbing' }
          : m,
      ),
    );
  };

  const handleCheckInAll = () => {
    setMembers((prev) => prev.map((m) => ({ ...m, status: 'climbing' })));
    setCheckinSuccess('Semua anggota berhasil CHECK-IN! Status pendakian: Sedang Mendaki.');
  };

  const handleCheckOutAll = () => {
    setMembers((prev) => prev.map((m) => ({ ...m, status: 'exited' })));
    setCheckinSuccess('Semua anggota berhasil CHECK-OUT! Pendakian selesai dengan selamat.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-lime-400" />
            <div>
              <h3 className="text-sm sm:text-base font-extrabold">
                Pos Gate Scanner (Petugas Ranger)
              </h3>
              <span className="text-[10px] text-stone-400">Validasi Check-in & Check-out Pos</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Search or Scan Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">
              Pindai QR Token atau Masukkan Kode Booking
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: TP-RNJ-8821 atau token..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
              <button
                onClick={() => setScanResolved(true)}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Cari Tiket
              </button>
            </div>
          </div>

          {/* Success message banner */}
          {checkinSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{checkinSuccess}</span>
            </div>
          )}

          {/* Resolved Ticket Preview */}
          {scanResolved && (
            <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/60 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    Data Tiket
                  </span>
                  <h4 className="font-extrabold text-sm text-stone-900 font-mono">
                    {mockBooking.bookingCode}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Pembayaran Terverifikasi
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">Gunung & Jalur</span>
                  <span className="font-bold text-stone-800">
                    {mockBooking.mountainName} ({mockBooking.trailName})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Tanggal Pendakian</span>
                  <span className="font-bold text-stone-800">{mockBooking.climbDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Leader</span>
                  <span className="font-bold text-stone-800">{mockBooking.leaderName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Kontak Leader</span>
                  <span className="font-bold text-stone-800">{mockBooking.leaderPhone}</span>
                </div>
              </div>

              {/* Members Attendance List */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <span className="text-xs font-extrabold text-stone-800 block">
                  Daftar Anggota Rombongan:
                </span>
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">{m.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">NIK: {m.nik}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'climbing'
                            ? 'bg-blue-100 text-blue-800'
                            : m.status === 'exited'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.status === 'climbing'
                          ? 'Sedang Mendaki'
                          : m.status === 'exited'
                          ? 'Sudah Turun'
                          : 'Belum Masuk'}
                      </span>
                      <button
                        onClick={() => handleToggleMember(m.id)}
                        className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold"
                      >
                        Ubah
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleCheckInAll}
                  className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Check-In Semua</span>
                </button>
                <button
                  onClick={handleCheckOutAll}
                  className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Check-Out Semua</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
