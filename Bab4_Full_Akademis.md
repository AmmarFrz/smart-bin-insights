# BAB IV: HASIL DAN PEMBAHASAN

## 4.1 Perancangan Sistem Smart Waste Management
### 4.1.1 Kriteria Desain
Sesuai dengan tujuan tugas akhir ini adalah membuat sistem *Smart Waste Management* berbasis *Internet of Things* (IoT) yang akan digunakan oleh Dinas Lingkungan Hidup (DLHK) maupun UPTD Pelayanan Persampahan, sehingga dalam perancangannya ditetapkan kriteria yang menjadi dasar rancang bangun tempat sampah pintar (*Smart Bin*). Kriteria desain didapat dari kegiatan observasi langsung di lapangan yang dikembangkan berdasarkan pertimbangan aspek efisiensi operasional pengangkutan dan kemudahan pengguna. Adapun kriteria yang menjadi tujuan akhir perancangan adalah sebagai berikut.
1. Perangkat keras bersifat *plug-and-play*, sehingga mudah dipasang pada berbagai jenis tempat sampah standar instansi tanpa merombak struktur utama tong sampah.
2. Perangkat memiliki daya tahan terhadap kondisi cuaca luar ruangan dan kelembapan di dalam tempat sampah.
3. Sistem mampu membaca tingkat volume sampah dan mengirimkan datanya secara *real-time* ke pusat kendali guna meminimalkan kegiatan inspeksi manual yang memboroskan bahan bakar armada truk.

Berdasarkan kriteria tersebut, sistem yang direncanakan berjenis pemantauan jarak jauh berbasis mikrokontroler ESP32. Mikrokontroler ESP32 dipilih karena memiliki tingkat konektivitas yang sangat baik dengan adanya modul Wi-Fi bawaan untuk integrasi *Internet of Things* (IoT). Selanjutnya, jenis sensor ultrasonik HC-SR04 dipilih untuk mendeteksi tinggi tumpukan sampah tanpa harus bersentuhan langsung dengan objek fisik limbah, sehingga meminimalisir risiko korosi atau kerusakan akibat cairan sampah. Adapun prototipe alat dilengkapi dengan fitur sebagai berikut.
1. Sistem penginderaan jarak jauh menggunakan pantulan gelombang suara untuk menghitung sisa ruang kosong pada wadah.
2. Indikator visual berupa lampu LED di bagian luar tong sampah untuk memberikan informasi kapasitas (hijau, kuning, merah) kepada masyarakat di lokasi.
3. Konektivitas nirkabel yang terhubung langsung dengan basis data awan (*cloud database*) secara berkesinambungan.

### 4.1.2 Desain Perangkat Keras
Desain purwarupa perangkat keras dibuat berdasarkan kesesuaian komponen elektronika serta dilakukan desain tata letak secara presisi guna memastikan aktivitas pembuangan sampah oleh masyarakat tidak terhambat. Secara struktural, seluruh modul elektronik disatukan pada kompartemen khusus di balik penutup tempat sampah. 

Sensor ultrasonik HC-SR04 diposisikan menghadap vertikal (*top-down*) ke dasar wadah agar pancaran gelombangnya mampu memindai ketinggian volume sampah secara akurat tanpa terhalang lekukan dinding tong. Data jarak yang ditangkap kemudian dieksekusi oleh mikrokontroler ESP32 guna menghasilkan persentase kepenuhan sebelum akhirnya ditransmisikan menuju server melalui gelombang Wi-Fi. Untuk menunjang interaksi langsung di lapangan, bodi luar penutup turut disematkan deretan lampu LED sebagai indikator kapasitas visual. Keseluruhan sirkuit vital tersebut dirancang untuk diamankan dalam sebuah *enclosure* kedap air.

*(Instruksi: Masukkan Gambar 4.x Desain Perangkat Keras di sini)*

