import { useMemo } from "react";
import { StatCard } from "@/components/StatCard";
import { FillGauge } from "@/components/FillGauge";
import { BinStatusBadge } from "@/components/BinStatusBadge";
import { useBins } from "@/hooks/useBins";
import { useDevices } from "@/hooks/useDevices";
import { useAlerts } from "@/hooks/useAlerts";
import { Trash2, Cpu, AlertTriangle, TruckIcon, Activity, Clock, Loader2, ShieldCheck, ShieldAlert, ShieldX, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { getFillPredictionDetail } from "@/lib/utils";
import { getSensorHealth, detectAnomaly } from "@/lib/anomaly-detection";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useSensorHistory } from "@/hooks/useSensorHistory";

export default function DashboardPage() {
  const { bins, loading: binsLoading } = useBins();
  const { devices } = useDevices();
  const { alerts } = useAlerts();
  const { historyData } = useSensorHistory();

  const fullBins = bins.filter(b => b.status === "full" && !b.is_maintenance).length;
  const onlineDevices = devices.filter(d => d.online).length;
  
  // Bins that need collection
  const binsToCollect = bins.filter(b => !b.is_maintenance && b.current_fill_percentage >= b.threshold_warning).sort((a, b) => b.current_fill_percentage - a.current_fill_percentage);



  if (binsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Memuat beranda...</p>
        </div>
      </div>
    );
  }

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Laporan Harian - EcoPhora UPTD Sleman", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Waktu Cetak: ${new Date().toLocaleString()}`, 14, 30);
      
      const tableColumn = ["Kode TPS", "Lokasi", "Volume", "Status", "Last Update"];
      const tableRows = bins.map(bin => [
        bin.bin_code,
        bin.location,
        `${bin.current_fill_percentage}%`,
        bin.status.toUpperCase(),
        bin.last_reading_at ? new Date(bin.last_reading_at).toLocaleString() : "-"
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
      });
      
      doc.save(`Laporan_EcoPhora_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Laporan PDF berhasil diunduh!");
    } catch (error) {
      toast.error("Gagal membuat PDF");
      console.error(error);
    }
  };

  const exportToCSV = () => {
    try {
      const data = bins.map(bin => ({
        "Kode TPS": bin.bin_code,
        "Lokasi": bin.location,
        "Volume (%)": bin.current_fill_percentage,
        "Status": bin.is_maintenance ? "Maintenance" : bin.status.toUpperCase(),
        "Terakhir Update": bin.last_reading_at ? new Date(bin.last_reading_at).toLocaleString() : "-"
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data TPS");
      
      XLSX.writeFile(workbook, `Data_TPS_EcoPhora_${new Date().toISOString().split('T')[0]}.csv`);
      toast.success("Data CSV berhasil diunduh!");
    } catch (error) {
      toast.error("Gagal membuat CSV");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Beranda <span className="text-gradient">Utama</span></h1>
          <p className="text-sm text-muted-foreground mt-1">Sistem pemantauan sampah IoT real-time</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportToCSV} variant="outline" className="gap-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10">
            <Download className="h-4 w-4" /> Unduh CSV
          </Button>
          <Button onClick={exportToPDF} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-500/20">
            <Download className="h-4 w-4" /> Cetak PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard title="Total Tempat Sampah" value={bins.length} subtitle="Dipantau" icon={Trash2} />
        <StatCard title="Perangkat Aktif" value={`${onlineDevices}/${devices.length}`} subtitle="Node ESP32 online" icon={Cpu} iconClassName="bg-accent/10 group-hover:bg-accent/20 group-hover:glow-blue" />
        <StatCard title="Tempat Sampah Penuh" value={fullBins} subtitle="Perlu diambil" icon={AlertTriangle} iconClassName="bg-destructive/10 group-hover:bg-destructive/20 group-hover:glow-red" />
        <StatCard title="Tugas Pengambilan" value={binsToCollect.length} subtitle="Peringatan/penuh" icon={TruckIcon} iconClassName="bg-warning/10 group-hover:bg-warning/20 group-hover:glow-amber" />
      </div>

      {/* === SMART COLLECTION ROUTE (Daftar Tugas) === */}
      {binsToCollect.length > 0 && (
        <div className="glass-card rounded-xl p-5 border-warning/20 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold">Daftar Tugas Pengambilan (Prioritas)</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {binsToCollect.map(bin => (
              <div key={bin.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10 transition-all hover:bg-warning/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center font-bold text-warning text-xs">
                    {bin.current_fill_percentage}%
                  </div>
                  <div>
                    <span className="text-sm font-semibold">{bin.bin_code}</span>
                    <p className="text-xs text-muted-foreground">{bin.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <BinStatusBadge status={bin.status} isMaintenance={bin.is_maintenance} />
                  <Button size="sm" variant="outline" className="h-7 text-xs bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 border-emerald-500/20" onClick={() => toast.success(`Ditandai selesai untuk ${bin.bin_code}`)}>
                    Tandai Selesai
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === SENSOR HEALTH MONITOR (Anomaly Detection) === */}
      {bins.length > 0 && (
        <div className="glass-card rounded-xl p-5 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Monitor Kesehatan Sensor</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {bins.map(bin => {
              const isOnline = bin.devices?.online ?? false;
              let health = getSensorHealth(bin.last_reading_at, isOnline);
              
              if (health.severity === "normal" && bin.previous_fill_percentage !== undefined) {
                const anomaly = detectAnomaly(bin.current_fill_percentage, bin.previous_fill_percentage, bin.last_reading_at);
                if (anomaly.type) {
                  health = anomaly;
                }
              }
              
              const HealthIcon = health.severity === "normal" ? ShieldCheck : health.severity === "warning" ? ShieldAlert : ShieldX;
              const dotClass = health.severity === "normal"
                ? "bg-emerald-400 shadow-emerald-400/50 animate-pulse"
                : health.severity === "warning"
                  ? "bg-amber-400 shadow-amber-400/50"
                  : "bg-red-400 shadow-red-400/50 animate-pulse";
              const borderClass = health.severity === "normal"
                ? "border-emerald-500/20 hover:border-emerald-500/40"
                : health.severity === "warning"
                  ? "border-amber-500/20 hover:border-amber-500/40"
                  : "border-red-500/20 hover:border-red-500/40";
              const bgClass = health.severity === "normal"
                ? "bg-emerald-50 dark:bg-emerald-500/5"
                : health.severity === "warning"
                  ? "bg-amber-50 dark:bg-amber-500/5"
                  : "bg-red-50 dark:bg-red-500/5";
              return (
                <div key={bin.id} className={`flex items-center gap-3 p-3 rounded-lg ${bgClass} border ${borderClass} transition-all duration-200 hover:shadow-sm`}>
                  <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 shadow-sm ${dotClass}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-semibold text-foreground">{bin.bin_code}</span>
                      <HealthIcon className={`h-3 w-3 text-${health.color}-400`} />
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{health.label} — {health.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 stagger-children">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Tingkat Kepenuhan Real-Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(155, 70%, 50%)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(155, 70%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    fontSize: 12,
                    boxShadow: "0 8px 32px hsla(0,0%,0%,0.1)",
                  }}
                />
                <Area type="monotone" dataKey="avg" stroke="hsl(155, 70%, 50%)" fill="url(#fillGrad)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Peringatan Terbaru
          </h3>
          <div className="space-y-3">
            {alerts.length === 0 && (
              <div className="py-8 text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Clock className="h-5 w-5 text-primary/60" />
                </div>
                <p className="text-xs text-muted-foreground">Belum ada peringatan</p>
              </div>
            )}
            {alerts.slice(0, 4).map(alert => (
              <div key={alert.id} className={`flex items-start gap-3 rounded-lg p-3 text-xs transition-all duration-200 hover:translate-x-1 ${
                alert.type === "critical" ? "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/15" :
                alert.type === "warning" ? "bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/15" :
                "bg-muted/50 border border-border"
              }`}>
                <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 shadow-sm ${
                  alert.type === "critical" ? "bg-red-400 shadow-red-400/50 animate-pulse-dot" :
                  alert.type === "warning" ? "bg-amber-400 shadow-amber-400/50" : "bg-muted-foreground"
                }`} />
                <div>
                  <p className="font-medium text-foreground/90">{alert.message}</p>
                  <p className="text-muted-foreground mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 stagger-children">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Ringkasan Status Tempat Sampah</h3>
          <div className="space-y-3">
            {bins.length === 0 && (
              <div className="py-8 text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Trash2 className="h-5 w-5 text-primary/60" />
                </div>
                <p className="text-xs text-muted-foreground">Belum ada tempat sampah. Tambahkan dari panel Admin.</p>
              </div>
            )}
            {bins.slice(0, 6).map(bin => {
              return (
                <div key={bin.id} className="flex flex-col gap-1.5 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-20 truncate">{bin.bin_code}</span>
                    <div className="flex-1"><FillGauge percentage={bin.is_maintenance ? 0 : bin.current_fill_percentage} /></div>
                    <BinStatusBadge status={bin.status} isMaintenance={bin.is_maintenance} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
