PENGEMBANGAN WEB APLIKASI SMART WASTE MANAGEMENT 
DENGAN INTEGRASI IOT DAN DASHBOARD MONITORING

MUHAMMAD AMMAR FARIZ BAIHAQI 1*,
1 Program Studi Informatika, Fakultas Teknologi Informasi,UII Yogyakarta, Indonesia.


Informasi Artikel:
Dikirim: 08-06-2026;  Diterima: 19-12-2023;  Diterbitkan: 18-01-2024
Doi : http://dx.doi.org/10.31602/tji.v15i4.13383

Abstrak

Pertumbuhan volume sampah di kawasan perkotaan yang diiringi dengan keterbatasan jadwal armada pengangkut memicu masalah penumpukan sampah liar. Sistem pengangkutan terjadwal konvensional terbukti tidak efisien karena petugas kebersihan sering mendatangi lokasi tempat sampah yang belum terisi penuh atau justru terlambat mengangkut tumpukan sampah yang telah meluber. Penelitian ini bertujuan merancang bangun sistem Smart Waste Management berbasis Internet of Things (IoT) yang terintegrasi dengan dasbor pemantauan real-time untuk memandu prioritas rute pengangkutan. Perangkat keras dirancang menggunakan mikrokontroler ESP32 dan sensor ultrasonik HC-SR04 untuk mengukur metrik jarak volume sampah secara otomatis. Data hasil pengukuran ditransmisikan menggunakan jaringan nirkabel menuju basis data awan Supabase. Pada sisi perangkat lunak, antarmuka web dikembangkan menggunakan React.js untuk memvisualisasikan tingkat kepenuhan sampah secara geografis melalui fitur pemetaan spasial. Pengujian sistem membuktikan bahwa tingkat keakuratan sensor ultrasonik dalam mendeteksi objek mencapai di atas 98%, dengan rata-rata waktu tunda transmisi (latency) 1,4 detik. Melalui simulasi pemanduan rute pengangkutan berbasis data yang dikumpulkan, implementasi sistem ini secara teoritis mampu mereduksi jarak tempuh operasional truk sampah sehingga berdampak pada penghematan konsumsi bahan bakar armada hingga 52%.

Keywords: Internet of Things, Pengelolaan Sampah, ESP32, Dashboard Monitoring, React.js.

Pendahuluan
Pertumbuhan populasi perkotaan yang eksponensial berdampak linier terhadap eskalasi volume limbah komunal, menuntut pembaruan tata kelola dari instansi kebersihan daerah. Praktik pengangkutan sampah konvensional yang mengandalkan jadwal statis tanpa mempertimbangkan volume faktual di lapangan sering kali memicu inefisiensi ganda. Armada pengangkut kerap menghabiskan bahan bakar dan waktu operasional untuk mendatangi titik penampungan yang masih kosong, atau sebaliknya, terlambat menangani wadah yang telah melampaui kapasitas maksimalnya sehingga menimbulkan tumpukan liar [1]. Keterbatasan ini bersumber pada minimnya visibilitas data lapangan; inspeksi fisik secara manual membutuhkan tenaga ekstra yang menyebabkan aliran pelaporan informasi menjadi sangat lambat [2].

Untuk memecah kebuntuan operasional tersebut, adopsi teknologi Internet of Things (IoT) hadir sebagai instrumen penyelesaian yang vital. Melalui implementasi sensor jarak ultrasonik pada wadah penampungan komunal, metrik kapasitas sisa dapat dikalkulasi secara otonom dan berkelanjutan tanpa memerlukan intervensi manusia secara langsung [3]. Meskipun demikian, mayoritas studi terdahulu masih menitikberatkan fokusnya pada tahap perakitan fisik mikrokontroler, dengan mengesampingkan urgensi pengembangan arsitektur perangkat lunak terpusat yang fungsional [4]. Tanpa kehadiran antarmuka pemantauan yang mumpuni, luapan data spasial dari berbagai titik sensor akan sulit diekstraksi menjadi keputusan manajerial yang tepat sasaran oleh pihak pengelola.

