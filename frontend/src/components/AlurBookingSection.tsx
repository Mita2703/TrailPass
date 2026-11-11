import React from 'react';
import { Search, Users, CreditCard, QrCode, ArrowRight } from 'lucide-react';

export const AlurBookingSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Cari & Cek Kuota Jalur',
      desc: 'Pilih gunung tujuan, tanggal pendakian, dan pantau kuota harian secara real-time langsung dari balai pengelola.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Isi Data Anggota & SIMAKSI',
      desc: 'Lengkapi identitas KTP/SIM rombongan dan kontak darurat. Kuota di-hold aman selama 30 menit proses pengisian.',
      icon: Users,
    },
    {
      step: '03',
      title: 'Bayar Instan Aman',
      desc: 'Dukungan QRIS, transfer bank, dan e-wallet resmi terintegrasi otomatis melalui Midtrans Snap payment gateway.',
      icon: CreditCard,
    },
    {
      step: '04',
      title: 'Dapatkan E-Tiket QR',
      desc: 'E-Tiket digital terbit instan dengan tanda tangan kriptografi anti-pemalsuan untuk validasi cepat di pos gerbang.',
      icon: QrCode,
    },
  ];

  return (
    <section id="alur" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg inline-block mb-3">
          Sederhana & Cepat
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Alur Pemesanan Resmi TrailPass
        </h2>
        <p className="mt-2 text-stone-600 text-sm sm:text-base">
          Proses perizinan mendaki gunung kini tanpa ribet antre manual di loket pos basecamp.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black text-stone-200 group-hover:text-emerald-200 transition-colors">
                    {s.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">{s.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-stone-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
