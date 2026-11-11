// ============================================================
// TRAILPASS — Centralized Data & Types
// ============================================================

export type HikingStatus = 'OPEN' | 'LIMITED' | 'CLOSED';
export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Menantang' | 'Sangat Menantang';

export interface Trail {
  id: string;
  name: string;
  basecamp: string;
  distanceKm: number;
  durationHours: string;
  difficulty: DifficultyLevel;
  elevationGain: number;
  status: HikingStatus;
  quota: { available: number; total: number };
  image: string;
  highlights: string[];
  facilities: string[];
  price: number; // IDR per person
}

export interface Mountain {
  id: string;
  slug: string;
  name: string;
  province: string;
  location: string;
  elevation: number;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  status: HikingStatus;
  statusNote?: string;
  trails: Trail[];
  requirements: {
    documents: string[];
    equipment: string[];
    health: string[];
  };
  rules: {
    before: string[];
    during: string[];
    forbidden: string[];
  };
  faqs: { q: string; a: string }[];
  nationalPark: string;
  bestSeason: string;
  coordinates: { lat: number; lng: number };
}

export interface Booking {
  id: string;
  code: string;
  mountain: string;
  trail: string;
  date: string;
  returnDate: string;
  hikers: number;
  total: number;
  status: 'PENDING_PAYMENT' | 'PROCESSING' | 'PAID' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  leader: { name: string; idNumber: string };
}

export interface HikerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  idType: 'KTP' | 'PASPOR' | 'SIM';
  idNumber: string;
  address: string;
  avatar?: string;
  joinedAt: string;
  totalHikes: number;
  mountainsVisited: string[];
}