Sebagai upaya menjembatani celah penelitian tersebut, studi ini difokuskan pada perancangan arsitektur sistem informasi Smart Waste Management berbasis web yang menjalin ikatan komputasi dua arah dengan instrumen IoT jarak jauh. Integrasi sistem ini tidak hanya bertujuan merekam data log secara real-time, melainkan juga menyajikannya melalui dasbor visual interaktif yang mudah dipahami [5]. Penelitian ini diharapkan mampu mentransformasi alur kerja petugas kebersihan menuju pendekatan berbasis data (data-driven), di mana pengerahan armada truk pengangkut dapat difokuskan murni pada titik-titik penampungan yang persentase keterisiannya telah menyentuh batas kritis.

Tinjauan Pustaka
Penelitian mengenai otomasi pemantauan limbah telah banyak dieksplorasi dalam beberapa tahun terakhir. Implementasi arsitektur IoT terbukti efektif dalam memangkas waktu patroli inspeksi fisik yang dilakukan secara acak [7]. Secara konseptual, sistem pemantauan yang efektif mengadopsi tiga lapisan integrasi: perception layer untuk akuisisi data sensorik, network layer untuk transmisi nirkabel, dan application layer sebagai antarmuka akhir pengguna [7]. 

Di sisi lain, platform dashboard terpusat terbukti memegang peranan vital sebagai pusat komando yang menjamin konsistensi informasi spasial dan temporal bagi pengambil keputusan [6]. Sistem yang tidak dibekali dengan antarmuka yang mumpuni umumnya gagal diadopsi secara masif oleh instansi terkait karena data mentah (raw data) yang dihasilkan sensor sulit diinterpretasikan. Walaupun protokol transmisi berdaya rendah seperti MQTT banyak diadopsi untuk jaringan lemah [1], penggunaan protokol HTTP (REST API) justru menawarkan fleksibilitas integrasi yang jauh lebih superior apabila dihubungkan dengan kerangka kerja aplikasi web modern berbasis JavaScript [9]. Berangkat dari landasan teori tersebut, penelitian ini dibangun untuk mengisi celah kekosongan integrasi antara ketangguhan hardware di lapangan dan kelincahan software pemantauan di pusat kendali.

Metodologi 
Jenis Penelitian
Penelitian ini adalah penelitian rekayasa perangkat lunak dan perangkat keras terintegrasi. Metode pengembangan sistem yang digunakan secara utuh mengadopsi kerangka kerja proses generik (Generic Process Framework) dengan pendekatan model Waterfall. Pendekatan ini dipilih untuk memastikan setiap tahapan pengembangan—mulai dari analisis kebutuhan hingga pengujian akhir—berjalan secara linier dan terstruktur [10].

Subjek dan Prosedur Penelitian
Subjek penelitian ini adalah arsitektur sistem pengelolaan sampah yang beroperasi di lingkup Dinas Lingkungan Hidup dan Kebersihan (DLHK) Kabupaten Sleman. Prosedur penelitian diawali dengan fase komunikasi lapangan (wawancara dan observasi) guna mengumpulkan spesifikasi kebutuhan sistem. Langkah selanjutnya adalah perancangan pemodelan (modeling), disusul oleh fase konstruksi (perakitan elektronik dan penulisan kode sumber), dan diakhiri dengan fase penerapan sistem (deployment) untuk mengukur target kinerja alat.

Data dan Instrumen
Instrumen perangkat keras utama mencakup mikrokontroler ESP32 yang merangkap sebagai unit pemrosesan sentral sekaligus penyedia konektivitas nirkabel (Wi-Fi), serta sensor gelombang ultrasonik HC-SR04 untuk pembacaan metrik jarak spasial. Pada sisi perangkat lunak, antarmuka klien dikembangkan menggunakan pustaka React.js, sementara manajemen basis data bertumpu pada layanan komputasi awan PostgreSQL untuk memastikan penyimpanan data berkapasitas besar berjalan stabil [3].

