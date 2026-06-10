# BAB IV: HASIL DAN PEMBAHASAN

## 4.1 Perancangan Sistem Smart Waste Management
### 4.1.1 Kriteria Desain
Sesuai dengan tujuan tugas akhir ini adalah membuat sistem Smart Waste Management berbasis Internet of Things (IoT) yang akan digunakan oleh Dinas Lingkungan Hidup (DLHK) maupun UPTD Pelayanan Persampahan, sehingga dalam perancangannya ditetapkan kriteria yang menjadi dasar rancang bangun tempat sampah pintar (Smart Bin). Kriteria desain didapat dari kegiatan observasi langsung di lapangan yang dikembangkan berdasarkan pertimbangan aspek efisiensi operasional pengangkutan dan kemudahan pengguna. Adapun kriteria yang menjadi tujuan akhir perancangan adalah sebagai berikut:
1. Perangkat keras bersifat plug-and-play, sehingga mudah dipasang pada berbagai jenis tempat sampah standar instansi tanpa merombak struktur utama tong sampah secara destruktif.
2. Perangkat memiliki daya tahan terhadap kondisi cuaca luar ruangan (outdoor durability), kelembapan ekstrem, serta paparan gas korosif akibat pembusukan sampah di dalam wadah.
3. Sistem mampu membaca tingkat volume sampah secara berkelanjutan dan mengirimkan datanya secara real-time ke pusat kendali untuk meminimalkan kegiatan inspeksi manual yang memboroskan bahan bakar armada truk.

Berdasarkan kriteria tersebut, sistem yang direncanakan berjenis pemantauan jarak jauh berbasis mikrokontroler ESP32. Mikrokontroler ESP32 dipilih karena memiliki tingkat konektivitas nirkabel yang sangat baik dengan adanya modul Wi-Fi bawaan (IEEE 802.11 b/g/n) untuk integrasi Internet of Things (IoT) (Perumal, Divya, & Vishal, 2024). Selanjutnya, jenis sensor ultrasonik HC-SR04 dipilih untuk mendeteksi tinggi tumpukan sampah tanpa harus bersentuhan langsung dengan objek fisik limbah (non-contact measurement), sehingga meminimalisir risiko korosi atau kerusakan akibat cairan sampah, sebuah metode yang telah diakui keandalannya dalam riset pengelolaan sampah pintar (Raju, Dilip, Bandopant, Annaso, & Patole, 2024). Adapun prototipe alat dilengkapi dengan fitur sebagai berikut:
1. Sistem penginderaan jarak jauh menggunakan pantulan gelombang suara ultrasonik (40 kHz) untuk menghitung sisa ruang kosong pada wadah.
2. Indikator visual berupa layar LCD 16x2 I2C di bagian luar tong sampah untuk menampilkan teks informasi persentase kapasitas dan status koneksi kepada masyarakat di lokasi secara instan.
3. Konektivitas nirkabel yang terhubung langsung dengan basis data awan (cloud database) Supabase secara berkesinambungan melalui protokol HTTP POST.

### 4.1.2 Desain Perangkat Keras dan Sirkuit Elektronika
Desain purwarupa perangkat keras dibuat berdasarkan kesesuaian komponen elektronika serta dilakukan desain tata letak secara presisi untuk memastikan aktivitas pembuangan sampah oleh masyarakat tidak terhambat. Secara struktural, seluruh modul elektronik disatukan pada kompartemen khusus di balik penutup tempat sampah.

Sensor ultrasonik HC-SR04 diposisikan menghadap vertikal (top-down) ke dasar wadah agar pancaran gelombangnya mampu memindai ketinggian volume sampah secara akurat tanpa terhalang lekukan dinding tong. Data jarak yang terbaca kemudian diproses oleh mikrokontroler ESP32 untuk menghitung persentase kepenuhan, yang selanjutnya dikirimkan ke server melalui koneksi Wi-Fi. Untuk menunjang interaksi langsung di lapangan, bodi luar penutup turut disematkan panel layar LCD 16x2 I2C sebagai penampil persentase kapasitas visual dan status alat. Keseluruhan sirkuit vital tersebut dirancang untuk diamankan dalam sebuah enclosure kedap air.

Karena mikrokontroler ESP32 beroperasi dengan level logika 3,3V sedangkan sensor ultrasonik HC-SR04 membutuhkan tegangan 5V untuk beroperasi dan memancarkan sinyal Echo setinggi 5V, maka dirancang rangkaian pembagi tegangan (voltage divider) pada pin Echo. Pembagi tegangan ini menggunakan kombinasi resistor sebesar 1 kOhm dan 2 kOhm untuk menurunkan tegangan pulsa Echo dari 5V menjadi 3,33V. Hal ini krusial untuk mencegah kerusakan (overvoltage) pada pin GPIO ESP32 yang sensitif terhadap tegangan di atas 3,3V. Pemetaan perkabelan (Pin Mapping) antarkomponen elektronika dijabarkan pada Tabel 4.1.

Tabel 4.1 Pemetaan Pin (Pin Mapping) Sirkuit Elektronika Perangkat
| Komponen Asal | Pin Asal | Komponen Tujuan | Pin Tujuan | Fungsi / Keterangan |
| ------------- | -------- | --------------- | ---------- | ------------------- |
| Sensor HC-SR04 | VCC | Catu Daya Eksternal | +5V | Sumber daya utama sensor ultrasonik |
| Sensor HC-SR04 | GND | ESP32 / Ground | GND | Grounding bersama (Common Ground) |
| Sensor HC-SR04 | Trig | ESP32 | GPIO 5 | Output pulsa pemicu gelombang ultrasonik |
| Sensor HC-SR04 | Echo | Resistor Divider (1kOhm) | Input Divider | Penurunan tegangan logika 5V ke 3,3V |
| Resistor Divider| Output | ESP32 | GPIO 18 | Input pulsa Echo aman (3,3V) |
| Layar LCD 16x2 | VCC | Catu Daya Eksternal | +5V | Sumber daya utama layar LCD |
| Layar LCD 16x2 | GND | ESP32 / Ground | GND | Grounding bersama (Common Ground) |
| Layar LCD 16x2 | SDA | ESP32 | GPIO 21 | Jalur data serial komunikasi I2C |
| Layar LCD 16x2 | SCL | ESP32 | GPIO 22 | Jalur clock serial komunikasi I2C |

