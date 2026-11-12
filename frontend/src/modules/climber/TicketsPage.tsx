import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket, Download, Eye, Calendar, Users, Mountain,
  ShieldCheck, CheckCircle2, X
} from 'lucide-react';
import { DEMO_BOOKINGS, Booking } from '../../data/index';

// Realistic SVG QR Code Component
const QRCodeTicketSVG: React.FC<{ code: string }> = () => (
  <svg viewBox="0 0 140 140" className="w-full h-full" fill="none">
    {/* Finder Top-Left */}
    <rect x="6" y="6" width="36" height="36" rx="4" fill="#173F35" />
    <rect x="12" y="12" width="24" height="24" rx="2" fill="white" />
    <rect x="18" y="18" width="12" height="12" rx="1" fill="#173F35" />

    {/* Finder Top-Right */}
    <rect x="98" y="6" width="36" height="36" rx="4" fill="#173F35" />
    <rect x="104" y="12" width="24" height="24" rx="2" fill="white" />
    <rect x="110" y="18" width="12" height="12" rx="1" fill="#173F35" />

    {/* Finder Bottom-Left */}
    <rect x="6" y="98" width="36" height="36" rx="4" fill="#173F35" />
    <rect x="12" y="104" width="24" height="24" rx="2" fill="white" />
    <rect x="18" y="110" width="12" height="12" rx="1" fill="#173F35" />

    {/* Decorative bit modules */}
    {[
      [48,8],[54,8],[60,8],[68,8],[76,8],[84,8],
      [48,16],[60,16],[72,16],[84,16],
      [48,24],[54,24],[66,24],[76,24],[84,24],
      [48,32],[68,32],[80,32],
      [8,48],[16,48],[28,48],[36,48],[48,48],[56,48],[68,48],[80,48],[92,48],[104,48],[116,48],[124,48],
      [8,56],[24,56],[40,56],[48,56],[64,56],[72,56],[88,56],[96,56],[112,56],[128,56],
      [8,64],[16,64],[28,64],[48,64],[56,64],[68,64],[80,64],[92,64],[108,64],[120,64],
      [8,72],[24,72],[36,72],[48,72],[60,72],[76,72],[88,72],[104,72],[116,72],
      [8,80],[16,80],[28,80],[48,80],[56,80],[68,80],[84,80],[96,80],[112,80],[124,80],
      [8,88],[24,88],[40,88],[48,88],[64,88],[76,88],[92,88],[108,88],[120,88],
      [48,98],[56,98],[68,98],[80,98],[92,98],[104,98],[116,98],[124,98],
      [48,106],[64,106],[76,106],[88,106],[100,106],[112,106],[128,106],
      [48,114],[54,114],[68,114],[80,114],[92,114],[108,114],[120,114],
      [48,122],[60,122],[72,122],[84,122],[96,122],[112,122],[124,122]
    ].map(([x,y], i) => (
      <rect key={i} x={x} y={y} width="5" height="5" rx="1" fill="#173F35" />
    ))}

    {/* Center Mountain Logo Badge */}
    <rect x="58" y="58" width="24" height="24" rx="4" fill="white" />
    <rect x="61" y="61" width="18" height="18" rx="3" fill="#173F35" />
    <path d="M70 65 L76 73 L70 71 L64 73 Z" fill="#B8D986" />
  </svg>
);

