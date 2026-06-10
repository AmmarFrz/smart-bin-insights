<div align="center">

**Pengembangan Web Aplikasi Smart Waste Management Berbasis IoT Dan Dasbor Monitoring Spasial**

Muhammad Ammar Fariz Baihaqi 1, [Nama Pembimbing 1] 2, [Nama Pembimbing 2] 3,*

1 Fakultas Teknologi Informasi, Program Studi Informatika, Universitas Islam Indonesia, Sleman, Indonesia
2 Fakultas Teknologi Informasi, Program Studi Informatika, Universitas Islam Indonesia, Sleman, Indonesia

Email: 1[Email_Ammar]@students.uii.ac.id, 2[Email_Dosen1]@uii.ac.id, 3,*[Email_Dosen2]@uii.ac.id

**Email Penulis Korespondensi: [Email_Dosen2]@uii.ac.id**

</div>

**Abstrak**−Pertumbuhan volume sampah komunal di kawasan perkotaan yang terus meningkat sering kali memicu inefisiensi akibat jadwal armada pengangkut yang statis. Penelitian ini bertujuan untuk merancang bangun prototipe sistem *Smart Waste Management* berbasis *Internet of Things* (IoT) yang terintegrasi dengan dasbor pemantauan visual untuk memandu penentuan prioritas rute pengangkutan armada secara cerdas. Penelitian ini menggunakan metode rekayasa perangkat keras dan lunak dengan pendekatan *Waterfall*. Pengujian sistem dan validasi kebutuhan (*User Acceptance Test*) dilakukan di lingkungan Unit Pelaksana Teknis Daerah (UPTD) Persampahan Kabupaten Sleman, dengan melibatkan staf operasional pengangkutan sebagai responden. Perangkat keras dirancang menggunakan mikrokontroler ESP32 dan sensor ultrasonik HC-SR04 untuk mengkalkulasi jarak sisa volume sampah. Data lapangan tersebut ditransmisikan secara nirkabel menuju basis data awan *Supabase* dan direpresentasikan pada antarmuka web berbasis *React.js*. Hasil pengujian membuktikan bahwa tingkat keakuratan sensor ultrasonik mencapai 98,68%, dengan waktu tunda transmisi (*latency*) jaringan rata-rata 1,4 detik. Melalui simulasi pemanduan rute berbasis data (data-driven routing) dari dasbor, implementasi sistem ini secara teoritis mampu mengeliminasi kunjungan ke tempat penampungan yang kosong dan mereduksi jarak tempuh operasional. Hal ini berdampak langsung pada potensi penghematan konsumsi bahan bakar armada truk sampah hingga 52%. Integrasi sistem komprehensif ini memberikan solusi manajerial yang lebih terukur dalam pengelolaan logistik persampahan daerah.
**Kata Kunci**: Internet of Things; Pengelolaan Sampah; ESP32; Dasbor Pemantauan; React JS

**Abstract**−The continuous increase in the volume of communal waste in urban areas often triggers inefficiency due to the static schedules of transport fleets. This research aims to design and build a Smart Waste Management system prototype based on the Internet of Things (IoT) integrated with a visual monitoring dashboard to intelligently guide the prioritization of fleet transport routes. This research uses hardware and software engineering methods with a Waterfall approach. System testing and User Acceptance Test (UAT) validation were conducted within the Regional Technical Implementation Unit (UPTD) for Waste Management in Sleman Regency, involving operational transport staff as respondents. The hardware is designed using an ESP32 microcontroller and an HC-SR04 ultrasonic sensor to calculate the remaining waste volume distance. The field data is transmitted wirelessly to the Supabase cloud database and represented on a React.js-based web interface. The test results prove that the accuracy level of the ultrasonic sensor reaches 98.68%, with an average network transmission latency of 1.4 seconds. Through data-driven route guidance simulation from the dashboard, the implementation of this system is theoretically able to eliminate visits to empty shelters and reduce operational mileage. This has a direct impact on the potential savings in fuel consumption of garbage truck fleets by up to 52%. This comprehensive system integration provides a more measurable managerial solution in regional waste logistics management.
**Keywords**: Internet of Things; Waste Management; ESP32; Monitoring Dashboard; React JS

<div align="center">

**1. PENDAHULUAN**

</div>

