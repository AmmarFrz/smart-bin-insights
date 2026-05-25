# Smart Bin IoT — Firmware ESP32

Dua varian firmware untuk integrasi alat IoT ke dashboard:

| Folder | Konektivitas | Use case |
|--------|--------------|----------|
| `esp32_wifi/` | WiFi | Tong sampah indoor / area ber-WiFi (kantor, kampus, mall) |
| `esp32_sim900a/` | GSM/GPRS (SIM900A) | Tong sampah outdoor tanpa WiFi (taman, pinggir jalan) |

## Setup awal (dilakukan di dashboard)

1. Login ke dashboard sebagai **admin** → `/admin`.
2. Tab **Devices** → **Add Device** → isi nama & ESP ID → **copy `api_key`** yang ter-generate.
3. Tab **Bins** → **Add Bin**:
   - Isi `bin_code` (contoh: `BIN-001`) — ini yang akan dipakai di firmware.
   - Set `height_cm` = tinggi tong sampah aslinya (jarak dari sensor ke dasar tong saat kosong).
   - Klik di peta untuk set koordinat lokasi.
   - Pilih **device** yang sudah dibuat di step 2.

## Setup Arduino IDE

1. Install **ESP32 board package** via Boards Manager (URL: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`).
2. Pilih board: **ESP32 Dev Module**.
3. Install library lewat Library Manager:
   - `ArduinoJson` (Benoit Blanchon)
   - Untuk varian SIM900A juga: `TinyGSM`, `ArduinoHttpClient`

## Konfigurasi firmware

Buka file `.ino`, ubah konstanta di bagian KONFIGURASI:

```cpp
const char* WIFI_SSID     = "...";   // (varian WiFi)
const char* WIFI_PASSWORD = "...";
const char* APN           = "internet";  // (varian SIM900A)

const char* API_KEY  = "paste_dari_dashboard";
const char* BIN_CODE = "BIN-001";
```

## Wiring HC-SR04 (sama untuk dua varian)

| HC-SR04 | ESP32 |
|---------|-------|
| VCC | 5V (VIN) |
| GND | GND |
| TRIG | GPIO 5 |
| ECHO | GPIO 18 (via voltage divider 1kΩ + 2kΩ ke 3.3V) |

⚠️ Pin ECHO HC-SR04 mengeluarkan 5V — **wajib** pakai voltage divider supaya tidak merusak GPIO ESP32 yang 3.3V.

## LED indikator (opsional)

| LED | GPIO | Status |
|-----|------|--------|
| Hijau | 25 | Fill < 70% |
| Kuning | 26 | Fill 70–89% |
| Merah | 27 | Fill ≥ 90% (penuh) |

## Wiring SIM900A (varian GPRS)

| SIM900A | ESP32 / Power |
|---------|---------------|
| VCC | **Power supply 5V minimal 2A** (BUKAN dari ESP32) |
| GND | Common GND |
| TXD | GPIO 16 (RX2) |
| RXD | GPIO 17 (TX2) — via voltage divider |

⚠️ SIM900A boros arus saat TX (peak 2A). Pakai power supply terpisah, atau buck converter yang kuat. Common GND wajib.

## Test endpoint manual (curl)

```bash
curl -X POST https://leeokbvvcalbehgyifyz.supabase.co/functions/v1/ingest-reading \
  -H "Content-Type: application/json" \
  -H "x-api-key: PASTE_API_KEY_DISINI" \
  -d '{"bin_code":"BIN-001","distance_cm":12.5}'
```

Response sukses:
```json
{
  "success": true,
  "bin_code": "BIN-001",
  "distance_cm": 12.5,
  "fill_percentage": 58
}
```

## Cara kerja perhitungan fill %

Backend menghitung otomatis:

```
fill_percentage = ((bin.height_cm - distance_cm) / bin.height_cm) * 100
```

Jadi sensor cukup kirim `distance_cm` — server yang konversi ke persentase berdasarkan `height_cm` tong yang di-set di dashboard.

## Trigger otomatis di backend

Setiap reading masuk akan:
1. Update `bins.current_fill_percentage` dan `bins.status` (empty/medium/full).
2. Update `devices.online = true` dan `devices.last_seen`.
3. Generate **alert otomatis** jika status berubah jadi `full` atau `medium`.

Semua perubahan langsung ter-reflect di dashboard via Supabase Realtime — tanpa refresh.

## Troubleshooting

| Gejala | Solusi |
|--------|--------|
| HTTP 401 "Invalid API key" | Pastikan `API_KEY` sama persis dengan kolom `api_key` di tabel devices |
| HTTP 404 "Bin not found" | `BIN_CODE` di firmware harus match dengan `bin_code` di dashboard |
| `distance = -1` | Wiring HC-SR04 salah, atau objek terlalu jauh (>4m) |
| ESP32 reboot saat WiFi connect | Power supply USB lemah — pakai 5V/1A minimum |
| SIM900A tidak connect GPRS | APN salah / kuota habis / sinyal lemah / power supply kurang |