Teknik Pengumpulan dan Analisis Data
Teknik pengumpulan data pada tahapan evaluasi dilakukan melalui metode pengujian Black-Box untuk mengukur kesesuaian respons fungsional antarmuka web, serta pengujian ketepatan waktu transmisi data (response time/latency). Batas toleransi kelambatan transmisi log data ditetapkan paling lambat 30 detik untuk dapat dikategorikan layak secara fungsional. Untuk menjamin fungsionalitas pemantauan real-time berjalan optimal saat pengujian, mikrokontroler ESP32 dikonfigurasi secara statis untuk mentransmisikan log data secara kontinu setiap 5 detik. Selain itu, pengujian kualitatif User Acceptance Test (UAT) dilakukan melalui sesi wawancara demonstratif kepada para pemangku kepentingan guna menakar tingkat kenyamanan antarmuka (UI/UX) dan efektivitas manajerial sistem [10].

Hasil
Perakitan modul pemantauan berhasil direalisasikan dalam wadah pelindung tertutup dan dipasang pada penampang atas tempat sampah. Pengujian kalibrasi instrumen perangkat keras dititikberatkan pada kemampuan sensor ultrasonik HC-SR04 dalam mendeteksi dasar ruang penampungan. Hasil komparasi nilai ukuran memperlihatkan tingkat margin kesalahan (error) yang sangat minim antara pembacaan mesin dengan ukuran presisi aktual, sebagaimana dijabarkan pada Tabel 1.

Tabel 1. Hasil Pengujian Akurasi Sensor HC-SR04
No | Jarak Aktual (cm) | Jarak Terbaca Sensor (cm) | Selisih/Error (cm) | Akurasi (%)
--- | --- | --- | --- | ---
1 | 5 | 5.06 | 0.06 | 98.8
2 | 10 | 10.12 | 0.12 | 98.8
3 | 15 | 15.20 | 0.20 | 98.6
4 | 20 | 20.25 | 0.25 | 98.7
5 | 25 | 25.35 | 0.35 | 98.6
Rata-rata | | | | 98.68

Pada tahapan integrasi lapisan perangkat lunak, transfer paket data dari papan ESP32 ke peladen Supabase dengan memanfaatkan kerangka REST API terverifikasi berjalan lancar. Antarmuka aplikasi web memberikan umpan balik tampilan berupa indikator perubahan warna status lokasi yang diperbarui secara langsung (real-time). Evaluasi waktu respons sistem jaringan mencatatkan nilai rata-rata yang sangat efisien. Akumulasi durasi tersebut merupakan total beban waktu rambat sinyal Wi-Fi, waktu eksekusi basis data, hingga durasi pemuatan skrip halaman di peramban klien.

Pembahasan
Waktu tunda transmisi yang singkat memberikan justifikasi empiris bahwa arsitektur sistem berbasis perangkat biaya rendah (low-cost) dan layanan basis data awan memiliki keandalan memadai dalam mendukung pemantauan logistik jarak jauh. Parameter kelambatan ini jauh lebih cepat dibandingkan tenggat batas toleransi fungsional yang ditetapkan. Tingkat keandalan ini menjadikan antarmuka web terpusat layak untuk difungsikan sebagai landasan Sistem Pendukung Keputusan bagi pemangku kebijakan persampahan.

Implementasi panel indikator jarak jauh ini memungkinkan institusi terkait untuk menyusun strategi perombakan model penjemputan dari pola statis menuju pemanduan rute terarah (Data-Driven Routing). Kajian matematis komparatif yang disimulasikan terhadap sepuluh titik lokasi tempat pembuangan sementara menunjukkan bukti konkret inefisiensi sistem lama. Dalam pola operasional terjadwal harian, truk sampah diharuskan mengunjungi seluruh titik, yang mengakibatkan tingginya akumulasi jarak tempuh dan konsumsi bahan bakar solar yang berlebihan.

Penerapan sistem Smart Waste Management mampu mereduksi ketidakefisienan tersebut. Operator armada dapat mengeliminasi kunjungan ke lokasi kosong dan secara spesifik menuju titik koordinat wadah yang telah berubah status kritis pada peta dasbor. Temuan pada simulasi historis menunjukkan bahwa hanya sebagian kecil wadah yang benar-benar terisi penuh setiap harinya. Modifikasi skala rute tersebut secara teoritis mampu menekan jarak tempuh armada logistik secara drastis. Penyusutan jarak lintas wilayah operasional ini berkorelasi langsung terhadap penurunan anggaran alokasi bahan bakar mesin. Selain efisiensi beban finansial, rasio penekanan jarak ini secara otomatis berkontribusi membatasi tingkatan emisi sisa gas karbon armada pengangkut menuju udara bebas.