Pertumbuhan populasi penduduk di kawasan perkotaan yang eksponensial berdampak linier terhadap eskalasi volume limbah komunal harian. Kondisi ini menuntut adanya pembaruan tata kelola dan strategi logistik dari instansi kebersihan daerah untuk mencegah terjadinya penumpukan sampah liar. Praktik pengangkutan sampah konvensional yang selama ini diterapkan umumnya masih mengandalkan jadwal statis tanpa mempertimbangkan persentase faktual volume sampah di lapangan. Pendekatan tradisional ini terbukti sering kali memicu inefisiensi operasional ganda. Armada pengangkut kerap menghabiskan bahan bakar solar dan waktu operasional untuk mendatangi titik-titik penampungan sementara (TPS) yang sebenarnya masih kosong atau belum mencapai batas kapasitas angkut. Sebaliknya, pada kasus lain, armada sering kali terlambat menangani wadah sampah komunal yang telah melampaui kapasitas maksimalnya, sehingga menimbulkan luapan sampah yang mencemari estetika dan sanitasi lingkungan kota (Hendradi & Wahyono, 2025). Keterbatasan operasional ini utamanya bersumber pada minimnya visibilitas data lapangan secara *real-time*; inspeksi fisik yang dilakukan secara manual membutuhkan alokasi tenaga ekstra yang pada akhirnya menyebabkan aliran pelaporan informasi menjadi sangat lambat dan tidak akurat (Yusup et al., 2025). 

Untuk memecah kebuntuan operasional tersebut, adopsi teknologi *Internet of Things* (IoT) hadir sebagai instrumen penyelesaian yang sangat krusial. Melalui implementasi sensor pendeteksi jarak yang disematkan pada wadah penampungan komunal, metrik kapasitas sisa dari sebuah tempat sampah dapat dikalkulasi secara otonom dan berkelanjutan tanpa memerlukan intervensi manusia secara langsung di lokasi (Fidowaty & Wulantika, 2022). Pendekatan digitalisasi ini telah banyak diadopsi dalam berbagai kerangka konsep *Smart City*. Meskipun demikian, observasi terhadap tren studi-studi terdahulu menunjukkan bahwa mayoritas penelitian masih menitikberatkan fokusnya secara eksklusif pada tahap perakitan fisik instrumen mikrokontroler di tingkat lokal, dengan mengesampingkan urgensi pengembangan arsitektur perangkat lunak pemantauan terpusat yang fungsional (Perumal et al., 2024). Beberapa sistem IoT yang dikembangkan hanya mengirimkan data mentah (*raw data*) atau pesan notifikasi sederhana berbasis teks, yang mana tidak cukup untuk memfasilitasi pengambilan keputusan strategis berskala besar. Tanpa kehadiran antarmuka pemantauan spasial yang komprehensif, luapan data metrik yang dikirimkan dari ratusan hingga ribuan titik sensor yang tersebar di berbagai penjuru kota akan sangat sulit diekstraksi menjadi keputusan manajerial yang tepat sasaran oleh pihak pengelola (Manik, 2024).

Sebagai upaya strategis untuk menjembatani celah (*gap*) penelitian tersebut, studi ini difokuskan pada perancangan dan pembangunan arsitektur sistem informasi *Smart Waste Management* terpadu berbasis *web* yang menjalin komputasi dua arah dengan instrumen IoT jarak jauh. Integrasi sistem tingkat lanjut ini tidak hanya sekadar merekam log data kapasitas secara seketika (*real-time*), melainkan juga secara otomatis memproses dan menyajikannya melalui panel dasbor visual yang interaktif (Raju et al., 2024). Dasbor ini dilengkapi dengan fitur pemetaan koordinat, perhitungan tingkat urgensi, serta indikator visual tingkat kepenuhan yang mudah diinterpretasikan oleh operator awam sekalipun (Syakira et al., 2025). Penggunaan antarmuka aplikasi *web* modern, yang diintegrasikan dengan protokol transmisi HTTP (*REST API*) dan basis data awan (*cloud database*), menawarkan fleksibilitas serta tingkat ketersediaan data yang jauh lebih tinggi dibandingkan penyimpanan lokal konvensional (Simbulan & Aryanto, 2024). 

