# STRUKTUR LENGKAP REVISI SKRIPSI (SIAP COPY-PASTE)

*Mohon maaf jika sebelumnya membingungkan. Ini adalah **TEKS LENGKAP** yang sudah dirangkai menggunakan tulisan asli Anda. Anda benar-benar tinggal **COPY (CTRL+C)** semua teks di bawah ini dan **PASTE (CTRL+V)** untuk menggantikan isi Bab 1.7, seluruh isi Bab 3, dan seluruh isi Bab 4 di Microsoft Word Anda.*

---

### BAB I PENDAHULUAN

*(Biarkan subbab 1.1 sampai 1.6 sama seperti aslinya)*

**1.7 Metodologi Penelitian**
Penelitian ini menggunakan metode pengembangan perangkat lunak Waterfall berdasarkan kerangka kerja Pressman (2014), yang terdiri dari tahap Komunikasi, Perencanaan, Pemodelan, Konstruksi, dan Penerapan (Deployment). Adapun pengumpulan data untuk menganalisis kebutuhan sistem dilakukan melalui tiga pendekatan, yakni wawancara langsung dengan pihak instansi terkait (DLHK Sleman, UPTD Pelayanan Persampahan, dan TPST Donokerto), observasi lapangan, serta studi literatur. Penjelasan lebih komprehensif mengenai penerapan tahapan metodologi dan perancangan sistem secara detail dibahas pada Bab III.

---

### BAB III METODE PENELITIAN

**3.1 Pendahuluan**
Metodologi penelitian berfungsi sebagai pedoman agar seluruh tahapan pengembangan sistem dapat berjalan dengan terarah dan terukur. Pendekatan yang terstruktur ini memastikan bahwa proses pengerjaan tidak dilakukan secara acak, melainkan mengikuti alur yang jelas sehingga hasilnya dapat dipertanggungjawabkan secara ilmiah (Sommerville, 2015).
Fokus utama penelitian ini adalah membangun sistem Smart Waste Management dengan mengintegrasikan teknologi Internet of Things (IoT) dan dashboard pemantauan berbasis web. Tujuannya adalah untuk mempermudah pemantauan kapasitas tempat sampah secara real-time. Selama ini, pemantauan masih dilakukan secara manual dengan mendatangi lokasi secara langsung. Hal ini sering menyebabkan keterlambatan jadwal pengangkutan dan memicu penumpukan sampah (Ishlakhuddin et al., 2025).
Penelitian ini menggunakan metode Waterfall yang mengacu pada Generic Process Framework dari Pressman (2014) (Pressman & Maxim, 2014). Metode ini dipilih karena tahapan pengerjaannya berurutan dan dilakukan secara bertahap. Pendekatan ini dinilai efektif untuk menjaga konsistensi perancangan sistem, memudahkan penyusunan dokumentasi laporan, serta meminimalkan risiko kesalahan pada setiap tahapannya.

**3.2 Kerangka Kerja Penelitian (Generic Process Framework)**
Penelitian ini mengikuti kerangka pengembangan perangkat lunak dari Pressman. Kerangka ini membagi proses perancangan sistem menjadi lima tahapan utama, yaitu: komunikasi (communication), perencanaan (planning), pemodelan (modeling), konstruksi (construction), dan penerapan sistem (deployment) (Pressman & Maxim, 2014).
*(Silakan masukkan Gambar 3.1 Diagram Penyelesaian Penelitian di sini)*
Secara garis besar, tahap komunikasi dilakukan untuk mengidentifikasi masalah di lapangan dan mengumpulkan data pendukung. Tahap perencanaan digunakan untuk menentukan indikator keberhasilan alat. Setelah itu, proses dilanjutkan ke tahap pemodelan guna menganalisis spesifikasi kebutuhan dan merancang desain sistem. Setelah perancangan selesai, tahap konstruksi dimulai dengan merakit perangkat keras dan menulis kode program, lalu dilanjutkan dengan proses pengujian. Terakhir, sistem diterapkan dan dievaluasi kinerjanya.

