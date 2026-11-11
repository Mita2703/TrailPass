import React from 'react';
import { QrCode, CheckCircle2, Smartphone } from 'lucide-react';

interface TicketShowcaseSectionProps {
  onOpenScanner: () => void;
}

export const TicketShowcaseSection: React.FC<TicketShowcaseSectionProps> = ({ onOpenScanner }) => {
  return (
    <section id="tiket" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-lime-400 bg-white/10 px-3 py-1.5 rounded-lg inline-block">
              Keamanan Tingkat Tinggi
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              E-Tiket QR Digital Anti-Pemalsuan
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Setiap tiket ditandatangani secara kriptografis menggunakan algoritma{' '}
              <span className="text-lime-300 font-semibold font-mono">HMAC-SHA256</span>. Petugas di
              pos gerbang dapat memvalidasi keaslian tiket secara instan tanpa khawatir tiket palsu atau
              tangkapan layar duplikat.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Offline Verification: Validasi QR tetap bekerja walau sinyal minim di pos gerbang.',
                'Multi-Member Support: 1 Kode Tiket mewakili seluruh rombongan pendaki.',
                'Otomatis Masuk Rekap Ranger: Monitor pendaki yang masih di atas gunung.',
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenScanner}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-stone-900 font-extrabold text-xs sm:text-sm shadow-lg shadow-lime-400/20 transition-all active:scale-95"
              >
                <Smartphone className="w-4 h-4" />
                <span>Uji Coba Gate Scanner Pos Ranger</span>
              </button>
            </div>
          </div>

          {/* Right Ticket Mockup Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm bg-white text-stone-900 rounded-3xl p-6 shadow-2xl relative border-4 border-lime-400/30">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                    E-SIMAKSI INDONESIA
                  </span>
                  <h4 className="font-extrabold text-base text-stone-900">Gunung Rinjani</h4>
                  <span className="text-xs text-stone-500">Jalur Sembalun • 3.726 mdpl</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-xs">
                  PASS
                </div>
              </div>

              {/* Data grid */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                <div>
                  <span className="text-stone-400 block text-[10px]">Kode Registrasi</span>
                  <span className="font-mono font-bold text-emerald-900">TP-RNJ-8821</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Tgl Pendakian</span>
                  <span className="font-bold">15 Nov 2026</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Ketua Kelompok</span>
                  <span className="font-bold">Arya Pratama</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Status SIMAKSI</span>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    RESMI & LUNAS
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center space-y-2">
                <div className="w-36 h-36 bg-white mx-auto flex items-center justify-center rounded-xl p-2 shadow-inner border border-stone-100">
                  <QrCode className="w-32 h-32 text-stone-900" />
                </div>
                <span className="text-[10px] font-mono text-stone-400 block">
                  Pindai di Pos 1 Basecamp
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
