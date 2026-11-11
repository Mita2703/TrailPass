import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mountain, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

// ── Login Page ────────────────────────────────────────────
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Email dan password harus diisi.'); return; }
    setLoading(true);
    // Simulate auth (replace with real API call)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    // Demo: any input logs in
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-20 max-w-md mx-auto w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 w-fit">
          <div className="w-9 h-9 bg-[#173F35] rounded-xl flex items-center justify-center">
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold text-[#173F35]">TrailPass</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-charcoal mb-1.5">Selamat datang kembali.</h1>
          <p className="text-muted text-sm mb-8">Masuk untuk melanjutkan petualanganmu.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@kamu.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pr-11"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 accent-[#173F35]"
                />
                <span className="text-sm text-muted">Ingat saya</span>
              </label>
              <Link to="/lupa-password" className="text-sm text-[#173F35] font-semibold hover:underline">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : 'Masuk'}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Belum punya akun?{' '}
            <Link to="/daftar" className="text-[#173F35] font-bold hover:underline">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Image (desktop only) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
          alt="Pegunungan"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#173F35]/70 to-[#285C4A]/50" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <blockquote className="text-xl font-bold leading-snug mb-3">
            "Setiap puncak yang kamu capai dimulai dari satu langkah pertama."
          </blockquote>
          <p className="text-white/60 text-sm">— TrailPass, Satu Tiket Semua Jalur</p>
        </div>
      </div>
    </div>
  );
};

// ── Register Page ─────────────────────────────────────────
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', agree: false });
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
    if (form.password !== form.confirm) e.confirm = 'Password tidak sama.';
    if (!form.agree) e.agree = 'Kamu harus menyetujui syarat dan ketentuan.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/masuk'), 2000);
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-extrabold text-charcoal mb-2">Akun berhasil dibuat!</h2>
        <p className="text-muted text-sm">Mengarahkan ke halaman login...</p>
      </div>
    </div>
  );

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={`input-field ${errors[key] ? 'border-red-300 ring-1 ring-red-200' : ''}`}
      />
      {errors[key] && <p className="text-xs text-red-600 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-offwhite flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80" alt="Gunung" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#173F35]/70 to-[#285C4A]/50" />
        <div className="absolute top-10 left-10">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold">TrailPass</span>
          </Link>
        </div>
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="section-label bg-[#B8D986]/20 text-[#B8D986] border-[#B8D986]/30 mb-4">Gratis & Mudah</div>
          <h2 className="text-2xl font-extrabold mb-2">Mulai petualanganmu sekarang.</h2>
          <p className="text-white/60 text-sm">Daftar dalam 1 menit dan eksplorasi berbagai gunung di Indonesia.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-20 max-w-md mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 mb-10 w-fit lg:hidden">
          <div className="w-9 h-9 bg-[#173F35] rounded-xl flex items-center justify-center">
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold text-[#173F35]">TrailPass</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-charcoal mb-1.5">Buat akun baru.</h1>
        <p className="text-muted text-sm mb-8">Daftar gratis dan mulai jelajahi gunung Indonesia.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('name', 'Nama Lengkap', 'text', 'Sesuai KTP / Paspor')}
          {field('email', 'Email', 'email', 'email@kamu.com')}
          {field('phone', 'Nomor Telepon', 'tel', '08xxxxxxxxxx')}

          <div>
            <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimal 8 karakter"
                className={`input-field pr-11 ${errors.password ? 'border-red-300' : ''}`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide">Konfirmasi Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Ulangi password"
              className={`input-field ${errors.confirm ? 'border-red-300' : ''}`}
            />
            {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>}
          </div>

          <div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#173F35]"
              />
              <span className="text-sm text-muted leading-relaxed">
                Saya menyetujui{' '}
                <Link to="/syarat" className="text-[#173F35] font-semibold hover:underline">Syarat & Ketentuan</Link>
                {' '}dan{' '}
                <Link to="/privasi" className="text-[#173F35] font-semibold hover:underline">Kebijakan Privasi</Link>
                {' '}TrailPass.
              </span>
            </label>
            {errors.agree && <p className="text-xs text-red-600 mt-1">{errors.agree}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60">
            {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Buat Akun'}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          Sudah punya akun?{' '}
          <Link to="/masuk" className="text-[#173F35] font-bold hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
};
