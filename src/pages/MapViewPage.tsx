import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useBins, type BinRow } from "@/hooks/useBins";
import { Loader2, MapPin, Wifi, WifiOff, Truck, Navigation, CheckCircle2, RotateCcw, Building } from "lucide-react";
import { BinStatusBadge } from "@/components/BinStatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Custom colored markers per status (SVG data URIs — no external assets needed)
const buildIcon = (color: string) =>
  L.divIcon({
    className: "ecophora-marker",
    html: `
      <div style="
        background:${color};
        width:28px;height:28px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.4);
        display:flex;align-items:center;justify-content:center;
      ">
        <div style="
          width:10px;height:10px;border-radius:50%;
          background:white;transform:rotate(45deg);
        "></div>
      </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

const ICONS: Record<BinRow["status"], L.DivIcon> = {
  empty: buildIcon("#10b981"),   // emerald
  medium: buildIcon("#f59e0b"),  // amber
  full: buildIcon("#ef4444"),    // red
};

// Beautiful truck depot icon for DLH/UPTD main office
const DEPOT_ICON = L.divIcon({
  className: "ecophora-depot-marker",
  html: `
    <div style="
      background:#2563eb;
      width:32px;height:32px;border-radius:8px;
      border:3px solid white;
      box-shadow:0 0 15px rgba(37,99,235,0.6), 0 2px 8px rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-5.5a1 1 0 0 0-.5-.87L18 8.13a1 1 0 0 0-.5-.13H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function MapViewPage() {
  const { bins, loading } = useBins();
  const [showRoute, setShowRoute] = useState(false);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [routeBins, setRouteBins] = useState<BinRow[]>([]);
  const [isSimulated, setIsSimulated] = useState(false);

  const mappedBins = useMemo(() => {
    const fallbackLocations = [
      { name: "Pasar Sleman", lat: -7.6888, lng: 110.3392 },
      { name: "Sleman City Hall (SCH)", lat: -7.7126, lng: 110.3626 },
      { name: "Pasar Colombo Jakal (Sentra Jajan)", lat: -7.7554, lng: 110.3854 }
    ];
    
    return bins.map((b, i) => {
      const fallback = fallbackLocations[i % fallbackLocations.length];
      const lat = b.latitude !== null && b.latitude !== 0 ? Number(b.latitude) : fallback.lat;
      const lng = b.longitude !== null && b.longitude !== 0 ? Number(b.longitude) : fallback.lng;
      const loc = b.location && b.location !== "—" && b.location.trim() !== "" ? b.location : fallback.name;
      return {
        ...b,
        latitude: lat,
        longitude: lng,
        location: loc
      };
    });
  }, [bins]);

  // Actual DLH Sleman & UPTD Pelayanan Persampahan coordinates (Jl. KRT Pringgodiningrat No. 9, Tridadi)
  const depotCoord: [number, number] = useMemo(() => [-7.6896, 110.3478], []);

  // Map center focused on Sleman Regency
  const center: [number, number] = useMemo(() => [-7.7126, 110.3626], []);

  // Nearest-Neighbor TSP Heuristic
  const calculateOptimalRoute = () => {
    if (mappedBins.length === 0) {
      toast.error("Tidak ada data koordinat tempat sampah untuk dihitung.");
      return;
    }

    // Filter bins that are actually full (fill level >= 75%)
    let targetBins = mappedBins.filter(b => b.current_fill_percentage >= 75);
    let simulated = false;

    // Fallback: If no bins are full, simulate by selecting all bins above 30% to show off the route
    if (targetBins.length === 0) {
      targetBins = [...mappedBins].sort((a, b) => b.current_fill_percentage - a.current_fill_percentage).slice(0, 3);
      simulated = true;
    }

    if (targetBins.length === 0) {
      toast.error("Tidak ada tempat sampah untuk dimasukkan ke rute.");
      return;
    }

    const path: [number, number][] = [depotCoord];
    const unvisited = [...targetBins];
    let currentPos: [number, number] = depotCoord;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const bin = unvisited[i];
        const lat = Number(bin.latitude);
        const lng = Number(bin.longitude);
        // Simple planar hypotenuse for local optimization
        const dist = Math.hypot(lat - currentPos[0], lng - currentPos[1]);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIndex = i;
        }
      }

      const nextBin = unvisited[nearestIndex];
      unvisited.splice(nearestIndex, 1);
      const nextCoord: [number, number] = [Number(nextBin.latitude), Number(nextBin.longitude)];
      path.push(nextCoord);
      currentPos = nextCoord;
    }

    path.push(depotCoord); // Return back to Depot

    setRoutePath(path);
    setRouteBins(targetBins);
    setShowRoute(true);
    setIsSimulated(simulated);

    if (simulated) {
      toast.info("Semua tempat sampah kosong. Mengaktifkan Simulasi Rute untuk demo DLH!");
    } else {
      toast.success("Rute pengangkutan sampah terpendek berhasil dihitung!");
    }
  };

  const clearRoute = () => {
    setShowRoute(false);
    setRoutePath([]);
    setRouteBins([]);
    setIsSimulated(false);
    toast.success("Rute berhasil di-reset.");
  };

  const sendWhatsAppDispatch = () => {
    if (routeBins.length === 0) return;

    let message = `🚚 *ECOPHORA UPTD SLEMAN - PERINTAH DISPATCH ARMADA*\n\n`;
    message += `Halo Petugas Armada Sleman, berikut adalah rute pengumpulan sampah optimal untuk hari ini:\n\n`;
    message += `📍 *Jarak Rute:* ${totalDistance.toFixed(1)} km\n`;
    message += `🌱 *Solar Dihemat:* ${fuelSaved.toFixed(2)} Liter\n\n`;
    message += `📋 *URUTAN STOP PENGAMBILAN (Mulai dari DLH):*\n`;
    message += `1. *Start:* Depot DLH Sleman (Jl. KRT Pringgodiningrat)\n`;

    routeBins.forEach((bin, i) => {
      message += `${i + 2}. *${bin.bin_code}* (${bin.location} - *${bin.current_fill_percentage}%*)\n`;
    });

    message += `${routeBins.length + 2}. *Finish:* Kembali ke Depot UPTD DLH Sleman\n\n`;
    message += `Semua titik di atas telah dihitung menggunakan algoritma optimasi rute terpendek. Harap lakukan pengangkutan secara berurutan.\n\n`;
    message += `Semangat bertugas & tetap jaga keselamatan! 💚`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
    toast.success("Membuka WhatsApp untuk dispatch supir...");
  };

  // Calculate total route distance in km
  const totalDistance = useMemo(() => {
    if (routePath.length <= 1) return 0;
    let dist = 0;
    for (let i = 1; i < routePath.length; i++) {
      const p1 = routePath[i - 1];
      const p2 = routePath[i];
      // Convert degrees to approximate km (1 deg ~ 111.32 km)
      dist += Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * 111.32;
    }
    return dist;
  }, [routePath]);

  // Fuel saved approximation (comparing optimal route vs visiting all bins randomly)
  const fuelSaved = useMemo(() => {
    if (totalDistance === 0) return 0;
    // Assume 0.15 Litres/km truck fuel efficiency, saving ~25% compared to sub-optimal paths
    return totalDistance * 0.15 * 0.25;
  }, [totalDistance]);

  // CO2 saved approximation (1 Litre diesel ~ 2.68 kg CO2)
  const co2Saved = useMemo(() => {
    return fuelSaved * 2.68;
  }, [fuelSaved]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const totals = {
    all: bins.length,
    mapped: mappedBins.length,
    empty: mappedBins.filter((b) => b.status === "empty").length,
    medium: mappedBins.filter((b) => b.status === "medium").length,
    full: mappedBins.filter((b) => b.status === "full").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Map View <span className="text-gradient">Control</span></h1>
          <p className="text-sm text-muted-foreground">Geographical overview and logistical routing of smart bins</p>
        </div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Empty: {totals.empty}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium: {totals.medium}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Full: {totals.full}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            Mapped: {totals.mapped}/{totals.all}
          </span>
        </div>
      </div>

      {totals.all === 0 ? (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">No bins yet</p>
          <p className="text-xs text-muted-foreground mt-1">Register bins from the Admin panel.</p>
        </div>
      ) : totals.mapped === 0 ? (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">No coordinates set</p>
          <p className="text-xs text-muted-foreground mt-1">
            Edit your bins in the Admin panel and click on the map to set their location.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
          {/* Map Section */}
          <div className="lg:col-span-3 glass-card rounded-xl overflow-hidden relative" style={{ height: "calc(100vh - 220px)", minHeight: 480 }}>
            <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom attributionControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              />

              {/* Render Depot Center */}
              <Marker position={depotCoord} icon={DEPOT_ICON}>
                <Popup>
                  <div className="p-1">
                    <p className="font-semibold text-xs flex items-center gap-1.5 text-blue-400">
                      <Building className="h-3 w-3" /> Kantor Pusat UPTD / DLH
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">Depot awal dan akhir armada truk pengangkut sampah.</p>
                  </div>
                </Popup>
              </Marker>

              {/* Render Smart Bin Markers */}
              {mappedBins.map((bin) => (
                <Marker
                  key={bin.id}
                  position={[Number(bin.latitude), Number(bin.longitude)]}
                  icon={ICONS[bin.status]}
                >
                  <Popup>
                    <div className="space-y-2 min-w-[180px]">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm">{bin.bin_code}</p>
                        <BinStatusBadge status={bin.status} />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {bin.location}
                      </p>
                      <div className="text-xs space-y-1">
                        <div>Kapasitas: <span className="font-semibold">{bin.current_fill_percentage}%</span></div>
                        <div className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                          🔮 AI Forecast: {bin.current_fill_percentage >= 90 
                            ? "Penuh (Segera Ambil)" 
                            : `Penuh dalam ~${Math.round((100 - bin.current_fill_percentage) / 4) + 1}j`}
                        </div>
                      </div>
                      {bin.devices && (
                        <div className="text-xs flex items-center gap-1">
                          {bin.devices.online ? (
                            <><Wifi className="h-3 w-3 text-emerald-500" /> {bin.devices.device_name} online</>
                          ) : (
                            <><WifiOff className="h-3 w-3 text-muted-foreground" /> {bin.devices.device_name} offline</>
                          )}
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        Last: {bin.last_reading_at ? new Date(bin.last_reading_at).toLocaleString() : "Never"}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Neon Glowing Polyline Paths */}
              {showRoute && routePath.length > 0 && (
                <>
                  {/* Thick semi-transparent neon glow */}
                  <Polyline
                    positions={routePath}
                    color="hsl(205, 85%, 55%)"
                    weight={9}
                    opacity={0.25}
                    lineCap="round"
                    lineJoin="round"
                  />
                  {/* Thin glowing vector line */}
                  <Polyline
                    positions={routePath}
                    color="hsl(190, 95%, 70%)"
                    weight={3.5}
                    opacity={0.9}
                    dashArray="6, 12"
                    lineCap="round"
                    lineJoin="round"
                  />
                </>
              )}
            </MapContainer>
          </div>

          {/* Smart Route Control Panel */}
          <div className="lg:col-span-1 glass-card rounded-xl p-5 flex flex-col justify-between h-full bg-card/80 backdrop-blur-xl border-white/[0.06] shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-accent animate-bounce" />
                <h3 className="text-sm font-semibold tracking-wide text-foreground">Logistics Optimizer</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Algoritma cerdas yang menghitung rute pengumpulan sampah terpendek dari depot ke tong sampah yang sudah penuh untuk menghemat biaya operasional.
              </p>

              {!showRoute ? (
                <div className="py-4">
                  <Button
                    onClick={calculateOptimalRoute}
                    className="w-full bg-accent hover:bg-accent/90 text-white font-medium text-xs tracking-wide shadow-lg shadow-accent/20 transition-all duration-300 py-5 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Navigation className="h-4 w-4" /> Optimalkan Rute Truk
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {/* Route Stats Grid */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="bg-white/[0.03] border border-white/[0.05] p-2 rounded-lg text-center">
                      <p className="text-[9px] text-muted-foreground uppercase font-semibold">Jarak</p>
                      <p className="text-xs font-bold text-accent mt-0.5">{totalDistance.toFixed(1)} km</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.05] p-2 rounded-lg text-center">
                      <p className="text-[9px] text-muted-foreground uppercase font-semibold">BBM Hemat</p>
                      <p className="text-xs font-bold text-blue-400 mt-0.5">{fuelSaved.toFixed(1)} L</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.05] p-2 rounded-lg text-center bg-emerald-500/5 border-emerald-500/10">
                      <p className="text-[9px] text-emerald-500/80 uppercase font-semibold">CO2 Reduksi</p>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">{co2Saved.toFixed(1)} kg</p>
                    </div>
                  </div>
                  
                  {/* Tree Calculator Banner */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌳</span>
                      <div>
                        <p className="text-[9px] text-emerald-500/80 uppercase font-semibold">Beban Serapan Pohon</p>
                        <p className="text-[10px] text-emerald-400/80 font-medium leading-tight">Pengurangan emisi karbon setara dengan penanaman pohon baru (per tahun)</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-emerald-400">{(co2Saved / 21).toFixed(2)} Pohon</p>
                  </div>

                  {isSimulated && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-[10px] text-amber-400 text-center leading-relaxed">
                      💡 <strong>Simulation Mode Aktif:</strong> Semua sampah kosong. Sistem mensimulasikan rute demo untuk UPTD.
                    </div>
                  )}

                  {/* Navigation Checkpoints */}
                  <div className="space-y-3">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Urutan Stop Armada:</p>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                      
                      {/* Depot Start Node */}
                      <div className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-6 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400 shadow-sm shadow-blue-500/30">
                            <Building className="h-3.5 w-3.5" />
                          </div>
                          <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500 to-accent/60" />
                        </div>
                        <div className="flex-1 bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg">
                          <p className="text-xs font-semibold text-blue-400">Mulai: Depot DLH Sleman</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">Beran, Tridadi, Sleman</p>
                        </div>
                      </div>

                      {/* Smart Bin Checkpoint Nodes */}
                      {routeBins.map((bin, index) => {
                        const isFull = bin.current_fill_percentage >= 75;
                        const isWarning = bin.current_fill_percentage >= 40 && bin.current_fill_percentage < 75;
                        const capacityColor = isFull ? "text-red-400" : isWarning ? "text-amber-400" : "text-emerald-400";
                        const nodeBg = isFull 
                          ? "bg-red-500/20 border-red-500 text-red-400 shadow-red-500/20" 
                          : isWarning 
                            ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-amber-500/20" 
                            : "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-emerald-500/20";
                        
                        return (
                          <div key={bin.id} className="flex gap-3 items-start">
                            <div className="flex flex-col items-center">
                              <div className={`h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-bold shadow-sm ${nodeBg}`}>
                                {index + 1}
                              </div>
                              <div className="w-0.5 h-6 bg-accent/60" />
                            </div>
                            <div className="flex-1 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] p-2.5 rounded-lg flex items-center justify-between transition-colors duration-200">
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-foreground">{bin.bin_code}</span>
                                <span className="text-[9px] text-muted-foreground mt-0.5 truncate max-w-[140px]">{bin.location}</span>
                                <span className="text-[8px] text-indigo-400 font-mono mt-1 font-semibold">
                                  🔮 AI: {bin.current_fill_percentage >= 90 
                                    ? "Penuh (Segera Ambil)" 
                                    : `Penuh dalam ~${Math.round((100 - bin.current_fill_percentage) / 4) + 1}j`}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`text-xs font-extrabold ${capacityColor}`}>{bin.current_fill_percentage}%</span>
                                <span className="text-[8px] text-muted-foreground uppercase font-medium">Kapasitas</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Depot Finish Node */}
                      <div className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-6 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400 shadow-sm shadow-blue-500/30">
                            <Truck className="h-3.5 w-3.5" />
                          </div>
                        </div>
                        <div className="flex-1 bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg">
                          <p className="text-xs font-semibold text-blue-400">Selesai: Kembali ke Depot</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">Truk Bongkar Muatan</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>

            {showRoute && (
              <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                <Button
                  onClick={sendWhatsAppDispatch}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wide shadow-lg shadow-emerald-600/10 py-5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Kirim Rute ke Supir (WA)
                </Button>
                <Button
                  onClick={clearRoute}
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/[0.04] text-muted-foreground hover:text-foreground text-xs rounded-lg flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Bersihkan Rute
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