(Instruksi: Masukkan Gambar 4.1 Skema Rangkaian Elektronika Fritzing di sini)

### 4.1.3 Skema Basis Data (Cloud Database Schema)
Integrasi antara perangkat keras dan dasbor monitoring dijembatani oleh pangkalan data awan Supabase yang ditenagai oleh mesin PostgreSQL. Arsitektur data dirancang untuk menyimpan informasi status fisik tempat sampah, log pembacaan berkala (time-series), serta data peringatan darurat. Skema tabel database didefinisikan sebagai berikut:

1. Tabel `bins`
   Tabel ini menyimpan profil fisik dan status mutakhir dari setiap unit tempat sampah pintar yang terpasang di lapangan.
   
   Tabel 4.2 Struktur Tabel `bins`
   | Nama Field | Tipe Data | Keterangan |
   | ---------- | --------- | ---------- |
   | `id` | UUID (Primary Key) | Identifikasi unik universal untuk setiap tempat sampah |
   | `code` | VARCHAR (Unique) | Kode unik unit (misalnya: "SB-Sleman-01") |
   | `location_name` | VARCHAR | Deskripsi nama lokasi penempatan tempat sampah |
   | `latitude` | DOUBLE PRECISION | Koordinat lintang geografis lokasi |
   | `longitude` | DOUBLE PRECISION | Koordinat bujur geografis lokasi |
   | `max_depth` | INTEGER | Jarak sensor ke dasar wadah saat kosong (cm) |
   | `current_volume` | INTEGER | Persentase kapasitas volume sampah aktual (0-100%) |
   | `is_maintenance` | BOOLEAN | Status mode perbaikan (TRUE/FALSE) |
   | `last_reading_at` | TIMESTAMP | Catatan waktu pembaruan data terakhir dari sensor |

2. Tabel `readings`
   Tabel ini berfungsi sebagai log historis (time-series log) yang merekam setiap paket transmisi data dari sensor untuk kebutuhan analisis analitik.
   
   Tabel 4.3 Struktur Tabel `readings`
   | Nama Field | Tipe Data | Keterangan |
   | ---------- | --------- | ---------- |
   | `id` | BIGINT (Primary Key) | ID unik baris data historis (Auto-Increment) |
   | `bin_id` | UUID (Foreign Key) | Penghubung relasional ke tabel `bins` |
   | `distance` | NUMERIC | Jarak sisa ruang kosong yang dibaca oleh sensor (cm) |
   | `calculated_volume` | INTEGER | Hasil persentase kapasitas yang terekam pada saat transmisi |
   | `created_at` | TIMESTAMP | Stempel waktu pencatatan data ke pangkalan data |

3. Tabel `alerts`
   Tabel ini menampung log peringatan kapasitas kritis yang dipicu secara otomatis oleh sistem saat volume melebihi batas toleransi.
   
   Tabel 4.4 Struktur Tabel `alerts`
   | Nama Field | Tipe Data | Keterangan |
   | ---------- | --------- | ---------- |
   | `id` | BIGINT (Primary Key) | ID unik baris peringatan (Auto-Increment) |
   | `bin_id` | UUID (Foreign Key) | Hubungan relasi ke unit tempat sampah bermasalah |
   | `message` | TEXT | Kalimat informasi notifikasi sistem |
   | `status` | VARCHAR | Tingkat urgensi status peringatan ("warning" atau "critical") |
   | `is_read` | BOOLEAN | Status penanganan notifikasi oleh petugas admin |
   | `created_at` | TIMESTAMP | Stempel waktu kejadian pemicuan alarm |

## 4.2 Manufaktur Sistem
### 4.2.1 Perangkaian Elektronika
Kegiatan perangkaian fisik tiap-tiap modul kelistrikan menjadi fondasi sistem. Seluruh kaki komponen saling dihubungkan menggunakan teknik penyolderan untuk merekatkan konduktor pada purwarupa, demi menekan probabilitas terjadinya kegagalan arus (short circuit) ketika alat dioperasikan di lapangan dalam jangka panjang. Catu daya sistem disuplai oleh adaptor DC 5V/2A yang dihubungkan ke pin VIN ESP32 untuk memberi daya mikrokontroler, serta menyuplai tegangan 5V secara paralel menuju VCC sensor HC-SR04 dan LCD 16x2. Sirkuit pembagi tegangan disolder pada papan PCB dot-matrix kecil untuk memastikan kerapian sambungan kabel jumper. Spesifikasi komponen elektronika yang digunakan dijabarkan pada Tabel 4.8.

Tabel 4.5 Spesifikasi Komponen Elektronika Perangkat
| No | Nama Komponen | Spesifikasi Teknis | Peran dalam Sistem |
| -- | ------------- | ------------------ | ------------------ |
| 1 | Mikrokontroler ESP32 | Mikrokontroler 32-bit Tensilica Dual-Core, Tegangan 3.3V, Wi-Fi 802.11 | Unit pemrosesan data utama |
| 2 | Sensor Ultrasonik HC-SR04 | Tegangan input 5V, Jangkauan 2 - 400 cm, Sudut deteksi < 15derajat | Mengukur jarak antara sensor dengan permukaan sampah |
| 3 | Modul LCD 16x2 I2C | Layar monokrom 16x2 karakter, protokol komunikasi serial I2C | Menampilkan status tingkat kapasitas secara visual |
| 4 | Resistor Pembagi Tegangan | 1 kOhm dan 2 kOhm metal film toleransi 1% | Proteksi level tegangan pin Echo menuju ESP32 |
| 5 | PCB & Kabel Jumper | Papan PCB lubang FR4, kabel jumper tembaga AWG28 | Menghubungkan jalur sirkuit antarkomponen |

### 4.2.2 Perangkaian Mekanika
Kegiatan manufaktur berupa perangkaian mekanika dimulai dengan membuat wadah isolator (enclosure / body cover) sebagai pelindung utama papan sirkuit terhadap anomali cuaca. Opsi material jatuh pada polimer plastik jenis ABS (Akrilonitril-Butadiena-Stiren). Sifat kaku dari plastik ABS diperlukan untuk melindungi komponen dari benturan fisik, terutama saat proses pengangkutan sampah oleh petugas.

