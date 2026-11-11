import React, { useState } from 'react';
import {
  Users, Plus, Trash2, Edit2, Shield, Eye, EyeOff,
  UserCheck, AlertCircle, X, Check
} from 'lucide-react';

interface SavedHiker {
  id: string;
  name: string;
  idType: 'KTP' | 'PASPOR' | 'SIM';
  idNumber: string;
  phone: string;
  emergencyContact: string;
  relation: string;
}

const INITIAL_HIKERS: SavedHiker[] = [
  {
    id: 'h-1',
    name: 'Budi Santoso',
    idType: 'KTP',
    idNumber: '3374021204980002',
    phone: '081298765432',
    emergencyContact: '081399887766 (Istri)',
    relation: 'Teman',
  },
  {
    id: 'h-2',
    name: 'Citra Dewi Lestari',
    idType: 'KTP',
    idNumber: '3374015609010005',
    phone: '085712345678',
    emergencyContact: '081244556677 (Orang Tua)',
    relation: 'Keluarga',
  },
  {
    id: 'h-3',
    name: 'Dimas Kurniawan',
    idType: 'KTP',
    idNumber: '3374032508970001',
    phone: '089677889900',
    emergencyContact: '081233445566 (Kakak)',
    relation: 'Teman',
  },
];

export const HikersDataPage: React.FC = () => {
  const [hikers, setHikers] = useState<SavedHiker[]>(INITIAL_HIKERS);
  const [showMask, setShowMask] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    idType: 'KTP' as 'KTP' | 'PASPOR' | 'SIM',
    idNumber: '',
    phone: '',
    emergencyContact: '',
    relation: 'Teman',
  });

  const toggleMask = (id: string) => {
    setShowMask((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskIdNumber = (num: string) => {
    if (!num || num.length < 8) return num;
    return `${num.slice(0, 4)}******${num.slice(-4)}`;
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      idType: 'KTP',
      idNumber: '',
      phone: '',
      emergencyContact: '',
      relation: 'Teman',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (hiker: SavedHiker) => {
    setEditingId(hiker.id);
    setForm({
      name: hiker.name,
      idType: hiker.idType,
      idNumber: hiker.idNumber,
      phone: hiker.phone,
      emergencyContact: hiker.emergencyContact,
      relation: hiker.relation,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus data pendaki ini dari daftar tersimpan?')) {
      setHikers(hikers.filter((h) => h.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.idNumber) {
      alert('Nama dan Nomor Identitas wajib diisi.');
      return;
    }

    if (editingId) {
      setHikers(
        hikers.map((h) => (h.id === editingId ? { ...h, ...form } : h))
      );
    } else {
      const newHiker: SavedHiker = {
        id: `h-${Date.now()}`,
        ...form,
      };
      setHikers([...hikers, newHiker]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div>
          <h1 className="text-xl font-extrabold text-charcoal">Data Anggota Rombongan</h1>
          <p className="text-xs text-muted">
            Simpan data teman pendakian Anda agar pemesanan tiket E-SIMAKSI berikutnya lebih cepat.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Anggota
        </button>
      </div>

      {/* Security Privacy Notice */}
      <div className="flex items-start gap-3 bg-offwhite p-4 rounded-2xl border border-black/5 text-xs text-muted">
        <Shield className="w-4 h-4 text-[#173F35] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-charcoal font-bold">Privasi Terjaga:</strong> Nomor identitas kependudukan (NIK/Paspor) disensor demi keamanan. Data ini hanya digunakan untuk pendaftaran perizinan SIMAKSI resmi ke Balai Pengelola Gunung.
        </p>
      </div>

      {/* Hikers Table / Cards */}
      <div className="card overflow-hidden border border-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-offwhite border-b border-black/5">
              <tr>
                <th className="py-3 px-4 font-bold text-muted uppercase">Nama Anggota</th>
                <th className="py-3 px-4 font-bold text-muted uppercase">Identitas Resmi</th>
                <th className="py-3 px-4 font-bold text-muted uppercase">Kontak Telepon</th>
                <th className="py-3 px-4 font-bold text-muted uppercase">Kontak Darurat</th>
                <th className="py-3 px-4 font-bold text-muted uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {hikers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    Belum ada anggota rombongan tersimpan. Klik "Tambah Anggota" untuk menambahkan.
                  </td>
                </tr>
              ) : (
                hikers.map((hiker) => {
                  const isVisible = showMask[hiker.id];
                  return (
                    <tr key={hiker.id} className="hover:bg-offwhite/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-charcoal">
                        {hiker.name}
                        <span className="block text-[10px] text-muted font-normal mt-0.5">
                          Hubungan: {hiker.relation}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-charcoal font-bold">
                            {hiker.idType}
                          </span>
                          <span className="text-charcoal font-medium">
                            {isVisible ? hiker.idNumber : maskIdNumber(hiker.idNumber)}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleMask(hiker.id)}
                            className="text-muted hover:text-charcoal p-1 rounded"
                            title={isVisible ? 'Sensor' : 'Tampilkan'}
                          >
                            {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-charcoal">
                        {hiker.phone || '-'}
                      </td>

                      <td className="py-3.5 px-4 text-muted">
                        {hiker.emergencyContact || '-'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(hiker)}
                            className="p-1.5 text-muted hover:text-[#173F35] hover:bg-black/5 rounded-lg transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(hiker.id)}
                            className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Hiker */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-black/5">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <h3 className="text-base font-extrabold text-charcoal">
                {editingId ? 'Edit Data Anggota' : 'Tambah Anggota Rombongan'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-offwhite hover:bg-black/5 flex items-center justify-center text-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-charcoal mb-1">Nama Lengkap (Sesuai KTP)</label>
                <input
                  type="text"
                  required
                  placeholder="Mis. Bambang Pamungkas"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Jenis ID</label>
                  <select
                    value={form.idType}
                    onChange={(e) => setForm({ ...form, idType: e.target.value as any })}
                    className="input-field cursor-pointer"
                  >
                    <option value="KTP">KTP</option>
                    <option value="PASPOR">Paspor</option>
                    <option value="SIM">SIM</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-charcoal mb-1">Nomor Identitas</label>
                  <input
                    type="text"
                    required
                    placeholder="16 digit NIK"
                    value={form.idNumber}
                    onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Kontak Darurat & Hubungan</label>
                <input
                  type="text"
                  placeholder="Mis. 081234567890 (Ibu Kandung)"
                  value={form.emergencyContact}
                  onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Hubungan dengan Ketua</label>
                <select
                  value={form.relation}
                  onChange={(e) => setForm({ ...form, relation: e.target.value })}
                  className="input-field cursor-pointer"
                >
                  <option value="Teman">Teman</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Rekan Kerja">Rekan Kerja</option>
                  <option value="Komunitas">Komunitas Pecinta Alam</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary flex-1 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 justify-center"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
