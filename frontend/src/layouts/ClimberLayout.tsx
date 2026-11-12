import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, User, ShoppingBag, Ticket, Map, Users, Settings,
  Mountain, LogOut, Bell, ChevronRight, Menu, X, ArrowLeft
} from 'lucide-react';
import { DEMO_PROFILE } from '../data/index';

const navItems = [
  { to: '/pendaki/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/pendaki/profil', label: 'Profil Saya', icon: User },
  { to: '/pendaki/pemesanan', label: 'Pemesanan Saya', icon: ShoppingBag },
  { to: '/pendaki/tiket', label: 'E-Ticket Saya', icon: Ticket },
  { to: '/pendaki/riwayat', label: 'My Hiking Journey', icon: Map },
  { to: '/pendaki/data-rombongan', label: 'Data Rombongan', icon: Users },
  { to: '/pendaki/pengaturan', label: 'Pengaturan', icon: Settings },
];

const Sidebar: React.FC<{ mobile?: boolean; onClose?: () => void }> = ({ mobile, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className={`flex flex-col h-full ${mobile ? 'w-72' : 'w-64'} bg-white border-r border-black/5`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#173F35] rounded-xl flex items-center justify-center">
            <Mountain className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <span className="text-base font-extrabold text-[#173F35] block leading-tight">TrailPass</span>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Portal Pendaki</span>
          </div>
        </Link>
        {mobile && onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-charcoal hover:bg-black/5">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="px-4 py-4 border-b border-black/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-offwhite">
          <div className="w-9 h-9 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
            {DEMO_PROFILE.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-charcoal truncate">{DEMO_PROFILE.name}</div>
            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SIMAKSI Verified
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={isActive(to, exact) ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            {isActive(to, exact) && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* Footer Navigation */}
      <div className="px-3 py-4 border-t border-black/5 space-y-1">
        <Link to="/gunung" className="sidebar-link">
          <Mountain className="w-4 h-4" />
          Jelajahi Gunung
        </Link>
        <button
          onClick={() => navigate('/masuk')}
          className="sidebar-link w-full text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  );
};

export const ClimberLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentNav = navItems.find((n) =>
    n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );
  const pageTitle = currentNav?.label || 'Area Pendaki';

  return (
    <div className="flex h-screen bg-offwhite overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="h-16 bg-white border-b border-black/5 flex items-center px-4 sm:px-6 gap-3 shrink-0 shadow-sm justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-muted hover:text-charcoal hover:bg-black/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-charcoal">{pageTitle}</h1>
              <p className="text-[11px] text-muted hidden sm:block">Kelola izin SIMAKSI dan riwayat pendakianmu.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/gunung"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#173F35] bg-[#B8D986]/25 hover:bg-[#B8D986]/40 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Mountain className="w-3.5 h-3.5" />
              Pesan Tiket
            </Link>

            <button className="relative p-2 rounded-xl text-muted hover:text-charcoal hover:bg-black/5">
              <Bell className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>

            <Link to="/pendaki/profil" className="flex items-center gap-2 pl-2 border-l border-black/5">
              <div className="w-8 h-8 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {DEMO_PROFILE.name.charAt(0)}
              </div>
            </Link>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