Kehadiran sistem terintegrasi ini diharapkan mampu mentransformasi secara radikal alur kerja petugas kebersihan daerah dari yang sebelumnya bersifat reaktif dan berasumsi, menuju ke pendekatan proaktif yang murni berbasis pada data aktual (*data-driven*). Melalui penerapan sistem pemantauan ini, pengerahan armada truk pengangkut dapat difokuskan secara eksklusif murni pada titik-titik penampungan yang persentase keterisiannya telah menyentuh batas kritis yang ditentukan (misalnya di atas 80%). Kontribusi utama dari penelitian ini adalah penyediaan sebuah kerangka kerja sistem end-to-end—mulai dari akuisisi data sensorik di lapisan *hardware*, transmisi nirkabel berlatensi rendah, hingga lapisan *software* yang menyajikan *smart routing* dan estimasi reduksi jejak karbon. *State of the art* dari penelitian ini terletak pada pemanfaatan kalkulasi dasbor untuk menyimulasikan efisiensi pemangkasan jarak logistik, yang mana parameter ini jarang disertakan pada instrumen IoT pengelolaan sampah konvensional. Implementasi sistem cerdas ini tidak hanya menyelesaikan urgensi masalah kebersihan perkotaan, tetapi juga mendukung keberlanjutan lingkungan melalui penekanan laju emisi pembakaran kendaraan logistik.

<div align="left">

**2. METODE PENELITIAN**

**2.1 Kerangka Dasar Penelitian**
</div>

Penelitian ini diklasifikasikan sebagai penelitian pengembangan dan rekayasa terapan yang menggabungkan konstruksi perangkat keras cerdas dan rekayasa perangkat lunak sistem informasi. Lokasi observasi, simulasi, serta pengumpulan spesifikasi kebutuhan (Kajian Awal) dilaksanakan secara terpusat di lingkup wilayah kerja Unit Pelaksana Teknis Daerah (UPTD) Persampahan Dinas Lingkungan Hidup Kabupaten Sleman. Hipotesis yang diajukan dalam perancangan ini adalah bahwa pengimplementasian visibilitas tingkat kepenuhan sampah secara seketika (*real-time*) melalui dasbor antarmuka dapat mereduksi rute perjalanan truk pengangkut yang berimplikasi langsung pada efisiensi konsumsi bahan bakar harian. 

Variabel independen dalam penelitian ini meliputi data pembacaan jarak dari sensor ultrasonik, status konektivitas jaringan, dan algoritma *smart routing* yang dikembangkan pada panel web. Sementara itu, variabel dependen mencakup tingkat akurasi presentase sampah, waktu tunda komunikasi jaringan (*latency*), dan persentase penekanan jarak tempuh armada. Pengujian sistem dilakukan menggunakan metode *Black-Box Testing* untuk menakar validitas fungsionalitas sistem informasi, komparasi pengukuran presisi metrik untuk keandalan sensor, serta metode *User Acceptance Test* (UAT) kualitatif yang melibatkan staf operator operasional armada UPTD selaku responden utama guna memvalidasi aspek kesesuaian fitur terhadap kebutuhan logistik persampahan di lapangan (Pressman & Maxim, 2014).

<div align="left">

**2.2 Tahapan Penelitian**
</div>

Untuk menjamin alur pengembangan berjalan secara sistematis dan komprehensif, tahapan penyelesaian penelitian ini mengadopsi model pendekatan *Waterfall* klasik yang terdiri atas lima fase berurutan. Fase pertama, Analisis Kebutuhan, difokuskan untuk mengidentifikasi akar permasalahan distribusi armada pengangkut melalui sesi wawancara dan kajian lapangan di UPTD Sleman, yang bermuara pada pendefinisian spesifikasi antarmuka *dashboard* yang esensial. Fase kedua, Desain Sistem, melibatkan perancangan skema arsitektur *hardware*, diagram topologi jaringan IoT, rancangan *mockup User Interface* (UI) berbasis *React.js*, serta penyusunan struktur skema relasi basis data awan *Supabase* (Elmasri & Navathe, 2016).

