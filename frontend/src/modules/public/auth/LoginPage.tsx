import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mountain, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/pendaki/dashboard';

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email dan password harus diisi.');
      return;
    }
    setLoading(true);
    // Simulate auth
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-20 max-w-md mx-auto w-full">
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

        <div>
          <h1 className="text-3xl font-extrabold text-charcoal mb-1.5">Selamat datang kembali.</h1>
          <p className="text-muted text-sm mb-8">Masuk untuk melanjutkan petualangan dan akses e-SIMAKSI Anda.</p>

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
                placeholder="nama@email.com"
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
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                >
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
              <Link to="/lupa-password" className="text-sm text-forest-800 font-semibold hover:underline">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60 mt-2 shadow-md"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                'Masuk ke Akun'
              )}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Belum punya akun?{' '}
            <Link to="/daftar" className="text-forest-800 font-bold hover:underline">
              Daftar gratis
            </Link>
          </p>

          <div className="mt-8 p-3.5 bg-forest-50 border border-forest-100 rounded-2xl text-xs text-forest-800 flex items-center justify-between">
            <span className="font-medium">Akun Demo:</span>
            <button
              type="button"
              onClick={() => {
                setForm({ email: 'andi.pratama@example.com', password: 'password123', remember: true });
              }}
              className="text-xs font-bold text-forest-900 underline hover:text-forest-700"
            >
              Isi data demo
            </button>
          </div>
        </div>
      </div>

      {/* Right: Image (desktop only) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
          alt="Pegunungan Indonesia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#173F35]/80 via-[#173F35]/50 to-[#285C4A]/40" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="inline-block bg-lime-400 text-forest-900 font-extrabold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-4">
            E-SIMAKSI Terintegrasi
          </div>
          <blockquote className="text-2xl font-bold leading-snug mb-3">
            "Satu tiket digital terintegrasi untuk seluruh jalur resmi gunung di Indonesia."
          </blockquote>
          <p className="text-white/70 text-sm">— TrailPass • Explore Mountains, Book Your Adventure</p>
        </div>
      </div>
    </div>
  );
};