**3.3 Tahap Komunikasi (Communication)**
Tahap ini bertujuan untuk berinteraksi dengan pengguna atau pihak terkait (seperti petugas kebersihan) guna memahami kendala nyata di lapangan. Dari proses ini, peneliti dapat merumuskan fitur-fitur yang perlu disediakan pada sistem yang akan dibangun (Yusup et al., 2025).

**3.3.1 Identifikasi Masalah**
Langkah ini penting untuk mengetahui kondisi sistem pengelolaan sampah saat ini. Berdasarkan hasil observasi, petugas masih memeriksa kondisi tempat sampah secara fisik dari satu lokasi ke lokasi lain. Metode pemeriksaan manual tersebut kurang efisien dari segi waktu dan tenaga, terutama untuk jangkauan wilayah yang luas. Karena tidak ada informasi jarak jauh terkait tingkat kepenuhan sampah, pembaruan data kebersihan menjadi lambat.
Selain itu, jadwal truk pengangkut masih bersifat statis dan tidak disesuaikan dengan kondisi tumpukan sampah yang sebenarnya di lapangan. Akibatnya, armada sering mendatangi tempat sampah yang sudah meluber, atau sebaliknya, mendatangi lokasi yang ternyata masih kosong. Hal ini menunjukkan perlunya penerapan teknologi sensor yang dapat mendeteksi kapasitas sampah secara otomatis dan mengirimkan datanya secara real-time.

**3.3.2 Pengumpulan Data**
Untuk menentukan kebutuhan sistem dengan presisi, peneliti mengumpulkan data menggunakan tiga metode utama:
1. Wawancara: Sesi tanya jawab dilakukan dengan pihak Dinas Lingkungan Hidup (DLHK), UPTD Pelayanan Persampahan Sleman, dan TPST Donokerto untuk mempelajari Standar Operasional Prosedur (SOP) pengelolaan sampah saat ini. Peneliti juga menggali berbagai kendala teknis yang dihadapi oleh petugas.
2. Observasi Lapangan: Peninjauan langsung dilakukan di lingkungan operasional untuk mengamati rute armada pengangkut, persebaran letak tempat sampah, dan memverifikasi kendala fisik yang menghambat kelancaran proses pengangkutan.
3. Studi Literatur: Peneliti mengkaji berbagai referensi akademik seperti jurnal ilmiah dan pedoman yang berkaitan dengan pemanfaatan teknologi IoT, penggunaan sensor ultrasonik, dan pembuatan antarmuka web. Referensi ini dijadikan landasan teori sebelum merancang prototipe sistem (Muhaimin & Mufti, 2024).

**3.4 Tahap Perencanaan (Planning)**
Setelah inti masalah dipetakan, tahapan selanjutnya adalah merencanakan arah teknis pengerjaan alat dan menetapkan target kinerja sistem yang terukur.

**3.4.1 Penentuan Indikator Penelitian**
Indikator ini difungsikan sebagai tolok ukur untuk mengevaluasi kelayakan kinerja alat. Sistem terintegrasi yang dibangun nantinya akan dinilai berdasarkan pencapaian parameter pengujian berikut (Pressman & Maxim, 2014).

Tabel 3.1 Penentuan Indikator Penelitian
*(Silakan masukkan Tabel 3.1 Penentuan Indikator di sini)*

Target-target capaian ini akan dievaluasi dan dijadikan acuan penilaian utama pada saat tahap pengujian alat (testing) dilakukan.

**3.5 Tahap Pemodelan (Modeling)**
Tahap ini merupakan proses memodelkan masalah operasional menjadi sebuah rancangan sistem yang utuh, mencakup aspek perangkat keras (hardware) maupun perangkat lunak (software).

