import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useBins, type BinRow } from "@/hooks/useBins";
import { Loader2, MapPin, Wifi, WifiOff, Building } from "lucide-react";
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
          <h1 className="text-2xl font-bold tracking-tight">Peta Lokasi <span className="text-gradient">Utama</span></h1>
          <p className="text-sm text-muted-foreground">Gambaran geografis dan rute logistik tempat sampah</p>
        </div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Kosong: {totals.empty}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Sedang: {totals.medium}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Penuh: {totals.full}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            Terpetakan: {totals.mapped}/{totals.all}
          </span>
        </div>
      </div>

      {totals.all === 0 ? (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">Belum ada tempat sampah</p>
          <p className="text-xs text-muted-foreground mt-1">Daftarkan tempat sampah dari panel Admin.</p>
        </div>
      ) : totals.mapped === 0 ? (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">Belum ada koordinat yang diatur</p>
          <p className="text-xs text-muted-foreground mt-1">
            Edit tempat sampah di panel Admin dan klik pada peta untuk mengatur lokasi.
          </p>
        </div>
      ) : (
          <div className="glass-card rounded-xl overflow-hidden relative" style={{ height: "calc(100vh - 220px)", minHeight: 480 }}>
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
                        Terakhir: {bin.last_reading_at ? new Date(bin.last_reading_at).toLocaleString() : "Belum pernah"}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
      )}
    </div>
  );
}
