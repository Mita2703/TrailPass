import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain, Ticket, Calendar, MapPin, ArrowRight, CheckCircle2,
  Clock, ShieldCheck, ChevronRight, Compass, Award, QrCode
} from 'lucide-react';
import { DEMO_PROFILE, DEMO_BOOKINGS } from '../../data/index';
import { BookingStatusBadge } from '../../components/ui';

export const DashboardOverview: React.FC = () => {
  const activeTicket = DEMO_BOOKINGS.find((b) => b.status === 'PAID');
  const pendingBooking = DEMO_BOOKINGS.find((b) => b.status === 'PENDING_PAYMENT');
  const completedHikes = DEMO_BOOKINGS.filter((b) => b.status === 'COMPLETED');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173F35] to-[#285C4A] p-6 sm:p-8 text-white shadow-card">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-[#B8D986]/20 border border-[#B8D986]/30 text-[#B8D986] text-xs font-bold px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8D986] animate-pulse" />
            Pendaki Terverifikasi SIMAKSI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Halo, {DEMO_PROFILE.name}! 🏔️
          </h1>
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            Siap untuk petualangan berikutnya? Pantau status tiket aktifmu, jelajahi jalur baru, atau abadikan jurnal pendakianmu di My Hiking Journey.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/gunung"
              className="inline-flex items-center gap-2 bg-[#B8D986] hover:bg-[#a5ca6e] text-[#173F35] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              Jelajahi Gunung
            </Link>
            <Link
              to="/dashboard/tiket"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/20 transition-all backdrop-blur-sm"
            >
              <Ticket className="w-4 h-4" />
              Lihat E-Ticket Saya
            </Link>
          </div>
        </div>

        {/* Decorative background mountain graphic */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none hidden sm:block">
          <Mountain className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pendakian Selesai', value: DEMO_PROFILE.totalHikes, unit: 'Kali', icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Gunung Dikunjungi', value: DEMO_PROFILE.mountainsVisited.length, unit: 'Gunung', icon: Mountain, color: 'text-[#173F35]', bg: 'bg-[#B8D986]/20' },
          { label: 'Tiket Aktif', value: activeTicket ? 1 : 0, unit: 'Tiket', icon: Ticket, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Menunggu Bayar', value: pendingBooking ? 1 : 0, unit: 'Booking', icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="card p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted">{stat.label}</span>
              <div className={`w-8 h-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-charcoal">{stat.value}</span>
              <span className="text-xs font-medium text-muted">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Ticket / Upcoming Booking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Ticket Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-charcoal flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#173F35]" />
              Tiket Pendakian Aktif
            </h2>
            <Link to="/dashboard/tiket" className="text-xs font-bold text-[#173F35] hover:underline flex items-center gap-1">
              Semua Tiket <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeTicket ? (
            <div className="card overflow-hidden border border-emerald-100 hover:shadow-card-hover transition-all">
              <div className="bg-[#173F35] text-white p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#B8D986] uppercase tracking-wider block">
                    E-SIMAKSI Tervalidasi
                  </span>
                  <h3 className="text-lg font-extrabold">{activeTicket.mountain}</h3>
                  <p className="text-xs text-white/70">{activeTicket.trail}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-white/60 block">Kode Booking</span>
                  <span className="text-xs font-mono font-bold bg-white/10 px-2 py-1 rounded border border-white/20">
                    {activeTicket.code}
                  </span>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted block">Jadwal Pendakian</span>
                  <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted" />
                    {activeTicket.date} s/d {activeTicket.returnDate}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-muted block">Peserta</span>
                  <span className="text-xs font-bold text-charcoal">
                    {activeTicket.hikers} Pendaki (Ketua: {activeTicket.leader.name})
                  </span>
                </div>
                <div className="flex sm:justify-end">
                  <Link
                    to="/dashboard/tiket"
                    className="btn-lime text-xs py-2 px-4 w-full sm:w-auto"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Buka QR Code
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center bg-offwhite border-dashed">
              <Ticket className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-charcoal mb-1">Belum ada tiket aktif</p>
              <p className="text-xs text-muted mb-4">Rencanakan pendakianmu sekarang dan dapatkan e-ticket resmi.</p>
              <Link to="/gunung" className="btn-primary text-xs py-2 px-4">
                Pesan Tiket Sekarang
              </Link>
            </div>
          )}

          {/* Pending Payment Alert if any */}
          {pendingBooking && (
            <div className="card p-4 bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Menunggu Pembayaran: {pendingBooking.mountain} ({pendingBooking.code})
                  </h4>
                  <p className="text-[11px] text-amber-700">
                    Segera selesaikan pembayaran Rp {pendingBooking.total.toLocaleString('id-ID')} sebelum kuota kedaluwarsa.
                  </p>
                </div>
              </div>
              <Link
                to={`/dashboard/pemesanan`}
                className="btn-primary text-xs py-2 px-3 bg-amber-800 hover:bg-amber-900 border-none shrink-0"
              >
                Bayar Sekarang
              </Link>
            </div>
          )}
        </div>

        {/* My Hiking Journey Quick Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-charcoal flex items-center gap-2">
              <Award className="w-4 h-4 text-[#173F35]" />
              My Hiking Journey
            </h2>
            <Link to="/dashboard/riwayat" className="text-xs font-bold text-[#173F35] hover:underline">
              Jurnal Lengkap
            </Link>
          </div>

          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-black/5">
              <div className="w-10 h-10 rounded-2xl bg-[#B8D986]/30 text-[#173F35] flex items-center justify-center font-bold">
                7
              </div>
              <div>
                <p className="text-xs font-extrabold text-charcoal">7 Puncak Ditaklukkan</p>
                <p className="text-[11px] text-muted">Semua tervalidasi check-in/out basecamp</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-2">
                Gunung Terakhir Dikunjungi:
              </span>
              <div className="space-y-2">
                {DEMO_PROFILE.mountainsVisited.map((mtn, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-offwhite">
                    <span className="font-semibold text-charcoal flex items-center gap-1.5">
                      <Mountain className="w-3 h-3 text-[#173F35]" />
                      {mtn}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      Tuntas
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/dashboard/riwayat"
              className="w-full btn-secondary text-xs py-2.5 justify-center"
            >
              Buka Timeline & Galeri Perjalanan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