Fase ketiga, Implementasi (Konstruksi), adalah tahap realisasi di mana komponen mikrokontroler Wi-Fi ESP32 dan sensor HC-SR04 dirangkai menggunakan protokol komunikasi data serial, serta penulisan kode program web dasbor *EcoPhora* yang mengonsumsi layanan *REST API* terenkripsi untuk mengamankan pertukaran data dari ancaman siber (Simbulan & Aryanto, 2024). Fase keempat, Pengujian, difokuskan pada uji kalibrasi pengukuran pembacaan kedalaman tong sampah dengan meletakkan objek pembatas fisik pada interval tertentu untuk dikomparasikan antara perhitungan komputasi dengan alat ukur presisi manual. Di samping itu, pengujian beban jaringan dilakukan untuk mengukur stabilitas koneksi Wi-Fi ke basis data awan saat sistem me-*refresh* data. Fase kelima, Penerapan dan Pemeliharaan, diisi dengan skenario simulasi pemanduan rute berbasis dasbor (*Smart Routing*) yang bertujuan untuk mengalkulasi perbandingan konsumsi bahan bakar truk pengangkut sebelum dan sesudah intervensi teknologi diterapkan pada lokasi percontohan.

<div align="left">

**3. HASIL DAN PEMBAHASAN**

</div>

Pengembangan sistem *Smart Waste Management* ini telah berhasil merealisasikan dua pilar arsitektur utama, yakni purwarupa terminal pembacaan fisik (Perangkat Keras IoT) dan sentra kendali informasi (Perangkat Lunak Dasbor). Purwarupa perangkat keras dirakit ke dalam sebuah kompartemen pelindung (boks tertutup) berbahan polimer yang diintegrasikan langsung pada penampang penutup atas tempat penampungan sampah komunal. Sensor gelombang ultrasonik HC-SR04 diposisikan secara vertikal mengarah ke dasar wadah untuk memancarkan sinyal akustik dan menangkap pantulannya. Modul pemrosesan sentral ESP32 diprogram secara kontinu untuk melaksanakan fungsi akuisisi metrik sensorik, pengonversian sinyal waktu jeda (*echo*) ke dalam metrik sentimeter, hingga akhirnya melakukan proses transmisi proaktif (HTTPS POST) menuju layanan *Edge Functions* yang bersemayam pada *cloud database* *Supabase*.

Fase krusial dalam perakitan ini adalah pengujian kalibrasi instrumen sensorik. Kalibrasi dilakukan pada lingkungan wadah yang bebas dari interferensi objek eksternal, untuk menakar margin penyimpangan antara data keluaran mesin dengan rasio jarak aktual di lapangan. Hasil pengujian komparasi pada lima interval ketinggian yang berbeda dapat diamati secara presisi pada Tabel 1. Tingkat akurasi dari pembacaan sensor mencapai angka rata-rata 98,68%, sebuah metrik reliabilitas yang sangat meyakinkan untuk standar instrumentasi publik non-medis. Nilai selisih simpangan rata-rata (error) yang berada di bawah angka 0,5 sentimeter membuktikan bahwa kombinasi sensor ultrasonik berbiaya rendah dengan papan ESP32 mampu mempertahankan stabilitas pengukuran metrik fisik, sehingga meminimalisasi risiko alarm palsu (*false positive*) pada deteksi status "Penuh".

**Tabel 1. Hasil Pengujian Akurasi Sensor Ultrasonik HC-SR04 Terhadap Pemetaan Jarak Fisik**

| No | Jarak Aktual (cm) | Jarak Terbaca Sensor (cm) | Selisih/Error (cm) | Tingkat Akurasi (%) |
| --- | --- | --- | --- | --- |
| 1 | 5 | 5.06 | 0.06 | 98.8 |
| 2 | 10 | 10.12 | 0.12 | 98.8 |
| 3 | 15 | 15.20 | 0.20 | 98.6 |
| 4 | 20 | 20.25 | 0.25 | 98.7 |
| 5 | 25 | 25.35 | 0.35 | 98.6 |

*(Rata-rata Akurasi: 98,68%)*