## 4.2 Manufaktur Sistem
### 4.2.1 Perangkaian Elektronika
Integrasi awal bermula dari perangkaian fisik tiap-tiap modul kelistrikan yang menjadi fondasi sistem. Seluruh kaki komponen saling dihubungkan menggunakan teknik penyolderan untuk merekatkan konduktor pada purwarupa, demi menekan probabilitas terjadinya kegagalan arus (*short circuit*) ketika alat dioperasikan di lapangan dalam jangka panjang. Sistem terdiri atas berbagai komponen elektronika dengan spesifikasi tiap komponennya terlihat pada Tabel 4.1.

**Tabel 4.1 Spesifikasi Komponen Elektronika Perangkat**
| No | Nama Komponen | Spesifikasi Teknis |
| -- | -- | -- |
| 1 | Mikrokontroler ESP32 | Mikrokontroler 32-bit (Tegangan 3.3V) dengan Modul Wi-Fi bawaan |
| 2 | Sensor Ultrasonik HC-SR04 | Tegangan input 5V, Rentang ukur 2 cm – 400 cm, Resolusi presisi 0.3 cm |
| 3 | Modul LCD 16x2 I2C | Layar monokrom 16x2 karakter, protokol komunikasi I2C (hanya 4 pin) |
| 4 | Resistor | Hambatan bervariasi (sebagai penahan arus dan *voltage divider* LED) |
| 5 | Dioda Pemancar Cahaya (LED) | Indikator visual 3 warna (Merah, Kuning, Hijau) |
| 6 | *Breadboard* & Kabel *Jumper* | Papan purwarupa dan jalur sirkuit tembaga |

### 4.2.2 Perangkaian Mekanika
Kegiatan manufaktur berupa perangkaian mekanika dimulai dengan membuat wadah isolator (*enclosure* / *body cover*) sebagai tameng pelindung papan sirkuit terhadap anomali cuaca. Opsi material jatuh pada polimer plastik jenis ABS (Akrilonitril-Butadiena-Stiren). Sifat kaku dari plastik ABS sangat krusial dalam meredam kejut mekanis, terutama ketika petugas kebersihan membanting atau menutup tong sampah dengan kasar. 

Resistansi material ini terhadap fluktuasi kelembapan juga berperan besar untuk mengantisipasi potensi korsleting yang dipicu oleh uap korosif dari pembusukan limbah organik. Pada bagian penutup wadah pelindung, dibuat sebuah celah presisi (lubang kalibrasi) tempat melekatnya sensor ultrasonik, sehingga rambatan suara dapat dilontarkan secara leluasa membelah ruang kosong di dalam wadah penampungan. Adapun hasil manufaktur perakitan instrumen dapat dilihat pada Gambar 4.x.

*(Instruksi: Masukkan Gambar 4.x Tampilan Wujud Fisik Alat dari Berbagai Sisi di sini)*

### 4.2.3 Pengujian Perangkat Keras
Pengujian dilakukan setelah seluruh instrumen perangkat keras telah dirangkai secara sempurna. Pengujian difokuskan pada tingkat akurasi sensor ultrasonik dalam membaca kedalaman volume. 

**Uji Akurasi Sensor Ultrasonik**
Pengujian sensor dilakukan untuk mendapatkan tingkat akurasi yang tepat dalam mengalkulasi sisa ruang kosong. Pengujian dilakukan melalui serangkaian proses kalibrasi dengan membandingkan nilai kepresisian jarak yang dibaca oleh sensor HC-SR04 melawan jarak aktual yang diukur menggunakan penggaris/meteran standar. Adapun hasil pengujian akurasi terlihat pada Tabel 4.2.

**Tabel 4.2 Hasil Pengujian Akurasi Pembacaan Jarak Sensor**
| Jarak Aktual (cm) | Pembacaan Sensor (cm) | Selisih/Error (cm) | Akurasi (%) |
| -- | -- | -- | -- |
| 5,0 | 5,1 | 0,1 | 98,0 |
| 10,0 | 10,2 | 0,2 | 98,0 |
| 15,0 | 14,8 | 0,2 | 98,7 |
| 20,0 | 19,9 | 0,1 | 99,5 |
| 25,0 | 25,2 | 0,2 | 99,2 |

