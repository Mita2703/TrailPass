import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mountain, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    agree: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nama lengkap harus diisi.';
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Format email tidak valid.';
    if (form.phone.length < 10) e.phone = 'Nomor telepon minimal 10 digit.';
    if (form.password.length < 8) e.password = 'Password minimal 8 karakter.';
    if (form.password !== form.confirm) e.confirm = 'Konfirmasi password tidak cocok.';
    if (!form.agree) e.agree = 'Anda harus menyetujui syarat & ketentuan.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      navigate('/pendaki/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Left Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8 w-fit group">
          <div className="w-10 h-10 bg-forest-900 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Mountain className="w-5 h-5 text-lime-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-forest-900">TrailPass</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest-600 -mt-1">
              Satu Tiket Semua Jalur
            </span>
          </div>
        </Link>

        {success ? (
          <div className="text-center py-10 bg-white rounded-3xl p-8 shadow-card border border-black/5 animate-in fade-in">
            <div className="w-16 h-16 bg-lime-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-forest-800" />
            </div>
            <h2 className="text-2xl font-extrabold text-charcoal mb-2">Akun Berhasil Dibuat!</h2>
            <p className="text-muted text-sm mb-6">
              Mengarahkan Anda ke Dashboard Pendaki...
            </p>
            <div className="w-6 h-6 border-2 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-extrabold text-charcoal mb-1.5">Buat Akun Pendaki</h1>
            <p className="text-muted text-sm mb-6">
              Daftar untuk pemesanan tiket, validasi e-SIMAKSI, dan pencatatan riwayat pendakian.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">
                  Nama Lengkap Sesuai KTP/Identitas
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Andi Pratama"
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="andi@email.com"
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">
                  Nomor WhatsApp / HP
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="081234567890"
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Minimal 8 karakter"
                    className={`input-field pr-11 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">
                  Konfirmasi Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Ulangi password"
                  className={`input-field ${errors.confirm ? 'border-red-500' : ''}`}
                />
                {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
              </div>

              <div>
                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#173F35]"
                  />
                  <span className="text-xs text-muted leading-relaxed">
                    Saya menyetujui{' '}
                    <span className="text-forest-800 font-semibold underline">Syarat & Ketentuan SIMAKSI</span> dan{' '}
                    <span className="text-forest-800 font-semibold underline">Kebijakan Privasi</span> TrailPass.
                  </span>
                </label>
                {errors.agree && <p className="text-xs text-red-500 mt-1">{errors.agree}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60 shadow-md mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  'Buat Akun Pendaki'
                )}
              </button>
            </form>

            <p className="text-sm text-muted text-center mt-6">
              Sudah punya akun?{' '}
              <Link to="/masuk" className="text-forest-800 font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Right: Banner */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
          alt="Gunung Rinjani"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#173F35]/80 via-[#173F35]/50 to-[#285C4A]/40" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
            <h3 className="text-xl font-bold mb-2">Mengapa Mendaftar di TrailPass?</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                Satu akun untuk pemesanan di seluruh taman nasional dan gunung.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                Simpan data anggota rombongan tanpa input ulang saat booking.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                Jurnal pendakian digital "My Hiking Journey" otomatis tervalidasi.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