export const MOUNTAINS: Mountain[] = [
  {
    id: 'merbabu',
    slug: 'gunung-merbabu',
    name: 'Gunung Merbabu',
    province: 'Jawa Tengah',
    location: 'Boyolali, Magelang & Semarang',
    elevation: 3145,
    description: 'Surga savana hijau dengan panorama Merapi yang memukau.',
    longDescription: 'Gunung Merbabu berada di Taman Nasional Gunung Merbabu, Jawa Tengah. Terkenal dengan hamparan savana hijau yang luas dan panorama Gunung Merapi yang berdiri gagah di sebelahnya. Dengan 4 jalur resmi, Merbabu menawarkan variasi pengalaman pendakian dari yang ramah pemula hingga menantang.',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'OPEN',
    statusNote: 'Semua jalur beroperasi normal. Kuota harian dibatasi.',
    nationalPark: 'Taman Nasional Gunung Merbabu',
    bestSeason: 'April – Oktober (Musim Kemarau)',
    coordinates: { lat: -7.455, lng: 110.439 },
    trails: [
      {
        id: 'selo',
        name: 'Jalur Selo',
        basecamp: 'Desa Selo, Boyolali',
        distanceKm: 7.2,
        durationHours: '5–7 jam',
        difficulty: 'Sedang',
        elevationGain: 1200,
        status: 'LIMITED',
        quota: { available: 42, total: 250 },
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        highlights: ['Savana Lembah Merbabu', 'Puncak Kenteng Songo', 'View Gunung Merapi'],
        facilities: ['Toilet', 'Warung', 'Area Camping'],
        price: 15000,
      },
      {
        id: 'suwanting',
        name: 'Jalur Suwanting',
        basecamp: 'Desa Suwanting, Magelang',
        distanceKm: 8.5,
        durationHours: '6–8 jam',
        difficulty: 'Menantang',
        elevationGain: 1450,
        status: 'OPEN',
        quota: { available: 112, total: 150 },
        image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
        highlights: ['Hutan Pinus Lebat', 'View Panorama 360°', 'Sunrise Terbaik'],
        facilities: ['Toilet', 'Area Camping'],
        price: 15000,
      },
      {
        id: 'wekas',
        name: 'Jalur Wekas',
        basecamp: 'Desa Wekas, Magelang',
        distanceKm: 6.8,
        durationHours: '5–6 jam',
        difficulty: 'Sedang',
        elevationGain: 1150,
        status: 'OPEN',
        quota: { available: 98, total: 150 },
        image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?auto=format&fit=crop&w=800&q=80',
        highlights: ['Trek Landai', 'Hutan Tropis', 'Pemandangan Lembah'],
        facilities: ['Toilet', 'Warung', 'Area Camping', 'Pos Kesehatan'],
        price: 15000,
      },
      {
        id: 'thekelan',
        name: 'Jalur Thekelan',
        basecamp: 'Kopeng, Semarang',
        distanceKm: 7.5,
        durationHours: '5–7 jam',
        difficulty: 'Sedang',
        elevationGain: 1300,
        status: 'OPEN',
        quota: { available: 65, total: 100 },
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        highlights: ['Vegetasi Beragam', 'Camp Sabana', 'Puncak Triangulasi'],
        facilities: ['Toilet', 'Area Camping'],
        price: 15000,
      },
    ],
    requirements: {
      documents: ['KTP / Paspor / SIM asli yang masih berlaku', 'Surat Keterangan Sehat dari dokter (maks. H-7)', 'Form pendaftaran yang telah diisi secara online'],
      equipment: ['Tenda dan sleeping bag', 'Matras', 'Jaket waterproof', 'Headlamp + baterai cadangan', 'Peralatan masak & logistik', 'P3K dasar', 'Trash bag (zero waste)'],
      health: ['Tidak menderita penyakit jantung, asma, atau tekanan darah tinggi', 'Usia minimal 10 tahun (dengan pendamping dewasa)', 'Kondisi fisik prima saat mendaki'],
    },
    rules: {
      before: ['Daftar dan bayar secara online melalui TrailPass sebelum keberangkatan', 'Lapor ke pos basecamp dengan menunjukkan e-ticket QR Code', 'Patuhi jadwal keberangkatan sesuai booking'],
      during: ['Jaga kebersihan jalur, bawa kembali seluruh sampah', 'Patuhi arahan petugas pos pendakian', 'Jangan melewati jalur yang tidak resmi'],
      forbidden: ['Membuang sampah sembarangan', 'Memetik, merusak, atau membawa flora dan fauna', 'Menyalakan api sembarangan', 'Membawa minuman beralkohol', 'Mendirikan tenda di luar zona camping'],
    },
    faqs: [
      { q: 'Berapa lama waktu pendakian rata-rata ke puncak?', a: 'Tergantung jalur yang dipilih. Rata-rata 5–8 jam perjalanan dari basecamp ke puncak.' },
      { q: 'Apakah ada pemandu (guide) yang wajib?', a: 'Pemandu tidak diwajibkan, namun sangat disarankan bagi pendaki pemula.' },
      { q: 'Bisakah membatalkan atau reschedule tiket?', a: 'Pembatalan dan reschedule dapat dilakukan melalui dashboard TrailPass, dengan ketentuan yang berlaku.' },
    ],
  },
  {
    id: 'rinjani',
    slug: 'gunung-rinjani',
    name: 'Gunung Rinjani',
    province: 'Nusa Tenggara Barat',
    location: 'Lombok Timur & Lombok Utara',
    elevation: 3726,
    description: 'Kaldera vulkanik megah dengan Danau Segara Anak di ketinggian 2.000 mdpl.',
    longDescription: 'Gunung Rinjani adalah gunung berapi tertinggi kedua di Indonesia dan ikon utama Pulau Lombok. Kawasan Taman Nasional Gunung Rinjani menawarkan pemandangan kaldera vulkanik raksasa, Danau Segara Anak yang biru jernih, serta sumber air panas alami.',
    image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80'],
    status: 'OPEN',
    nationalPark: 'Taman Nasional Gunung Rinjani',
    bestSeason: 'April – November',
    coordinates: { lat: -8.412, lng: 116.467 },
    trails: [
      {
        id: 'sembalun',
        name: 'Jalur Sembalun',
        basecamp: 'Desa Sembalun, Lombok Timur',
        distanceKm: 18.5,
        durationHours: '2–3 hari',
        difficulty: 'Menantang',
        elevationGain: 2200,
        status: 'OPEN',
        quota: { available: 88, total: 150 },
        image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
        highlights: ['Plawangan Sembalun', 'Danau Segara Anak', 'Puncak 3.726 mdpl'],
        facilities: ['Toilet', 'Warung', 'Area Camping'],
        price: 5000,
      },
      {
        id: 'senaru',
        name: 'Jalur Senaru',
        basecamp: 'Desa Senaru, Lombok Utara',
        distanceKm: 16.2,
        durationHours: '2–3 hari',
        difficulty: 'Sedang',
        elevationGain: 1950,
        status: 'LIMITED',
        quota: { available: 14, total: 100 },
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        highlights: ['Hutan Tropis Lebat', 'Air Terjun Sendang Gile', 'Plawangan Senaru'],
        facilities: ['Toilet', 'Area Camping'],
        price: 5000,
      },
    ],
    requirements: {
      documents: ['KTP / Paspor asli', 'Surat Keterangan Sehat', 'Bukti booking TrailPass'],
      equipment: ['Tenda, sleeping bag, matras', 'Jaket hangat & jas hujan', 'Headlamp, P3K, trash bag'],
      health: ['Kondisi fisik prima', 'Tidak ada riwayat penyakit jantung/paru-paru'],
    },
    rules: {
      before: ['Daftar online & bayar sebelum berangkat', 'Lapor ke pos Sembalun/Senaru dengan e-ticket'],
      during: ['Jaga kebersihan, bawa semua sampah turun', 'Patuhi arahan petugas'],
      forbidden: ['Membuang sampah', 'Merusak flora & fauna', 'Api sembarangan'],
    },
    faqs: [
      { q: 'Wajibkah menggunakan guide di Rinjani?', a: 'Ya, pendakian ke Rinjani wajib menggunakan guide lokal berlisensi sesuai aturan TNGR.' },
      { q: 'Berapa lama pendakian standar ke puncak?', a: 'Umumnya 2–3 hari perjalanan pergi pulang, termasuk menginap di camp.' },
    ],
  },
  {
    id: 'semeru',
    slug: 'gunung-semeru',
    name: 'Gunung Semeru',
    province: 'Jawa Timur',
    location: 'Lumajang & Malang',
    elevation: 3676,
    description: 'Atap tertinggi Pulau Jawa dengan legenda Ranu Kumbolo dan Mahameru.',
    longDescription: 'Gunung Semeru adalah puncak tertinggi di Pulau Jawa. Menawarkan pemandangan ikonik Danau Ranu Kumbolo, padang bunga Oro-Oro Ombo, serta kawah aktif Jonggring Saloko.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'],
    status: 'CLOSED',
    statusNote: 'Jalur ditutup sementara — Status Waspada (Level II) berdasarkan rekomendasi PVMBG.',
    nationalPark: 'Taman Nasional Bromo Tengger Semeru',
    bestSeason: 'April – Oktober',
    coordinates: { lat: -8.108, lng: 112.922 },
    trails: [
      {
        id: 'ranupani',
        name: 'Jalur Ranupani',
        basecamp: 'Desa Ranupani, Lumajang',
        distanceKm: 17.0,
        durationHours: '2–3 hari',
        difficulty: 'Menantang',
        elevationGain: 2150,
        status: 'CLOSED',
        quota: { available: 0, total: 500 },
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        highlights: ['Ranu Kumbolo', 'Oro-Oro Ombo', 'Puncak Mahameru'],
        facilities: ['Toilet', 'Warung', 'Pos Kesehatan'],
        price: 19000,
      },
    ],
    requirements: { documents: [], equipment: [], health: [] },
    rules: { before: [], during: [], forbidden: [] },
    faqs: [],
  },
  {
    id: 'gede-pangrango',
    slug: 'gunung-gede-pangrango',
    name: 'Gunung Gede Pangrango',
    province: 'Jawa Barat',
    location: 'Cianjur, Sukabumi & Bogor',
    elevation: 2958,
    description: 'Padang edelweiss Surya Kencana seluas 50 hektar di ketinggian Jawa Barat.',
    longDescription: 'Taman Nasional Gunung Gede Pangrango merupakan salah satu taman nasional tertua di Indonesia. Terkenal dengan padang edelweiss Alun-Alun Surya Kencana, kawah aktif, dan canopy trail yang unik.',
    image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?auto=format&fit=crop&w=1200&q=80'],
    status: 'OPEN',
    nationalPark: 'Taman Nasional Gunung Gede Pangrango',
    bestSeason: 'April – Oktober',
    coordinates: { lat: -6.78, lng: 106.985 },
    trails: [
      {
        id: 'cibodas',
        name: 'Jalur Cibodas',
        basecamp: 'Pintu Masuk Cibodas, Cianjur',
        distanceKm: 12.8,
        durationHours: '6–8 jam',
        difficulty: 'Sedang',
        elevationGain: 1500,
        status: 'OPEN',
        quota: { available: 142, total: 300 },
        image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?auto=format&fit=crop&w=800&q=80',
        highlights: ['Air Terjun Cibeureum', 'Kawah Ratu', 'Alun-Alun Surya Kencana'],
        facilities: ['Toilet', 'Warung', 'Pos Kesehatan', 'Area Camping'],
        price: 29000,
      },
      {
        id: 'gunung-putri',
        name: 'Jalur Gunung Putri',
        basecamp: 'Desa Sukatani, Cianjur',
        distanceKm: 9.5,
        durationHours: '5–7 jam',
        difficulty: 'Menantang',
        elevationGain: 1750,
        status: 'LIMITED',
        quota: { available: 18, total: 200 },
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        highlights: ['Trek Curam Berkarakter', 'View Lembah Cianjur', 'Surya Kencana via Puncak'],
        facilities: ['Toilet', 'Area Camping'],
        price: 29000,
      },
    ],
    requirements: { documents: ['KTP semua anggota', 'Surat Keterangan Sehat'], equipment: ['Tenda, sleeping bag', 'Jaket hangat'], health: ['Rombongan minimal 3 orang'] },
    rules: { before: ['Daftar & bayar online'], during: ['Jaga kebersihan'], forbidden: ['Memetik edelweiss', 'Membuang sampah'] },
    faqs: [{ q: 'Bolehkah memetik bunga edelweiss?', a: 'Tidak diperbolehkan. Edelweiss dilindungi undang-undang.' }],
  },
  {
    id: 'prau',
    slug: 'gunung-prau',
    name: 'Gunung Prau',
    province: 'Jawa Tengah',
    location: 'Wonosobo, Temanggung & Batang',
    elevation: 2565,
    description: 'Golden sunrise terbaik dengan bukit teletubbies dan panorama Sindoro-Sumbing.',
    longDescription: 'Gunung Prau di Dataran Tinggi Dieng menawarkan pengalaman pendakian yang relatif singkat namun memukau. Sunrise dari puncaknya disebut sebagai salah satu yang paling indah di Jawa.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'],
    status: 'OPEN',
    nationalPark: 'Forum Pengelola Gunung Prau',
    bestSeason: 'Sepanjang tahun (terbaik Mei–Sep)',
    coordinates: { lat: -7.188, lng: 109.922 },
    trails: [
      {
        id: 'patak-banteng',
        name: 'Jalur Patak Banteng',
        basecamp: 'Kejajar, Wonosobo',
        distanceKm: 4.2,
        durationHours: '2.5–3.5 jam',
        difficulty: 'Sedang',
        elevationGain: 850,
        status: 'OPEN',
        quota: { available: 220, total: 400 },
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
        highlights: ['Trek Favorit Pemula', 'Sunrise Spektakuler', 'Bukit Teletubbies'],
        facilities: ['Toilet', 'Warung', 'Area Camping'],
        price: 25000,
      },
      {
        id: 'dieng',
        name: 'Jalur Dieng Kulon',
        basecamp: 'Kawasan Dieng, Banjarnegara',
        distanceKm: 5.0,
        durationHours: '3–4 jam',
        difficulty: 'Mudah',
        elevationGain: 650,
        status: 'OPEN',
        quota: { available: 180, total: 200 },
        image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
        highlights: ['Trek Landai Ramah Keluarga', 'Lembah Daisy', 'View Sindoro-Sumbing'],
        facilities: ['Toilet', 'Warung', 'Area Camping'],
        price: 25000,
      },
    ],
    requirements: { documents: ['KTP / Kartu Pelajar'], equipment: ['Jaket tebal (suhu 2–10°C)', 'Sleeping bag', 'Headlamp'], health: ['Tidak ada batasan khusus'] },
    rules: { before: ['Daftar online'], during: ['Zero waste, bawa semua sampah turun'], forbidden: ['Membuang sampah', 'Api sembarangan'] },
    faqs: [{ q: 'Apakah cocok untuk pemula?', a: 'Ya, Jalur Patak Banteng sangat cocok untuk pemula dengan perjalanan 2.5–3.5 jam.' }],
  },
  {
    id: 'bromo',
    slug: 'gunung-bromo',
    name: 'Gunung Bromo',
    province: 'Jawa Timur',
    location: 'Probolinggo, Pasuruan & Malang',
    elevation: 2329,
    description: 'Kaldera vulkanik ikonik dengan lautan pasir dan sunrise Penanjakan yang legendaris.',
    longDescription: 'Gunung Bromo berada di kawasan Taman Nasional Bromo Tengger Semeru. Merupakan destinasi wisata alam paling ikonik di Jawa Timur dengan pemandangan lautan pasir dan kawah aktif yang spektakuler.',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80'],
    status: 'OPEN',
    nationalPark: 'Taman Nasional Bromo Tengger Semeru',
    bestSeason: 'April – Oktober',
    coordinates: { lat: -7.942, lng: 112.953 },
    trails: [
      {
        id: 'cemoro-lawang',
        name: 'Jalur Cemoro Lawang',
        basecamp: 'Cemoro Lawang, Probolinggo',
        distanceKm: 3.5,
        durationHours: '1.5–2 jam',
        difficulty: 'Mudah',
        elevationGain: 420,
        status: 'OPEN',
        quota: { available: 350, total: 600 },
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
        highlights: ['Sunrise Penanjakan', 'Kawah Aktif Bromo', 'Lautan Pasir Tengger'],
        facilities: ['Toilet', 'Warung', 'Parkir Jeep'],
        price: 29000,
      },
    ],
    requirements: { documents: ['E-Tiket TrailPass / TNBTS'], equipment: ['Masker debu', 'Jaket tebal'], health: [] },
    rules: { before: ['Booking online wajib'], during: ['Patuhi radius aman kawah'], forbidden: ['Mendekati kawah tanpa izin'] },
    faqs: [{ q: 'Apakah bisa naik kuda?', a: 'Ya, tersedia ojek kuda dari lautan pasir menuju anak tangga kawah.' }],
  },
];

