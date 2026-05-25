# 🗑️ EcoPhora - Smart Waste Management System

**EcoPhora** adalah platform pemantauan dan pengelolaan sampah pintar berbasis IoT terintegrasi. Sistem ini dirancang khusus untuk mempermudah instansi kebersihan seperti **Dinas Lingkungan Hidup (DLH)** atau **UPTD Pelayanan Persampahan** dalam memantau kapasitas sampah secara real-time, mengoptimalkan armada pengangkut, dan meningkatkan efisiensi logistik pengumpulan sampah.

---

## 🚀 Fitur Unggulan (Premium Features)

1. **📊 Real-time Monitoring & Analytics**:
   * Dasbor interaktif dengan visualisasi data kapasitas sampah terisi secara live.
   * Grafik historis harian dan bulanan berdesain *glassmorphism* modern.
   * Fitur ekspor laporan terperinci dalam format PDF/Excel untuk pelaporan dinas.

2. **🗺️ Interactive Cybernetic Map (Dark Matter Mode)**:
   * Pemetaan geospasial interaktif menggunakan basemap premium **CartoDB Dark Matter**.
   * Marker lokasi tempat sampah pintar yang memancarkan pendaran warna dinamis sesuai level pengisian (Hijau/Kuning/Merah).

3. **🛣️ Logistics Routing Optimizer (TSP Heuristic)**:
   * Algoritma TSP (Traveling Salesperson) Heuristic terintegrasi yang menghitung jalur terpendek dari **Kantor UPTD DLH Sleman** menuju seluruh tong sampah yang penuh secara otomatis.
   * Gambar rute menyala neon (*glowing polyline*) di peta.
   * Estimasi rincian jarak rute tempuh total dan estimasi **penghematan bahan bakar solar**.

4. **📲 WhatsApp Driver Dispatch System**:
   * Sistem pembagian instruksi satu klik yang memformat rute urutan stop checkpoints dan mengirimkannya langsung ke WhatsApp pribadi pengemudi truk sampah.

5. **🔌 IoT Hardware Integration Ready**:
   * Firmware ESP32 terintegrasi penuh untuk **SIM900A GPRS Modem** (koneksi seluler publik luar ruangan) dan **WiFi**.
   * Skema rangkaian kelistrikan (*wiring diagram*) neon beresolusi tinggi tersedia langsung di folder `docs/Laporan_Visual.md` untuk perakitan fisik.

---

## 🛠️ Arsitektur Teknologi (Tech Stack)

* **Frontend**: React, Vite, TypeScript, TailwindCSS, Lucide Icons, Leaflet (Map).
* **Backend & Database**: Supabase Cloud (PostgreSQL, Realtime Subscriptions).
* **Hardware**: ESP32 DevKit, SIM900A GSM/GPRS Modem, Sensor Ultrasonik HC-SR04, Resistor & Lampu LED Indikator.

---

## 📁 Dokumentasi Sistem
Seluruh tangkapan layar antarmuka premium, tabel sambungan pin fisik hardware, dan panduan lengkap dapat diakses langsung pada file **[Laporan_Visual.md](docs/Laporan_Visual.md)**.
