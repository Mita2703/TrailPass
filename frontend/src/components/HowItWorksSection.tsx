import React from 'react';
import { Mountain, FileText, CreditCard, Ticket } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Mountain,
    title: 'Pilih Gunung',
    description: 'Temukan destinasi, pilih jalur yang diinginkan, dan tentukan tanggal pendakian. Pantau kuota tersedia secara real-time.',
    color: 'emerald',
    iconBg: 'bg-emerald-600',
    numColor: 'text-emerald-200',
    connectorColor: 'from-emerald-500 to-blue-500',
  },
  {
    num: '02',
    icon: FileText,
    title: 'Isi Data Pendaki',
    description: 'Lengkapi informasi ketua rombongan dan setiap anggota pendakian sesuai identitas resmi. Data aman dan terenkripsi.',
    color: 'blue',
    iconBg: 'bg-blue-600',
    numColor: 'text-blue-200',
    connectorColor: 'from-blue-500 to-violet-500',
  },
  {
    num: '03',
    icon: CreditCard,
    title: 'Lakukan Pembayaran',
    description: 'Selesaikan pembayaran secara online melalui Midtrans dengan berbagai pilihan metode yang tersedia dan aman.',
    color: 'violet',
    iconBg: 'bg-violet-600',
    numColor: 'text-violet-200',
    connectorColor: 'from-violet-500 to-lime-500',
  },
  {
    num: '04',
    icon: Ticket,
    title: 'Terima E-Tiket',
    description: 'Dapatkan kode booking dan QR Code sebagai tiket digital pendakian resmi Anda. Siap divalidasi di pos basecamp.',
    color: 'lime',
    iconBg: 'bg-[#114232]',
    numColor: 'text-lime-300',
    connectorColor: '',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="alur" className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#114232]/8 border border-[#114232]/15 rounded-full px-4 py-1.5 mb-5">
            <span className="text-xs font-bold text-[#114232] uppercase tracking-widest">Cara Pemesanan</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0C2B1E] tracking-tight mb-4">
            Langkah Mudah Menuju Puncak.
          </h2>
          <p className="text-stone-500 text-base max-w-md mx-auto">
            Proses pemesanan yang sederhana, cepat, dan aman hanya dalam 4 langkah.
          </p>
        </div>

        {/* Steps — Desktop horizontal, Mobile vertical */}
        <div className="relative">
          {/* Desktop Connector Line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-emerald-400 via-blue-400 via-violet-400 to-lime-500" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative flex flex-col items-center text-center group">
                  {/* Mobile vertical connector */}
                  {idx < steps.length - 1 && (
                    <div className="lg:hidden absolute top-32 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-stone-300 to-stone-200" />
                  )}

                  {/* Icon Circle */}
                  <div className={`relative w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-200 z-10`}>
                    <Icon className="w-7 h-7 text-white" />
                    {/* Step Number Badge */}
                    <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center">
                      <span className="text-[10px] font-black text-stone-700">{step.num}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-extrabold text-[#0C2B1E] mb-2">{step.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed max-w-[220px]">{step.description}</p>

                  {/* Step num decorative */}
                  <div className={`mt-4 text-5xl font-black ${step.numColor} opacity-20 select-none`}>
                    {step.num}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <div className="inline-block bg-white border border-stone-200 rounded-2xl p-6 shadow-soft max-w-lg">
            <p className="text-sm text-stone-600 mb-4">
              Siap memulai petualangan pertamamu? Daftar akun TrailPass sekarang dan dapatkan akses ke semua destinasi gunung di Indonesia.
            </p>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#114232] hover:bg-[#0c3125] text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all text-sm">
              <Ticket className="w-4 h-4 text-lime-400" />
              Mulai Pesan Tiket Sekarang
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
