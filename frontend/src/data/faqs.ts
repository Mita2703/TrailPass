import { FaqItem } from '../types';

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Umum',
    question: 'Apa itu TrailPass?',
    answer: 'TrailPass adalah platform e-ticketing dan e-SIMAKSI pendakian multi-gunung berbasis web pertama di Indonesia. Mengusung prinsip "Satu Tiket, Semua Jalur", TrailPass menyatukan sistem pemesanan tiket resmi berbagai taman nasional dan perhutani ke dalam satu portal terpadu, dilengkapi pemantauan kuota real-time, antrean virtual adil, serta e-tiket QR Code yang tervalidasi di basecamp.'
  },
  {
    id: 'faq-2',
    category: 'Pemesanan',
    question: 'Bagaimana cara memesan tiket pendakian?',
    answer: 'Pemesanan tiket di TrailPass sangat mudah dalam 4 langkah: (1) Cari dan pilih destinasi gunung beserta jalur & tanggal pendakian yang diinginkan, (2) Isi data ketua rombongan dan seluruh anggota pendaki sesuai KTP/identitas resmi, (3) Lakukan pembayaran online secara instan melalui Midtrans (QRIS, Transfer Bank, atau E-Wallet), dan (4) Tiket digital E-SIMAKSI langsung terbit bersama QR Code aktif yang siap ditunjukkan kepada petugas pos pendakian.'
  },
  {
    id: 'faq-3',
    category: 'SIMAKSI & Kuota',
    question: 'Bagaimana cara mengetahui kuota pendakian yang tersedia?',
    answer: 'Anda dapat memantau kuota pendakian secara real-time langsung melalui beranda TrailPass pada tabel "Pantau Kuota" atau halaman detail masing-masing gunung. Setiap jalur pendakian dilengkapi label status jelas: Hijau (Tersedia), Kuning (Kuota Terbatas), Merah (Penuh), dan Abu-abu (Ditutup). Angka kuota diperbarui otomatis oleh sistem sinkronisasi balai pengelola setiap beberapa menit.'
  },
  {
    id: 'faq-4',
    category: 'Tiket & Validasi',
    question: 'Apakah tiket pendakian tersedia dalam bentuk digital?',
    answer: 'Ya, 100% digital dan ramah lingkungan tanpa perlu dicetak di kertas! Setelah pembayaran terverifikasi otomatis oleh Midtrans, sistem TrailPass langsung menerbitkan E-Tiket berformat kartu digital dengan enkripsi QR Code. Tiket dapat diunduh ke ponsel Anda dan tetap dapat dipindai secara offline oleh scanner pos pendakian basecamp.'
  },
  {
    id: 'faq-5',
    category: 'Pemesanan',
    question: 'Bagaimana jika jalur pendakian ditutup setelah melakukan pemesanan?',
    answer: 'Apabila terjadi force majeure (seperti peningkatan aktivitas vulkanik, cuaca ekstrem, kebakaran hutan, atau kebijakan penutupan berkala dari Balai Taman Nasional/Perhutani), TrailPass akan mengirimkan notifikasi instan melalui email dan WhatsApp. Pendaki berhak mengajukan penjadwalan ulang (reschedule) tanpa biaya tambahan atau pengembalian dana (refund) penuh sesuai kebijakan pengelola masing-masing gunung.'
  },
  {
    id: 'faq-6',
    category: 'Tiket & Validasi',
    question: 'Bagaimana cara melakukan validasi tiket di pos pendakian?',
    answer: 'Saat tiba di pos pendaftaran / basecamp resmi, ketua rombongan cukup membuka E-Tiket TrailPass di ponsel dan memperlihatkan QR Code kepada petugas pos. Petugas akan memindai QR Code menggunakan aplikasi scanner TrailPass untuk memvalidasi identitas rombongan, mengecek kelengkapan SOP SIMAKSI, dan mencatat status check-in pendakian. Hal yang sama dilakukan saat turun (check-out) demi keselamatan pelaporan pendaki.'
  }
];
