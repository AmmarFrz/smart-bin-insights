import { useDevices } from "@/hooks/useDevices";
import { LcdDisplay } from "@/components/LcdDisplay";
import { Badge } from "@/components/ui/badge";
import { Cpu, Wifi, WifiOff, Signal, Clock, Loader2, Server } from "lucide-react";

export default function DevicesPage() {
  const { devices, loading } = useDevices();

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const fmtUptime = (lastSeen: string | null) => {
    if (!lastSeen) return "Never";
    const diff = Date.now() - new Date(lastSeen).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">IoT Device Monitoring</h1>
        <p className="text-sm text-muted-foreground">ESP32 microcontroller status and sensor data</p>
      </div>

      {devices.length === 0 ? (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center text-center">
          <Server className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">No devices registered</p>
          <p className="text-xs text-muted-foreground mt-1">Admins can register ESP32 nodes from the Admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map(device => (
            <div key={device.id} className="glass-card rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Cpu className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{device.device_name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{device.esp_id}</p>
                  </div>
                </div>
                {device.online ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                    <Wifi className="h-3 w-3" /> Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground gap-1">
                    <WifiOff className="h-3 w-3" /> Disconnected
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted p-3">
                  <Signal className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Firmware</p>
                  <p className="text-sm font-semibold">{device.firmware_version ?? "—"}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Last seen</p>
                  <p className="text-sm font-semibold">{fmtUptime(device.last_seen)}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <Server className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold">{device.online ? "Live" : "Idle"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">LCD Output Preview</p>
                <LcdDisplay lines={[`${device.device_name}`, device.online ? `Status: CONNECTED` : `Status: OFFLINE`]} />
              </div>

              {device.notes && <p className="text-xs text-muted-foreground">{device.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