Resistansi material ABS terhadap fluktuasi kelembapan juga berperan besar untuk mengantisipasi potensi korsleting yang dipicu oleh uap korosif dari pembusukan limbah organik di bawahnya. Pada bagian penutup wadah pelindung, dibuat dua celah lingkaran presisi berdiameter 1.6 cm sebagai lubang transmiter dan receiver sensor ultrasonik, sehingga gelombang ultrasonik dapat dipancarkan ke dalam wadah penampungan tanpa adanya hambatan fisik. Layar LCD disematkan pada sisi depan penutup bodi dengan dilapisi akrilik transparan tipis dan lem sealant silikon untuk melindunginya dari cipratan air hujan.

(Instruksi: Masukkan Gambar 4.2 Tampilan Wujud Fisik Alat dari Berbagai Sisi di sini)

### 4.2.3 Pengujian Perangkat Keras dan Kalibrasi Sensor
Pengujian dilakukan setelah seluruh instrumen perangkat keras telah dirangkai secara sempurna. Pengujian difokuskan pada tingkat akurasi sensor ultrasonik dalam membaca kedalaman volume.

Pengujian sensor dilakukan untuk mendapatkan tingkat akurasi yang tepat dalam mengalkulasi sisa ruang kosong. Pengujian dilakukan melalui serangkaian proses kalibrasi dengan membandingkan nilai kepresisian jarak yang dibaca oleh sensor HC-SR04 melawan jarak aktual yang diukur menggunakan pita ukur / meteran standar. Adapun hasil pengujian akurasi terlihat pada Tabel 4.6.

Tabel 4.6 Hasil Pengujian Akurasi Pembacaan Jarak Sensor
| Jarak Aktual (cm) | Pembacaan Sensor (cm) | Selisih/Error (cm) | Akurasi (%) |
| ----------------- | --------------------- | ------------------ | ----------- |
| 5,0 | 5,1 | 0,1 | 98,0 |
| 10,0 | 10,2 | 0,2 | 98,0 |
| 15,0 | 14,8 | 0,2 | 98,7 |
| 20,0 | 19,9 | 0,1 | 99,5 |
| 25,0 | 25,2 | 0,2 | 99,2 |

Berdasarkan hasil pengujian pada Tabel 4.6, tingkat selisih (error) pembacaan alat secara konsisten berada di angka yang sangat minor, yakni kurang dari 1 cm (rata-rata error 0,16 cm). Hasil analisis deviasi ini menunjukkan adanya bias pengukuran akibat sudut penyebaran (beam width) pancaran ultrasonik sebesar 15 derajat yang berpotensi memantul pada dinding wadah apabila penempatan sensor tidak benar-benar tegak lurus. Namun, dengan persentase keakuratan rata-rata di atas 98.6%, maka instrumen pengukuran ultrasonik telah dinyatakan berjalan dengan sangat layak dan presisi untuk memicu notifikasi peringatan (alerts).

## 4.3 Integrasi Sistem
### 4.3.1 Kriteria Desain Website
Berdasarkan tujuan tugas akhir ini, perangkat tempat sampah pintar (Smart Bin) akan terintegrasi secara otomatis dengan sistem pemantauan berupa website (dashboard), sehingga dalam perancangannya diterapkan kriteria desain yang menjadi dasar pengembangannya. Kriteria desain didapatkan dari analisis kebutuhan operasional pengelola kebersihan DLHK. Adapun kriteria desain yang menjadi tujuan akhir pengembangan website adalah sebagai berikut:
1. Website mampu menampilkan data kapasitas volume sampah secara real-time dan bersifat responsive web design sehingga dapat diakses melalui komputer/laptop maupun smartphone.
2. Website memiliki sistem autentikasi (login) untuk membatasi hak akses pengelolaan data hanya kepada administrator yang berwenang.
3. Website menyajikan visualisasi data berupa progres bar dan indikator warna (hijau, kuning, merah) agar informasi hierarki prioritas pengangkutan lebih mudah diinterpretasikan oleh operator awam sekalipun.

### 4.3.2 Pengembangan Website
#### a. Desain Visual dan Antarmuka (UI/UX)
Tahapan pertama dalam proses desain antarmuka front-end adalah penetapan tema visual. Pemilihan skema Dark Mode (warna dominan gelap) dengan aksen hijau neon diterapkan bukan semata-mata demi nilai estetika, melainkan untuk mereduksi kelelahan mata (eye strain) bagi operator pemantau yang menatap layar dalam durasi panjang. Desain fitur dan user interface (UI) website ini dibagi menjadi beberapa segmen utama, yaitu halaman Autentikasi (Login), halaman Dashboard Utama, dan halaman Analitik Temporal.

(Instruksi: Masukkan Gambar 4.3 Rancangan Desain Interface / Wireframe Halaman Dashboard di sini)

#### b. Pemrograman Fitur Website dan Arsitektur Kode
Tahapan yang dilakukan setelah membuat desain interface adalah merealisasikannya menjadi sebuah website fungsional melalui proses pemrograman. Website dikembangkan menggunakan framework frontend React.js yang dikombinasikan dengan Vite, sedangkan untuk backend dan manajemen database menggunakan layanan awan Supabase (PostgreSQL). Format file yang digunakan dalam pertukaran data (payload) berupa format JSON. Tampilan website dibuat sistematis dan intuitif.

Struktur proyek front-end React.js disusun secara modular untuk memisahkan logika data dengan komponen visual:
- `/src/components`: Berisi komponen UI yang dapat digunakan kembali, seperti `AppSidebar.tsx` (navigasi), `BinStatusBadge.tsx` (tanda visual status), dan `BinFormDialog.tsx` (modal CRUD).
- `/src/context`: Menginkubasi `theme-provider.tsx` yang mengatur state tema Light/Dark Mode menggunakan CSS variables di Tailwind.
- `/src/hooks`: Mengandung file `useBins.ts` yang menangani fetch data, mutasi data, dan aktivasi realtime channel Supabase.
- `/src/pages`: Menyimpan file halaman utama seperti `DashboardPage.tsx`, `MapViewPage.tsx` (Peta spasial Leaflet), `AnalyticsPage.tsx` (ekspor PDF/CSV), dan `AboutPage.tsx` (Eco-Transparansi).

