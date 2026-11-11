# TrailPass — E-Ticketing & E-SIMAKSI Pendakian Gunung Indonesia

> **"Satu Tiket, Semua Jalur"**  
> Sistem E-Ticketing dan E-SIMAKSI Pendakian Multi-Gunung Berbasis Web Terpadu se-Indonesia.

---

## 🏔️ Sekilas Proyek

TrailPass menyelesaikan fragmentasi perizinan pendakian gunung di Indonesia dengan menyatukan seluruh jalur resmi Taman Nasional dan Perhutani ke dalam satu platform modern. Dilengkapi dengan:
* **Pemantauan Kuota Real-Time** dengan kalender kuota multi-warna dan peringatan status jalur (Buka / Terbatas / Tutup Darurat).
* **Antrean Virtual Adil (Fair Virtual Queue)** berbasis Redis Sorted Set & token akses 10 menit untuk mencegah bot dan serbuan massal (flash booking).
* **Transaksi Booking Atomik Bebas Overselling** dengan isolasi transaksi database PostgreSQL + Prisma.
* **Integrasi Pembayaran Midtrans Snap** (QRIS, VA Bank, E-Wallet) dengan webhook idempotent bersertifikasi SHA512.
* **E-Tiket QR Digital Kriptografis (HMAC-SHA256)** anti-screenshot palsu dan verifikasi pos offline.
* **Pos Gate Scanner Ranger** untuk check-in/check-out rombongan pendaki dan monitor pendaki terlambat (*overdue climbers*).
* **Portal Admin & Organizer** lengkap dengan manajemen jalur, kuota massal, verifikasi akun, audit log, dan laporan pendapatan.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Backend** | Node.js (v20+), Express, TypeScript, Zod, Prisma ORM |
| **Database** | PostgreSQL 16 (dengan ekstensi UUID & Index) |
| **Cache & Queue** | Redis 7 (dengan transparent in-memory fallback) |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons |
| **Payment Gateway** | Midtrans Snap (Sandbox & Production Ready) |
| **Container & Deploy** | Docker, Docker Compose, Nginx, Vercel Ready, Railway Ready |
| **Testing** | Vitest (50 Unit Tests), Concurrency Test Script, K6 Load Test |

---

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat
* Node.js v20+ & npm / pnpm
* Docker Desktop (opsional untuk database PostgreSQL & Redis lokal)

### 1. Menjalankan Database dengan Docker Compose
```bash
docker compose up -d postgres redis
```
*(Catatan: Jika Redis tidak aktif, backend otomatis beralih ke in-memory store tanpa error).*

### 2. Konfigurasi & Menjalankan Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```
Backend berjalan di: `http://localhost:4000/api/v1`

### 3. Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di: `http://localhost:5173`

---

## 🧪 Pengujian Otomatis & Uji Konkurensi

### Menjalankan Unit Test Backend (50/50 Passed)
```bash
npm --prefix backend test
```

### Typecheck TypeScript
```bash
npm --prefix backend run typecheck
npm --prefix frontend run build
```

### Uji Beban & Konkurensi Anti-Overselling
Untuk menguji 500 permintaan booking bersamaan memperebutkan kuota terbatas:
```bash
npm --prefix backend run test:concurrency
```

Atau menggunakan k6:
```bash
k6 run backend/scripts/load-test-k6.js
```

---

## 🚢 Panduan Deployment

### Deployment Cepat dengan Docker Compose
Jalankan seluruh sistem (Database, Cache, Backend API, Frontend Nginx):
```bash
docker compose up --build -d
```
* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:4000/api/v1`

### Deployment Cloud Terpisah
* **Backend:** Deploy ke [Railway](https://railway.app) atau [Render](https://render.com) menggunakan `railway.json` atau `backend/Dockerfile`.
* **Frontend:** Deploy ke [Vercel](https://vercel.com) (file `frontend/vercel.json` sudah tersedia untuk penanganan SPA routing) atau [Netlify](https://netlify.com).

---

## 📁 Struktur Direktori

```
trailpass/
├── backend/
│   ├── prisma/             # Schema 21 tabel, migrasi, dan data seed
│   ├── scripts/            # Race condition & k6 load test scripts
│   ├── src/
│   │   ├── config/         # Environment parser dengan validasi Zod
│   │   ├── jobs/           # Background workers (Hold expirer, No-show marker, Overdue monitor)
│   │   ├── lib/            # Prisma, Redis fallback, QR signer HMAC-SHA256
│   │   ├── middleware/     # Auth JWT, Role guard, Error handler
│   │   └── modules/
│   │       ├── auth/       # Register, login, me
│   │       ├── mountains/  # Gunung & aturan pendakian
│   │       ├── trails/     # Jalur & kalender kuota
│   │       ├── bookings/   # Hold kuota atomik & data anggota rombongan
│   │       ├── payments/   # Midtrans Snap & webhook notification
│   │       ├── scanner/    # Pos Gate Scanner check-in & check-out
│   │       ├── queue/      # Virtual Queue fair waitlist
│   │       ├── refunds/    # Reschedule & refund penutupan darurat
│   │       ├── admin/      # Profil verifikasi, blacklist, manajemen gunung & audit log
│   │       └── organizer/  # Portal pengelola gunung, bulk kuota & petugas
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components & modals (Search, Booking, Scanner, Admin)
│   │   ├── data/           # Mock data gunung, kuota live, FAQs
│   │   ├── types/          # TypeScript definitions
│   │   ├── App.tsx         # Root container
│   │   └── main.tsx
│   ├── nginx.conf
│   ├── Dockerfile
│   └── vercel.json
├── docker-compose.yml       # Full stack container configuration
└── README.md
```

---

## 📄 Lisensi
Hak Cipta © 2026 TrailPass Indonesia. Seluruh hak cipta dilindungi.