Berdasarkan hasil pengujian pada Tabel 4.2, tingkat selisih (*error*) pembacaan alat secara konsisten berada di angka yang sangat minor, yakni kurang dari 1 cm. Dengan pencapaian persentase keakuratan di atas 98%, maka instrumen pengukuran ultrasonik telah dinyatakan berjalan dengan sangat layak dan presisi untuk memicu notifikasi peringatan (*alerts*).

## 4.3 Integrasi Sistem
### 4.3.1 Kriteria Desain Website
Berdasarkan tujuan tugas akhir ini, perangkat tempat sampah pintar (*Smart Bin*) akan terintegrasi secara otomatis dengan sistem pemantauan berupa *website* (*dashboard*), sehingga dalam perancangannya diterapkan kriteria desain yang menjadi dasar pengembangannya. Kriteria desain didapatkan dari analisis kebutuhan operasional pengelola kebersihan DLHK. Adapun kriteria desain yang menjadi tujuan akhir pengembangan website adalah sebagai berikut:
1. *Website* mampu menampilkan data kapasitas volume sampah secara *real-time* dan bersifat *responsive web design* sehingga dapat diakses melalui komputer/laptop maupun *smartphone*.
2. *Website* memiliki sistem autentikasi (*login*) guna membatasi hak akses pengelolaan data hanya kepada administrator yang berwenang.
3. *Website* menyajikan visualisasi data berupa progres bar dan indikator warna (hijau, kuning, merah) agar informasi hierarki prioritas pengangkutan lebih mudah diinterpretasikan oleh operator awam sekalipun.

### 4.3.2 Pengembangan Website
**a. Desain Website**
Tahapan pertama dalam proses desain antarmuka *front-end* adalah penetapan tema visual. Pemilihan skema *Dark Mode* (warna dominan gelap) dengan aksen hijau neon diterapkan bukan semata-mata demi nilai estetika, melainkan untuk mereduksi kelelahan mata (*eye strain*) bagi operator pemantau yang menatap layar dalam durasi panjang. Desain fitur dan *user interface* (UI) website ini dibagi menjadi beberapa segmen utama, yaitu halaman Autentikasi (Login), halaman Dashboard Utama, dan halaman Analitik Temporal.

*(Instruksi: Masukkan Gambar Rancangan Desain Interface / Wireframe di sini jika ada)*

**b. Pemrograman Fitur Website**
Tahapan yang dilakukan setelah membuat desain *interface* adalah merealisasikannya menjadi sebuah *website* fungsional melalui proses pemrograman. *Website* dikembangkan menggunakan *framework frontend* React.js yang dikombinasikan dengan Vite, sedangkan untuk *backend* dan manajemen *database* menggunakan layanan awan Supabase (PostgreSQL). Format *file* yang digunakan dalam pertukaran data (*payload*) berupa format JSON. Tampilan *website* dibuat sistematis dan intuitif. Adapun detail hasil realisasinya adalah sebagai berikut:

**1. Halaman Autentikasi (Login)**
Lapis pertama pertahanan sistem berwujud portal autentikasi. Pengguna diwajibkan menyetorkan kredensial otorisasi berupa surat elektronik (*email*) beserta kata sandi rahasia yang valid. Mekanisme keamanan pada gerbang ini sepenuhnya disandarkan pada layanan *Supabase Auth* yang menerbitkan token *JSON Web Token* (JWT) seketika setelah kredensial dinyatakan sahih. Tanpa mengantongi token JWT ini, seluruh rute navigasi (*routing*) menuju dasbor utama akan diblokir secara absolut melalui proteksi *Route Guard*. Mekanisme ketat ini ditegakkan demi menjamin bahwa hanya personel administrator berwenang yang sanggup mencampuri data pergerakan aset persampahan instansi. Sistem juga telah dilengkapi dengan penanganan galat (*error handling*) yang akan memuntahkan pesan peringatan visual apabila terjadi percobaan peretasan atau kesalahan input kata sandi.

*(Instruksi: Masukkan Screenshot Halaman Login di sini)*

