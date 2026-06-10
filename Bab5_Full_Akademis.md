# BAB V: KESIMPULAN DAN SARAN

## 5.1 Kesimpulan
Berdasarkan hasil perancangan, pembuatan, dan pengujian sistem *Smart Waste Management* yang telah dilakukan, maka dapat ditarik beberapa kesimpulan sebagai berikut:

1. Sistem *Smart Waste Management* yang mengintegrasikan perangkat keras (mikrokontroler ESP32) dan aplikasi *web* berhasil dibangun. Data hasil pembacaan sensor ultrasonik HC-SR04 dapat dikirimkan ke *database* Supabase, dan langsung ditampilkan pada halaman *dashboard* pengguna tanpa perlu memuat ulang halaman (*real-time*).
2. Hasil pengujian menunjukkan bahwa sensor ultrasonik mampu bekerja dengan baik, di mana rata-rata akurasi pembacaan jarak sisa ruang kosong mencapai angka di atas 98%. Selain itu, pada pengujian transmisi jaringan, waktu tunda (*delay*) pengiriman data dari perangkat hingga tampil di *dashboard* tercatat rata-rata sebesar 1,4 detik. Angka ini menunjukkan bahwa sistem sangat responsif dan jauh di bawah batas toleransi kelambatan 30 detik.
3. Antarmuka *dashboard* yang dikembangkan telah memenuhi kebutuhan fungsional pemantauan jarak jauh. Fitur yang berhasil diimplementasikan meliputi visualisasi tingkat kepenuhan sampah, pemetaan lokasi melalui fitur peta (*Map View*), sistem notifikasi peringatan jika sampah penuh, hingga fitur ekspor data laporan (PDF/CSV) untuk mempermudah tugas administrasi pengelola.
4. Berdasarkan simulasi analisis efisiensi operasional pengangkutan, peralihan dari metode rute statis menuju rute dinamis berbasis data (*Data-Driven Routing*) diestimasi mampu menghemat konsumsi bahan bakar armada truk pengangkut hingga 52%. Hal ini juga memberikan dampak positif berupa pengurangan emisi karbon (CO2) ke lingkungan.

## 5.2 Saran
Meskipun sistem ini telah berhasil berjalan sesuai dengan tujuan penelitian, masih terdapat beberapa kekurangan yang dapat diperbaiki untuk pengembangan selanjutnya. Adapun saran untuk penelitian berikutnya adalah sebagai berikut:

1. Modul komunikasi pada sistem ini masih menggunakan SIM900A (jaringan 2G/GPRS) sebagai alternatif Wi-Fi. Mengingat jaringan 2G sudah mulai ditutup oleh beberapa penyedia layanan seluler di Indonesia, pengembangan selanjutnya disarankan menggunakan modul komunikasi yang lebih baru seperti modul 4G LTE atau LoRaWAN agar koneksi internet lebih stabil di area terbuka.
2. Prototipe perangkat keras saat ini masih sangat bergantung pada sumber listrik langsung dari stopkontak melalui adaptor. Untuk ke depannya, sistem dapat dilengkapi dengan sumber energi mandiri seperti panel surya (*solar cell*) dan baterai, sehingga tempat sampah pintar ini dapat dipasang secara bebas di ruang publik tanpa terhalang ketersediaan kabel listrik PLN.
3. Aplikasi *web dashboard* dapat dikembangkan lebih lanjut dengan menambahkan fitur kecerdasan buatan (*Machine Learning*) untuk memprediksi pola penumpukan sampah. Dengan adanya data historis, sistem diharapkan tidak hanya sekadar memberi tahu saat wadah penuh, tetapi juga mampu meramalkan kapan wadah tersebut akan penuh di hari-hari berikutnya.
4. Desain wadah pelindung (*enclosure*) komponen elektronik sebaiknya dirancang ulang dengan material yang lebih kokoh dan sistem pengunci khusus. Hal ini diperlukan untuk mencegah kerusakan alat akibat faktor cuaca ekstrem maupun tindakan perusakan (*vandalisme*) saat alat dipasang di tempat umum.