**3.5.1 Analisis Kebutuhan Sistem**
Kebutuhan fungsionalitas sistem diklasifikasikan ke dalam dua bagian agar proses pengembangan lebih fokus (Sommerville, 2015):
a. Kebutuhan Fungsional
• Sistem harus mampu mengukur sisa ruang kapasitas tempat sampah secara mandiri menggunakan sensor ultrasonik.
• Modul mikrokontroler harus dapat membaca data sensor dan mentransmisikannya ke internet secara otomatis.
• Diperlukan antarmuka web berupa dasbor pemantauan guna menampilkan visualisasi tingkat persentase sampah secara langsung kepada pengguna.
• Sistem harus memiliki lampu peringatan LED indikator yang otomatis menyala jika tempat sampah terdeteksi penuh.

b. Kebutuhan Non-Fungsional
• Rangkaian komponen fisik harus dirancang agar memiliki keandalan daya yang stabil untuk pengoperasian dalam durasi yang panjang.
• Tata letak antarmuka dasbor harus bersifat responsif (responsive layout) agar ukuran grafisnya menyesuaikan secara proporsional dengan layar komputer maupun ponsel.
• Waktu muat (loading) pada halaman web serta kecepatan penerimaan pembaruan data harus berlangsung secara cepat.

**3.5.2 Perancangan Sistem**
Bagian ini menjabarkan alur logika kerja serta arsitektur sistem secara umum (Sommerville, 2015).

**a. Kriteria Desain Perangkat Keras**
Sesuai dengan tujuan tugas akhir ini adalah membuat sistem Smart Waste Management yang akan digunakan oleh Dinas Lingkungan Hidup (DLHK) maupun UPTD Pelayanan Persampahan, sehingga dalam perancangannya ditetapkan kriteria yang menjadi dasar rancang bangun tempat sampah pintar (Smart Bin). Kriteria desain didapat dari kegiatan observasi langsung di lapangan yang dikembangkan berdasarkan pertimbangan aspek efisiensi operasional dan kemudahan pengguna. Adapun kriteria yang menjadi tujuan akhir perancangan adalah sebagai berikut:
1. Perangkat keras bersifat plug-and-play, sehingga mudah dipasang pada berbagai jenis tempat sampah standar instansi.
2. Perangkat memiliki daya tahan terhadap kondisi cuaca luar ruangan dan kelembapan di dalam tempat sampah.
3. Sistem mampu membaca volume sampah dan mengirimkan datanya secara real-time untuk meminimalkan inspeksi manual.

Berdasarkan kriteria tersebut, sistem yang direncanakan berjenis pemantauan jarak jauh berbasis mikrokontroler ESP32. Mikrokontroler ESP32 dipilih karena memiliki tingkat konektivitas yang baik dengan adanya modul Wi-Fi bawaan untuk integrasi Internet of Things (IoT). Selanjutnya, jenis sensor ultrasonik HC-SR04 dipilih untuk mendeteksi tinggi tumpukan sampah tanpa harus bersentuhan langsung dengan objek fisik, sehingga meminimalisir risiko kerusakan.

Penempatan komponen perangkat keras dirancang sedemikian rupa agar tidak mengganggu fungsi utama tempat sampah saat operasional pembuangan sampah. Seluruh komponen elektronik ditempatkan secara terpusat pada bagian dalam penutup tempat sampah. Dalam konfigurasinya, sensor ultrasonik diarahkan lurus ke bawah menuju dasar tempat sampah untuk mendeteksi tinggi tumpukan sampah yang ada. Hasil deteksi dari sensor tersebut selanjutnya diproses oleh ESP32 untuk dihitung tingkat kepenuhannya, lalu dikirimkan ke server menggunakan jaringan nirkabel. Sebagai penanda visual, sistem dilengkapi dengan indikator berupa tiga lampu LED (merah, kuning, hijau) yang terpasang di sisi luar penutup tempat sampah. Seluruh rangkaian ini dilindungi menggunakan kotak panel (casing) yang bersifat kedap air, dengan sumber daya listrik yang disuplai melalui sambungan adaptor DC.