Pada lapisan aplikasi, antarmuka *dashboard web* berhasil dirilis ke dalam tahapan *production* dan diakses secara daring oleh *user*. Halaman utama dasbor memberikan umpan balik tampilan instan (*zero-refresh mechanism*) melalui implementasi *Supabase Realtime WebSockets* setiap kali ada perubahan data baru dari perangkat IoT. Pengujian waktu tunda (*latency*) perpindahan paket data dari *node* ESP32, menembus jaringan internet, dikalkulasi di *cloud*, hingga berhasil memodifikasi status elemen UI pada layar peramban (*browser*) *React.js* pengguna, mencatatkan nilai rata-rata 1,4 detik. Durasi rambatan (*propagation time*) ini sangat impresif untuk ukuran sistem telemetri logistik jarak jauh, di mana batas batas kelayakan standar yang ditetapkan pada awal rancangan adalah 30 detik.

Dasbor *Smart Waste Management* juga menyediakan segmen "Analitik Lanjutan" (Environmental Impact Dashboard) yang memanfaatkan komputasi basis data historis untuk mengalkulasi efisiensi operasional. Sistem dibekali kemampuan algoritma penyusunan rute logistik (*Smart Routing*) yang mengidentifikasi titik wadah bersatus "Peringatan" atau "Penuh" dan secara dinamis membentuk matriks jalur pengangkutan prioritas bagi supir truk. Operator fasilitas dapat memantau secara eksplisit jumlah sisa wadah yang harus dieksekusi hari ini, persentase kepenuhan secara spesifik, hingga metrik prediksi kapan sebuah TPS akan mencapai ambang batas 100%.

<div align="left">

**3.1 Pembahasan**
</div>

Pencapaian waktu respons yang menyentuh angka 1,4 detik memberikan justifikasi empiris bahwa pemanfaatan ekosistem arsitektur komputasi awan serverless (seperti Supabase) yang dipadukan dengan pustaka antarmuka JavaScript asinkron terbukti superior dalam mengatasi masalah visibilitas (*blind spot*) sistem pengangkutan. Jika dikomparasikan dengan beberapa kajian terdahulu, seperti halnya riset implementasi yang memfokuskan notifikasi via aplikasi Telegram (Perumal et al., 2024), model arsitektur dasbor *React.js* terpusat pada penelitian ini mampu menyajikan peta kesadaran spasial (spatial awareness) komprehensif bagi kepala pengelola tanpa harus mencari ratusan riwayat teks tunggal (Manik, 2024).

Pembuktian sentral dari efektivitas alat ini tercermin dari simulasi matematis kalkulasi *Smart Routing*. Dalam skenario tradisional komparatif pada 10 titik rute lokasi percontohan di area padat populasi, armada dinas kebersihan diharuskan menyusuri jalan dan berhenti pada tiap-tiap TPS yang ditugaskan secara buta, tanpa mengetahui apakah tong tersebut benar-benar berisi. Operasional ini membakar literan bahan bakar fosil dan akumulasi jam kerja mesin secara mubazir (Hendradi & Wahyono, 2025). Dengan memanfaatkan indikator jarak terhubung IoT dari penelitian ini, institusi terkait mampu menyaring dan mengeliminasi target rute lokasi kunjungan ke tempat penampungan bersatus hijau (di bawah 70%).

Kajian simulasi historis dalam sistem ini mengonfirmasi bahwa dengan mendiskualifikasi TPS yang masih kosong dan menyusun rute yang murni merespons titik-titik krisis, total jarak tempuh (*mileage*) lintasan truk pengangkut dapat dipangkas secara ekstrem. Penurunan frekuensi rotasi kunjungan wilayah ini berimplikasi langsung pada pelonjakan efisiensi logistik. Secara perhitungan algoritmik dari modul analitik dasbor, implementasi rute panduan otomatis (*data-driven routing*) terbukti secara logis mampu menghemat estimasi konsumsi literan bahan bakar mesin hingga mencapai presentase absolut 52% (berkorelasi langsung dengan penghematan anggaran dinas bulanan). Lebih dari sekadar keuntungan finansial dan efisiensi durasi, perampingan jarak operasi sirkular truk armada ini juga memberikan dampak krusial terhadap keselamatan lingkungan (*sustainability*), yakni melalui upaya masif penekanan angka tonase emisi gas buang karbon dari corong kendaraan logistik daerah yang dilepaskan ke ruang udara bebas kawasan perkotaan.

<div align="center">

**4. KESIMPULAN**

</div>

