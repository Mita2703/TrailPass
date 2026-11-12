import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mountain, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/pendaki');
  const isTransparent = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  if (isDashboard) return null; // Dashboard has its own topbar

  const navLinks = [
    { label: 'Beranda', to: '/' },
    { label: 'Jelajahi Gunung', to: '/gunung' },
    { label: 'Cara Pemesanan', to: '/#cara-pemesanan' },
    { label: 'Tentang Kami', to: '/tentang' },
  ];

  const textColor = isTransparent ? 'text-white' : 'text-charcoal';
  const bg = isTransparent
    ? 'bg-[#0a1c15]/85 backdrop-blur-md shadow-sm border-b border-white/10'
    : 'bg-white/95 backdrop-blur-md shadow-nav border-b border-black/5';

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${bg}`}>
      <div className="container-main">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm
              ${isTransparent ? 'bg-[#B8D986] text-[#173F35]' : 'bg-[#173F35] text-white'}`}>
              <Mountain className={`w-5 h-5 ${isTransparent ? 'text-[#173F35]' : 'text-white'}`} />
            </div>
            <div>
              <span className={`text-lg font-extrabold tracking-tight ${isTransparent ? 'text-white' : 'text-[#173F35]'}`}>
                TrailPass
              </span>
              <div className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block leading-none
                ${isTransparent ? 'text-[#B8D986]' : 'text-[#285C4A]'}`}>
                Satu Tiket, Semua Jalur
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {navLinks.map((link) => {
              const isActive = link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to.replace('/#', '/'));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-1.5 text-sm font-semibold rounded-xl transition-all
                    ${isTransparent
                      ? isActive
                        ? 'text-white bg-white/15'
                        : 'text-white/85 hover:text-white hover:bg-white/10'
                      : isActive
                        ? 'text-[#173F35] bg-[#B8D986]/30'
                        : 'text-muted hover:text-charcoal hover:bg-black/5'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Auth buttons */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Link
              to="/masuk"
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors
                ${isTransparent
                  ? 'text-white hover:bg-white/15'
                  : 'text-[#173F35] hover:bg-[#173F35]/8'
                }`}
            >
              Masuk
            </Link>
            <Link
              to="/daftar"
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all shadow-sm
                ${isTransparent
                  ? 'bg-[#B8D986] hover:bg-[#a5ca6e] text-[#173F35]'
                  : 'bg-[#173F35] hover:bg-[#285C4A] text-white'
                }`}
            >
              Daftar
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden ml-auto p-2 rounded-xl transition-colors
              ${isTransparent ? 'text-white hover:bg-white/10' : 'text-charcoal hover:bg-black/5'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-black/5 shadow-lg">
          <div className="container-main py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2.5 text-sm font-medium text-charcoal hover:text-[#173F35] hover:bg-[#173F35]/5 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-black/5 flex gap-2">
              <Link to="/masuk" className="flex-1 btn-secondary text-center text-sm py-2.5">Masuk</Link>
              <Link to="/daftar" className="flex-1 btn-primary text-center text-sm py-2.5">Daftar</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