**2. Halaman Dashboard Utama (Real-time Monitoring)**
Ruang kendali utama ini dirancang selayaknya kokpit operasional tingkat lanjut. Di jajaran teratas, bertengger empat panel metrik makro (*Stat Cards*) yang secara seketika (*real-time*) menyajikan kalkulasi agregat: total populasi tempat sampah yang terdaftar, persentase perangkat yang berstatus memancarkan sinyal aktif (*Active Devices*), hingga kuantifikasi pasti berapa banyak wadah yang telah menyentuh batas kritis (*Full Bins*). 

Mekanisme sinkronisasi data pada halaman ini merupakan mahakarya dari implementasi protokol *WebSockets* melalui pustaka *Supabase Realtime Subscribe*. Ketika sensor ESP32 di lapangan menembakkan pembaruan data ke basis data awan, perubahan tersebut langsung didorong (*pushed*) ke antarmuka React.js dalam hitungan milidetik. Hal ini memicu fungsi *re-render* yang menggeser gradasi warna progres bar secara dinamis—dari hijau (aman), kuning (waspada), hingga merah (kritis)—tanpa menuntut interaksi penyegaran halaman (*refresh*) secara manual dari pihak operator.

*(Instruksi: Masukkan Screenshot Halaman Dashboard Utama di sini)*

**3. Halaman Analitik dan Deteksi Anomali**
Guna mengakomodasi kebutuhan audit jangka panjang, sistem membekali diri dengan halaman Analitik temporal (*time-series*). Pergerakan historis penumpukan volume sampah divisualisasikan menggunakan grafik area (*area chart*) yang dibangun di atas pustaka *Recharts*. Garis tren pada grafik ini memampukan pihak manajemen untuk menelusuri jam-jam sibuk (*peak hours*) pembuangan limbah secara presisi.

Di balik layar, halaman ini turut dipersenjatai dengan algoritma deteksi anomali konektivitas. Sistem akan membandingkan stempel waktu (*timestamp*) dari kolom `last_reading_at` pada basis data dengan waktu aktual (*current time*) di peladen lokal. Apabila kalkulasi selisih waktu tersebut melampaui batas kewajaran (misalnya perangkat absen mengirim paket data selama lebih dari beberapa jam), antarmuka akan serta merta melucuti status perangkat dan menyematkan label *Offline* (berwarna merah pekat). Fitur pelacakan mandiri ini secara dramatis menyederhanakan tugas teknisi lapangan dalam mengidentifikasi tong sampah mana yang mengalami degradasi catu daya baterai atau terputus dari area jangkauan sinyal Wi-Fi.

*(Instruksi: Masukkan Screenshot Halaman Analitik/Grafik di sini)*

**4. Modul Manajemen Rute (Smart Routing) dan Ekspor Laporan**
Modul ini bertindak sebagai otak logistik sistem. Melalui kapabilitas manipulasi antarmuka, sistem secara cerdas akan menyaring (*filtering*) dan mengurutkan daftar lokasi penampungan secara hierarkis berdasarkan tingkat kepenuhannya. Tempat sampah yang volumenya telah melampaui batas 70% akan secara otomatis didorong ke urutan teratas sebagai prioritas utama pengangkutan (*Smart Collection Route*), lengkap dengan ketersediaan tombol konfirmasi "Tandai Selesai" bagi petugas paska-pengangkutan.

Di sudut fungsional lainnya, terselip kapabilitas ekstraksi laporan akhir. Hanya dengan satu jentikan interaksi kursor, serangkaian data historis yang berserakan di basis data akan dikonversi ke dalam wujud lembar kerja terstruktur (CSV) melalui modul *SheetJS*, maupun dicetak sebagai dokumen biner presisi tinggi (PDF) menggunakan pustaka *jsPDF*. Kehadiran fitur generator laporan ini sangat krusial untuk melenyapkan kerumitan rekapitulasi administrasi bulanan pemerintah.

*(Instruksi: Masukkan Screenshot Daftar Prioritas Pengangkutan/Alerts di sini)*

