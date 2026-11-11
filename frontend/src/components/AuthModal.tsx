import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'climber' | 'organizer'>('climber');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: fullName || (email.split('@')[0] || 'User Pendaki'),
        role: role,
        email: email || 'user@trailpass.id',
      });
      onClose();
    }, 600);
  };

  const handleQuickLogin = (demoRole: 'climber' | 'organizer' | 'admin') => {
    onLoginSuccess({
      name:
        demoRole === 'admin'
          ? 'Admin TrailPass'
          : demoRole === 'organizer'
          ? 'Pengelola Balai TNGR'
          : 'Arya Pratama',
      role: demoRole,
      email: `${demoRole}@trailpass.id`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-emerald-950 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] text-lime-400 font-bold uppercase tracking-widest block">
              TrailPass Portal
            </span>
            <h3 className="text-lg font-extrabold">
              {mode === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Akun Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all ${
              mode === 'login'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-500'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all ${
              mode === 'register'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-stone-500'
            }`}
          >
            Daftar (Register)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Nama sesuai KTP"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Nomor HP / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Daftar Sebagai</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('climber')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      role === 'climber'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    Pendaki
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      role === 'organizer'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    Pengelola Gunung
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Demo 1-Click Login Shortcuts */}
          <div className="pt-4 border-t border-stone-100">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block text-center mb-2">
              Masuk Cepat Demo:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('climber')}
                className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-bold text-stone-700"
              >
                👤 Pendaki
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('organizer')}
                className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-bold text-stone-700"
              >
                🌲 Pengelola
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-bold text-stone-700"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
