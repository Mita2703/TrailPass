import React from 'react';
import { QrCode, CheckCircle, Calendar, Users, MapPin, Hash, ArrowRight, Shield, Ticket } from 'lucide-react';

// Realistic QR Code SVG (decorative pattern)
const QRCodeDecorativeSVG: React.FC = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
    {/* Finder patterns */}
    {/* Top-left */}
    <rect x="4" y="4" width="34" height="34" rx="4" fill="#0C2B1E" />
    <rect x="10" y="10" width="22" height="22" rx="2" fill="white" />
    <rect x="15" y="15" width="12" height="12" rx="1" fill="#0C2B1E" />
    {/* Top-right */}
    <rect x="82" y="4" width="34" height="34" rx="4" fill="#0C2B1E" />
    <rect x="88" y="10" width="22" height="22" rx="2" fill="white" />
    <rect x="93" y="15" width="12" height="12" rx="1" fill="#0C2B1E" />
    {/* Bottom-left */}
    <rect x="4" y="82" width="34" height="34" rx="4" fill="#0C2B1E" />
    <rect x="10" y="88" width="22" height="22" rx="2" fill="white" />
    <rect x="15" y="93" width="12" height="12" rx="1" fill="#0C2B1E" />
    {/* Data modules — decorative */}
    {[
      [44,4],[50,4],[56,4],[62,4],[70,4],
      [44,10],[56,10],[68,10],[76,10],
      [44,16],[50,16],[56,16],[62,16],[70,16],[76,16],
      [44,22],[62,22],[68,22],
      [44,28],[50,28],[62,28],[70,28],[76,28],
      [4,44],[10,44],[22,44],[28,44],[44,44],[50,44],[62,44],[70,44],[82,44],[94,44],[106,44],[112,44],
      [4,50],[16,50],[28,50],[38,50],[44,50],[56,50],[68,50],[76,50],[88,50],[100,50],[112,50],
      [4,56],[10,56],[16,56],[28,56],[44,56],[62,56],[70,56],[82,56],[94,56],[100,56],[112,56],
      [4,62],[22,62],[28,62],[44,62],[50,62],[68,62],[76,62],[88,62],[106,62],[112,62],
      [4,68],[10,68],[22,68],[38,68],[44,68],[56,68],[68,68],[82,68],[94,68],[112,68],
      [4,76],[16,76],[22,76],[38,76],[50,76],[62,76],[70,76],[88,76],[100,76],[106,76],
      [44,82],[50,82],[68,82],[82,82],[94,82],[106,82],[112,82],
      [44,88],[56,88],[70,88],[76,88],[88,88],[100,88],[112,88],
      [44,94],[62,94],[70,94],[82,94],[88,94],[112,94],
      [44,100],[50,100],[56,100],[68,100],[82,100],[94,100],[106,100],[112,100],
      [44,106],[62,106],[76,106],[88,106],[100,106],[112,106],
      [44,112],[50,112],[68,112],[82,112],[88,112],[100,112],[106,112],[112,112],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="4" height="4" rx="0.5" fill="#0C2B1E" />
    ))}
    {/* Logo center */}
    <rect x="52" y="52" width="16" height="16" rx="3" fill="white" />
    <rect x="54" y="54" width="12" height="12" rx="2" fill="#114232" />
    <path d="M60 56 L64 62 L60 60 L56 62Z" fill="#A3E635" />
  </svg>
);