**c. Hasil Pemrograman Sistem Integrasi**
Tahap krusial selanjutnya adalah algoritma pengikatan data dari instrumen keras menuju peranti lunak. Alur kerja sistem integrasi bermula saat sensor HC-SR04 menangkap angka jarak ruang kosong, lalu mengirimkannya ke Arduino/ESP32. Mikrokontroler ESP32 lantas mengolah angka tersebut ke dalam formulasi persentase kapasitas. Data akhir tersebut dikemas berformat JSON, kemudian ditembakkan menggunakan *HTTP POST Request* secara nirkabel (Wi-Fi) menuju titik akhir (*endpoint*) API Supabase.

Setelah singgah di tabel `readings` PostgreSQL, *framework* React.js di *front-end* yang telah "berlangganan" jalur koneksi *WebSockets* (melalui modul *Supabase Realtime*) akan seketika menyedot pembaruan data tersebut. Arsitektur komunikasi ini memastikan pergeseran grafik di layar operator termutakhirkan dalam orde milidetik, tanpa memaksa kursor pengguna memuat ulang (*refresh*) halaman peramban secara konvensional.

*(Instruksi: Masukkan Gambar Diagram Alur/Flowchart Integrasi Sistem di sini)*

### 4.3.3 Pengujian Sistem
Pengujian sistem integrasi merupakan proses untuk memvalidasi bahwa transmisi data dari mikrokontroler berhasil ditampilkan akurat pada *website*. Proses pengujian dibagi menjadi dua segmen, yaitu pengujian fungsional fitur (*Black Box*) dan pengujian kecepatan transmisi (*Response Time*).

**a. Hasil Pengujian Fitur Website (Black-Box)**
Hasil pengujian menyoroti tingkat kesesuaian antara perintah masukan pengguna terhadap reaksi antarmuka aplikasi.
**Tabel 4.3 Hasil Pengujian Fitur Website dengan Metode Black Box**
| No | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| -- | -- | -- | -- | -- |
| 1 | Melakukan *login* dengan kredensial yang valid | Sistem menerbitkan token dan membuka akses halaman *Dashboard* | Sesuai | Berhasil |
| 2 | Memasukkan kombinasi *password* yang salah | Sistem memblokir akses dan memunculkan *error pop-up alert* | Sesuai | Berhasil |
| 3 | Mengakses menu navigasi antar halaman | *Routing* berpindah kilat tanpa *reload* seluruh kerangka situs | Sesuai | Berhasil |
| 4 | Klik tombol ekspor laporan (*Download PDF*) | Sistem merender tabel menjadi dokumen berkas biner PDF | Sesuai | Berhasil |

**b. Hasil Pengujian Keseluruhan Sistem Integrasi (Response Time)**
Pengujian ini tak hanya mengkalkulasi transmisi perangkat lunak, namun juga membuktikan kelihaian modul Wi-Fi di tubuh ESP32.
**Tabel 4.4 Hasil Pengujian Kecepatan Transmisi Integrasi**
| No | Skema Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| -- | -- | -- | -- | -- |
| 1 | Pengiriman paket data volume pasca-pergeseran objek di depan sensor | Perubahan progres bar visual muncul di layar *dashboard* kurang dari toleransi 30 detik | Data seketika muncul di UI *website* dengan jeda waktu rata-rata 1-2 detik tanpa perlu *refresh* | Berhasil |
| 2 | Uji transisi status LED indikator fisik di lokasi | Lampu fisik alat berpindah warna selaras dengan notifikasi palet warna di *dashboard* administrator | Sinkronisasi warna fisik dan virtual berjalan presisi | Berhasil |

## 4.4 Analisis Pengaruh dan Rencana Penerapan Sistem Smart Waste Management dalam Penanganan Permasalahan Sampah