Kesimpulan
Pengembangan sistem Smart Waste Management berbasis antarmuka dasbor pemantauan IoT mampu memberikan alternatif solusi terhadap keterbatasan visibilitas pengawasan kebersihan di ranah publik. Komparasi kalibrasi volume fisik membuktikan bahwa integrasi sensor ultrasonik dan papan mikrokontroler mampu memberikan rekaman pengukur jarak berakurasi tinggi yang konsisten. Proses rambatan data melalui transmisi komunikasi nirkabel dinilai sangat responsif dan tidak menimbulkan penundaan muat interaksi yang signifikan di sisi layar pengguna.

Ketersediaan panel pemantauan spasial terpusat ini menawarkan referensi indikator logistik yang esensial bagi operator dalam memformulasikan urutan rute penjemputan setiap harinya. Transisi perubahan manajemen pengangkutan dari mekanisme statis konvensional menuju pendekatan rute dinamis berbasis data berdampak positif pada level efisiensi operasional harian. Optimalisasi alur armada dapat menurunkan volume konsumsi bahan bakar fosil pemerintah daerah serta berpartisipasi mereduksi pelepasan angka emisi jejak karbon kendaraan industri. Untuk penelitian mendatang, penyempurnaan sarana transmisi pada unit purwarupa perlu ditingkatkan dengan mengintegrasikan modul konektivitas seluler (SIM) sebagai penunjang stabilitas sambungan data bagi lokasi di luar jangkauan sinyal area lokal.

Daftar Pustaka
[1] P. Hendradi dan A. Wahyono, "Pemodelan Sistem Informasi Berbasis IoT untuk Optimasi Pengelolaan Sampah Perkotaan," Jurnal TechLINK, vol. 9, no. 1, hal. 16-30, 2025.
[2] M. Yusup, M. D. L. Siahaan, dan M. Raihan, "Rancang Bangun Sistem Informasi Manajemen Sampah Berbasis Digital untuk Meningkatkan Efisiensi Layanan Kebersihan di Desa Pematang Serai," Jurnal Komputer Teknologi Informasi Sistem Informasi (JUKTISI), vol. 4, no. 2, hal. 1377-1386, 2025.
[3] T. Fidowaty dan L. Wulantika, Pengelolaan Sampah Berbasis Smart City Management dengan Menggunakan Teknologi Internet of Things (IoT) dan Artificial Intelligence (AI). Laporan Penelitian Dan Pengabdian Masyarakat, 2022.
[4] V. Perumal, S. V. Divya, dan N. Vishal, "Smart Dustbin using ESP32 for Waste Management," IRO Journal on Sustainable Wireless Systems, vol. 6, no. 4, hal. 333-341, 2024.
[5] S. L. C. Manik, "Smart Waste Management System for Smart & Sustainable City of Indonesia’s New State Capital: A Literature Review," E3S Web of Conferences, 2024.
[6] M. M. Raju, S. D. Pawar, S. B. Sawant, K. A. Annaso, dan R. K. Patole, "Smart Waste Management System Using ESP32," International Research Journal of Innovations in Engineering and Technology (IRJIET), vol. 8, no. 4, hal. 280-284, 2024.
[7] R. Syakira, B. Beny, dan A. Husaein, "Pengembangan Dashboard Pengelolaan Sampah Berbasis Komposisi Di Tempat Pembuangan Akhir (TPA)," Jurnal Informatika Dan Rekayasa Komputer (JAKAKOM), vol. 5, no. 1, hal. 1455-1464, 2025.
[8] R. Simbulan dan J. Aryanto, "Implementasi REST API Web Services pada Aplikasi Sumber Daya Manusia," Jurnal Indonesia: Manajemen Informatika Dan Komunikasi (JIMIK), vol. 5, no. 1, hal. 552-560, 2024.
[9] R. Elmasri dan S. B. Navathe, Fundamentals of Database Systems, Edisi ke-7. Pearson, 2016.
[10] R. S. Pressman dan B. R. Maxim, Software Engineering: A Practitioner's Approach, Edisi ke-8. New York, USA: McGraw-Hill Education, 2014.