// Demo bookings for dashboard
export const DEMO_BOOKINGS: Booking[] = [
  { id: '1', code: 'TRP-2611-MRB-0021', mountain: 'Gunung Merbabu', trail: 'Jalur Selo', date: '2026-11-15', returnDate: '2026-11-16', hikers: 3, total: 45000, status: 'PAID', createdAt: '2026-11-10', leader: { name: 'Andi Pratama', idNumber: '3374010101990001' } },
  { id: '2', code: 'TRP-2612-PRU-0088', mountain: 'Gunung Prau', trail: 'Jalur Patak Banteng', date: '2026-12-05', returnDate: '2026-12-06', hikers: 5, total: 125000, status: 'PENDING_PAYMENT', createdAt: '2026-11-09', leader: { name: 'Andi Pratama', idNumber: '3374010101990001' } },
  { id: '3', code: 'TRP-2610-GDE-0045', mountain: 'Gunung Gede Pangrango', trail: 'Jalur Cibodas', date: '2026-10-20', returnDate: '2026-10-21', hikers: 4, total: 116000, status: 'COMPLETED', createdAt: '2026-10-10', leader: { name: 'Andi Pratama', idNumber: '3374010101990001' } },
];

export const DEMO_PROFILE: HikerProfile = {
  id: 'usr-001',
  name: 'Andi Pratama',
  email: 'andi.pratama@email.com',
  phone: '081234567890',
  birthdate: '1999-01-01',
  idType: 'KTP',
  idNumber: '3374010101990001',
  address: 'Jl. Merbabu Indah No. 12, Boyolali, Jawa Tengah',
  joinedAt: '2026-01-15',
  totalHikes: 7,
  mountainsVisited: ['Gunung Merbabu', 'Gunung Gede Pangrango', 'Gunung Prau'],
};
