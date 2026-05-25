import { useBins } from "@/hooks/useBins";
import { BinStatusBadge } from "@/components/BinStatusBadge";
import { FillGauge } from "@/components/FillGauge";
import { LcdDisplay } from "@/components/LcdDisplay";
import { LedIndicator } from "@/components/LedIndicator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Ruler, Wifi, WifiOff, Loader2, Trash2 } from "lucide-react";
import { getFillPrediction } from "@/lib/utils";

export default function BinsPage() {
  const { bins, loading } = useBins();

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Smart Bin Monitoring</h1>
        <p className="text-sm text-muted-foreground">Real-time ultrasonic sensor readings from all bins</p>
      </div>

      {bins.length === 0 ? (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center text-center">
          <Trash2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">No bins yet</p>
          <p className="text-xs text-muted-foreground mt-1">Admins can register bins from the Admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bins.map(bin => {
            const online = bin.devices?.online ?? false;
            const distance = bin.current_distance_cm ?? 0;
            const fill = bin.current_fill_percentage;
            return (
              <div key={bin.id} className="glass-card rounded-xl p-5 space-y-4 transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{bin.bin_code}</p>
                    <p className="text-xs text-muted-foreground">{bin.devices?.device_name ?? "No device linked"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BinStatusBadge status={bin.status} />
                    {online ? (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 gap-1">
                        <Wifi className="h-3 w-3" /> Online
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground border-border gap-1">
                        <WifiOff className="h-3 w-3" /> Offline
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {bin.location}
                </div>

                <FillGauge percentage={fill} />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Ruler className="h-3 w-3" /> {distance} cm</span>
                    <span>Updated: {bin.last_reading_at ? new Date(bin.last_reading_at).toLocaleString() : "Never"}</span>
                  </div>
                  <div className="text-xs font-medium text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-md inline-flex w-fit">
                    {getFillPrediction(fill)}
                  </div>
                </div>

                <LcdDisplay lines={[`Fill: ${fill}%  ${distance}cm`, `Status: ${bin.status.toUpperCase()}`]} />

                <div className="flex gap-4">
                  <LedIndicator color="green" active={bin.status === "empty"} label="Empty" />
                  <LedIndicator color="yellow" active={bin.status === "medium"} label="Medium" />
                  <LedIndicator color="red" active={bin.status === "full"} label="Full" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
