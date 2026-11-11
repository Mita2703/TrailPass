import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  CreditCard,
  QrCode,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  UserCheck,
} from 'lucide-react';
import { Mountain, TrailInfo } from '../types';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  mountain: Mountain | null;
  trail: TrailInfo | null;
  date: string;
}

type Step = 'queue' | 'form' | 'payment' | 'ticket';

interface MemberData {
  fullName: string;
  nik: string;
  birthDate: string;
  gender: 'male' | 'female';
  emergencyContact: string;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  mountain,
  trail,
  date,
}) => {
  if (!isOpen || !mountain || !trail) return null;

  const [step, setStep] = useState<Step>('queue');

  // Queue state
  const [queuePosition, setQueuePosition] = useState<number>(14);
  const [estimatedWaitSeconds, setEstimatedWaitSeconds] = useState<number>(8);

  // Form state
  const [memberCount, setMemberCount] = useState<number>(2);
  const [leaderData, setLeaderData] = useState<MemberData>({
    fullName: 'Arya Pratama',
    nik: '3201011995081200',
    birthDate: '1995-08-12',
    gender: 'male',
    emergencyContact: '081298765432 (Ibu Susi)',
  });
  const [additionalMembers, setAdditionalMembers] = useState<MemberData[]>([
    {
      fullName: 'Bagas Aditya',
      nik: '3201011996042100',
      birthDate: '1996-04-21',
      gender: 'male',
      emergencyContact: '081311223344 (Bpk Joko)',
    },
  ]);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca_va' | 'gopay'>('qris');
  const [bookingCode, setBookingCode] = useState<string>('');

  // Queue simulation timer
  useEffect(() => {
    if (step === 'queue') {
      const interval = setInterval(() => {
        setQueuePosition((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeout(() => setStep('form'), 600);
            return 0;
          }
          return prev - 2;
        });
        setEstimatedWaitSeconds((prev) => Math.max(0, prev - 2));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Calculate pricing
  const ticketBasePrice = trail.totalQuota ? mountain.startingPrice : 35000;
  const insurancePrice = 5000;
  const adminFee = 2500;
  const totalAmount = (ticketBasePrice + insurancePrice) * memberCount + adminFee;

  // Handle member count change
  const handleMemberCountChange = (count: number) => {
    setMemberCount(count);
    const diff = count - 1 - additionalMembers.length;
    if (diff > 0) {
      const added: MemberData[] = Array.from({ length: diff }, (_, i) => ({
        fullName: `Anggota ${additionalMembers.length + i + 2}`,
        nik: '320101199' + Math.floor(1000000 + Math.random() * 9000000),
        birthDate: '1998-05-10',
        gender: 'male',
        emergencyContact: '081298765432',
      }));
      setAdditionalMembers([...additionalMembers, ...added]);
    } else if (diff < 0) {
      setAdditionalMembers(additionalMembers.slice(0, count - 1));
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedCode = `TP-${mountain.slug.slice(0, 3).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;
    setBookingCode(generatedCode);
    setStep('payment');
  };

  const handleSimulatePaymentSuccess = () => {
    setStep('ticket');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest block">
              Pemesanan E-SIMAKSI
            </span>
            <h3 className="text-base sm:text-lg font-extrabold">
              {mountain.name} • {trail.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: QUEUE */}
          {step === 'queue' && (
            <div className="text-center py-8 px-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-lime-100 border border-lime-300 text-emerald-900 mx-auto flex items-center justify-center animate-pulse">
                <Clock className="w-8 h-8 text-emerald-700" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-stone-900 mb-2">
                  Anda Berada Dalam Antrean Virtual
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Sistem antrean cerdas TrailPass memastikan kuota dialokasikan secara adil dan bebas dari
                  serangan bot.
                </p>
              </div>

              {/* Position box */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 max-w-xs mx-auto">
                <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider block">
                  Nomor Antrean Anda
                </span>
                <span className="text-4xl font-extrabold text-emerald-800 my-1 block">
                  #{queuePosition}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  Estimasi waktu tunggu: ~{estimatedWaitSeconds} detik
                </span>
              </div>

              {/* Progress bar */}
              <div className="max-w-xs mx-auto">
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-lime-500 h-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(15, (1 - queuePosition / 14) * 100))}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setStep('form')}
                className="text-xs text-stone-400 hover:text-stone-700 underline pt-4"
              >
                Lewati simulasi antrean (Developer Pass)
              </button>
            </div>
          )}

          {/* STEP 2: LEADER & MEMBERS FORM */}
          {step === 'form' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Trip Summary Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Jadwal Pendakian
                  </span>
                  <span className="text-sm font-extrabold text-stone-900">
                    {date} (Mulai Pendakian)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Jalur Masuk
                  </span>
                  <span className="text-xs font-bold text-stone-800">{trail.name}</span>
                </div>
              </div>

              {/* Member count picker */}
              <div>
                <label className="text-xs font-extrabold text-stone-800 uppercase tracking-wider block mb-2">
                  Jumlah Pendaki dalam Rombongan
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleMemberCountChange(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        memberCount === num
                          ? 'border-emerald-700 bg-emerald-800 text-white shadow-sm'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {num} Orang
                    </button>
                  ))}
                </div>
              </div>

              {/* Leader form */}
              <div className="p-4 rounded-2xl border border-stone-200 space-y-3 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <h5 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                    Data Ketua Kelompok / Leader
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Nama Lengkap (Sesuai KTP)
                    </label>
                    <input
                      type="text"
                      required
                      value={leaderData.fullName}
                      onChange={(e) => setLeaderData({ ...leaderData, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      NIK (16 Digit)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={leaderData.nik}
                      onChange={(e) => setLeaderData({ ...leaderData, nik: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      required
                      value={leaderData.birthDate}
                      onChange={(e) => setLeaderData({ ...leaderData, birthDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Kontak Darurat (Nama & No HP)
                    </label>
                    <input
                      type="text"
                      required
                      value={leaderData.emergencyContact}
                      onChange={(e) =>
                        setLeaderData({ ...leaderData, emergencyContact: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                    />
                  </div>
                </div>
              </div>

              {/* Additional members forms */}
              {additionalMembers.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-stone-200 space-y-3 bg-stone-50/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-stone-500" />
                    <h5 className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
                      Data Anggota #{idx + 2}
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={m.fullName}
                        onChange={(e) => {
                          const updated = [...additionalMembers];
                          updated[idx].fullName = e.target.value;
                          setAdditionalMembers(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        NIK (16 Digit)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={m.nik}
                        onChange={(e) => {
                          const updated = [...additionalMembers];
                          updated[idx].nik = e.target.value;
                          setAdditionalMembers(updated);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-stone-100 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>
                    Tiket Masuk ({memberCount} x Rp {ticketBasePrice.toLocaleString('id-ID')}):
                  </span>
                  <span className="font-semibold">
                    Rp {(ticketBasePrice * memberCount).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Asuransi Jiwa Pendaki ({memberCount} x Rp 5.000):</span>
                  <span className="font-semibold">
                    Rp {(insurancePrice * memberCount).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Biaya Layanan & E-SIMAKSI:</span>
                  <span className="font-semibold">Rp {adminFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-extrabold text-stone-900">
                  <span>Total Pembayaran:</span>
                  <span className="text-emerald-800 text-base">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Pembayaran Midtrans Snap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 3: MIDTRANS SNAP POPUP SIMULATION */}
          {step === 'payment' && (
            <div className="space-y-6 py-2">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-blue-950">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-700" />
                  <div>
                    <span className="text-xs font-bold block">Midtrans Payment Gateway</span>
                    <span className="text-[11px] text-blue-700">Kode Booking: {bookingCode}</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold bg-blue-200/80 px-2.5 py-1 rounded-lg">
                  Sandbox
                </span>
              </div>

              {/* Total amount */}
              <div className="text-center py-2">
                <span className="text-xs text-stone-500 font-semibold block uppercase tracking-wider">
                  Total Tagihan
                </span>
                <span className="text-3xl font-extrabold text-stone-900 mt-1 block">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5">
                {[
                  { id: 'qris', name: 'QRIS (GoPay, OVO, ShopeePay, Dana, BCA Mobile)', icon: '📱' },
                  { id: 'bca_va', name: 'BCA Virtual Account (Otomatis Terverifikasi)', icon: '🏦' },
                  { id: 'gopay', name: 'GoPay Instant Payment', icon: '⚡' },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      paymentMethod === m.id
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-xs font-bold text-stone-800">
                      <span className="text-lg">{m.icon}</span>
                      <span>{m.name}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === m.id ? 'border-blue-600' : 'border-stone-300'
                      }`}
                    >
                      {paymentMethod === m.id && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* QR display simulation */}
              {paymentMethod === 'qris' && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
                  <div className="w-40 h-40 bg-white p-2 rounded-2xl border border-stone-200 mx-auto flex items-center justify-center shadow-inner">
                    <QrCode className="w-32 h-32 text-stone-900" />
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500 block">
                    Pindai QRIS menggunakan aplikasi perbankan atau e-wallet apa saja
                  </span>
                </div>
              )}

              {/* Simulate button */}
              <button
                onClick={handleSimulatePaymentSuccess}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasikan Pembayaran Sukses (Instant Settlement)</span>
              </button>
            </div>
          )}

          {/* STEP 4: DIGITAL E-TICKET QR VIEW */}
          {step === 'ticket' && (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-extrabold text-stone-900">
                  Pembayaran Berhasil & E-Tiket Diterbitkan!
                </h4>
                <p className="text-xs text-stone-500">
                  Tunjukkan QR code ini kepada petugas pos saat check-in pendakian.
                </p>
              </div>

              {/* Digital ticket card */}
              <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-emerald-900">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] text-lime-400 font-extrabold uppercase tracking-widest block">
                      TrailPass E-SIMAKSI
                    </span>
                    <h5 className="text-base font-extrabold">{mountain.name}</h5>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-lime-400 text-emerald-950">
                    LUNAS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-5">
                  <div>
                    <span className="text-white/50 text-[10px] block">Kode Booking</span>
                    <span className="font-extrabold text-sm text-lime-300 font-mono">
                      {bookingCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block">Tanggal Pendakian</span>
                    <span className="font-bold">{date}</span>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block">Ketua Rombongan</span>
                    <span className="font-bold">{leaderData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block">Jumlah Anggota</span>
                    <span className="font-bold">{memberCount} Orang</span>
                  </div>
                </div>

                {/* QR Code Center */}
                <div className="bg-white p-4 rounded-2xl text-stone-900 text-center max-w-xs mx-auto space-y-2">
                  <div className="w-40 h-40 mx-auto flex items-center justify-center bg-stone-50 rounded-xl">
                    <QrCode className="w-36 h-36 text-emerald-950" />
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 truncate">
                    HMAC-SHA256: {Math.random().toString(36).substring(2, 15)}...
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => alert(`Mengunduh E-Tiket PDF untuk kode ${bookingCode}...`)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:border-emerald-700 bg-white text-stone-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Unduh E-Tiket PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Selesai & Tutup</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
