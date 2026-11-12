import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Mountain, MapPin, ChevronDown, TrendingUp, Shield, QrCode, Zap } from 'lucide-react';
import { MOUNTAINS } from '../../data/index';
import { StatusBadge, SectionHeader } from '../../components/ui';
import { MonthlyQuotaSection } from '../../components/MonthlyQuotaSection';
import { Footer } from '../../components/Footer';

// ── Hero ─────────────────────────────────────────────────
const Hero: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/gunung${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
      {/* BG Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=2000&q=85"
          alt="Pegunungan Indonesia"
          className="w-full h-full object-cover"
        />
        {/* Top gradient for navbar and header contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06170f]/90 via-[#06170f]/40 to-transparent" />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f18] via-[#0d1f18]/65 to-transparent" />
        {/* Left side gradient for copy readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06170f]/80 via-[#06170f]/30 to-transparent" />
      </div>

      <div className="relative z-10 container-main w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#B8D986]/20 border border-[#B8D986]/40 rounded-full px-4 py-1.5 mb-5 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 bg-[#B8D986] rounded-full animate-pulse" />
            <span className="text-[#B8D986] text-xs font-bold uppercase tracking-wider">Platform Pendakian Indonesia</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5 drop-shadow-sm">
            Temukan Gunung,<br />
            <span className="text-[#B8D986]">Tentukan</span> Petualanganmu.
          </h1>

          <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-lg font-normal drop-shadow-sm">
            Jelajahi berbagai gunung di Indonesia, pantau kuota pendakian secara real-time, dan pesan e-tiket resmi dalam satu platform.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-xl max-w-lg mb-8">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari gunung — Merbabu, Rinjani, Prau..."
                className="flex-1 text-sm text-charcoal placeholder:text-muted outline-none bg-transparent py-1.5"
              />
            </div>
            <button type="submit" className="btn-primary rounded-xl py-2.5 px-5 shrink-0">
              Cari
            </button>
          </form>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/gunung" className="btn-lime gap-2 py-3 px-6 text-sm font-bold">
              <Mountain className="w-4 h-4" />
              Jelajahi Gunung
            </Link>
            <a href="#cara-pemesanan" className="border border-white/30 hover:bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors">
              Pelajari Cara Booking
            </a>
          </div>
        </div>

        {/* Floating Quick Mountain Shortcut */}
        <div className="absolute bottom-0 right-0 hidden lg:flex items-end gap-6 pb-2">
          {MOUNTAINS.slice(0, 3).map((m) => (
            <Link key={m.id} to={`/gunung/${m.slug}`}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-2 transition-all">
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-white text-xs font-semibold">{m.name}</div>
                <div className="text-white/50 text-[10px]">{m.elevation.toLocaleString('id-ID')} mdpl</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Mountain Card ─────────────────────────────────────────
const MountainCard: React.FC<{ mountain: typeof MOUNTAINS[0] }> = ({ mountain }) => (
  <Link
    to={`/gunung/${mountain.slug}`}
    className="card-hover group block"
  >
    {/* Image */}
    <div className="relative h-52 overflow-hidden">
      <img
        src={mountain.image}
        alt={mountain.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
      <div className="absolute top-3 left-3">
        <StatusBadge status={mountain.status} />
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-xs font-medium">
        <Mountain className="w-3.5 h-3.5" />
        {mountain.elevation.toLocaleString('id-ID')} mdpl
      </div>
    </div>

    {/* Content */}
    <div className="p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-extrabold text-charcoal text-base group-hover:text-[#173F35] transition-colors leading-tight">
            {mountain.name}
          </h3>
          <div className="flex items-center gap-1 text-muted text-xs mt-0.5">
            <MapPin className="w-3 h-3 shrink-0" />
            {mountain.location}
          </div>
        </div>
        <div className="text-xs text-muted font-medium shrink-0">
          {mountain.trails.length} Jalur
        </div>
      </div>

      <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{mountain.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-black/5">
        <div className="text-xs text-muted">{mountain.province}</div>
        <div className="flex items-center gap-1 text-[#173F35] text-xs font-semibold group-hover:gap-2 transition-all">
          Lihat Detail
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  </Link>
);

// ── Destinations section ─────────────────────────────────
const DestinationsSection: React.FC = () => (
  <section className="section bg-offwhite">
    <div className="container-main">
      <div className="flex items-end justify-between gap-4 mb-10">
        <SectionHeader
          label="Destinasi Gunung"
          title="Temukan Gunung Impianmu."
          subtitle="Beragam destinasi pendakian, satu platform untuk setiap petualangan."
        />
        <Link to="/gunung" className="btn-secondary shrink-0 hidden sm:flex">
          Semua Gunung
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {MOUNTAINS.map((m) => <MountainCard key={m.id} mountain={m} />)}
      </div>

      <div className="sm:hidden text-center">
        <Link to="/gunung" className="btn-secondary">Lihat Semua Gunung</Link>
      </div>
    </div>
  </section>
);

// ── How it works ─────────────────────────────────────────
const HowItWorksSection: React.FC = () => {
  const steps = [
    { n: '01', title: 'Pilih Gunung & Jalur', desc: 'Jelajahi berbagai destinasi dan pilih jalur pendakian yang sesuai kemampuan.' },
    { n: '02', title: 'Tentukan Tanggal', desc: 'Pilih tanggal pendakian dan cek ketersediaan kuota secara real-time.' },
    { n: '03', title: 'Lengkapi Data & Bayar', desc: 'Isi data pendaki, lakukan pembayaran online via Midtrans dengan aman.' },
    { n: '04', title: 'Dapatkan E-Ticket QR', desc: 'Tiket digital dengan QR Code dikirim ke emailmu. Siap divalidasi di basecamp.' },
  ];

  return (
    <section id="cara-pemesanan" className="section bg-offwhite">
      <div className="container-main">
        <SectionHeader
          label="Cara Pemesanan"
          title="Langkah Mudah Menuju Puncak."
          subtitle="Proses booking yang sederhana dan transparan."
          center
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[calc(50%+32px)] right-0 h-px bg-gradient-to-r from-[#B8D986] to-transparent z-0" />
              )}
              <div className="relative z-10 bg-white rounded-2xl p-6 shadow-card border border-black/5 h-full">
                <div className="w-14 h-14 rounded-2xl bg-[#173F35] text-[#B8D986] flex items-center justify-center font-black text-lg mb-4 shadow-sm">
                  {step.n}
                </div>
                <h3 className="font-bold text-charcoal mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Features ─────────────────────────────────────────────
const FeaturesSection: React.FC = () => {
  const features = [
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Monitoring Kuota Real-Time', desc: 'Pantau ketersediaan kuota per jalur dan tanggal secara akurat, diperbarui langsung dari balai pengelola.' },
    { icon: <Shield className="w-5 h-5" />, title: 'Pembayaran Aman via Midtrans', desc: 'Berbagai pilihan metode pembayaran: QRIS, Transfer Bank, e-Wallet, Kartu Kredit — semua terjamin aman.' },
    { icon: <QrCode className="w-5 h-5" />, title: 'E-Ticket QR Code', desc: 'Tiket digital terenkripsi dengan QR Code. Dapat disimpan offline dan dipindai cepat di pos pendakian.' },
    { icon: <Mountain className="w-5 h-5" />, title: 'Multi-Gunung, Satu Platform', desc: 'Jelajahi dan pesan tiket berbagai gunung di Indonesia tanpa perlu berpindah-pindah website.' },
    { icon: <Zap className="w-5 h-5" />, title: 'Validasi Tiket Digital', desc: 'Petugas pos dapat memindai QR Code untuk validasi check-in dan check-out pendakian secara akurat.' },
  ];

  return (
    <section className="section bg-white">
      <div className="container-main">
        <SectionHeader
          label="Keunggulan TrailPass"
          title="Pendakian Lebih Mudah & Terpercaya."
          subtitle="Teknologi untuk mendukung pengalaman pendakian yang lebih aman dan terorganisir."
          center
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#173F35]/8 text-[#173F35] flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-charcoal mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── FAQ ───────────────────────────────────────────────────
const faqs = [
  { q: 'Apakah bisa melihat info gunung tanpa login?', a: 'Ya! Kamu bebas menjelajahi seluruh informasi gunung, jalur, kuota, dan persyaratan tanpa perlu login. Login hanya diperlukan saat melakukan pemesanan tiket.' },
  { q: 'Bagaimana cara memesan tiket pendakian?', a: 'Pilih gunung dan jalur, tentukan tanggal pendakian, lengkapi data rombongan, lakukan pembayaran via Midtrans, dan e-tiket QR Code akan langsung diterbitkan.' },
  { q: 'Apakah tiket bisa dibatalkan atau reschedule?', a: 'Pembatalan dan reschedule dapat dilakukan melalui dashboard hiker kamu, dengan kebijakan yang disesuaikan tiap gunung. Refund mengikuti aturan balai pengelola.' },
  { q: 'Bagaimana cara memvalidasi tiket di basecamp?', a: 'Tunjukkan e-tiket di aplikasi atau cetak QR Code kamu kepada petugas pos. Petugas akan memindai QR Code untuk validasi check-in dan check-out.' },
  { q: 'Apakah data saya aman di TrailPass?', a: 'Ya, seluruh data pribadi dienkripsi dan dijaga kerahasiaannya. TrailPass tidak menjual atau membagikan data kepada pihak ketiga.' },
];

const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="section bg-offwhite">
      <div className="container-main max-w-3xl">
        <SectionHeader label="FAQ" title="Pertanyaan yang Sering Diajukan." center />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className={`card border transition-all ${openIdx === i ? 'border-[#285C4A]/25 shadow-card-hover' : 'border-black/5'}`}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 p-5 text-left"
              >
                <span className={`text-sm font-semibold ${openIdx === i ? 'text-[#173F35]' : 'text-charcoal'}`}>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 mt-0.5 transition-transform text-muted ${openIdx === i ? 'rotate-180 text-[#173F35]' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Landing Page ─────────────────────────────────────────
export const LandingPage: React.FC = () => (
  <main>
    <Hero />
    <DestinationsSection />
    <MonthlyQuotaSection />
    <HowItWorksSection />
    <FeaturesSection />
    <FaqSection />
    <Footer />
  </main>
);
