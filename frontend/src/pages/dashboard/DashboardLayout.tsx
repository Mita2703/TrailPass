import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, User, ShoppingBag, Ticket, Map, Users, Settings,
  Mountain, LogOut, Bell, ChevronRight, Menu, X
} from 'lucide-react';
import { DEMO_PROFILE } from '../../data/index';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/profil', label: 'Profil Saya', icon: User },
  { to: '/dashboard/pemesanan', label: 'Pemesanan Saya', icon: ShoppingBag },
  { to: '/dashboard/tiket', label: 'E-Ticket Saya', icon: Ticket },
  { to: '/dashboard/riwayat', label: 'My Hiking Journey', icon: Map },
  { to: '/dashboard/data-pendaki', label: 'Data Pendaki', icon: Users },
  { to: '/dashboard/pengaturan', label: 'Pengaturan', icon: Settings },
];

const Sidebar: React.FC<{ mobile?: boolean; onClose?: () => void }> = ({ mobile, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className={`flex flex-col h-full ${mobile ? 'w-72' : 'w-64'} bg-white border-r border-black/5`}>
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#173F35] rounded-xl flex items-center justify-center">
            <Mountain className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
          </div>
          <span className="text-base font-extrabold text-[#173F35]">TrailPass</span>
        </Link>
        {mobile && onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-charcoal hover:bg-black/5">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Profile mini */}
      <div className="px-4 py-4 border-b border-black/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-offwhite">
          <div className="w-9 h-9 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {DEMO_PROFILE.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-charcoal truncate">{DEMO_PROFILE.name}</div>
            <div className="text-xs text-muted truncate">{DEMO_PROFILE.email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
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

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-black/5 space-y-1">
        <Link to="/gunung" className="sidebar-link">
          <Mountain className="w-4 h-4" />
          Jelajahi Gunung
        </Link>
        <button
          onClick={() => navigate('/masuk')}
          className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  );
};

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = navItems.find((n) =>
    n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to)
  )?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-offwhite overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-black/5 flex items-center px-4 sm:px-6 gap-3 shrink-0 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-muted hover:text-charcoal hover:bg-black/5"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="text-sm font-bold text-charcoal">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-muted hover:text-charcoal hover:bg-black/5">
              <Bell className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-sm">
              {DEMO_PROFILE.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