**b. Kriteria Desain Website**
Untuk memaksimalkan fungsi dari perangkat keras IoT, data yang diperoleh harus dikumpulkan dan ditampilkan pada sebuah sistem informasi terpusat. Pengembangan aplikasi berbasis web ini dirancang untuk mempermudah pihak pengelola kebersihan dalam melakukan pemantauan. Adapun kriteria utama dalam pengembangan antarmuka web ini adalah sebagai berikut.
1. Sistem harus mampu menyajikan informasi kapasitas tempat sampah secara real-time dan memiliki tampilan yang responsif (responsive web design) sehingga dapat diakses melalui berbagai perangkat seperti komputer maupun ponsel pintar.
2. Sistem dilengkapi dengan fitur autentikasi (login) guna membatasi hak akses pengelolaan data hanya kepada pihak administrator yang berwenang.
3. Dashboard monitoring harus menyajikan visualisasi data berupa grafik dan indikator warna agar informasi lebih mudah dipahami oleh petugas operasional.

Desain Software: Penulisan logika program pada mikrokontroler ESP32 dijalankan menggunakan aplikasi Arduino IDE. Untuk perancangan antarmuka pengguna web (front-end), sistem dikembangkan menggunakan gabungan pustaka React.js dan perangkat Vite untuk performa yang optimal, serta Tailwind CSS untuk mengatur gaya desainnya. Manajemen basis data secara keseluruhan dikelola menggunakan layanan komputasi awan Supabase.

**3.6 Tahap Konstruksi (Construction)**
Fase konstruksi adalah tahap persiapan perakitan rancangan menjadi perangkat fisik nyata. Aktivitas di tahap ini meliputi persiapan komponen elektronik, penentuan arsitektur pemograman, dan perumusan pengujian fungsi dasar dari alat yang akan dirakit.

**3.6.1 Alat dan Bahan**
Peneliti mempersiapkan sejumlah modul perangkat keras utama yang dibutuhkan untuk merakit satu unit instrumen pemantau tempat sampah yang fungsional secara komprehensif.
*(Silakan masukkan Tabel 3.2 Alat dan Bahan yang berisi daftar ESP32 sampai Kapasitor di sini)*

**3.6.2 Implementasi Sistem Perangkat Lunak**
Langkah ini merupakan fase di mana rancangan arsitektur dan diagram yang telah dibuat sebelumnya diterjemahkan menjadi baris kode program. Pada sisi perangkat lunak mikrokontroler (ESP32), implementasi kode difokuskan pada kalkulasi waktu pantulan gelombang suara sensor ultrasonik untuk mendapatkan nilai metrik jarak, serta menerapkan fitur Captive Portal yang memungkinkan inisialisasi jaringan nirkabel secara dinamis. Transmisi data menuju basis data Supabase dilakukan menggunakan protokol HTTP POST dalam format JSON. Pada lapisan antarmuka aplikasi (Web Dashboard), sistem mengimplementasikan *Realtime Subscribe* dari pustaka Supabase untuk merespons pembaruan data secara seketika tanpa harus memuat ulang peramban.

