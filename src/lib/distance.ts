// Аймаг/хотын төв координатууд (lat, lng)
export const AIMAG_COORDS: Record<string, { lat: number; lng: number }> = {
  "Улаанбаатар": { lat: 47.9184, lng: 106.9177 },
  "Архангай": { lat: 47.8638, lng: 100.7236 },
  "Баян-Өлгий": { lat: 48.9688, lng: 89.9626 },
  "Баянхонгор": { lat: 46.1947, lng: 100.7181 },
  "Булган": { lat: 48.8125, lng: 103.5347 },
  "Говь-Алтай": { lat: 46.3722, lng: 96.2572 },
  "Говьсүмбэр": { lat: 46.4853, lng: 108.3564 },
  "Дархан-Уул": { lat: 49.4685, lng: 105.9740 },
  "Дорноговь": { lat: 44.8923, lng: 110.1172 },
  "Дорнод": { lat: 47.7165, lng: 114.5322 },
  "Дундговь": { lat: 45.7631, lng: 106.2647 },
  "Завхан": { lat: 47.7433, lng: 96.8427 },
  "Орхон": { lat: 49.0278, lng: 104.1508 },
  "Өвөрхангай": { lat: 46.2653, lng: 102.7831 },
  "Өмнөговь": { lat: 43.5756, lng: 104.4281 },
  "Сүхбаатар": { lat: 46.6893, lng: 113.3844 },
  "Сэлэнгэ": { lat: 49.4399, lng: 106.8483 },
  "Төв": { lat: 47.7093, lng: 106.9556 },
  "Увс": { lat: 48.0584, lng: 91.6372 },
  "Ховд": { lat: 48.0111, lng: 91.6417 },
  "Хөвсгөл": { lat: 49.3883, lng: 100.1511 },
  "Хэнтий": { lat: 47.3167, lng: 109.6508 },
};

// Haversine formula - шулуун шугамын зай (км)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Хоёр аймгийн хоорондын ойролцоо замын зай (км)
 * Шулуун шугамын зайг 1.35 коэффициентоор үржүүлнэ (замын нугалаа тооцсон)
 */
export function getDistanceKm(from: string, to: string): number | null {
  const c1 = AIMAG_COORDS[from];
  const c2 = AIMAG_COORDS[to];
  if (!c1 || !c2) return null;
  if (from === to) return 0;
  const straight = haversineDistance(c1.lat, c1.lng, c2.lat, c2.lng);
  return Math.round(straight * 1.35);
}
