import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Mail, Instagram, Twitter, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#173F35] text-white">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="container-main py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold mb-1">Siap Memulai Petualangan?</h3>
              <p className="text-white/60 text-sm">Jelajahi ratusan jalur pendakian dan pesan tiketmu sekarang.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/gunung" className="btn-lime gap-2 py-3 px-6">
                Jelajahi Gunung
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/daftar" className="border border-white/30 hover:bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors">
                Buat Akun Gratis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-main py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#B8D986]/20 flex items-center justify-center">
                <Mountain className="w-5 h-5 text-[#B8D986]" />
              </div>
              <span className="text-lg font-extrabold">TrailPass</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Platform E-Ticketing dan E-SIMAKSI pendakian multi-gunung di Indonesia.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-white/60" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Navigasi', links: [['Beranda', '/'], ['Jelajahi Gunung', '/gunung'], ['Cara Pemesanan', '/#cara-pemesanan'], ['Tentang Kami', '/tentang']] },
            { title: 'Bantuan', links: [['Pusat Bantuan', '#'], ['FAQ', '#faq'], ['Syarat & Ketentuan', '/syarat'], ['Kebijakan Privasi', '/privasi']] },
            { title: 'Destinasi', links: [['Gunung Merbabu', '/gunung/gunung-merbabu'], ['Gunung Rinjani', '/gunung/gunung-rinjani'], ['Gunung Prau', '/gunung/gunung-prau'], ['Gunung Bromo', '/gunung/gunung-bromo']] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-white/60 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <span>© {year} TrailPass. All Rights Reserved.</span>
          <span>Dibuat dengan penuh semangat untuk para pendaki Indonesia 🏔️</span>
        </div>
      </div>
    </footer>
  );
};