**3.6.3 Skenario Pengujian Sistem**
Fase ini ditujukan untuk melangsungkan serangkaian rencana uji teknis, dengan sasaran utama memastikan keandalan fungsional dari platform perangkat lunak serta mengukur kelancaran proses transmisi data. Tahap pengujian ini dibagi menjadi empat fokus utama:
• Pengujian Sensor: Membandingkan jarak terbaca sensor dengan jarak aktual yang diukur menggunakan meteran.
• Pengujian Kotak Hitam (Black Box): Tahap pengujian pada penelitian ini terpusat pada evaluasi platform website pemantauan melalui penerapan skema black box. Pendekatan ini dipilih murni untuk menakar kesesuaian fungsional perintah antarmuka pengguna tanpa membedah kode di baliknya.
• Pengujian Response Time: Tes ini bertujuan untuk mencatat durasi waktu yang dibutuhkan selama proses transmisi paket data jaringan (latency) hingga berhasil divisualisasikan.
• Pengujian Penerimaan Pengguna (User Acceptance Test): Pengujian ini dilakukan menggunakan pendekatan kualitatif melalui observasi dan wawancara dengan petugas instansi terkait mengenai kemudahan antarmuka.

**3.7 Tahap Penerapan dan Evaluasi (Deployment)**
Prosedur penyebaran tingkat akhir ini dilakukan apabila sistem instrumen perangkat keras beserta aplikasi web pantaunya telah dirakit secara utuh dan lolos verifikasi fungsi di tataran laboratorium. Tahap evaluasi akan membandingkan kinerja fungsional sistem secara operasional di lapangan dengan kriteria target yang disusun pada tahapan perencanaan awal. Catatan hasil evaluasi secara keseluruhan nantinya akan disusun sebagai pedoman penyempurnaan sistem serta menjadi standar acuan perawatan.

---

### BAB IV HASIL DAN PEMBAHASAN

**4.1 Manufaktur dan Implementasi Perangkat Keras**
**4.1.1 Perangkaian Elektronika**
Tahap perakitan diawali dengan menghubungkan seluruh modul elektronik pembentuk sistem. Proses ini dilakukan dengan menyolder kaki komponen secara hati-hati agar setiap jalur kelistrikan terhubung dengan baik dan terhindar dari risiko arus pendek (short circuit). Spesifikasi rinci dari komponen perangkat keras yang dirakit pada tahap ini dapat dilihat pada tabel di bawah ini.
*(Silakan masukkan Tabel 4.1 Spesifikasi Komponen Perangkat Keras di sini)*

**4.1.2 Perangkaian Mekanika**
Tahap mekanika berfokus pada pembuatan kotak pelindung (enclosure) untuk melindungi papan sirkuit dari kondisi lingkungan. Material utama yang digunakan untuk boks ini adalah plastik ABS (Akrilonitril-Butadiena-Stiren). Penggunaan plastik ABS dipilih karena memiliki karakteristik mekanik yang kuat, sehingga mampu menahan benturan saat penutup tempat sampah ditutup secara kasar oleh pengguna. Selain itu, plastik ini memiliki ketahanan yang baik terhadap perubahan suhu dan kelembapan, yang sangat berguna untuk mencegah terjadinya korsleting akibat uap pembusukan sampah. Sensor ultrasonik ditempatkan secara presisi pada lubang di bagian dasar boks ABS, sehingga gelombang ultrasonik dapat dipancarkan dengan bebas ke arah tumpukan sampah.

**4.2 Integrasi dan Implementasi Perangkat Lunak**
**4.2.1 Algoritma Mikrokontroler (ESP32)**
Pada sisi mikrokontroler (ESP32), program yang telah dirancang berhasil mendeteksi dan mengirim data jarak secara konstan. Berikut adalah bagian inti dari algoritma pembacaan sensor dan komunikasi datanya:

```cpp
// Algoritma Pembacaan Jarak Sensor HC-SR04
float readDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  long duration = pulseIn(PIN_ECHO, HIGH, 30000UL); // Menangkap gema
  if (duration == 0) return -1.0f; // Timeout jika gagal
  return (duration * 0.0343f) / 2.0f; // Konversi ke Centimeter
}

// Logika Implementasi Captive Portal
void startConfigPortal() {
  WiFi.mode(WIFI_AP);
  WiFi.softAP("SmartBin-Setup"); 
  server.on("/save", HTTP_POST, [&]() {
    String bc = server.arg("bincode");
    String ak = server.arg("apikey");
    preferences.putString("bincode", bc);
    preferences.putString("apikey", ak);
    ESP.restart(); // Muat ulang dengan profil baru
  });
  server.begin();
}
```

