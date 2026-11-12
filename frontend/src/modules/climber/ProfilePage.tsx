import React, { useState } from 'react';
import {
  CheckCircle2, Shield, Save, Edit3, Eye, EyeOff
} from 'lucide-react';
import { DEMO_PROFILE } from '../../data/index';

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [maskId, setMaskId] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: DEMO_PROFILE.name,
    email: DEMO_PROFILE.email,
    phone: DEMO_PROFILE.phone,
    birthdate: DEMO_PROFILE.birthdate,
    idType: DEMO_PROFILE.idType,
    idNumber: DEMO_PROFILE.idNumber,
    address: DEMO_PROFILE.address,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const maskedNumber = formData.idNumber
    ? `${formData.idNumber.slice(0, 6)}******${formData.idNumber.slice(-4)}`
    : '';

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div>
          <h1 className="text-xl font-extrabold text-charcoal">Profil Pendaki</h1>
          <p className="text-xs text-muted">
            Kelola data diri dan identitas resmi untuk proses perizinan E-SIMAKSI.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'btn-secondary text-xs' : 'btn-primary text-xs'}
        >
          {isEditing ? 'Batal' : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profil
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Perubahan profil berhasil disimpan ke sistem TrailPass!
        </div>
      )}

      {/* Avatar & Account Level Card */}
      <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#173F35] text-white flex items-center justify-center font-extrabold text-3xl shadow-md border-4 border-white">
            {formData.name.charAt(0)}
          </div>
          <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="SIMAKSI Verified">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-extrabold text-charcoal">{formData.name}</h2>
            <span className="badge-open text-[10px]">Terverifikasi Dukcapil / SIMAKSI</span>
          </div>
          <p className="text-xs text-muted">Anggota aktif sejak Januari 2026</p>
          <p className="text-[11px] text-muted">
            ID Akun: <span className="font-mono font-medium text-charcoal">{DEMO_PROFILE.id}</span>
          </p>
        </div>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <h3 className="text-sm font-extrabold text-charcoal flex items-center gap-2 border-b border-black/5 pb-3">
          <Shield className="w-4 h-4 text-[#173F35]" />
          Informasi Identitas & Kontak
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">
              Nama Lengkap (Sesuai KTP)
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`input-field ${!isEditing ? 'bg-offwhite text-charcoal cursor-not-allowed' : ''}`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="input-field bg-offwhite text-muted cursor-not-allowed"
            />
            <span className="text-[10px] text-muted mt-1 block">Email akun tidak dapat diubah sembarangan.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">
              Nomor Telepon / WhatsApp
            </label>
            <input
              type="tel"
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`input-field ${!isEditing ? 'bg-offwhite text-charcoal cursor-not-allowed' : ''}`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">
              Tanggal Lahir
            </label>
            <input
              type="date"
              disabled={!isEditing}
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              className={`input-field ${!isEditing ? 'bg-offwhite text-charcoal cursor-not-allowed' : ''}`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">
              Jenis Identitas
            </label>
            <select
              disabled={!isEditing}
              value={formData.idType}
              onChange={(e) => setFormData({ ...formData, idType: e.target.value as any })}
              className={`input-field ${!isEditing ? 'bg-offwhite text-charcoal cursor-not-allowed' : ''}`}
            >
              <option value="KTP">KTP (WNI)</option>
              <option value="PASPOR">Paspor (WNA / Internasional)</option>
              <option value="SIM">SIM</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wide">
                Nomor Identitas ({formData.idType})
              </label>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setMaskId(!maskId)}
                  className="text-[11px] font-semibold text-[#173F35] flex items-center gap-1 hover:underline"
                >
                  {maskId ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {maskId ? 'Tampilkan' : 'Sensor'}
                </button>
              )}
            </div>
            <input
              type="text"
              disabled={!isEditing}
              value={isEditing || !maskId ? formData.idNumber : maskedNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              className={`input-field ${!isEditing ? 'bg-offwhite text-charcoal cursor-not-allowed' : ''}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wide">
            Alamat Lengkap
          </label>
          <textarea
            rows={3}
            disabled={!isEditing}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`input-field ${!isEditing ? 'bg-offwhite text-charcoal cursor-not-allowed' : ''}`}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-3 border-t border-black/5">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Perubahan
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