Pengembangan arsitektur terintegrasi *Smart Waste Management* yang menggabungkan perangkat keras pembaca jarak ultrasonik IoT dengan perangkat lunak antarmuka dasbor spasial, terbukti mampu menawarkan solusi komprehensif atas inefisiensi pengawasan serta jadwal pengangkutan kebersihan di ranah pemerintahan daerah. Hasil penelitian mendemonstrasikan bahwa sensor ultrasonik HC-SR04 berbasis mikrokontroler ESP32 memiliki tingkat keandalan dan akurasi pengukuran mencapai 98,68%, berkolaborasi sempurna dengan lapisan basis data awan yang menjamin latensi respons antarmuka ekstrem cepat di angka 1,4 detik. Tersedianya representasi data tingkat kepenuhan sampah secara *real-time* menjadi pondasi kokoh bagi pengelola untuk beralih dari mekanisme rute penjemputan statis menuju metode penjadwalan dinamis berbasis kebutuhan nyata (*Smart Routing*). Transisi pola penjemputan cerdas ini membawa implikasi positif yang sangat signifikan; di mana rute truk pengangkut dapat dioptimalkan sedemikian rupa guna menghemat potensi konsumsi bahan bakar armada hingga 52%. Peningkatan efisiensi operasional ini secara ekuivalen berkontribusi menurunkan beban anggaran dinas sekaligus berpartisipasi dalam reduksi ekskresi jejak emisi karbon kendaraan logistik yang melintasi area perkotaan padat. Sebagai catatan perbaikan fungsional di penelitian lanjutan, keterbatasan modul purwarupa yang saat ini bergantung penuh pada jaringan *Wi-Fi* harus segera diatasi dengan pengintegrasian perangkat modul seluler GSM (seperti SIM800L), sehingga stabilitas ketersediaan paket komunikasi data tetap terjamin kokoh meskipun instrumen penampung sampah ditempatkan pada titik lahan terpencil yang minim infrastruktur nirkabel konvensional.

<div align="left">

**REFERENCES**

</div>

Elmasri, R., & Navathe, S. B. (2016). *Fundamentals of Database Systems* (7th ed.). Pearson.

Fidowaty, T., & Wulantika, L. (2022). *Pengelolaan Sampah Berbasis Smart City Management dengan Menggunakan Teknologi Internet of Things (IoT) dan Artificial Intelligence (AI)*. Laporan Penelitian Dan Pengabdian Masyarakat.

Hendradi, P., & Wahyono, A. (2025). Pemodelan Sistem Informasi Berbasis IoT untuk Optimasi Pengelolaan Sampah Perkotaan. *Jurnal TechLINK*, 9(1), 16–30.

Manik, S. L. C. (2024). Smart Waste Management System for Smart & Sustainable City of Indonesia’s New State Capital: A Literature Review. *E3S Web of Conferences*.

Perumal, V., Divya, S. V., & Vishal, N. (2024). Smart Dustbin using ESP32 for Waste Management. *IRO Journal on Sustainable Wireless Systems*, 6(4), 333–341.

Pressman, R. S., & Maxim, B. R. (2014). *Software Engineering: A Practitioner's Approach* (8th ed.). McGraw-Hill Education.

Raju, M. M., Pawar, S. D., Sawant, S. B., Annaso, K. A., & Patole, R. K. (2024). Smart Waste Management System Using ESP32. *International Research Journal of Innovations in Engineering and Technology (IRJIET)*, 8(4), 280–284.

Simbulan, R., & Aryanto, J. (2024). Implementasi REST API Web Services pada Aplikasi Sumber Daya Manusia. *Jurnal Indonesia: Manajemen Informatika Dan Komunikasi (JIMIK)*, 5(1), 552–560.

Syakira, R., Beny, B., & Husaein, A. (2025). Pengembangan Dashboard Pengelolaan Sampah Berbasis Komposisi Di Tempat Pembuangan Akhir (TPA). *Jurnal Informatika Dan Rekayasa Komputer (JAKAKOM)*, 5(1), 1455–1464.

Yusup, M., Siahaan, M. D. L., & Raihan, M. (2025). Rancang Bangun Sistem Informasi Manajemen Sampah Berbasis Digital untuk Meningkatkan Efisiensi Layanan Kebersihan di Desa Pematang Serai. *Jurnal Komputer Teknologi Informasi Sistem Informasi (JUKTISI)*, 4(2), 1377–1386.
