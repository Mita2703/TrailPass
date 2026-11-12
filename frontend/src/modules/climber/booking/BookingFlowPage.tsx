import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Mountain, Users,
  Clock, CreditCard, ArrowRight, ArrowLeft,
  CheckCircle2, Download, QrCode
} from 'lucide-react';
import { MOUNTAINS } from '../../../data/index';
import { QuotaBar } from '../../../components/ui';

interface HikerData {
  name: string;
  idNumber: string;
  phone: string;
  isLeader: boolean;
}

export const BookingFlowPage: React.FC = () => {
  const { mountainSlug, trailId } = useParams<{ mountainSlug: string; trailId: string }>();

  // Find mountain and trail
  const mountain = MOUNTAINS.find((m) => m.slug === mountainSlug) || MOUNTAINS[0];
  const trail = mountain.trails.find((t) => t.id === trailId) || mountain.trails[0];

  // Steps: 1: Destinasi, 2: Tanggal, 3: Jumlah Pendaki, 4: Data Pendaki, 5: Ringkasan, 6: Antrean, 7: Pembayaran, 8: E-Ticket
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [hikersCount, setHikersCount] = useState<number>(2);
  const [hikers, setHikers] = useState<HikerData[]>([
    { name: 'Andi Pratama', idNumber: '3374010101990001', phone: '081234567890', isLeader: true },
    { name: 'Budi Santoso', idNumber: '3374021204980002', phone: '081298765432', isLeader: false },
  ]);

  // Virtual Queue State
  const [queuePosition, setQueuePosition] = useState<number>(14);
  const [queueDone, setQueueDone] = useState<boolean>(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'BCA_VA' | 'MANDIRI_VA' | 'GOPAY'>('QRIS');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Update hikers array when count changes
  useEffect(() => {
    setHikers((prev) => {
      const updated = [...prev];
      while (updated.length < hikersCount) {
        updated.push({
          name: '',
          idNumber: '',
          phone: '',
          isLeader: false,
        });
      }
      return updated.slice(0, hikersCount);
    });
  }, [hikersCount]);

  // Virtual queue simulation
  useEffect(() => {
    if (currentStep === 6 && queuePosition > 0 && !queueDone) {
      const interval = setInterval(() => {
        setQueuePosition((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setQueueDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [currentStep, queuePosition, queueDone]);

  const pricePerPerson = trail.price || 15000;
  const adminFee = 3500;
  const totalAmount = pricePerPerson * hikersCount + adminFee;
  const bookingCode = `TRP-2026-${trail.id.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleNext = () => {
    // Validations
    if (currentStep === 4) {
      const empty = hikers.some((h) => !h.name || !h.idNumber);
      if (empty) {
        alert('Mohon lengkapi nama dan NIK untuk seluruh anggota pendaki.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 8));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayMidtrans = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCurrentStep(8); // To E-Ticket
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-offwhite py-12 px-4 sm:px-6 animate-in fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to={`/gunung/${mountain.slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-charcoal transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Detail Gunung
          </Link>
          <span className="text-xs font-mono font-bold text-muted bg-white px-2.5 py-1 rounded-lg border border-black/5">
            E-SIMAKSI Online Booking
          </span>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="card p-4 sm:p-5 mb-6 border border-black/5">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal mb-3">
            <span>Langkah {currentStep} dari 8</span>
            <span className="text-[#173F35]">
              {currentStep === 1 && 'Konfirmasi Destinasi'}
              {currentStep === 2 && 'Pilih Tanggal'}
              {currentStep === 3 && 'Jumlah Pendaki'}
              {currentStep === 4 && 'Data Pendaki'}
              {currentStep === 5 && 'Ringkasan Pemesanan'}
              {currentStep === 6 && 'Antrean Virtual'}
              {currentStep === 7 && 'Pembayaran Midtrans'}
              {currentStep === 8 && 'E-Ticket Terbit'}
            </span>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#173F35] rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Konfirmasi Destinasi */}
        {currentStep === 1 && (
          <div className="card p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="border-b border-black/5 pb-4">
              <h2 className="text-xl font-extrabold text-charcoal mb-1">Konfirmasi Destinasi Pendakian</h2>
              <p className="text-xs text-muted">Pastikan gunung dan jalur yang dipilih telah sesuai dengan kesiapan fisik rombongan.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img
                src={mountain.image}
                alt={mountain.name}
                className="w-full sm:w-44 h-32 object-cover rounded-2xl shrink-0"
              />
              <div className="space-y-2 flex-1">
                <span className="badge-open text-[10px]">Status: Buka Normal</span>
                <h3 className="text-lg font-extrabold text-charcoal">{mountain.name}</h3>
                <p className="text-xs text-muted flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-[#173F35]" />
                  {trail.name} ({trail.basecamp})
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="bg-offwhite p-2 rounded-lg text-center">
                    <span className="text-[10px] text-muted block">Jarak</span>
                    <span className="font-bold text-charcoal">{trail.distanceKm} km</span>
                  </div>
                  <div className="bg-offwhite p-2 rounded-lg text-center">
                    <span className="text-[10px] text-muted block">Waktu</span>
                    <span className="font-bold text-charcoal">{trail.durationHours}</span>
                  </div>
                  <div className="bg-offwhite p-2 rounded-lg text-center">
                    <span className="text-[10px] text-muted block">Tingkat</span>
                    <span className="font-bold text-charcoal">{trail.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <strong>Ketentuan Pengelola:</strong> Rombongan wajib menaati batas waktu mendaki, membawa perlengkapan bivak lengkap, dan mematuhi SOP Zero Waste.
            </div>

            <div className="flex justify-end pt-4 border-t border-black/5">
              <button onClick={handleNext} className="btn-primary text-xs py-3 px-6">
                Lanjut: Pilih Tanggal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Pilih Tanggal */}
        {currentStep === 2 && (
          <div className="card p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="border-b border-black/5 pb-4">
              <h2 className="text-xl font-extrabold text-charcoal mb-1">Pilih Tanggal Pendakian</h2>
              <p className="text-xs text-muted">Cek ketersediaan kuota harian pada tanggal yang Anda tentukan.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase">Tanggal Naik (Check-In)</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field text-sm font-semibold"
                />
              </div>

              {/* Real-time date quota preview card */}
              <div className="bg-offwhite p-5 rounded-2xl border border-black/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal">Ketersediaan Kuota Tanggal Terpilih:</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Tersedia
                  </span>
                </div>

                <QuotaBar
                  available={trail.quota.available}
                  total={trail.quota.total}
                  status="OPEN"
                />

                <p className="text-[11px] text-muted">
                  Tersedia <strong className="text-charcoal">{trail.quota.available} slot</strong> dari total {trail.quota.total} kuota harian jalur {trail.name}.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-black/5">
              <button onClick={handlePrev} className="btn-secondary text-xs py-2.5 px-4">
                Kembali
              </button>
              <button onClick={handleNext} className="btn-primary text-xs py-2.5 px-6">
                Lanjut: Jumlah Pendaki <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Jumlah Pendaki */}
        {currentStep === 3 && (
          <div className="card p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="border-b border-black/5 pb-4">
              <h2 className="text-xl font-extrabold text-charcoal mb-1">Tentukan Jumlah Pendaki</h2>
              <p className="text-xs text-muted">Satu pendaftaran dapat memuat hingga maksimal 10 anggota rombongan.</p>
            </div>

            <div className="p-6 rounded-2xl bg-offwhite border border-black/5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-charcoal">Jumlah Anggota Rombongan</h4>
                <p className="text-xs text-muted">Termasuk ketua rombongan</p>
              </div>

              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-black/10 shadow-sm">
                <button
                  type="button"
                  onClick={() => setHikersCount(Math.max(1, hikersCount - 1))}
                  className="w-8 h-8 rounded-lg bg-offwhite hover:bg-black/5 flex items-center justify-center font-bold text-charcoal"
                >
                  -
                </button>
                <span className="text-base font-extrabold text-[#173F35] w-8 text-center">{hikersCount}</span>
                <button
                  type="button"
                  onClick={() => setHikersCount(Math.min(10, hikersCount + 1))}
                  className="w-8 h-8 rounded-lg bg-offwhite hover:bg-black/5 flex items-center justify-center font-bold text-charcoal"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-black/5">
              <button onClick={handlePrev} className="btn-secondary text-xs py-2.5 px-4">
                Kembali
              </button>
              <button onClick={handleNext} className="btn-primary text-xs py-2.5 px-6">
                Lanjut: Isi Data Pendaki <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Data Pendaki */}
        {currentStep === 4 && (
          <div className="card p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="border-b border-black/5 pb-4">
              <h2 className="text-xl font-extrabold text-charcoal mb-1">Data Anggota Rombongan</h2>
              <p className="text-xs text-muted">Lengkapi data seluruh pendaki sesuai KTP / Paspor sah untuk validasi pos SIMAKSI.</p>
            </div>

            <div className="space-y-4">
              {hikers.map((hiker, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-black/10 bg-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-black/5">
                    <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#173F35]" />
                      Pendaki #{idx + 1} {idx === 0 && <span className="badge-open text-[10px] ml-1">Ketua Rombongan</span>}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-muted mb-1">Nama Lengkap (KTP)</label>
                      <input
                        type="text"
                        required
                        value={hiker.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHikers((prev) => prev.map((item, i) => i === idx ? { ...item, name: val } : item));
                        }}
                        placeholder="Nama lengkap"
                        className="input-field text-xs py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-muted mb-1">Nomor Identitas (NIK)</label>
                      <input
                        type="text"
                        required
                        value={hiker.idNumber}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHikers((prev) => prev.map((item, i) => i === idx ? { ...item, idNumber: val } : item));
                        }}
                        placeholder="16 digit NIK"
                        className="input-field text-xs py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-muted mb-1">No. WhatsApp</label>
                      <input
                        type="tel"
                        value={hiker.phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHikers((prev) => prev.map((item, i) => i === idx ? { ...item, phone: val } : item));
                        }}
                        placeholder="08xxxxxxxxxx"
                        className="input-field text-xs py-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-black/5">
              <button onClick={handlePrev} className="btn-secondary text-xs py-2.5 px-4">
                Kembali
              </button>
              <button onClick={handleNext} className="btn-primary text-xs py-2.5 px-6">
                Lanjut: Ringkasan & Biaya <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Ringkasan Pemesanan */}
        {currentStep === 5 && (
          <div className="card p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="border-b border-black/5 pb-4">
              <h2 className="text-xl font-extrabold text-charcoal mb-1">Ringkasan Pemesanan</h2>
              <p className="text-xs text-muted">Periksa kembali detail jadwal, destinasi, dan rincian biaya sebelum konfirmasi.</p>
            </div>

            <div className="bg-offwhite rounded-2xl p-5 border border-black/5 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-muted">Destinasi Gunung:</span>
                <span className="font-bold text-charcoal">{mountain.name} ({mountain.elevation} mdpl)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-muted">Jalur Pendakian:</span>
                <span className="font-bold text-charcoal">{trail.name} ({trail.basecamp})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-muted">Tanggal Pendakian:</span>
                <span className="font-bold text-charcoal">{selectedDate}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-muted">Jumlah Pendaki:</span>
                <span className="font-bold text-charcoal">{hikersCount} Orang</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-muted">Ketua Rombongan:</span>
                <span className="font-bold text-charcoal">{hikers[0].name} ({hikers[0].idNumber})</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="card p-5 border border-black/5 space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>Tiket Masuk ({hikersCount} x Rp {pricePerPerson.toLocaleString('id-ID')}):</span>
                <span>Rp {(pricePerPerson * hikersCount).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Biaya Layanan & E-SIMAKSI QR:</span>
                <span>Rp {adminFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-black/5 text-sm font-extrabold text-charcoal">
                <span>Total Pembayaran:</span>
                <span className="text-lg text-[#173F35]">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-black/5">
              <button onClick={handlePrev} className="btn-secondary text-xs py-2.5 px-4">
                Kembali
              </button>
              <button onClick={handleNext} className="btn-primary text-xs py-2.5 px-6">
                Masuk Antrean & Pembayaran <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Antrean Virtual */}
        {currentStep === 6 && (
          <div className="card p-6 sm:p-8 space-y-6 text-center animate-in fade-in">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#B8D986]/30 text-[#173F35] flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <h2 className="text-xl font-extrabold text-charcoal">
                {queueDone ? 'Giliran Anda Tiba!' : 'Antrean Virtual TrailPass'}
              </h2>

              <p className="text-xs text-muted leading-relaxed">
                {queueDone
                  ? 'Sistem berhasil mengamankan kuota Anda. Silakan lanjutkan ke pembayaran dalam waktu 15 menit.'
                  : 'Sistem sedang mengatur antrean pemesanan secara adil berbasis Redis untuk mencegah lonjakan kuota bersamaan.'}
              </p>

              {!queueDone ? (
                <div className="bg-offwhite p-6 rounded-2xl border border-black/5 space-y-3">
                  <span className="text-xs text-muted block uppercase tracking-wider font-bold">Nomor Antrean Anda:</span>
                  <span className="text-4xl font-black text-[#173F35] block">{queuePosition}</span>
                  <span className="text-[11px] text-muted block">Estimasi tunggu: ~{queuePosition * 2} detik</span>

                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-300"
                      style={{ width: `${Math.max(10, ((15 - queuePosition) / 15) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kuota Terkunci Aman (Lock 15 Menit)
                </div>
              )}

              <div className="pt-4 flex justify-center gap-3">
                {!queueDone && (
                  <button
                    onClick={() => { setQueuePosition(0); setQueueDone(true); }}
                    className="text-[11px] text-muted underline hover:text-charcoal"
                  >
                    (Bypass simulasi antrean)
                  </button>
                )}
                {queueDone && (
                  <button onClick={handleNext} className="btn-primary text-xs py-3 px-8">
                    Lanjut ke Pembayaran Midtrans <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Pembayaran Midtrans */}
        {currentStep === 7 && (
          <div className="card p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="border-b border-black/5 pb-4">
              <div className="inline-flex items-center gap-1.5 text-xs text-muted bg-offwhite px-2.5 py-1 rounded-lg mb-2">
                <CreditCard className="w-3.5 h-3.5 text-[#173F35]" /> Gateway Pembayaran Resmi
              </div>
              <h2 className="text-xl font-extrabold text-charcoal mb-1">Pembayaran Online Midtrans</h2>
              <p className="text-xs text-muted">Pilih metode pembayaran terverifikasi untuk menerbitkan e-ticket digital.</p>
            </div>

            {/* Total Display */}
            <div className="p-4 rounded-2xl bg-[#173F35] text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] text-white/60 block uppercase">Total Tagihan</span>
                <span className="text-xl font-extrabold">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <span className="text-xs text-[#B8D986] font-mono font-bold bg-white/10 px-2.5 py-1 rounded">
                {bookingCode}
              </span>
            </div>

            {/* Methods */}
            <div className="space-y-2.5">
              {[
                { id: 'QRIS', label: 'QRIS (GoPay, OVO, Dana, BCA, ShopeePay)', note: 'Konfirmasi instan otomatis' },
                { id: 'BCA_VA', label: 'BCA Virtual Account', note: 'Nomor virtual account otomatis' },
                { id: 'MANDIRI_VA', label: 'Mandiri Bill Payment', note: 'Transfer via Livin Mandiri / ATM' },
                { id: 'GOPAY', label: 'GoPay / GoPay Coins', note: 'Buka langsung di aplikasi GoJek' },
              ].map((m) => (
                <label
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === m.id
                      ? 'border-[#173F35] bg-emerald-50/40 ring-1 ring-[#173F35]'
                      : 'border-black/10 hover:border-black/20 bg-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-charcoal block">{m.label}</span>
                    <span className="text-[11px] text-muted">{m.note}</span>
                  </div>
                  <input
                    type="radio"
                    name="paymethod"
                    checked={paymentMethod === m.id}
                    onChange={() => {}}
                    className="accent-[#173F35]"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-black/5">
              <button onClick={handlePrev} className="btn-secondary text-xs py-2.5 px-4">
                Kembali
              </button>
              <button
                onClick={handlePayMidtrans}
                disabled={isProcessingPayment}
                className="btn-lime text-xs py-3 px-8 font-bold flex items-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#173F35] border-t-transparent rounded-full animate-spin" />
                    Memproses Verifikasi Midtrans...
                  </>
                ) : (
                  <>
                    Bayar Sekarang (Rp {totalAmount.toLocaleString('id-ID')})
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: E-Ticket Terbit */}
        {currentStep === 8 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="card p-6 sm:p-8 bg-gradient-to-r from-[#173F35] to-[#285C4A] text-white text-center rounded-3xl">
              <div className="w-14 h-14 rounded-full bg-[#B8D986] text-[#173F35] flex items-center justify-center mx-auto mb-3 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold mb-1">Pembayaran Berhasil!</h2>
              <p className="text-xs text-white/80 max-w-md mx-auto">
                Tiket digital E-SIMAKSI Anda telah terbit secara resmi dan tervalidasi di server Balai Pengelola.
              </p>
            </div>

            {/* Generated E-Ticket Card */}
            <div className="card overflow-hidden border border-emerald-100 shadow-elevated">
              <div className="bg-[#173F35] text-white p-5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#B8D986] font-bold uppercase tracking-wider block">TRAILPASS E-SIMAKSI TIKET</span>
                  <h3 className="text-lg font-extrabold">{mountain.name}</h3>
                  <p className="text-xs text-white/70">{trail.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/60 block">Kode Booking:</span>
                  <span className="text-xs font-mono font-bold bg-white/10 px-2 py-1 rounded">{bookingCode}</span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2 space-y-3 text-xs">
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Jadwal Pendakian</span>
                    <span className="font-bold text-charcoal">{selectedDate}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Ketua Rombongan</span>
                    <span className="font-bold text-charcoal">{hikers[0].name} ({hikers[0].idNumber})</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Total Peserta & Status</span>
                    <span className="font-bold text-charcoal">{hikersCount} Orang — Lunas Midtrans</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-offwhite border border-black/5">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl shadow-inner border border-black/10">
                    <QrCode className="w-full h-full text-[#173F35]" />
                  </div>
                  <span className="text-[9px] font-mono text-muted mt-2">Scan di Pos Basecamp</span>
                </div>
              </div>

              <div className="p-4 bg-offwhite border-t border-black/5 flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => alert(`Mengunduh E-Ticket PDF untuk booking ${bookingCode}`)}
                  className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Tiket PDF
                </button>
                <Link
                  to="/pendaki/tiket"
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  Buka di Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
