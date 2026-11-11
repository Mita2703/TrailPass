export type HikingStatus = 'TERSEDIA' | 'KUOTA_TERBATAS' | 'PENUH' | 'DITUTUP';

export interface TrailInfo {
  id: string;
  name: string;
  basecamp: string;
  lengthKm: number;
  difficulty: 'Mudah' | 'Sedang' | 'Menantang' | 'Sangat Menantang';
  estimatedHours: string;
  availableQuota: number;
  totalQuota: number;
  status: HikingStatus;
}

export interface Mountain {
  id: string;
  slug: string;
  name: string;
  alias?: string;
  elevation: number; // in mdpl
  region: 'Jawa Barat' | 'Jawa Tengah' | 'Jawa Timur' | 'Nusa Tenggara' | 'Sumatera';
  location: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  gallery: string[];
  status: HikingStatus;
  statusNote?: string;
  trailsCount: number;
  startingPrice: number;
  weekendPrice?: number;
  activeParkName: string;
  trails: TrailInfo[];
  features: string[];
  simaksiRequirements: string[];
}

export interface LiveQuotaItem {
  id: string;
  mountainId: string;
  mountainName: string;
  trailName: string;
  region: string;
  availableQuota: number;
  totalQuota: number;
  status: HikingStatus;
  statusLabel: string;
  lastUpdated: string;
  price: number;
  bookingAvailable: boolean;
}

export interface SearchFormData {
  mountainId: string;
  trailId?: string;
  date: string;
  hikersCount: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Umum' | 'Pemesanan' | 'SIMAKSI & Kuota' | 'Tiket & Validasi';
}

export interface DigitalTicketData {
  ticketCode: string;
  bookingCode: string;
  mountainName: string;
  elevation: number;
  trailName: string;
  basecamp: string;
  hikeDate: string;
  returnDate: string;
  leaderName: string;
  leaderId: string;
  hikersCount: number;
  totalPaid: number;
  paymentMethod: string;
  paymentStatus: 'Lunas' | 'Menunggu' | 'Dibatalkan';
  issuedAt: string;
  qrPayload: string;
}
