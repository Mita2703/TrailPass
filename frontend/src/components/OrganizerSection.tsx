import React from 'react';
import { ArrowRight, CheckCircle, Building2 } from 'lucide-react';

export const OrganizerSection: React.FC = () => {
  const benefits = [
    'Dashboard manajemen jalur & kuota terpusat',
    'Kelola harga tiket & jadwal pembukaan pendakian',
    'Monitor laporan pemesanan & rekap transaksi harian',
    'Validasi E-SIMAKSI dan check-in real-time di pos',
    'Notifikasi otomatis ke pendaki jika terjadi perubahan status',
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=70"
          alt="Latar pegunungan untuk organizer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#050f0a]/95 via-[#0a1f14]/90 to-[#114232]/85" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-lime-400/10 border border-lime-400/30 rounded-full px-4 py-1.5 mb-6">
              <Building2 className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-xs font-bold text-lime-300 uppercase tracking-widest">Portal Organizer & Balai TN</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Kelola Pendakian Lebih
              <br />
              <span className="text-lime-400">Terorganisir</span>
              <br />
              Bersama TrailPass.
            </h2>

            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">
              Gabung sebagai organizer atau tim pengelola gunung dan kelola jalur, kuota, harga tiket, status pendakian, serta laporan pemesanan melalui satu platform yang efisien.
            </p>

            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-lime-400/20 border border-lime-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-lime-400" />
                  </div>
                  <span className="text-sm text-white/80 font-medium leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2.5 bg-lime-400 hover:bg-lime-300 text-[#0C2B1E] font-extrabold px-7 py-3.5 rounded-xl transition-all group text-sm shadow-lg shadow-lime-500/20 active:scale-95">
                Daftar sebagai Organizer
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3.5 rounded-xl transition-all text-sm backdrop-blur-sm">
                Pelajari Selengkapnya
              </button>
            </div>
          </div>

          {/* Right: Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '🏔️', title: 'Multi-Gunung', desc: 'Kelola beberapa gunung dalam satu akun organizer' },
              { emoji: '📊', title: 'Laporan Real-Time', desc: 'Pantau rekap pemesanan dan kuota langsung dari dashboard' },
              { emoji: '🔔', title: 'Notifikasi Otomatis', desc: 'Kirim notifikasi ke pendaki saat status jalur berubah' },
              { emoji: '📱', title: 'Scanner QR', desc: 'Validasi tiket pendaki dengan app scanner bawaan TrailPass' },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 hover:bg-white/15 transition-colors"
              >
                <div className="text-2xl mb-2">{card.emoji}</div>
                <h4 className="text-sm font-extrabold text-white mb-1">{card.title}</h4>
                <p className="text-xs text-white/60 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
