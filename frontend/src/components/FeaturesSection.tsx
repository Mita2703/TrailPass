import React from 'react';
import { BarChart2, Users, CreditCard, QrCode, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: BarChart2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
    accentColor: 'border-emerald-200',
    tag: '01',
    title: 'Kuota Real-Time',
    description:
      'Pantau ketersediaan kuota pendakian berdasarkan jalur dan tanggal secara akurat. Data diperbarui otomatis dari sistem balai pengelola taman nasional.',
    highlight: 'Tidak ada lagi antrean tak pasti',
  },
  {
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    accentColor: 'border-blue-200',
    tag: '02',
    title: 'Antrean Virtual',
    description:
      'Nikmati proses pemesanan yang lebih tertata dan adil saat permintaan tiket meningkat. Sistem antrean berbasis Redis memastikan setiap pendaki mendapat kesempatan yang sama.',
    highlight: 'Adil & transparan untuk semua',
  },
  {
    icon: CreditCard,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-700',
    accentColor: 'border-violet-200',
    tag: '03',
    title: 'Pembayaran Terintegrasi',
    description:
      'Lakukan pembayaran online melalui berbagai metode yang tersedia dengan Midtrans: Transfer Bank, QRIS, GoPay, OVO, Dana, Kartu Kredit, dan lainnya.',
    highlight: 'Lebih dari 10 metode pembayaran',
  },
  {
    icon: QrCode,
    iconBg: 'bg-lime-50',
    iconColor: 'text-lime-700',
    accentColor: 'border-lime-200',
    tag: '04',
    title: 'E-Tiket QR Code',
    description:
      'Dapatkan tiket digital dengan enkripsi QR Code untuk proses validasi saat masuk dan keluar pos pendakian. Tersimpan di ponsel, bisa dipindai offline.',
    highlight: 'Tanpa print, 100% digital',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="fitur" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-4 py-1.5 mb-5">
            <span className="text-xs font-bold text-lime-800 uppercase tracking-widest">Keunggulan Platform</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0C2B1E] tracking-tight mb-4 leading-tight">
            Pendakian Lebih Mudah,{' '}
            <br className="hidden md:block" />
            Terencana, dan Terpercaya.
          </h2>
          <p className="text-stone-500 text-base max-w-lg mx-auto">
            TrailPass hadir untuk menjawab setiap tantangan dalam proses pendaftaran dan pemesanan tiket pendakian di Indonesia.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.tag}
                className={`group relative bg-white rounded-3xl p-6 border-2 ${feat.accentColor} hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
              >
                {/* Background Number */}
                <div className="absolute top-4 right-5 text-7xl font-black text-stone-50 select-none pointer-events-none leading-none">
                  {feat.tag}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl ${feat.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-base font-extrabold text-[#0C2B1E] mb-2 leading-tight">{feat.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed mb-4">{feat.description}</p>

                {/* Highlight Chip */}
                <div className="inline-flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                  <span className="text-[10px] font-bold text-stone-600">{feat.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Link */}
        <div className="mt-10 text-center">
          <button
            onClick={() => document.getElementById('alur')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#114232] hover:text-lime-700 transition-colors group"
          >
            Lihat cara pemesanannya
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