**4.2.2 Pengembangan Web Dashboard**
Desain antarmuka web "EcoPhora" diawali dengan pemilihan kombinasi warna *Dark Mode* (mode gelap) dengan warna aksen hijau. Sistem ini terbagi menjadi tiga halaman utama. 

Halaman Autentikasi (Login) berfungsi sebagai gerbang keamanan utama sistem untuk membatasi hak akses. Pada halaman ini, desain difokuskan pada fungsionalitas formulir masuk dengan tata letak minimalis yang memusat di tengah layar (*center-aligned*). Di bagian atas, terdapat logo dan nama aplikasi "EcoPhora - Smart Waste Management System". Untuk melakukan otentikasi, pengguna harus menekan tombol *Sign In* berwarna hijau solid yang kemudian akan mengeksekusi proses validasi kredensial pengguna menuju peladen basis data.

Halaman *Dashboard* berperan sebagai pusat kendali operasional (*control center*) setelah administrator berhasil melewati tahapan autentikasi. Antarmuka ini secara spesifik dirancang untuk menyajikan rekapitulasi data sensor secara *real-time* tanpa mengharuskan pengguna memuat ulang halaman (*refresh*). Transmisi pembaruan data terjadi seketika di layar pengguna, yang dimungkinkan berkat pemanfaatan fitur *realtime subscription* dari peladen basis data Supabase.
Pada struktur antarmukanya, tata letak halaman ini dipecah ke dalam beberapa segmen fungsional sebagai berikut:
1. **Panel Statistik Makro**: Tersusun atas empat kartu indikator di bagian teratas layar. Parameter yang ditampilkan mencakup jumlah keseluruhan tong sampah yang diawasi (*Total Smart Bins*), rasio perangkat mikrokontroler ESP32 yang berstatus terhubung ke jaringan (*Active Devices*), kalkulasi wadah yang telah menyentuh batas kapasitas maksimal (*Full Bins*), serta akumulasi tugas pengangkutan yang perlu segera dieksekusi oleh petugas lapangan (*Collection Tasks*).
2. **Daftar Tugas Pengangkutan (Smart Collection Route)**: Modul ini dirancang agar beroperasi secara kondisional. Apabila terdapat tempat sampah yang volume isiannya mencapai batas peringatan (*warning*) atau ambang batas penuh, sistem akan otomatis menampilkannya dalam wujud daftar prioritas. Unit dengan persentase muatan tertinggi akan ditempatkan pada urutan teratas. Modul ini turut dilengkapi dengan tombol "Tandai Selesai" guna memfasilitasi petugas dalam memberikan konfirmasi pasca-pengangkutan limbah.
3. **Pemantau Kesehatan Sensor (Anomaly Detection)**: Mengingat perangkat keras di lapangan beroperasi tanpa pengawasan langsung, fitur ini ditambahkan untuk mendeteksi anomali koneksi. Sistem secara mandiri mengevaluasi jeda waktu pengiriman data terakhir (*last_reading_at*) dari masing-masing titik sensor. Status kesehatan ini kemudian dikonversi menjadi indikator visual: penanda hijau mengartikan transmisi berjalan normal, kuning menandakan adanya keterlambatan penerimaan paket data, sedangkan merah mengindikasikan bahwa perangkat keras telah terputus dari jaringan (*offline*).
4. **Visualisasi Tingkat Kepenuhan**: Fluktuasi volume timbunan sampah direpresentasikan menggunakan grafik area (*area chart*) yang dibangun di atas pustaka antarmuka Recharts. Sumbu horizontal pada grafik memetakan interval waktu masuknya data, sementara sumbu vertikal merepresentasikan skala kapasitas dalam rentang 0 hingga 100 persen. Untuk mempermudah pembacaan, area di bawah garis tren diisi dengan gradasi warna hijau transparan.
5. **Panel Notifikasi Sistem (Recent Alerts)**: Mekanisme peringatan dini dikelola secara otonom pada level *backend* melalui eksekusi *trigger database* `update_bin_from_reading()`. Setiap kali jarak pantulan sensor mendeteksi perubahan status wadah dari kosong menjadi penuh, basis data PostgreSQL langsung menerbitkan notifikasi baru. Entri log peringatan ini diklasifikasikan berdasarkan tingkat urgensinya, dengan menempatkan palet merah untuk kondisi kritis dan kuning untuk kategori peringatan.
6. **Ekspor Laporan**: Guna mengakomodasi kebutuhan rekapitulasi administrasi instansi pengelola, fungsionalitas ekstraksi data disematkan pada sudut kanan atas antarmuka. Pengelola sistem memiliki keleluasaan untuk menarik data pantauan ke dalam format lembar kerja *Comma-Separated Values* (.csv) yang dieksekusi melalui pustaka SheetJS, maupun mengonversinya menjadi dokumen cetak *Portable Document Format* (.pdf) lewat modul jsPDF.