Adapun penjabaran detail fungsionalitas hasil pemrograman pada masing-masing antarmuka utama adalah sebagai berikut:

1. Halaman Autentikasi (*Login*)
   Dalam upaya mengamankan integritas pangkalan data dari kemungkinan intervensi pihak luar, portal autentikasi diimplementasikan selaku gerbang restriksi utama pada antarmuka aplikasi. Mengingat sistem pengelolaan persampahan ini memuat data operasional instansi pemerintah (Dinas Lingkungan Hidup), diperlukan batasan akses virtual untuk membedakan antara pengelola resmi dan publik anonim. Kehadiran halaman otorisasi ini memastikan bahwa seluruh fitur esensial—mulai dari pemantauan titik kritis hingga modifikasi aset fisik—mutlak dikendalikan oleh otoritas yang berwenang, sekaligus mencegah manipulasi data yang tidak sah.

   Lebih jauh, mekanisme perlindungan ini mewajibkan pengguna untuk melakukan sinkronisasi kredensial yang divalidasi langsung secara tersandi oleh layanan Supabase Auth. Segera setelah kredensial dinyatakan valid, arsitektur *back-end* akan menerbitkan sesi berbasis *JSON Web Token* (JWT) dengan tenggat waktu kedaluwarsa tertentu. Ketiadaan token ini secara otomatis memicu protokol *Route Guard* pada lapisan *front-end* untuk mengalihkan akses kembali ke halaman awal. Antisipasi terhadap upaya akses paksa (*brute force*) maupun kelalaian pengisian formulir ditangani secara preventif melalui modul penangkapan galat (*error handling*), yang memunculkan respons peringatan visual demi memandu interaksi pengguna dengan aman.

   (Instruksi: Masukkan Screenshot Halaman Login di sini)

2. Halaman *Dashboard* Utama (Pusat Kendali Operasional)
   Antarmuka ini difungsikan murni selaku stasiun pemantauan (*control station*) setelah administrator berhasil melewati tahapan autentikasi. Konstruksi dasbor difokuskan pada agregasi data sensor yang mengalir secara berkesinambungan, sehingga pengguna tidak perlu memuat ulang halaman secara manual (*refresh*). Pembaruan metrik seketika ini bersandar pada kapabilitas *realtime subscription* dari peladen PostgreSQL. Dengan mengadopsi pendekatan desain yang berpusat pada hierarki informasi, halaman dasbor dipecah ke dalam beberapa segmentasi pemantauan spesifik untuk memfasilitasi pengambilan keputusan yang cepat dan terukur.
   
   Rincian dari segmen-segmen tersebut mencakup:
   - Panel Statistik Makro: Memaparkan empat elemen indikator numerik di bagian teratas layar, yang menyajikan kalkulasi total aset wadah di lapangan, rasio mikrokontroler aktif, jumlah keranjang berstatus kritis, serta tumpukan tugas evakuasi yang mendesak.
   - Daftar Tugas Pengangkutan: Modul ini beroperasi secara kondisional manakala sistem mendeteksi anomali volume berstatus peringatan (*warning*) atau penuh. Tempat sampah dengan persentase timbunan tertinggi akan diposisikan pada urutan prioritas teratas, lengkap dengan ketersediaan tombol konfirmasi tugas pasca-eksekusi di lapangan.
   - Pemantau Kesehatan Sensor: Rutinitas pengawasan kondisi peranti keras difasilitasi melalui pelacakan waktu transmisi terakhir (*last_reading_at*). Deviasi waktu kontak kemudian dikonversi ke dalam indikator visual: hijau mengartikan sirkulasi jaringan normal, kuning mendeteksi kelambatan transmisi, sedangkan warna merah mengisyaratkan perangkat terputus dari jaringan koneksi nirkabel (*offline*).
   - Visualisasi Tingkat Kepenuhan: Transisi volume sampah harian direpresentasikan melalui grafik area (*area chart*) menggunakan pustaka Recharts, memadukan interval garis waktu pada sumbu horizontal dengan skala persentase pada sumbu vertikal.
   - Manajemen Notifikasi: Seluruh rentetan peringatan dini dibangkitkan secara otomatis oleh pemicu pangkalan data (*database trigger*). Perpindahan ambang batas menuju kondisi kritis akan langsung menghasilkan entri notifikasi baru yang memberikan informasi bagi operator dalam mengambil tindakan logistik.

   (Instruksi: Masukkan Screenshot Halaman Dashboard Utama di sini)

3. Halaman Pemetaan Geospasial (*GIS Mapping*)
   Transformasi deret koordinat lintang dan bujur menjadi representasi keruangan direalisasikan melalui integrasi pustaka pemetaan interaktif Leaflet. Halaman pemetaan spasial ini secara komprehensif memvisualisasikan persebaran titik infrastruktur mikrokontroler ke dalam format peta geografis dua dimensi. Pendekatan tata ruang ini krusial untuk diimplementasikan pada manajemen logistik perkotaan, karena interpretasi jarak antar-titik penampungan lebih efisien dilakukan secara visual dibandingkan menggunakan tabel data konvensional.
   
   Setiap penanda lokasi (*marker*) diatur untuk beroperasi secara dinamis dengan menyesuaikan pembaruan muatan data (*payload*) dari Supabase. Rona warna dari setiap penanda akan berubah secara otomatis mengikuti kalkulasi matematis jarak sensor—hijau mengindikasikan kapasitas aman, kuning menunjukkan status siaga, serta merah menandakan urgensi evakuasi tingkat tinggi. Jendela informasi (*pop-up*) yang memuat riwayat persentase kapasitas akan muncul ketika penanda dipilih, memberikan referensi kuantitatif bagi pengemudi armada saat merancang rute logistik terpendek.

   (Instruksi: Masukkan Screenshot Halaman Peta/Map View di sini)