### 4.4.1 Analisis Permasalahan Pengelolaan Sampah serta Pengaruh Penerapan Sistem Smart Waste Management
Sistem pemantauan tong sampah pintar yang terintegrasi dengan dasbor *website* ini merupakan perwujudan inovasi teknologi siber dalam manajemen infrastruktur publik. Pengadaan purwarupa ini ditujukan semata-mata untuk mengakhiri inefisiensi masif pada tata kelola pengumpulan limbah perkotaan. Mengacu pada rumusan observasi, permasalahan kronis di lapangan berakar dari penerapan rutinitas pengangkutan yang buta (*blind collection routine*). Armada truk instansi acapkali diwajibkan menyisir belasan rute jalan secara statis dan mendatangi setiap titik mangkal penampungan, padahal seringkali wadah yang didatangi masih dalam keadaan lengang. Akibatnya, alokasi bahan bakar tersedot sia-sia, sementara di belahan kota lain, tong sampah yang sungguh-sungguh kritis justru meluber tak tertangani lantaran terlewat dari jadwal prioritas.

Kehadiran produk inovasi *Smart Waste Management* ini meruntuhkan kendala tersebut dengan merevolusi skema operasional menjadi pemanduan rute berbasis data aktual (*Data-Driven Routing*). Berbekal injeksi mikrokontroler di hulu dan integrasi pangkalan data Supabase di hilir, pihak manajemen kebersihan kini memiliki kapabilitas eksekutif layaknya menara pemantau lalu lintas (ATC). Truk pengangkut armada hanya diinstruksikan untuk menghidupkan mesin dan meluncur ke jalanan bilamana layar dasbor telah mendelegasikan perintah berlabel warna merah pekat. Pada akhirnya, perpaduan epik antara ketangguhan peraba sensor di kerasnya jalanan dan kelihaian perangkat lunak komputasi di ruang kendali ini, terbukti sahih memangkas pemborosan jerih payah operasional, mereduksi emisi karbon dari pembakaran BBM truk yang nihil fungsi, serta menumpas tragedi penumpukan sampah liar di ruang publik secara preventif.

### 4.4.2 Rencana Penerapan Sistem Smart Waste Management
Sebagai rangkaian tindak lanjut dari perwujudan sistem fungsional ini, terdapat dimensi perencanaan kepatuhan hukum yang perlu dipertimbangkan agar inovasi piranti lunak dan keras ini memiliki pijakan legal yang kokoh tatkala diimplementasikan dalam skala pemerintahan daerah sesungguhnya.

**a. Kepatuhan Regulasi Nasional**
Implementasi sirkuit penginderaan jarak jauh dan pencatatan metrik volume persampahan yang tertanam pada antarmuka *website* ini sejalan dan tunduk dengan konvensi ketatanegaraan, di antaranya:
1. **Undang-Undang No. 18 Tahun 2008 tentang Pengelolaan Sampah**, yang menitikberatkan pendelegasian wewenang kepada instansi daerah untuk memodernisasi tata kelola persampahan menjadi lebih visioner, menyeluruh, dan berbasis pendataan komprehensif. Sistem penyedot data *time-series* dari kerangka purwarupa ini menyediakan fondasi arsip digital yang memenuhi kriteria modernisasi tersebut.
2. **Peraturan Pemerintah No. 81 Tahun 2012 tentang Pengelolaan Sampah**, yang memberikan amanat tak terelakkan bahwa pihak pemerintah wilayah diwajibkan menyelenggarakan pemantauan jejaring informasi pengelolaan limbah (berwujud *dashboard* publik/terbuka) yang sifatnya mutakhir, transparan, dan sanggup diakses guna kemaslahatan evaluasi publik.

**b. Penetapan Rute Cerdas (*Smart Routing Target*)**
Agar potensi *website* yang dikembangkan tidak berakhir sebagai sekadar pajangan statistik grafis belaka, penerapan operasionalnya mutlak diwajibkan menggandeng divisi supir armada (*fleet operators*). Sebelum armada berangkat di pagi hari, parameter `Tingkat Kepenuhan > 70%` yang terfilter di layar tabel *Alerts/Routes* harus terlebih dahulu dikonversi menjadi manifes Surat Perintah Jalan (SPJ). Hal ini menggaransi bahwa setiap liter bahan bakar solar yang dibakar oleh truk instansi memang dialokasikan murni untuk mengevakuasi penampungan kritis, merealisasikan prinsip *green operation* sekaligus mengokohkan arsitektur *Smart City* yang diimpi-impikan.
