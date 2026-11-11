import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Mountain, MapPin, Clock, ArrowRight, ChevronRight,
  CheckCircle, AlertTriangle, XCircle, Users, Ruler,
  Info, List, Layers, AlertCircle, BookOpen, ChevronDown,
  Star, Camera
} from 'lucide-react';
import { MOUNTAINS } from '../data/index';
import { StatusBadge, DifficultyBadge, QuotaBar, SectionHeader } from '../components/ui';
import { Footer } from '../components/Footer';

type TabId = 'overview' | 'jalur' | 'fasilitas' | 'persyaratan' | 'peraturan' | 'panduan';

export const MountainDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const mountain = MOUNTAINS.find((m) => m.slug === slug);
  if (!mountain) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Mountain className="w-12 h-12 text-muted mx-auto mb-3" />
        <p className="font-bold text-charcoal">Gunung tidak ditemukan.</p>
        <Link to="/gunung" className="btn-primary mt-4">Kembali ke Daftar</Link>
      </div>
    </div>
  );

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Info className="w-4 h-4" /> },
    { id: 'jalur', label: 'Jalur Pendakian', icon: <Layers className="w-4 h-4" /> },
    { id: 'persyaratan', label: 'Persyaratan', icon: <List className="w-4 h-4" /> },
    { id: 'peraturan', label: 'Peraturan', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'panduan', label: 'Panduan Booking', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Hero */}
      <div className="relative h-[65vh] min-h-[400px] overflow-hidden">
        <img src={mountain.image} alt={mountain.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f18] via-[#0d1f18]/40 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-20 left-0 right-0">
          <div className="container-main">
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/gunung" className="hover:text-white transition-colors">Jelajahi Gunung</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/90">{mountain.name}</span>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="container-main">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <StatusBadge status={mountain.status} className="mb-3" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">{mountain.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{mountain.location}</span>
                  <span className="flex items-center gap-1.5"><Mountain className="w-4 h-4" />{mountain.elevation.toLocaleString('id-ID')} mdpl</span>
                  <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" />{mountain.trails.length} jalur resmi</span>
                </div>
              </div>
              {mountain.status !== 'CLOSED' && (
                <button
                  onClick={() => setActiveTab('jalur')}
                  className="btn-lime py-3 px-6 self-start md:self-auto"
                >
                  Booking Tiket
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="bg-white border-b border-black/5 sticky top-16 z-30 shadow-sm">
        <div className="container-main">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-[#173F35] border-[#173F35] font-semibold'
                    : 'text-muted border-transparent hover:text-charcoal'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container-main py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <div className="card p-6">
                  <h2 className="text-xl font-extrabold text-charcoal mb-4">Tentang {mountain.name}</h2>
                  <p className="text-muted leading-relaxed mb-5">{mountain.longDescription}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Ketinggian', value: `${mountain.elevation.toLocaleString('id-ID')} mdpl` },
                      { label: 'Provinsi', value: mountain.province },
                      { label: 'Jalur Resmi', value: `${mountain.trails.length} jalur` },
                      { label: 'Taman Nasional', value: mountain.nationalPark },
                      { label: 'Musim Terbaik', value: mountain.bestSeason },
                      { label: 'Status', value: mountain.status === 'OPEN' ? 'Buka' : mountain.status === 'LIMITED' ? 'Terbatas' : 'Tutup' },
                    ].map((item) => (
                      <div key={item.label} className="bg-offwhite rounded-xl p-3">
                        <div className="text-xs text-muted font-medium mb-0.5">{item.label}</div>
                        <div className="text-sm font-bold text-charcoal">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {mountain.statusNote && (
                  <div className={`card p-4 border-l-4 ${mountain.status === 'CLOSED' ? 'border-red-400 bg-red-50' : mountain.status === 'LIMITED' ? 'border-amber-400 bg-amber-50' : 'border-emerald-400 bg-emerald-50'}`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${mountain.status === 'CLOSED' ? 'text-red-500' : mountain.status === 'LIMITED' ? 'text-amber-500' : 'text-emerald-600'}`} />
                      <p className="text-sm font-medium text-charcoal">{mountain.statusNote}</p>
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {mountain.gallery.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2"><Camera className="w-4 h-4" /> Galeri Foto</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {mountain.gallery.map((img, i) => (
                        <div key={i} className="rounded-xl overflow-hidden aspect-video">
                          <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* JALUR */}
            {activeTab === 'jalur' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-charcoal">Jalur Pendakian {mountain.name}</h2>
                {mountain.trails.map((trail) => (
                  <div key={trail.id} className="card overflow-hidden">
                    <div className="relative h-44 overflow-hidden">
                      <img src={trail.image} alt={trail.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
                      <div className="absolute top-3 left-3"><StatusBadge status={trail.status} /></div>
                      <div className="absolute bottom-3 left-3">
                        <DifficultyBadge level={trail.difficulty} />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-extrabold text-charcoal mb-1">{trail.name}</h3>
                      <div className="flex items-center gap-1 text-muted text-xs mb-4">
                        <MapPin className="w-3 h-3" />
                        {trail.basecamp}
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          { label: 'Jarak', value: `${trail.distanceKm} km` },
                          { label: 'Durasi', value: trail.durationHours },
                          { label: 'Gain Ele.', value: `+${trail.elevationGain} m` },
                        ].map((info) => (
                          <div key={info.label} className="bg-offwhite rounded-lg p-2.5 text-center">
                            <div className="text-[11px] text-muted mb-0.5">{info.label}</div>
                            <div className="text-xs font-bold text-charcoal">{info.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Quota */}
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Kuota Tersedia</div>
                        <QuotaBar available={trail.quota.available} total={trail.quota.total} status={trail.status} />
                      </div>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {trail.highlights.map((h) => (
                          <span key={h} className="text-xs bg-[#173F35]/6 text-[#173F35] px-2 py-1 rounded-lg font-medium">{h}</span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-3 border-t border-black/5">
                        <button className="btn-secondary flex-1 text-xs py-2.5">Detail Jalur</button>
                        {trail.status !== 'CLOSED' ? (
                          <Link
                            to={`/booking/${mountain.slug}/${trail.id}`}
                            className="btn-primary flex-1 text-center text-xs py-2.5"
                          >
                            Booking Sekarang
                          </Link>
                        ) : (
                          <button disabled className="flex-1 py-2.5 text-xs font-semibold text-muted bg-gray-100 rounded-xl cursor-not-allowed">
                            Jalur Ditutup
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PERSYARATAN */}
            {activeTab === 'persyaratan' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-charcoal">Persyaratan Pendakian</h2>
                {[
                  { title: 'Dokumen yang Diperlukan', icon: <List className="w-5 h-5" />, items: mountain.requirements.documents, color: 'blue' },
                  { title: 'Peralatan Wajib', icon: <Mountain className="w-5 h-5" />, items: mountain.requirements.equipment, color: 'green' },
                  { title: 'Kondisi Kesehatan', icon: <CheckCircle className="w-5 h-5" />, items: mountain.requirements.health, color: 'amber' },
                ].map((section) => (
                  <div key={section.title} className="card p-6">
                    <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2 text-[#173F35]">
                      {section.icon} {section.title}
                    </h3>
                    {section.items.length > 0 ? (
                      <ul className="space-y-2.5">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted">Belum ada informasi persyaratan untuk gunung ini.</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* PERATURAN */}
            {activeTab === 'peraturan' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-charcoal">Peraturan Pendakian</h2>
                {[
                  { title: 'Sebelum Pendakian', items: mountain.rules.before, icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
                  { title: 'Selama Pendakian', items: mountain.rules.during, icon: <Info className="w-4 h-4 text-blue-500" /> },
                  { title: 'Larangan Keras', items: mountain.rules.forbidden, icon: <XCircle className="w-4 h-4 text-red-500" /> },
                ].map((sec) => (
                  <div key={sec.title} className="card p-6">
                    <h3 className="font-bold text-charcoal mb-4">{sec.title}</h3>
                    {sec.items.length > 0 ? (
                      <ul className="space-y-2.5">
                        {sec.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                            {sec.icon}
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted">Belum ada informasi peraturan.</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* PANDUAN */}
            {activeTab === 'panduan' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-charcoal">Panduan Booking Tiket</h2>
                <div className="space-y-4">
                  {[
                    { step: '01', title: 'Pilih Jalur & Tanggal', desc: 'Klik tombol "Booking Sekarang" pada jalur yang diinginkan. Pilih tanggal pendakian yang tersedia dan pastikan kuota masih ada.' },
                    { step: '02', title: 'Login atau Daftar', desc: 'Jika belum memiliki akun, daftar terlebih dahulu. Proses registrasi cepat dan mudah.' },
                    { step: '03', title: 'Isi Data Rombongan', desc: 'Lengkapi data ketua dan seluruh anggota rombongan sesuai identitas resmi (KTP/Paspor).' },
                    { step: '04', title: 'Pembayaran Online', desc: 'Lakukan pembayaran melalui Midtrans dengan metode pilihanmu: QRIS, Transfer Bank, atau e-Wallet.' },
                    { step: '05', title: 'Terima E-Ticket', desc: 'E-ticket dengan QR Code akan dikirim ke emailmu dan tersimpan di dashboard TrailPass.' },
                  ].map((s) => (
                    <div key={s.step} className="card p-5 flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#173F35] text-[#B8D986] font-black text-base flex items-center justify-center shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal mb-1">{s.title}</h4>
                        <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ gunung */}
                {mountain.faqs.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-bold text-charcoal mb-4">FAQ Gunung ini</h3>
                    <div className="space-y-3">
                      {mountain.faqs.map((faq, i) => (
                        <div key={i} className="border border-black/8 rounded-xl overflow-hidden">
                          <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex justify-between items-center p-4 text-left">
                            <span className="text-sm font-semibold text-charcoal">{faq.q}</span>
                            <ChevronDown className={`w-4 h-4 text-muted transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                          </button>
                          {openFaq === i && (
                            <div className="px-4 pb-4">
                              <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick booking */}
            <div className="card p-5 sticky top-32">
              <h3 className="font-extrabold text-charcoal mb-1">{mountain.name}</h3>
              <div className="flex items-center gap-1 text-muted text-xs mb-4">
                <MapPin className="w-3 h-3" /> {mountain.location}
              </div>

              <StatusBadge status={mountain.status} className="mb-4" />

              {mountain.status !== 'CLOSED' && (
                <>
                  <p className="text-xs text-muted mb-4 leading-relaxed">
                    Pilih jalur pendakian untuk melihat kuota dan harga tiket.
                  </p>
                  <button
                    onClick={() => setActiveTab('jalur')}
                    className="btn-primary w-full py-3 justify-center"
                  >
                    Lihat Jalur & Booking
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {mountain.status === 'CLOSED' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-medium">
                  {mountain.statusNote || 'Pendakian ditutup sementara.'}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-black/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Jumlah Jalur</span>
                  <span className="font-semibold text-charcoal">{mountain.trails.length} Jalur</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Musim Terbaik</span>
                  <span className="font-semibold text-charcoal text-right max-w-[150px]">{mountain.bestSeason}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Pengelola</span>
                  <span className="font-semibold text-charcoal text-right max-w-[150px] leading-tight">{mountain.nationalPark}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
