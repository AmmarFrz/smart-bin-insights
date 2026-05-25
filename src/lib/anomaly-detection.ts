/**
 * EcoPhora - Anomaly Detection Module
 * Mendeteksi pola data sensor yang tidak wajar untuk mencegah
 * false alarm dan memastikan integritas data monitoring.
 */

export type AnomalyType = "spike" | "stuck" | "drop" | null;

export interface AnomalyResult {
  type: AnomalyType;
  label: string;
  description: string;
  severity: "normal" | "warning" | "critical";
  color: string;
}

/**
 * Mendeteksi anomali pada data sensor berdasarkan perbandingan
 * antara data saat ini dengan data sebelumnya.
 */
export function detectAnomaly(
  currentFill: number,
  previousFill: number | null,
  lastReadingAt: string | null
): AnomalyResult {
  if (previousFill === null || lastReadingAt === null) {
    return { type: null, label: "Normal", description: "Sensor beroperasi normal", severity: "normal", color: "emerald" };
  }

  const now = new Date();
  const lastReading = new Date(lastReadingAt);
  const minutesSinceLastReading = (now.getTime() - lastReading.getTime()) / (1000 * 60);
  const fillDelta = currentFill - previousFill;

  // SPIKE: Fill naik > 40% dalam waktu < 5 menit
  if (fillDelta > 40 && minutesSinceLastReading < 5) {
    return {
      type: "spike",
      label: "Spike Terdeteksi",
      description: `Lonjakan +${fillDelta.toFixed(0)}% dalam ${minutesSinceLastReading.toFixed(0)} menit. Kemungkinan sensor tertutup benda asing.`,
      severity: "critical",
      color: "red"
    };
  }

  // STUCK: Fill tidak berubah sama sekali selama > 360 menit (6 jam)
  if (Math.abs(fillDelta) < 1 && minutesSinceLastReading > 360) {
    return {
      type: "stuck",
      label: "Sensor Macet",
      description: `Data tidak berubah selama ${(minutesSinceLastReading / 60).toFixed(1)} jam. Periksa kondisi sensor.`,
      severity: "warning",
      color: "amber"
    };
  }

  // DROP: Fill turun > 30% secara tiba-tiba
  if (fillDelta < -30 && minutesSinceLastReading < 10) {
    return {
      type: "drop",
      label: "Drop Mendadak",
      description: `Penurunan ${Math.abs(fillDelta).toFixed(0)}% dalam ${minutesSinceLastReading.toFixed(0)} menit. Verifikasi apakah telah dilakukan pengangkutan.`,
      severity: "warning",
      color: "amber"
    };
  }

  return { type: null, label: "Normal", description: "Sensor beroperasi normal", severity: "normal", color: "emerald" };
}

/**
 * Mendapatkan status kesehatan sensor berdasarkan timestamp terakhir
 */
export function getSensorHealth(lastReadingAt: string | null, online: boolean): AnomalyResult {
  if (!online) {
    return {
      type: "stuck",
      label: "Offline",
      description: "Perangkat tidak terhubung ke jaringan",
      severity: "critical",
      color: "red"
    };
  }

  if (!lastReadingAt) {
    return {
      type: null,
      label: "Menunggu Data",
      description: "Belum ada data yang masuk dari sensor",
      severity: "warning",
      color: "amber"
    };
  }

  const now = new Date();
  const lastReading = new Date(lastReadingAt);
  const minutesSince = (now.getTime() - lastReading.getTime()) / (1000 * 60);

  if (minutesSince > 60) {
    return {
      type: "stuck",
      label: "Data Terlambat",
      description: `Data terakhir ${(minutesSince / 60).toFixed(1)} jam yang lalu`,
      severity: "warning",
      color: "amber"
    };
  }

  return {
    type: null,
    label: "Aktif",
    description: `Data terakhir ${minutesSince.toFixed(0)} menit yang lalu`,
    severity: "normal",
    color: "emerald"
  };
}