const TicketMockup: React.FC = () => (
  <div className="relative w-full max-w-sm mx-auto">
    {/* Shadow layer behind */}
    <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#114232]/20 rounded-3xl blur-sm" />

    {/* Main ticket card */}
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-elevated border border-stone-200">
      {/* Header green band */}
      <div className="bg-gradient-to-r from-[#0C2B1E] to-[#1A5336] px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lime-400/20 border border-lime-400/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-lime-400">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-black text-sm leading-none">TrailPass</div>
              <div className="text-lime-400/80 text-[9px] font-semibold uppercase tracking-widest">E-Tiket Resmi</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/50 text-[9px] uppercase tracking-widest">Status</div>
            <div className="flex items-center gap-1 text-lime-400 text-xs font-black mt-0.5">
              <CheckCircle className="w-3 h-3" />
              LUNAS
            </div>
          </div>
        </div>

        {/* Mountain info */}
        <div>
          <div className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5">Destinasi</div>
          <h3 className="text-white text-xl font-black leading-tight">Gunung Rinjani</h3>
          <p className="text-lime-300/80 text-xs font-medium mt-0.5">Jalur Sembalun · 3.726 mdpl · NTB</p>
        </div>
      </div>

      {/* Ticket notch separator */}
      <div className="relative flex items-center px-4 py-2">
        <div className="absolute left-0 w-5 h-5 bg-stone-100 rounded-full -translate-x-1/2" />
        <div className="flex-1 border-t-2 border-dashed border-stone-200" />
        <div className="absolute right-0 w-5 h-5 bg-stone-100 rounded-full translate-x-1/2" />
      </div>

      {/* Ticket details */}
      <div className="px-6 pb-4 space-y-3">
        {[
          { icon: Calendar, label: 'Tanggal Mendaki', value: '14 November 2026' },
          { icon: Users, label: 'Jumlah Pendaki', value: '4 Orang · 1 Rombongan' },
          { icon: MapPin, label: 'Basecamp', value: 'Sembalun Lawang, Lombok Timur' },
          { icon: Hash, label: 'Kode Booking', value: 'TRP-2611-RJN-0042' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-3.5 h-3.5 text-[#114232]" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wide">{label}</div>
              <div className="text-xs font-bold text-stone-900 mt-0.5">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code area */}
      <div className="relative mx-4 mb-5">
        <div className="absolute inset-0 rounded-2xl" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(17,66,50,0.03) 4px, rgba(17,66,50,0.03) 8px)'
        }} />
        <div className="relative bg-white border-2 border-dashed border-stone-200 rounded-2xl p-4 flex items-center gap-4">
          {/* QR */}
          <div className="w-24 h-24 shrink-0">
            <QRCodeDecorativeSVG />
          </div>
          {/* QR info */}
          <div>
            <div className="text-[9px] text-stone-400 uppercase tracking-widest mb-1">Scan QR Code ini di</div>
            <div className="text-xs font-extrabold text-[#0C2B1E] leading-tight mb-2">
              Pos Pendakian<br />Sembalun
            </div>
            <div className="text-[9px] font-mono text-stone-500 bg-stone-50 rounded px-1.5 py-1 border border-stone-200">
              TRP-2611-RJN-0042
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-stone-50 border-t border-stone-100 px-6 py-3 flex items-center justify-between">
        <div className="text-[9px] text-stone-400 font-medium">Diterbitkan: 11 Nov 2026 · 09:14 WIB</div>
        <div className="flex items-center gap-1 text-[9px] text-[#114232] font-bold">
          <Shield className="w-3 h-3" />
          TrailPass Verified
        </div>
      </div>
    </div>
  </div>
);

export const DigitalTicketSection: React.FC = () => {
  return (
    <section id="tiket" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-4 py-1.5 mb-6">
              <Ticket className="w-3.5 h-3.5 text-lime-700" />
              <span className="text-xs font-bold text-lime-800 uppercase tracking-widest">E-Tiket Digital</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0C2B1E] leading-tight tracking-tight mb-5">
              Satu Tiket Digital<br />untuk Setiap<br />
              <span className="text-[#114232]">Perjalanan.</span>
            </h2>

            <p className="text-stone-600 text-base leading-relaxed mb-8 max-w-md">
              Semua informasi pemesanan tersimpan dalam satu tiket digital yang mudah diakses dan divalidasi di pos pendakian — tanpa perlu print, tanpa kertas tercecer.
            </p>

            {/* Benefits list */}
            <ul className="space-y-3 mb-8">
              {[
                { text: 'Tiket terbit otomatis setelah pembayaran dikonfirmasi Midtrans', color: 'bg-emerald-500' },
                { text: 'QR Code terenkripsi, unik per rombongan, tidak bisa dipalsukan', color: 'bg-blue-500' },
                { text: 'Bisa disimpan offline di galeri ponsel', color: 'bg-violet-500' },
                { text: 'Validasi cepat di pos check-in dan check-out basecamp', color: 'bg-lime-500' },
              ].map(({ text, color }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className={`w-5 h-5 rounded-full ${color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <CheckCircle className="w-3 h-3 text-white" />
                  </span>
                  <span className="text-sm text-stone-700 font-medium leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            <button className="inline-flex items-center gap-2.5 bg-[#114232] hover:bg-[#0c3125] text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition-all group text-sm border border-emerald-700/40">
              <QrCode className="w-4 h-4 text-lime-400" />
              Pesan &amp; Dapatkan E-Tiket
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right: Ticket mockup */}
          <div className="relative">
            {/* Decorative background blobs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-lime-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <TicketMockup />
          </div>
        </div>
      </div>
    </section>
  );
};
