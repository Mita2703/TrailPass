import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Calendar, Users, Mountain,
  CreditCard, X, QrCode
} from 'lucide-react';
import { DEMO_BOOKINGS, Booking } from '../../data/index';
import { BookingStatusBadge } from '../../components/ui';

type BookingFilter = 'ALL' | 'PENDING_PAYMENT' | 'PROCESSING' | 'PAID' | 'CANCELLED' | 'COMPLETED';

export const BookingsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filters: { id: BookingFilter; label: string }[] = [
    { id: 'ALL', label: 'Semua' },
    { id: 'PENDING_PAYMENT', label: 'Menunggu Pembayaran' },
    { id: 'PROCESSING', label: 'Diproses' },
    { id: 'PAID', label: 'Terbayar' },
    { id: 'CANCELLED', label: 'Dibatalkan' },
    { id: 'COMPLETED', label: 'Selesai' },
  ];

  const filteredBookings = DEMO_BOOKINGS.filter((b) => {
    if (activeFilter === 'ALL') return true;
    return b.status === activeFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div>
          <h1 className="text-xl font-extrabold text-charcoal">Pemesanan Saya</h1>
          <p className="text-xs text-muted">
            Riwayat dan status seluruh transaksi booking tiket pendakian Anda.
          </p>
        </div>

        <Link to="/gunung" className="btn-primary text-xs self-start sm:self-auto">
          <Mountain className="w-3.5 h-3.5" />
          Pesan Tiket Baru
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === f.id
                ? 'bg-[#173F35] text-white shadow-sm'
                : 'bg-white text-muted hover:text-charcoal border border-black/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="card p-12 text-center bg-offwhite border-dashed">
            <ShoppingBag className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-bold text-charcoal mb-1">Tidak ada pemesanan</h3>
            <p className="text-xs text-muted">
              Tidak ada data pemesanan pada kategori ini.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="card p-5 hover:shadow-card-hover transition-all border border-black/5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-charcoal bg-offwhite px-2 py-1 rounded border border-black/5">
                    {booking.code}
                  </span>
                  <span className="text-xs text-muted">
                    Dibuat pada {booking.createdAt}
                  </span>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 items-center">
                <div className="md:col-span-2">
                  <h3 className="text-base font-extrabold text-charcoal">{booking.mountain}</h3>
                  <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                    <Mountain className="w-3.5 h-3.5 text-[#173F35]" />
                    {booking.trail}
                  </p>
                  <p className="text-xs text-charcoal/80 flex items-center gap-1.5 mt-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-muted" />
                    {booking.date} s/d {booking.returnDate}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-muted block">Jumlah Peserta</span>
                  <span className="text-xs font-bold text-charcoal flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-muted" />
                    {booking.hikers} Pendaki
                  </span>
                  <span className="text-[10px] text-muted block mt-0.5">Ketua: {booking.leader.name}</span>
                </div>

                <div>
                  <span className="text-[11px] text-muted block">Total Biaya</span>
                  <span className="text-sm font-extrabold text-[#173F35]">
                    Rp {booking.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/5">
                <div className="text-[11px] text-muted">
                  Pembayaran resmi terhubung dengan Midtrans
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Lihat Detail
                  </button>

                  {booking.status === 'PAID' && (
                    <Link
                      to="/pendaki/tiket"
                      className="btn-lime text-xs py-1.5 px-3"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      E-Ticket
                    </Link>
                  )}

                  {booking.status === 'PENDING_PAYMENT' && (
                    <button
                      onClick={() => alert(`Membuka popup pembayaran Midtrans untuk ${booking.code}`)}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Bayar Sekarang
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-black/5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <h3 className="text-base font-extrabold text-charcoal">Rincian Pemesanan</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-7 h-7 rounded-lg bg-offwhite hover:bg-black/5 flex items-center justify-center text-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-offwhite">
                <span className="text-muted">Kode Booking:</span>
                <span className="font-mono font-bold text-charcoal">{selectedBooking.code}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Destinasi:</span>
                  <span className="font-semibold text-charcoal">{selectedBooking.mountain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Jalur Registrasi:</span>
                  <span className="font-semibold text-charcoal">{selectedBooking.trail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Jadwal Masuk:</span>
                  <span className="font-semibold text-charcoal">{selectedBooking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Rencana Keluar:</span>
                  <span className="font-semibold text-charcoal">{selectedBooking.returnDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Status:</span>
                  <BookingStatusBadge status={selectedBooking.status} />
                </div>
              </div>

              <div className="pt-3 border-t border-black/5">
                <h4 className="font-bold text-charcoal mb-2">Data Ketua Rombongan:</h4>
                <div className="p-3 rounded-xl bg-offwhite space-y-1">
                  <p className="font-semibold text-charcoal">{selectedBooking.leader.name}</p>
                  <p className="text-muted font-mono">{selectedBooking.leader.idNumber}</p>
                  <p className="text-muted">{selectedBooking.leader.phone || '081234567890'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 flex justify-between items-center">
                <span className="font-bold text-charcoal">Total Tagihan:</span>
                <span className="text-base font-extrabold text-[#173F35]">
                  Rp {selectedBooking.total.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="btn-secondary w-full justify-center text-xs py-2.5"
                >
                  Tutup
                </button>
                {selectedBooking.status === 'PAID' && (
                  <Link
                    to="/pendaki/tiket"
                    className="btn-lime w-full justify-center text-xs py-2.5"
                  >
                    Buka E-Ticket
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