export const TicketsPage: React.FC = () => {
  const paidBookings = DEMO_BOOKINGS.filter((b) => b.status === 'PAID' || b.status === 'COMPLETED');
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  const handleDownload = (code: string) => {
    alert(`E-Ticket ${code} siap diunduh dalam format PDF resmi dengan enkripsi QR Code SIMAKSI.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div>
          <h1 className="text-xl font-extrabold text-charcoal">E-Ticket Digital Saya</h1>
          <p className="text-xs text-muted">
            Tiket resmi pendakian ber-QR Code untuk proses validasi di pos basecamp.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Dapat disimpan offline di ponsel</span>
        </div>
      </div>

      {/* Tickets Grid */}
      {paidBookings.length === 0 ? (
        <div className="card p-12 text-center bg-offwhite border-dashed">
          <Ticket className="w-12 h-12 text-muted mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-bold text-charcoal mb-1">Belum ada e-ticket aktif</h3>
          <p className="text-xs text-muted mb-4">
            E-ticket digital otomatis diterbitkan setelah pembayaran diverifikasi oleh Midtrans.
          </p>
          <Link to="/gunung" className="btn-primary text-xs py-2 px-4">
            Pesan Tiket Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paidBookings.map((ticket) => (
            <div
              key={ticket.id}
              className="card overflow-hidden border border-emerald-100 hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              {/* Ticket Top Banner */}
              <div className="bg-[#173F35] text-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#B8D986]/20 flex items-center justify-center">
                      <Mountain className="w-4 h-4 text-[#B8D986]" />
                    </div>
                    <span className="text-xs font-bold tracking-tight">TRAILPASS E-SIMAKSI</span>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    <CheckCircle2 className="w-3 h-3" />
                    {ticket.status === 'COMPLETED' ? 'SELESAI' : 'LUNAS / AKTIF'}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold">{ticket.mountain}</h3>
                <p className="text-xs text-[#B8D986]">{ticket.trail}</p>
              </div>

              {/* Perforated Divider */}
              <div className="relative flex items-center px-3 py-1 bg-white">
                <div className="w-4 h-4 rounded-full bg-offwhite -ml-5 border-r border-black/5" />
                <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                <div className="w-4 h-4 rounded-full bg-offwhite -mr-5 border-l border-black/5" />
              </div>

              {/* Ticket Body with QR preview */}
              <div className="p-5 grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2 space-y-2.5">
                  <div>
                    <span className="text-[10px] text-muted uppercase tracking-wider block">Kode Booking</span>
                    <span className="text-xs font-mono font-bold text-charcoal">{ticket.code}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted uppercase tracking-wider block">Jadwal Pendakian</span>
                    <span className="text-xs font-semibold text-charcoal flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted" />
                      {ticket.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted uppercase tracking-wider block">Ketua Rombongan & Peserta</span>
                    <span className="text-xs font-semibold text-charcoal flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted" />
                      {ticket.leader.name} ({ticket.hikers} Pendaki)
                    </span>
                  </div>
                </div>

                {/* QR Code thumbnail */}
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-offwhite border border-black/5">
                  <div className="w-20 h-20">
                    <QRCodeTicketSVG code={ticket.code} />
                  </div>
                  <span className="text-[9px] font-mono text-muted mt-1">Scan Pos</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 bg-offwhite border-t border-black/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleDownload(ticket.code)}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Tiket
                </button>
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Lihat Tiket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Ticket Modal for Pos Scanning */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-black/10">
            {/* Modal Header */}
            <div className="bg-[#173F35] text-white p-6 relative text-center">
              <button
                onClick={() => setSelectedTicket(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-[#B8D986]/20 text-[#B8D986] text-[10px] font-bold px-3 py-1 rounded-full mb-2">
                <ShieldCheck className="w-3 h-3" /> E-SIMAKSI RESMI
              </div>
              <h3 className="text-xl font-extrabold">{selectedTicket.mountain}</h3>
              <p className="text-xs text-[#B8D986]">{selectedTicket.trail}</p>
            </div>

            {/* Large QR Display for Scanner */}
            <div className="p-6 text-center space-y-4">
              <div className="w-48 h-48 mx-auto p-3 bg-white border-2 border-dashed border-[#173F35]/40 rounded-2xl shadow-inner">
                <QRCodeTicketSVG code={selectedTicket.code} />
              </div>

              <div>
                <p className="text-xs font-mono font-extrabold text-charcoal">{selectedTicket.code}</p>
                <p className="text-[11px] text-muted mt-0.5">
                  Tunjukkan QR Code ini kepada petugas pos pendaftaran saat check-in dan check-out.
                </p>
              </div>

              <div className="bg-offwhite rounded-2xl p-3.5 text-left text-xs space-y-1.5 border border-black/5">
                <div className="flex justify-between">
                  <span className="text-muted">Ketua Rombongan:</span>
                  <span className="font-bold text-charcoal">{selectedTicket.leader.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Peserta:</span>
                  <span className="font-bold text-charcoal">{selectedTicket.hikers} Pendaki</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Tanggal Naik:</span>
                  <span className="font-bold text-charcoal">{selectedTicket.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Status Pembayaran:</span>
                  <span className="font-bold text-emerald-700">Lunas (Midtrans)</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="btn-secondary flex-1 text-xs py-2"
                >
                  Tutup
                </button>
                <button
                  onClick={() => handleDownload(selectedTicket.code)}
                  className="btn-lime flex-1 text-xs py-2 text-center flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