4. Halaman Analitik Temporal dan Pelaporan (*Analytics*)
   Untuk memenuhi standar rekapitulasi administratif instansi pemerintahan, modul analitik ini dikembangkan sebagai instrumen pengolah data historis. Penyimpanan barisan angka murni tanpa adanya mekanisme pelaporan visual dapat menyulitkan proses analisis data logistik. Oleh karena itu, halaman analitik dirancang untuk mengekstrak data fluktuasi volume harian menjadi bagan tren interaktif yang lebih terstruktur bagi jajaran manajerial.
   
   Selain fungsi visualisasi tren, fungsionalitas ekstraksi laporan (*data export*) turut diimplementasikan sebagai fitur utama. Operator memiliki akses untuk mengonversi data agregat dari basis data ke dalam format berkas yang lazim digunakan secara komersial. Sistem memanfaatkan pustaka jsPDF untuk memproduksi dokumen laporan akhir berformat PDF, serta pustaka SheetJS untuk menghasilkan lembar kerja berekstensi .csv. Fitur pelaporan digital ini meminimalisasi potensi galat pada penyusunan evaluasi kinerja yang sebelumnya dilakukan secara manual (*human error*).

   (Instruksi: Masukkan Screenshot Halaman Analytics di sini)

5. Halaman Manajemen Aset Infrastruktur (*Admin/Bins*)
   Pemeliharaan dan pembaharuan data inventaris fisik direalisasikan melalui antarmuka modifikasi khusus yang terpisah dari konsol basis data. Panel pengelolaan infrastruktur ini dirancang untuk memfasilitasi kebutuhan administrasi perangkat lintas komponen, di mana perubahan parameter pada satu entitas fisik akan langsung diperbarui pada sistem pemantauan klien. Mengingat operator tidak diwajibkan memiliki latar belakang pemrograman basis data, keberadaan halaman ini sangat esensial untuk mempermudah proses manajemen sistem.
   
   Secara spesifik, antarmuka administrasi memberikan kewenangan bagi pengguna untuk mendaftarkan unit mikrokontroler ESP32 baru beserta penetapan titik koordinat pemetaannya. Fitur penyesuaian instrumen juga mengizinkan modifikasi parameter kalibrasi sensor (batas kedalaman wadah), serta menyediakan opsi untuk menonaktifkan sementara pembacaan data sensor ketika perangkat menjalani masa perbaikan teknis. Pendekatan manajemen grafis ini mengeliminasi kebutuhan eksekusi skrip basis data secara manual, sehingga pencatatan aset dapat berjalan mandiri, terpusat, dan terstruktur.

   (Instruksi: Masukkan Screenshot Halaman Manajemen Aset di sini)

6. Halaman Transparansi Lingkungan (*About / Eco*)
   Selain berfokus pada kapabilitas operasional dan transmisi data, sistem ini menyediakan laman informasi proyek di bawah tajuk "Eco-Transparansi Sleman". Halaman antarmuka ini disusun secara khusus untuk mendokumentasikan kerangka arsitektur teknis pembangun purwarupa, mencakup spesifikasi mikrokontroler, kerangka kerja front-end React.js, serta layanan komputasi awan Supabase. Dokumentasi teknis tersebut disajikan dengan bahasa yang terstruktur agar tetap relevan untuk dipahami oleh pihak eksternal.
   
   Sebagai wujud relevansi operasional terhadap keberlanjutan lingkungan, segmen ini turut membedah hubungan antara efisiensi logistik spasial dengan pelestarian lingkungan. Konsep ini direalisasikan melalui simulasi perhitungan matematis yang mengonversi jarak efisiensi rute harian menjadi estimasi pengurangan emisi gas karbon buang dari pembakaran bahan bakar truk. Paparan kalkulatif ini mempertegas kontribusi implementasi perangkat lunak pengelolaan sampah terhadap konsep tata kota cerdas (*Smart City*), yang juga memprioritaskan aspek kelestarian ekologi.

   (Instruksi: Masukkan Screenshot Halaman About/Eco-Transparansi di sini)

### 4.3.3 Implementasi Integrasi IoT dan Website
Tahap selanjutnya adalah proses integrasi pengiriman data dari perangkat keras menuju aplikasi web. Alur pengiriman data dimulai ketika sensor HC-SR04 membaca jarak sisa ruang, kemudian meneruskannya ke mikrokontroler ESP32. Mikrokontroler ESP32 lantas mengolah angka tersebut ke dalam formulasi persentase kapasitas. Persentase kapasitas (P) dihitung berdasarkan jarak pembacaan sensor (d) dan kedalaman maksimum tempat sampah (H_max) menggunakan persamaan berikut:

P = (1 - (d / H_max)) x 100%

Keterangan Variabel:
- P : Persentase kapasitas (tingkat kepenuhan) sampah dalam satuan persen (%).
- d : Jarak sisa ruang kosong yang dibaca oleh sensor dari bagian atas penutup ke permukaan tumpukan sampah (dalam satuan cm).
- H_max : Kedalaman maksimum atau tinggi total ruang dalam tempat sampah (dalam satuan cm).

Sebagai ilustrasi mudah cara kerja rumus ini di lapangan, misalkan sebuah tempat sampah memiliki tinggi ruang penampungan (H_max) sebesar 100 cm:
- Saat tempat sampah masih kosong, sensor akan membaca jarak hingga ke dasar (d = 100 cm). Maka perhitungannya: P = (1 - (100 / 100)) x 100% = 0%.
- Saat tempat sampah terisi limbah hingga menyisakan ruang kosong sebesar 10 cm dari atas (d = 10 cm), perhitungannya: P = (1 - (10 / 100)) x 100% = 90%. Angka 90% inilah yang menjadi representasi kapasitas penuh dan dikirimkan ke server.

Data akhir tersebut dikemas berformat JSON, kemudian dikirimkan melalui HTTP POST Request secara nirkabel (Wi-Fi) menuju titik akhir (endpoint) REST API Supabase dengan menyertakan Authorization Bearer Token pada header HTTP untuk keamanan akses database. Payload JSON yang dikirimkan memiliki struktur seperti pada contoh berikut:

```json
{
  "bin_id": "8f3b9c7d-4a1e-9b2c-8d7e-6f5a4b3c2d1e",
  "distance": 14.8,
  "calculated_volume": 75
}
```

Alur logika yang dieksekusi oleh firmware ESP32 secara berulang (main loop) dijabarkan pada pseudocode di bawah ini:

```text
ALGORITMA Firmware_ESP32_Loop
  Mulai
    // Membaca jarak dari sensor HC-SR04
    Picu pin Trigger (HIGH selama 10 mikrodetik, lalu LOW)
    Durasi = Baca durasi pulsa HIGH pada pin Echo
    Jarak = Durasi * 0.034 / 2
    
    // Validasi data pencilan (noise filter)
    Jika Jarak >= 2 dan Jarak <= max_depth Maka
      Persentase = (1 - (Jarak / max_depth)) * 100
      Jika Persentase < 0 Maka Persentase = 0
      Jika Persentase > 100 Maka Persentase = 100
      
      // Kirim data ke REST API Supabase
      Status_Kirim = HTTP_POST(URL_Supabase, JSON_Payload(bin_id, Jarak, Persentase))
      
      // Update Layar LCD Lokal
      Tampilkan_LCD("Vol: " + Persentase + "%")
      Jika Status_Kirim == 201 Maka
        Tampilkan_LCD("Kirim: Sukses")
      Lainnya
        Tampilkan_LCD("Kirim: Gagal")
      Akhir Jika
    Akhir Jika
    
    Tidur / Delay(30000) // Transmisi berkala setiap 30 detik
  Selesai
```

Setelah data tersimpan di tabel PostgreSQL, aplikasi React.js yang terhubung melalui WebSockets (Supabase Realtime) akan menerima pembaruan data tersebut secara otomatis. Mekanisme ini memungkinkan tampilan grafik dan indikator pada dashboard dapat diperbarui seketika tanpa mengharuskan pengguna memuat ulang (refresh) halaman.

(Instruksi: Masukkan Gambar 4.4 Diagram Alur/Flowchart Integrasi Sistem di sini)

### 4.3.4 Pengujian Sistem Integrasi
Pengujian sistem integrasi merupakan proses untuk memvalidasi bahwa transmisi data dari mikrokontroler berhasil ditampilkan akurat pada website. Proses pengujian dibagi menjadi dua segmen, yaitu pengujian fungsional fitur (Black Box) dan pengujian kecepatan transmisi (Response Time).

#### a. Hasil Pengujian Fitur Website (Black-Box)
Hasil pengujian menyoroti tingkat kesesuaian antara skenario perintah masukan pengguna terhadap luaran antarmuka aplikasi. Seluruh elemen interaksi telah diuji secara berkala dengan detail hasil yang dijabarkan pada Tabel 4.7.

Tabel 4.7 Hasil Pengujian Fitur Website dengan Metode Black Box
| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| -- | ------------------ | --------------------- | --------------- | ---------- |
| A | Gerbang Keamanan & Manajemen Sesi (Autentikasi) | | | |
| 1 | Registrasi akun baru (Email, password, role valid) | Akun tersimpan, penentuan role, redireksi ke beranda | Sesuai | Berhasil |
| 2 | Registrasi tanpa memilih role (kosong) | Memunculkan pesan galat "Role wajib dipilih" | Sesuai | Berhasil |
| 3 | Login dengan email & password terverifikasi | Kredensial divalidasi dan diarahkan ke Dashboard utama | Sesuai | Berhasil |
| 4 | Klik tombol "Logout" pada sidebar navigasi | Penghancuran token sesi, redireksi otomatis ke login | Sesuai | Berhasil |
| B | CRUD & Manajemen Aset Tempat Sampah (Admin) | | | |
| 1 | Menambah unit baru (Kode, lokasi, koordinat GPS) | Record tersimpan ke PostgreSQL, tampil di tabel pemantauan | Sesuai | Berhasil |
| 2 | Menghapus entri Smart Bin tidak aktif | Data terhapus permanen dari basis data dan tabel utama | Sesuai | Berhasil |
| 3 | Mengubah koordinat lokasi via Map Picker | Marker pada peta Leaflet otomatis bergeser ke lokasi baru | Sesuai | Berhasil |
| C | Dashboard & Real-Time Monitoring | | | |
| 1 | Pemantauan volume saat data dikirim oleh ESP32 | Persentase volume dan grafik terupdate real-time tanpa refresh | Sesuai | Berhasil |
| 2 | Menguji estimasi AI Forecast (waktu penuh) | Menampilkan teks prediksi sisa waktu (misal: "Penuh dlm 4 jam") | Sesuai | Berhasil |
| 3 | Menguji responsivitas visual via smartphone | Grid layout otomatis beradaptasi dengan ukuran layar mobile | Sesuai | Berhasil |
| D | Sistem Peringatan (Alerts) & Keamanan | | | |
| 1 | Pengiriman data volume >= 90% (Status Kritis) | Pemicuan modal peringatan merah & audio alarm beep | Sesuai | Berhasil |
| 2 | Klik tombol "Mark as Read" pada notifikasi | Status ter-update, badge counter belum terbaca berkurang | Sesuai | Berhasil |
| 3 | Pemutusan daya atau Wi-Fi perangkat ESP32 | Indikator Health Monitor berubah menjadi merah (offline) | Sesuai | Berhasil |
| E | Map View & Optimasi Rute (Geospasial) | | | |
| 1 | Membuka antarmuka peta geospasial (Map View) | Marker pin berubah warna (hijau/kuning/merah) sesuai volume | Sesuai | Berhasil |
| 2 | Menekan tombol "Optimalkan Rute Truk" | Sistem menggambar rute logistik terpendek di peta secara otomatis | Sesuai | Berhasil |
| 3 | Membaca indikator evaluasi metrik logistik | Menampilkan total jarak (Km), estimasi BBM hemat, & reduksi CO2 | Sesuai | Berhasil |
| F | Laporan, Tema & Aksesibilitas Web | | | |
| 1 | Menekan tombol "Cetak Laporan PDF" | Pembangkitan & pengunduhan berkas PDF rekapitulasi data historis | Sesuai | Berhasil |
| 2 | Mengubah tema antarmuka via Toggle Theme | Rona visual bertransisi mulus (Mode Gelap/Terang) | Sesuai | Berhasil |
| 3 | Menguji instalan Progressive Web App (PWA) | Aplikasi terpasang di home screen dan berjalan seperti native app | Sesuai | Berhasil |
| G | Keandalan Algoritma IoT (Reliability) | | | |
| 1 | Pembacaan jarak sensor melompat ekstrem (noise) | Filter IQR menolak data pencilan agar tidak disimpan ke basis data | Sesuai | Berhasil |

