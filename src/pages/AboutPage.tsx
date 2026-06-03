import {
  Info, Leaf, Fuel, TreePine, Banknote, ShieldCheck, 
  Trash2, Navigation, MessageSquare, Zap, Volume2, 
  FileText, Smartphone, LayoutDashboard, Activity
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      title: "Real-time Monitoring (Zero-Refresh) ⚡",
      description: "Data tingkat kepenuhan sampah ter-update secara otomatis ke dashboard via Supabase Realtime WebSocket tanpa perlu me-refresh halaman browser.",
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Kalkulator Jejak Karbon & Lingkungan 🌿",
      description: "Mengukur secara saintifik reduksi emisi CO₂, penghematan liter bahan bakar solar truk, ekuivalensi pohon terselamatkan, serta anggaran operasional.",
      icon: Leaf,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Smart Logistics Routing 🚛",
      description: "Menghitung rute pengumpulan armada truk terpendek dari Depo DLH melewati tempat sampah berstatus Penuh/Kritis dan mengabaikan yang kosong.",
      icon: Navigation,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Integrasi WhatsApp Driver Dispatch 📲",
      description: "Supir truk dapat langsung menerima daftar rute logistik optimal dan checklist TPS tujuan melalui tautan WhatsApp hanya dalam sekali klik.",
      icon: MessageSquare,
      color: "text-green-400 bg-green-500/10 border-green-500/20"
    },
    {
      title: "Prediksi Waktu Penuh (AI Forecast) 🔮",
      description: "Memproyeksikan estimasi sisa waktu sebelum wadah sampah penuh secara absolut, dikategorikan berdasar tingkat urgensi tindakan.",
      icon: LayoutDashboard,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Sirene Bunyi Alarm Suara (Beep Siren) 🔔",
      description: "Siren alarm suara sintetik dari browser Web Audio API akan otomatis berbunyi ketika tingkat kepenuhan kritis terdeteksi (>90%).",
      icon: Volume2,
      color: "text-red-400 bg-red-500/10 border-red-500/20"
    },
    {
      title: "Deteksi Anomali & Sensor Health 🛡️",
      description: "Mendeteksi secara cerdas kerusakan perangkat keras dari kejauhan (sensor stuck/macet, lonjakan ekstrem data, atau offline).",
      icon: ShieldCheck,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    },
    {
      title: "Aplikasi Mobile Installable (PWA) 📱",
      description: "Dapat ditambahkan ke layar HP sebagai aplikasi mandiri (Add to Home Screen) yang ringan tanpa memakan ruang memori HP.",
      icon: Smartphone,
      color: "text-pink-400 bg-pink-500/10 border-pink-500/20"
    },
    {
      title: "Ekspor Laporan PDF & Excel Instan 📊",
      description: "Menyederhanakan tugas administrasi bulanan dengan mengunduh berkas tabel data resmi PDF atau lembar sebar Excel dalam sekali klik.",
      icon: FileText,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    }
  ];

  const benefits = [
    {
      title: "Efisiensi Anggaran BBM",
      value: "Hemat hingga 25%",
      description: "Sistem mereduksi rute armada truk pengangkut secara drastis dengan melewati TPS yang memang butuh pengumpulan saja.",
      icon: Fuel,
      color: "from-blue-500/10 to-indigo-500/5 border-blue-500/20 text-blue-400"
    },
    {
      title: "Pencegahan Polusi & Bau",
      value: "Respons Cepat Sebelum Meluap",
      description: "Alarm Beep suara instan dan prediksi waktu penuh memicu pengumpulan sampah yang proaktif sebelum menumpuk di jalanan.",
      icon: Trash2,
      color: "from-red-500/10 to-amber-500/5 border-red-500/20 text-red-400"
    },
    {
      title: "Pemberdayaan Teknologi Hijau",
      value: "Eco",
      description: "Menampilkan konversi penyerapan gas emisi karbon ke jumlah ekuivalensi pohon yang terselamatkan secara ilmiah.",
      icon: TreePine,
      color: "from-emerald-500/10 to-green-500/5 border-emerald-500/20 text-emerald-400"
    },
    {
      title: "Penghematan Biaya Pemeliharaan",
      value: "Inspeksi Jarak Jauh",
      description: "Teknologi anomaly detection memangkas waktu inspeksi fisik perangkat keras sensor lapangan secara signifikan.",
      icon: Activity,
      color: "from-purple-500/10 to-pink-500/5 border-purple-500/20 text-purple-400"
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Info className="h-6 w-6 text-emerald-400" />
          <h1 className="text-2xl font-bold tracking-tight">EcoPhora Info & Keunggulan</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Platform Sistem Pengelolaan Sampah Cerdas berbasis Internet of Things (IoT) & Analisis Rute Teroptimasi.
        </p>
      </div>

      {/* SECTION 1: KEUNGGULAN UTAMA */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground/90 flex items-center gap-2">
          <Banknote className="h-5 w-5 text-emerald-400" /> Keunggulan Utama Sistem (Key Benefits)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, i) => (
            <div key={i} className={`relative overflow-hidden rounded-xl border p-5 bg-gradient-to-br ${benefit.color} hover:bg-white/[0.03] transition-all duration-300`}>
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">{benefit.title}</p>
                  <p className="text-lg font-bold text-foreground">{benefit.value}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: 9 FITUR UNGGULAN */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground/90 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-400" /> 9 Fitur Pembeda Utama (The Killer Features)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="glass-card rounded-xl p-5 border border-white/[0.04] flex flex-col gap-4 hover:border-white/[0.09] hover:bg-white/[0.02] transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                  <feature.icon className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-foreground/90 leading-tight">{feature.title}</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: ARSITEKTUR TEKNOLOGI */}
      <div className="glass-card rounded-xl p-6 border border-emerald-500/10 bg-emerald-500/[0.01] space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground/90">Bagaimana Alur Kerja Sistem EcoPhora?</h3>
            <p className="text-[10px] text-muted-foreground">Sinergi antara Perangkat IoT Lapangan, Server Cloud, dan Dasbor Operator</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2">
            <p className="font-semibold text-emerald-400">1. Node Sensor Lapangan (IoT)</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Mikrokontroler ESP32 mengaktifkan sensor ultrasonik HC-SR04 untuk mengukur ketinggian tumpukan sampah setiap interval waktu tertentu, memfilter noise secara lokal, dan mengirimkan datanya lewat jaringan internet menggunakan REST API HTTPS POST.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2">
            <p className="font-semibold text-blue-400">2. Supabase Serverless & Database</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Endpoint Supabase Edge Function menerima kiriman data sensor, memvalidasi kunci keamanan (x-api-key), melakukan pembaruan status tempat sampah di PostgreSQL database, dan menyebarkan event data baru secara instan via kanal WebSocket.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-2">
            <p className="font-semibold text-purple-400">3. React Dashboard (Front-End)</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Aplikasi web React Vite menerima event database secara real-time. Peta Leaflet akan langsung memperbarui rute logistik optimal armada pengangkut, memicu sirine suara darurat jika penuh, serta menghitung kontribusi ramah lingkungan dinamis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