**4.3 Hasil Pengujian Sistem**
**4.3.1 Pengujian Perangkat Keras (Akurasi Sensor)**
Tahap pengujian ini dilakukan untuk memastikan bahwa sensor HC-SR04 mampu membaca jarak dengan tingkat akurasi yang tinggi. Proses kalibrasi dilakukan dengan membandingkan nilai jarak yang terbaca oleh sistem mikrokontroler dengan jarak sebenarnya yang diukur secara manual menggunakan meteran/penggaris.

*(Silakan masukkan Tabel 4.2 Hasil Pengujian Sensor HC-SR04 di sini)*

Berdasarkan hasil pengujian pada Tabel 4.2, tingkat selisih (error) pembacaan sensor secara konsisten berada di bawah 1 cm untuk semua interval pengukuran. Dengan rata-rata akurasi yang mencapai 98,68%, dapat disimpulkan bahwa sensor ultrasonik berfungsi dengan sangat baik. Oleh karena itu, perangkat keras ini dinyatakan layak untuk digunakan sebagai alat ukur tingkat kepenuhan volume sampah.

**4.3.2 Pengujian Fungsional Website (Black Box)**
Pengujian *Black Box* bertujuan untuk memeriksa kesesuaian antara perintah yang diberikan pengguna pada antarmuka dengan respon yang dihasilkan oleh sistem.

*(Silakan masukkan Tabel 4.3 Pengujian Fitur Website dengan Metode Black Box di sini)*

**4.3.3 Pengujian Waktu Respons (Response Time)**
Pengujian ini bertujuan untuk mengukur kelancaran integrasi data, khususnya terkait durasi waktu yang dibutuhkan sejak data dikirimkan hingga ditampilkan di layar.

*(Silakan masukkan Tabel 4.4 Pengujian Waktu Respons Transmisi Sistem di sini)*

**4.4 Analisis Hasil dan Pembahasan**
Implementasi sistem informasi Smart Waste Management ini terbukti memberikan dampak signifikan. Melalui pemantauan dasbor real-time, pihak pengelola dapat beralih ke rute berbasis data (Data-Driven Routing). Petugas pengangkut kini hanya perlu mendatangi lokasi yang indikator grafiknya berstatus penuh (merah), sehingga secara teknis berhasil mengoptimalkan efisiensi waktu, menekan biaya bahan bakar, dan menghindari pemborosan sumber daya akibat inspeksi acak ke lokasi penampungan yang masih kosong. Sistem ini tidak hanya berfungsi sebagai alat pantau instan, tetapi juga bertindak sebagai media pengumpulan data jangka panjang untuk evaluasi kinerja instansi pemerintah.