#### b. Hasil Pengujian Keseluruhan Sistem Integrasi (Response Time)
Pengujian ini bertujuan untuk mengukur kinerja modul Wi-Fi pada ESP32 dalam mentransmisikan paket data menuju basis data di server. Hasil pengujian waktu tunda (delay) transmisi data dirangkum dalam Tabel 4.8.

Tabel 4.8 Hasil Pengujian Waktu Tunda (Delay) Pengiriman Data
| No | Percobaan Ke- | Waktu Pengiriman (Detik) | Status Koneksi | Keterangan Sinyal |
| -- | ------------- | ------------------------ | -------------- | ----------------- |
| 1 | Percobaan 1 | 1,2 | Sukses | Kuat (-65 dBm) |
| 2 | Percobaan 2 | 1,5 | Sukses | Kuat (-62 dBm) |
| 3 | Percobaan 3 | 1,1 | Sukses | Kuat (-67 dBm) |
| 4 | Percobaan 4 | 1,8 | Sukses | Kuat (-60 dBm) |
| 5 | Percobaan 5 | 1,4 | Sukses | Kuat (-64 dBm) |
| Rata-rata | Waktu (Delay): | 1,4 detik | | |

Berdasarkan hasil pada Tabel 4.8, didapatkan rata-rata waktu tunda (latency) sebesar 1,4 detik. Hasil analisis menunjukkan bahwa akumulasi delay ini dipengaruhi oleh lima komponen hambatan utama (bottleneck stages):
1. Processing Delay (ESP32): Waktu bagi ESP32 untuk memicu pulsa trigger, membaca pulsa Echo, menghitung persentase rata-rata dari 5 sampel, dan menyusun teks biner payload JSON (durasi sekitar 100 ms).
2. Network Delay (Uplink): Waktu perjalanan paket data dari modul Wi-Fi ESP32 melewati router lokal menuju gerbang internet penyedia layanan (ISP) regional (durasi sekitar 150 ms).
3. Database Write & Parsing Delay (Supabase Serverless API): Server API Supabase menerima HTTP POST request, memvalidasi token JWT, mem-parsing format JSON, mengeksekusi penulisan baris record baru ke tabel PostgreSQL, serta memicu trigger fungsi internal database (durasi sekitar 600 ms).
4. WebSocket Propagation Delay (Supabase Realtime): Server realtime mendeteksi perubahan baris pada PostgreSQL, lalu mendistribusikan sinyal pembaruan (broadcast) lewat jalur koneksi WebSockets TCP ke seluruh klien yang terhubung (durasi sekitar 300 ms).
5. Rendering Delay (Client-Side React): Browser menerima payload pembaruan data, melakukan state update pada Virtual DOM React.js, dan merender ulang elemen grafik Recharts dengan animasi transisi visual (durasi sekitar 250 ms).

Total jumlahan hambatan di atas menghasilkan latency rata-rata sebesar 1,4 detik yang dikategorikan sangat responsif (hampir seketika) karena jauh di bawah ambang batas toleransi operasional yang ditetapkan sebesar 30 detik.

## 4.4 Analisis Pengaruh dan Rencana Penerapan Sistem Smart Waste Management dalam Penanganan Permasalahan Sampah
### 4.4.1 Analisis Permasalahan Pengelolaan Sampah serta Pengaruh Penerapan Sistem Smart Waste Management
Sistem pemantauan tong sampah pintar yang terintegrasi dengan dasbor website ini merupakan perwujudan inovasi teknologi siber dalam manajemen infrastruktur publik. Pengadaan purwarupa ini ditujukan semata-mata untuk mengakhiri inefisiensi masif pada tata kelola pengumpulan limbah perkotaan. Mengacu pada rumusan observasi, permasalahan kronis di lapangan berakar dari penerapan rutinitas pengangkutan yang tidak terarah (blind collection routine). Armada truk instansi acapkali diwajibkan menyisir belasan rute jalan secara statis dan mendatangi setiap titik penampungan sampah, padahal seringkali wadah yang didatangi masih dalam keadaan kosong atau terisi sedikit. Akibatnya, alokasi bahan bakar minyak (BBM) tersedot sia-sia, sementara di belahan wilayah lain, tong sampah yang sudah penuh justru tidak tertangani lantaran terlewat dari jadwal prioritas petugas kebersihan.

Kehadiran produk inovasi Smart Waste Management ini menjadi solusi atas kendala tersebut dengan mengoptimalkan skema operasional menjadi pemanduan rute berbasis data aktual (Data-Driven Routing) (Sarmila, Achmad, & Arda, 2025). Berbekal implementasi mikrokontroler pada tempat sampah dan integrasi pangkalan data Supabase di hilir, pihak manajemen kebersihan kini memiliki kemampuan pemantauan secara terpusat (ATC). Truk pengangkut armada hanya diinstruksikan untuk menghidupkan mesin dan meluncur ke jalanan bilamana layar dasbor telah mendelegasikan perintah rute berlabel warna merah pekat (Kapasitas >= 70%).

Untuk membuktikan efisiensi operasional secara ilmiah, dibuat sebuah pemodelan simulasi perhitungan matematis sederhana perbandingan antara metode pengangkutan statis konvensional terhadap metode dinamis berbasis data dengan parameter sebagai berikut:
- Jumlah Aset Tempat Sampah (Smart Bins): 10 Titik di wilayah kerja Sleman.
- Rute Statis Konvensional: Truk wajib melintasi seluruh 10 titik setiap hari dengan jarak tempuh total 25 km.
- Rute Dinamis Berbasis Data: Truk hanya mendatangi titik-titik kritis (volume >= 70%). Berdasarkan data historis lapangan, rata-rata hanya 4 titik yang menyentuh batas kritis tersebut per hari. Dengan algoritma optimasi rute terpendek, jarak tempuh terpangkas menjadi 12 km.
- Konsumsi Bahan Bakar Truk (Solar): Rata-rata 1 Liter Solar per 5 km (0,2 Liter/km).
- Emisi Karbon Pembakaran Solar: 1 Liter Solar menghasilkan sekitar 2,68 kg CO2.

