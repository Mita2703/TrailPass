import { Mountain } from '../types';

export const MOUNTAINS_DATA: Mountain[] = [
  {
    id: 'rinjani',
    slug: 'gunung-rinjani',
    name: 'Gunung Rinjani',
    alias: 'Atap Lombok',
    elevation: 3726,
    region: 'Nusa Tenggara',
    location: 'Lombok Timur, Nusa Tenggara Barat',
    description: 'Gunung berapi tertinggi kedua di Indonesia dengan Danau Segara Anak yang memukau dan kaldera vulkanik megah.',
    longDescription: 'Taman Nasional Gunung Rinjani menyuguhkan panorama kaldera vulkanik raksasa dengan Danau Segara Anak di ketinggian 2.000 mdpl serta kerucut aktif Gunung Barujari. Pendakian melewati savana Sembalun yang luas dan hutan hujan tropis Senaru.',
    imageUrl: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'TERSEDIA',
    statusNote: 'Jalur Sembalun & Senaru beroperasi normal. Kuota harian dibatasi demi kelestarian.',
    trailsCount: 4,
    startingPrice: 5000,
    weekendPrice: 7500,
    activeParkName: 'Balai Taman Nasional Gunung Rinjani (TNGR)',
    features: ['Danau Segara Anak', 'Pemandian Air Panas Aik Kalak', 'Puncak 3.726 mdpl', 'Plawangan Sembalun'],
    simaksiRequirements: [
      'Identitas resmi (KTP/Paspor/SIM)',
      'Surat Keterangan Sehat dari dokter/klinik',
      'Wajib didampingi Guide / Porter lokal berlisensi (Aturan TNGR)',
      'Peralatan standar pendakian (tenda waterproof, sleeping bag, matras, nesting, P3K)',
      'Deposit sampah (Trash Bag Check-in)'
    ],
    trails: [
      {
        id: 'sembalun',
        name: 'Jalur Sembalun',
        basecamp: 'Desa Sembalun Lawang, Lombok Timur',
        lengthKm: 18.5,
        difficulty: 'Menantang',
        estimatedHours: '8 - 10 Jam ke Plawangan',
        availableQuota: 88,
        totalQuota: 150,
        status: 'TERSEDIA'
      },
      {
        id: 'senaru',
        name: 'Jalur Senaru',
        basecamp: 'Desa Senaru, Lombok Utara',
        lengthKm: 16.2,
        difficulty: 'Sedang',
        estimatedHours: '7 - 9 Jam ke Plawangan',
        availableQuota: 14,
        totalQuota: 100,
        status: 'KUOTA_TERBATAS'
      },
      {
        id: 'torean',
        name: 'Jalur Torean',
        basecamp: 'Desa Loloan, Bayan, Lombok Utara',
        lengthKm: 14.8,
        difficulty: 'Menantang',
        estimatedHours: '8 - 11 Jam (Jalur Lembah)',
        availableQuota: 45,
        totalQuota: 80,
        status: 'TERSEDIA'
      },
      {
        id: 'timbanuh',
        name: 'Jalur Timbanuh',
        basecamp: 'Desa Timbanuh, Pringgasela',
        lengthKm: 15.0,
        difficulty: 'Sangat Menantang',
        estimatedHours: '9 - 12 Jam',
        availableQuota: 30,
        totalQuota: 40,
        status: 'TERSEDIA'
      }
    ]
  },
  {
    id: 'semeru',
    slug: 'gunung-semeru',
    name: 'Gunung Semeru',
    alias: 'Puncak Mahameru',
    elevation: 3676,
    region: 'Jawa Timur',
    location: 'Lumajang & Malang, Jawa Timur',
    description: 'Puncak tertinggi Pulau Jawa dengan keindahan magis Danau Ranu Kumbolo dan pesona Oro-Oro Ombo.',
    longDescription: 'Gunung Semeru merupakan atap tertinggi di Pulau Jawa yang bernaung di bawah Balai Besar Taman Nasional Bromo Tengger Semeru (TNBTS). Destinasi ikonik ini terkenal dengan keindahan danau air tawar alami Ranu Kumbolo serta padang bunga Verbena di Oro-Oro Ombo.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'DITUTUP',
    statusNote: 'Jalur pendakian ditutup sementara berdasarkan rekomendasi PVMBG status Waspada Level II (Aktivitas Vulkanik & Pemulihan Ekosistem).',
    trailsCount: 1,
    startingPrice: 19000,
    weekendPrice: 24000,
    activeParkName: 'Balai Besar TNBTS (Bromo Tengger Semeru)',
    features: ['Danau Ranu Kumbolo', 'Tanjakan Cinta', 'Oro-Oro Ombo', 'Kalimati & Mahameru'],
    simaksiRequirements: [
      'KTP / Paspor asli yang masih berlaku',
      'Surat Keterangan Dokter (maksimal H-1 keberangkatan)',
      'Bukti booking online resmi TNBTS (E-SIMAKSI)',
      'Batas aman pendakian hanya sampai batas yang direkomendasikan PVMBG',
      'Peralatan bivak & logistik mandiri'
    ],
    trails: [
      {
        id: 'ranupani',
        name: 'Jalur Ranupani',
        basecamp: 'Desa Ranupani, Senduro, Lumajang',
        lengthKm: 17.0,
        difficulty: 'Menantang',
        estimatedHours: '9 - 11 Jam ke Kalimati',
        availableQuota: 0,
        totalQuota: 500,
        status: 'DITUTUP'
      }
    ]
  },
  {
    id: 'gede-pangrango',
    slug: 'gunung-gede-pangrango',
    name: 'Gunung Gede Pangrango',
    alias: 'Alun-Alun Surya Kencana',
    elevation: 2958,
    region: 'Jawa Barat',
    location: 'Cianjur, Sukabumi & Bogor, Jawa Barat',
    description: 'Hutan hujan tropis rimbun, padang bunga edelweiss Surya Kencana seluas 50 hektar, serta air terjun Cibeureum.',
    longDescription: 'Taman Nasional Gunung Gede Pangrango (TNGGP) adalah laboratorium alam tertua di Indonesia. Menyajikan pemandangan padang edelweiss Surya Kencana, kawah aktif Gunung Gede, jembatan gantung canopy trail, dan sumber mata air panas alami.',
    imageUrl: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'TERSEDIA',
    statusNote: 'Seluruh 3 pintu resmi beroperasi dengan kuota harian SIMAKSI TNGGP.',
    trailsCount: 3,
    startingPrice: 29000,
    weekendPrice: 34000,
    activeParkName: 'Balai Besar Taman Nasional Gunung Gede Pangrango',
    features: ['Alun-Alun Surya Kencana', 'Kawah Ratu', 'Air Panas Kandang Badak', 'Telaga Biru'],
    simaksiRequirements: [
      'Surat Keterangan Bebas Narkoba / Surat Dokter Resmi',
      'E-KTP asli semua anggota rombongan',
      'Rombongan minimal 3 orang sesuai SOP TNGGP',
      'Pemeriksaan barang bawaan (Zero Waste / Trash Bag)'
    ],
    trails: [
      {
        id: 'cibodas',
        name: 'Jalur Cibodas',
        basecamp: 'Pintu Masuk Cibodas, Cianjur',
        lengthKm: 12.8,
        difficulty: 'Sedang',
        estimatedHours: '6 - 8 Jam',
        availableQuota: 142,
        totalQuota: 300,
        status: 'TERSEDIA'
      },
      {
        id: 'gunung-putri',
        name: 'Jalur Gunung Putri',
        basecamp: 'Desa Sukatani, Pacet, Cianjur',
        lengthKm: 9.5,
        difficulty: 'Menantang',
        estimatedHours: '5 - 7 Jam (Trek Curam)',
        availableQuota: 18,
        totalQuota: 200,
        status: 'KUOTA_TERBATAS'
      },
      {
        id: 'selabintana',
        name: 'Jalur Selabintana',
        basecamp: 'Sukabumi Utara',
        lengthKm: 15.2,
        difficulty: 'Sangat Menantang',
        estimatedHours: '9 - 12 Jam (Hutan Liar)',
        availableQuota: 40,
        totalQuota: 100,
        status: 'TERSEDIA'
      }
    ]
  },
  {
    id: 'merbabu',
    slug: 'gunung-merbabu',
    name: 'Gunung Merbabu',
    alias: 'Surga Savana Hijau',
    elevation: 3145,
    region: 'Jawa Tengah',
    location: 'Magelang, Boyolali & Semarang, Jawa Tengah',
    description: 'Bukit-bukit teletubbies hijau berundak dengan pemandangan gagah Gunung Merapi tepat di hadapan mata.',
    longDescription: 'Taman Nasional Gunung Merbabu terkenal di kalangan pendaki nusantara karena keelokan hamparan savana hijau bak karpet zamrud. Dari puncaknya (Kenteng Songo & Triangulasi), Anda dapat menikmati lanskap panorama 7 gunung di Jawa Tengah.',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'KUOTA_TERBATAS',
    statusNote: 'Jalur Selo sangat diminati akhir pekan ini, tersisa kuota sedikit.',
    trailsCount: 4,
    startingPrice: 15000,
    weekendPrice: 20000,
    activeParkName: 'Balai Taman Nasional Gunung Merbabu (BTNGMb)',
    features: ['Savana 1 & 2 Selo', 'Puncak Kenteng Songo', 'Pemandangan Gunung Merapi', 'Batu Tulis'],
    simaksiRequirements: [
      'Pendaftaran E-SIMAKSI resmi dengan NIK valid',
      'Pemeriksaan gelang RFID / QR Code di Pos Selo',
      'Membawa trash bag wajib',
      'Ketua rombongan usia minimal 17 tahun'
    ],
    trails: [
      {
        id: 'selo',
        name: 'Jalur Selo',
        basecamp: 'Gentingsari, Selo, Boyolali',
        lengthKm: 7.2,
        difficulty: 'Sedang',
        estimatedHours: '6 - 7 Jam',
        availableQuota: 12,
        totalQuota: 250,
        status: 'KUOTA_TERBATAS'
      },
      {
        id: 'suwanting',
        name: 'Jalur Suwanting',
        basecamp: 'Sawangan, Magelang',
        lengthKm: 8.5,
        difficulty: 'Menantang',
        estimatedHours: '7 - 9 Jam',
        availableQuota: 75,
        totalQuota: 150,
        status: 'TERSEDIA'
      },
      {
        id: 'wekas',
        name: 'Jalur Wekas',
        basecamp: 'Kapuhan, Sawangan, Magelang',
        lengthKm: 6.8,
        difficulty: 'Sedang',
        estimatedHours: '5 - 6 Jam',
        availableQuota: 95,
        totalQuota: 150,
        status: 'TERSEDIA'
      },
      {
        id: 'thekelan',
        name: 'Jalur Thekelan',
        basecamp: 'Kopeng, Getasan, Semarang',
        lengthKm: 7.5,
        difficulty: 'Sedang',
        estimatedHours: '6 - 7 Jam',
        availableQuota: 60,
        totalQuota: 100,
        status: 'TERSEDIA'
      }
    ]
  },
  {
    id: 'prau',
    slug: 'gunung-prau',
    name: 'Gunung Prau',
    alias: 'Samudra Awan Dieng',
    elevation: 2565,
    region: 'Jawa Tengah',
    location: 'Wonosobo, Temanggung & Batang, Jawa Tengah',
    description: 'Golden sunrise terindah di Asia Tenggara dengan trek ramah pendaki pemula dan panorama gagah Gunung Sindoro-Sumbing.',
    longDescription: 'Gunung Prau berada di Dataran Tinggi Dieng dengan bukit Teletubbies dan bunga daisy. Menjadi tujuan favorit pendaki keluarga dan pemula karena durasi pendakian yang relatif singkat (3-4 jam) namun menyajikan pemandangan sunrise yang spektakuler.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'TERSEDIA',
    statusNote: 'Semua basecamp buka. Kuota harian terdistribusi di 5 jalur resmi.',
    trailsCount: 5,
    startingPrice: 25000,
    weekendPrice: 30000,
    activeParkName: 'Forum Pengelola Gunung Prau (FKPI)',
    features: ['Golden Sunrise Dieng', 'Bukit Teletubbies', 'Pemandangan Sindoro-Sumbing', 'Lembah Daisy'],
    simaksiRequirements: [
      'Membawa kartu identitas sah (KTP/Pelajar)',
      'Surat keterangan sehat bagi pendaki',
      'Peralatan hangat (suhu malam hari bisa mencapai 2-5°C)',
      'Mematuhi aturan Zero Trash'
    ],
    trails: [
      {
        id: 'patak-banteng',
        name: 'Jalur Patak Banteng',
        basecamp: 'Kejajar, Wonosobo',
        lengthKm: 4.2,
        difficulty: 'Sedang',
        estimatedHours: '3 - 4 Jam (Jalur Favorit Cepat)',
        availableQuota: 180,
        totalQuota: 400,
        status: 'TERSEDIA'
      },
      {
        id: 'dieng-wetan',
        name: 'Jalur Dieng Kulon',
        basecamp: 'Dieng, Banjarnegara',
        lengthKm: 5.0,
        difficulty: 'Mudah',
        estimatedHours: '3.5 - 4.5 Jam (Trek Landai)',
        availableQuota: 110,
        totalQuota: 200,
        status: 'TERSEDIA'
      },
      {
        id: 'kalilembu',
        name: 'Jalur Kalilembu',
        basecamp: 'Kejajar, Wonosobo',
        lengthKm: 5.5,
        difficulty: 'Mudah',
        estimatedHours: '4 Jam',
        availableQuota: 95,
        totalQuota: 150,
        status: 'TERSEDIA'
      },
      {
        id: 'dwarawati',
        name: 'Jalur Dwarawati',
        basecamp: 'Candi Dwarawati, Dieng Kulon',
        lengthKm: 5.2,
        difficulty: 'Mudah',
        estimatedHours: '3.5 Jam',
        availableQuota: 85,
        totalQuota: 150,
        status: 'TERSEDIA'
      },
      {
        id: 'wates',
        name: 'Jalur Wates',
        basecamp: 'Temanggung',
        lengthKm: 6.0,
        difficulty: 'Sedang',
        estimatedHours: '4 - 5 Jam',
        availableQuota: 70,
        totalQuota: 100,
        status: 'TERSEDIA'
      }
    ]
  },
  {
    id: 'bromo',
    slug: 'gunung-bromo',
    name: 'Gunung Bromo',
    alias: 'Lautan Pasir Tengger',
    elevation: 2329,
    region: 'Jawa Timur',
    location: 'Probolinggo, Pasuruan, Malang & Lumajang, Jawa Timur',
    description: 'Kaldera vulkanik legendaris dunia dengan lautan pasir berbisik, kawah aktif spektakuler, dan matahari terbit Penanjakan.',
    longDescription: 'Taman Nasional Bromo Tengger Semeru menghadirkan bentang alam purba kaldera pasir seluas 10 kilometer persegi. Destinasi warisan budaya suku Tengger ini menawarkan sensasi berdiri di bibir kawah aktif dan menyaksikan cahaya fajar keemasan dari Bukit Penanjakan.',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'TERSEDIA',
    statusNote: 'Kunjungan kaldera dan sunrise point normal dengan booking kuota resmi TNBTS.',
    trailsCount: 2,
    startingPrice: 29000,
    weekendPrice: 34000,
    activeParkName: 'Balai Besar TNBTS',
    features: ['Kawah Aktif Bromo', 'Bukit Penanjakan 1', 'Pasir Berbisik', 'Pura Poten Luhur'],
    simaksiRequirements: [
      'Voucher E-Tiket Barcode resmi TrailPass / TNBTS',
      'Wajib mematuhi batas aman radius kawah yang ditetapkan petugas',
      'Kendaraan Jeep berlisensi Paguyuban TNBTS jika memasuki lautan pasir'
    ],
    trails: [
      {
        id: 'pananjakan-cemoro',
        name: 'Jalur Cemoro Lawang - Penanjakan',
        basecamp: 'Cemoro Lawang, Ngadisari, Probolinggo',
        lengthKm: 3.5,
        difficulty: 'Mudah',
        estimatedHours: '2 Jam (Walking / Jeep)',
        availableQuota: 320,
        totalQuota: 600,
        status: 'TERSEDIA'
      },
      {
        id: 'tosari-wonokitri',
        name: 'Jalur Wonokitri - Pasuruan',
        basecamp: 'Tosari, Pasuruan',
        lengthKm: 4.0,
        difficulty: 'Mudah',
        estimatedHours: '2.5 Jam',
        availableQuota: 210,
        totalQuota: 450,
        status: 'TERSEDIA'
      }
    ]
  }
];
