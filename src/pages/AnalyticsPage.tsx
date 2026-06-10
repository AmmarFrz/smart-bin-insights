import { useMemo } from "react";
import { dailyWasteData, weeklyData, monthlyData, hourlyFillData } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, AreaChart, Area } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Download, Leaf, Fuel, TreePine, Banknote } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AnalyticsPage() {
  // === CARBON FOOTPRINT CALCULATOR ===
  // Kalkulasi dampak lingkungan berdasarkan data operasional
  const carbonStats = useMemo(() => {
    const totalCollections = weeklyData.reduce((s, w) => s + w.totalCollections, 0);
    // Rata-rata jarak per trip pengangkutan (km) di area Sleman
    const avgDistancePerTrip = 8.5;
    // Efisiensi bahan bakar truk sampah (liter/km)
    const fuelPerKm = 0.15;
    // Penghematan ~25% dibanding rute acak (berkat Smart Routing)
    const savingsRatio = 0.25;

    const totalDistanceKm = totalCollections * avgDistancePerTrip;
    const fuelSavedLiters = totalDistanceKm * fuelPerKm * savingsRatio;
    // 1 liter solar menghasilkan 2.68 kg CO2
    const co2PreventedKg = fuelSavedLiters * 2.68;
    // 1 pohon menyerap ~21.77 kg CO2 per tahun
    const treesEquivalent = co2PreventedKg / 21.77;
    // Harga solar Rp 6.800/liter
    const moneySavedRp = fuelSavedLiters * 6800;

    return { fuelSavedLiters, co2PreventedKg, treesEquivalent, moneySavedRp };
  }, []);

  const generatePDF = (type: "weekly" | "monthly") => {
    const doc = new jsPDF();
    const title = type === "weekly" ? "Weekly Analytics Report" : "Monthly Analytics Report";
    
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    if (type === "weekly") {
      autoTable(doc, {
        startY: 40,
        head: [['Week', 'Average Fill (%)', 'Total Collections']],
        body: weeklyData.map(item => [item.week, `${item.avgFill}%`, item.totalCollections.toString()]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }
      });
    } else {
      autoTable(doc, {
        startY: 40,
        head: [['Month', 'Total Waste (kg)', 'Collections']],
        body: monthlyData.map(item => [item.month, `${item.totalWaste} kg`, item.collections.toString()]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }
      });
    }
    
    doc.save(`ecophora-${type}-report.pdf`);
  };

  const generateExcel = (type: "weekly" | "monthly") => {
    let data;
    if (type === "weekly") {
      data = weeklyData.map(item => ({
        Week: item.week,
        'Average Fill (%)': item.avgFill,
        'Total Collections': item.totalCollections
      }));
    } else {
      data = monthlyData.map(item => ({
        Month: item.month,
        'Total Waste (kg)': item.totalWaste,
        Collections: item.collections
      }));
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");
    
    XLSX.writeFile(workbook, `ecophora-${type}-report.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">Historical waste monitoring data and trends</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => generatePDF("weekly")}>
              Weekly Report (PDF)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => generatePDF("monthly")}>
              Monthly Report (PDF)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => generateExcel("weekly")}>
              Weekly Report (Excel)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => generateExcel("monthly")}>
              Monthly Report (Excel)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* === ENVIRONMENTAL IMPACT DASHBOARD === */}
      <div className="glass-card rounded-xl p-5 border border-emerald-500/10 bg-emerald-500/[0.02]">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Leaf className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Environmental Impact</h3>
            <p className="text-[10px] text-muted-foreground">Estimasi dampak lingkungan dari optimasi rute pengangkutan</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* CO2 Prevented */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/15 p-4 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-all duration-500" />
            <Leaf className="h-5 w-5 text-emerald-400 mb-2" />
            <p className="text-[10px] text-emerald-400/70 uppercase font-semibold tracking-wider">CO₂ Dicegah</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{carbonStats.co2PreventedKg.toFixed(1)}<span className="text-xs font-normal ml-1">kg</span></p>
            <p className="text-[9px] text-muted-foreground mt-1">Emisi karbon yang berhasil direduksi</p>
          </div>

          {/* Fuel Saved */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/15 p-4 group hover:border-blue-500/30 transition-all duration-300">
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-all duration-500" />
            <Fuel className="h-5 w-5 text-blue-400 mb-2" />
            <p className="text-[10px] text-blue-400/70 uppercase font-semibold tracking-wider">BBM Dihemat</p>
            <p className="text-xl font-bold text-blue-400 mt-1">{carbonStats.fuelSavedLiters.toFixed(1)}<span className="text-xs font-normal ml-1">liter</span></p>
            <p className="text-[9px] text-muted-foreground mt-1">Solar armada truk pengangkut</p>
          </div>

          {/* Trees Equivalent */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/15 p-4 group hover:border-green-500/30 transition-all duration-300">
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-green-500/5 group-hover:bg-green-500/10 transition-all duration-500" />
            <TreePine className="h-5 w-5 text-green-400 mb-2" />
            <p className="text-[10px] text-green-400/70 uppercase font-semibold tracking-wider">Setara Pohon</p>
            <p className="text-xl font-bold text-green-400 mt-1">{carbonStats.treesEquivalent.toFixed(1)}<span className="text-xs font-normal ml-1">pohon</span></p>
            <p className="text-[9px] text-muted-foreground mt-1">Pohon yang terselamatkan per tahun</p>
          </div>

          {/* Money Saved */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/15 p-4 group hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-amber-500/5 group-hover:bg-amber-500/10 transition-all duration-500" />
            <Banknote className="h-5 w-5 text-amber-400 mb-2" />
            <p className="text-[10px] text-amber-400/70 uppercase font-semibold tracking-wider">Anggaran Hemat</p>
            <p className="text-xl font-bold text-amber-400 mt-1">Rp {(carbonStats.moneySavedRp / 1000).toFixed(0)}<span className="text-xs font-normal ml-1">rb</span></p>
            <p className="text-[9px] text-muted-foreground mt-1">Penghematan biaya BBM bulanan</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 text-foreground/90">Daily Average Fill Level (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyWasteData}>
                <defs>
                  <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(155, 70%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(155, 70%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
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
                <Area type="monotone" dataKey="avgFill" stroke="hsl(155, 70%, 45%)" fill="url(#dailyFill)" strokeWidth={2.5} name="Avg Fill %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 text-foreground/90">Daily Collections</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyWasteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(220, 14%, 25%, 0.6)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215, 14%, 50%)" }} stroke="hsl(220, 14%, 22%)" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215, 14%, 50%)" }} stroke="hsl(220, 14%, 22%)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid hsl(220, 14%, 20%)",
                    background: "hsl(220, 18%, 11%)",
                    color: "hsl(210, 20%, 90%)",
                    fontSize: 12,
                    boxShadow: "0 8px 32px hsla(0,0%,0%,0.4)",
                  }}
                />
                <Bar dataKey="collections" fill="hsl(205, 85%, 55%)" radius={[6, 6, 0, 0]} name="Collections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 text-foreground/90">Weekly Monitoring</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
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
                <Line type="monotone" dataKey="avgFill" stroke="hsl(155, 70%, 45%)" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }} name="Avg Fill %" />
                <Line type="monotone" dataKey="totalCollections" stroke="hsl(205, 85%, 55%)" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }} name="Collections" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 text-foreground/90">Monthly Waste Statistics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
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
                <Bar dataKey="totalWaste" fill="hsl(155, 70%, 45%)" radius={[6, 6, 0, 0]} name="Total Waste (kg)" />
                <Bar dataKey="collections" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} name="Collections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4 text-foreground/90">24-Hour Multi-Bin Fill Trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyFillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" interval={2} />
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
              <Line type="monotone" dataKey="bin1" stroke="hsl(155, 70%, 45%)" strokeWidth={2.5} dot={false} name="BIN-001" />
              <Line type="monotone" dataKey="bin2" stroke="hsl(205, 85%, 55%)" strokeWidth={2.5} dot={false} name="BIN-002" />
              <Line type="monotone" dataKey="bin3" stroke="hsl(38, 92%, 50%)" strokeWidth={2.5} dot={false} name="BIN-003" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-center mt-8 text-xs text-muted-foreground/70 border-t border-border/40 pt-4">
        <p>Sumber Data Historis: Sistem Informasi Pengelolaan Sampah Nasional (SIPSN) & Laporan DLH Kabupaten Sleman 2024/2025.</p>
        <p>Volume timbulan sampah rata-rata tercatat sebesar 601,79 Ton/Hari.</p>
      </div>
    </div>
  );
}
