import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Lock, Shield, Bell, Eye, EyeOff, LogOut,
  CheckCircle2, Key, Smartphone
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');

  // Password state
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Preference switches
  const [privacyPublic, setPrivacyPublic] = useState(false);
  const [waNotification, setWaNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) {
      alert('Password baru minimal 8 karakter.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Konfirmasi password tidak cocok.');
      return;
    }
    setSuccessMsg('Kata sandi berhasil diperbarui!');
    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari akun TrailPass?')) {
      navigate('/masuk');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="pb-4 border-b border-black/5">
        <h1 className="text-xl font-extrabold text-charcoal">Pengaturan Akun & Keamanan</h1>
        <p className="text-xs text-muted">
          Kelola kata sandi, preferensi privasi, dan metode autentikasi akun Anda.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Change Password Card */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-charcoal flex items-center gap-2 border-b border-black/5 pb-3">
          <Key className="w-4 h-4 text-[#173F35]" />
          Ubah Kata Sandi
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-3.5 max-w-md text-xs">
          <div>
            <label className="block font-bold text-charcoal mb-1">Kata Sandi Saat Ini</label>
            <div className="relative">
              <input
                type={showOldPass ? 'text' : 'password'}
                required
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                className="input-field pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              >
                {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Kata Sandi Baru</label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="input-field pr-10"
                placeholder="Min. 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              >
                {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Konfirmasi Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="input-field"
              placeholder="Ulangi kata sandi baru"
            />
          </div>

          <button type="submit" className="btn-primary text-xs py-2 px-4 mt-2">
            Simpan Kata Sandi Baru
          </button>
        </form>
      </div>

      {/* Security & 2FA */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-charcoal flex items-center gap-2 border-b border-black/5 pb-3">
          <Shield className="w-4 h-4 text-[#173F35]" />
          Keamanan & Autentikasi
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-charcoal">Verifikasi 2 Langkah (2FA)</p>
              <p className="text-muted">Kirimkan kode OTP ke WhatsApp setiap kali melakukan login dari perangkat baru.</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-[#173F35] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-black/5">
            <div>
              <p className="font-bold text-charcoal">Privasi Nama Pendaki di Papan Kuota Publik</p>
              <p className="text-muted">Samarkan nama lengkap pada manifest pendakian publik basecamp.</p>
            </div>
            <input
              type="checkbox"
              checked={privacyPublic}
              onChange={(e) => setPrivacyPublic(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-[#173F35] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-charcoal flex items-center gap-2 border-b border-black/5 pb-3">
          <Bell className="w-4 h-4 text-[#173F35]" />
          Notifikasi Sistem
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-charcoal">Notifikasi WhatsApp</p>
              <p className="text-muted">Terima E-Ticket QR, peringatan kuota, dan status buka/tutup jalur via WhatsApp.</p>
            </div>
            <input
              type="checkbox"
              checked={waNotification}
              onChange={(e) => setWaNotification(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-[#173F35] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-black/5">
            <div>
              <p className="font-bold text-charcoal">Notifikasi Email</p>
              <p className="text-muted">Kirimkan invoice resmi Midtrans dan salinan PDF E-SIMAKSI ke email terdaftar.</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotification}
              onChange={(e) => setEmailNotification(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-[#173F35] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="card p-6 border-red-100 bg-red-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-extrabold text-red-900">Keluar dari Akun</h4>
          <p className="text-xs text-red-700">
            Sesi Anda di perangkat ini akan diakhiri.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-primary text-xs py-2 px-4 bg-red-600 hover:bg-red-700 border-none self-start sm:self-auto flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar Sekarang
        </button>
      </div>
    </div>
  );
};