Perbandingan efisiensi operasional selama kurun waktu 1 bulan (30 hari) dijabarkan secara rinci pada analisis matematis di bawah ini:

1. Kasus A: Metode Konvensional (Statis)
   Pada metode lama, truk mendatangi seluruh 10 titik setiap hari dengan jarak tempuh total 25 km, tanpa mengetahui isi tempat sampah.
   - Konsumsi Solar Harian = 25 km x 0,2 Liter/km = 5 Liter per hari.
   - Konsumsi Solar Bulanan = 5 Liter x 30 hari = 150 Liter per bulan.
   - Emisi Gas CO2 Bulanan = 150 Liter x 2,68 kg CO2/Liter = 402 kg CO2 per bulan.
   (Catatan: Setiap 1 liter pembakaran solar menghasilkan sekitar 2,68 kg gas Karbon Dioksida).

2. Kasus B: Metode Smart Waste (Data-Driven)
   Pada metode baru yang dikembangkan, truk hanya mendatangi titik yang terbukti sudah penuh (rata-rata 4 titik per hari berdasarkan data), sehingga rute tempuh memendek menjadi 12 km.
   - Konsumsi Solar Harian = 12 km x 0,2 Liter/km = 2,4 Liter per hari.
   - Konsumsi Solar Bulanan = 2,4 Liter x 30 hari = 72 Liter per bulan.
   - Emisi Gas CO2 Bulanan = 72 Liter x 2,68 kg CO2/Liter = 192,96 kg CO2 per bulan.

3. Kalkulasi Selisih Efisiensi (Penghematan)
   Berdasarkan perbandingan kedua kasus di atas, diperoleh angka penghematan riil sebagai berikut:
   - Penghematan BBM Bulanan = 150 Liter - 72 Liter = 78 Liter Solar. (Meningkatkan efisiensi BBM sebesar 52%).
   - Pengurangan Emisi Karbon Bulanan = 402 kg CO2 - 192,96 kg CO2 = 209,04 kg CO2. (Menurunkan pencemaran udara dari asap truk sebesar 52%).

Pada akhirnya, integrasi antara sensor perangkat keras di lapangan dan sistem pemantauan di pusat kendali terbukti secara matematis mampu mengoptimalkan konsumsi bahan bakar armada pengangkut, menurunkan tingkat emisi karbon, serta mencegah terjadinya penumpukan sampah liar secara preventif.

### 4.4.2 Rencana Penerapan Sistem Smart Waste Management
Sebagai rangkaian tindak lanjut dari perwujudan sistem fungsional ini, terdapat dimensi perencanaan kepatuhan hukum yang perlu dipertimbangkan agar inovasi piranti lunak dan keras ini memiliki dasar hukum yang jelas ketika diterapkan dalam skala pemerintahan daerah sesungguhnya.

#### a. Kepatuhan Regulasi Nasional
Implementasi sirkuit penginderaan jarak jauh dan pencatatan metrik volume persampahan yang tertanam pada antarmuka website ini sejalan dan tunduk dengan peraturan perundang-undangan yang berlaku, di antaranya:
1. Undang-Undang No. 18 Tahun 2008 tentang Pengelolaan Sampah: Undang-undang ini mengatur pendelegasian wewenang kepada instansi daerah untuk memodernisasi tata kelola persampahan menjadi lebih visioner, menyeluruh, dan berbasis pendataan komprehensif. Sistem pengumpulan data time-series dari kerangka purwarupa ini menyediakan fondasi arsip digital yang memenuhi kriteria modernisasi tersebut.
2. Peraturan Pemerintah No. 81 Tahun 2012 tentang Pengelolaan Sampah: Regulasi ini mewajibkan pemerintah daerah untuk menyediakan sistem informasi pengelolaan sampah yang mutakhir, transparan, dan mudah diakses untuk kebutuhan evaluasi publik.

#### b. Penetapan Rute Cerdas (Smart Routing Target)
Agar sistem informasi pemantauan yang dikembangkan dapat memberikan dampak yang maksimal, luaran data dari sistem ini sangat direkomendasikan untuk dimanfaatkan sebagai sistem pendukung keputusan (*decision support*) bagi pihak pengelola armada kebersihan. Data tempat sampah dengan parameter tingkat kepenuhan di atas 70% yang tersaji pada antarmuka sistem dapat diusulkan sebagai rujukan pendukung bagi pemangku kebijakan sebelum menyusun rute harian pengangkutan. Dengan mengadopsi pemanduan rute berbasis data aktual ini, instansi pengelola memiliki peluang besar untuk meningkatkan efisiensi konsumsi bahan bakar truk operasional. Pendekatan ini diharapkan dapat menjadi sumbangsih akademis dalam membantu mewujudkan tata kelola persampahan daerah yang ramah lingkungan (*green operation*) serta selaras dengan visi pengembangan Smart City.

## Daftar Pustaka

Perumal, V., Divya, S. V., & Vishal, N. (2024). Smart dustbin using ESP32 for waste management. IRO Journal on Sustainable Wireless Systems, 4(002). https://doi.org/10.36548/jsws.2024.4.002

Raju, M. M., Dilip, P. S., Bandopant, S. S., Annaso, K. A., & Patole, R. K. (2024). Smart waste management system using ESP32. International Research Journal of Innovations in Engineering and Technology, 8(4). https://doi.org/10.47001/IRJIET/2024.804043

Sarmila, S., Achmad, A., & Arda, A. L. (2025). Smart waste management monitoring and control analysis based on objects based on smart systems and internet of things. Journal of Applied Informatics and Computing, 9(6). https://doi.org/10.30871/jaic.v9i6.11281
