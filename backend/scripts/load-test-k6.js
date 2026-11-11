import http from 'k6/http';
import { check, sleep } from 'k6';

// Konfigurasi skenario beban k6
export const options = {
  stages: [
    { duration: '10s', target: 50 },   // Ramp-up ke 50 VUs
    { duration: '20s', target: 500 },  // Ramp-up ke 500 concurrent users
    { duration: '15s', target: 500 },  // Beban puncak 500 pengguna
    { duration: '10s', target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% request di bawah 500ms
    http_req_failed: ['rate<0.05'],   // Tingkat kegagalan sistem < 5%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000/api/v1';

export default function () {
  // 1. Cek kesehatan sistem & ketersediaan jalur
  const resAvailability = http.get(`${BASE_URL}/mountains`);
  check(resAvailability, {
    'status mountains 200': (r) => r.status === 200,
  });

  // 2. Simulasi pengguna masuk ke antrean virtual
  const trailId = 'd824d546-5a40-4bc3-95aa-2a26c459952a'; // Jalur contoh
  const queuePayload = JSON.stringify({
    date: '2026-11-20',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const resQueue = http.post(`${BASE_URL}/trails/${trailId}/queue/join`, queuePayload, params);
  check(resQueue, {
    'antrean response 200': (r) => r.status === 200,
  });

  sleep(0.5);
}
