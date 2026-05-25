import { useState } from "react";
import { useBins, BinRow } from "@/hooks/useBins";
import { useDevices, DeviceRow } from "@/hooks/useDevices";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BinFormDialog } from "@/components/BinFormDialog";
import { DeviceFormDialog } from "@/components/DeviceFormDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Cpu, Plus, Pencil, Trash, KeyRound, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminPage() {
  const { bins, refetch: refetchBins } = useBins();
  const { devices, refetch: refetchDevices } = useDevices();

  const [binDialog, setBinDialog] = useState<{ open: boolean; bin: BinRow | null }>({ open: false, bin: null });
  const [deviceDialog, setDeviceDialog] = useState<{ open: boolean; device: DeviceRow | null }>({ open: false, device: null });
  const [confirmDelete, setConfirmDelete] = useState<{ kind: "bin" | "device"; id: string; name: string } | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const table = confirmDelete.kind === "bin" ? "bins" : "devices";
    const { error } = await supabase.from(table).delete().eq("id", confirmDelete.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${confirmDelete.kind === "bin" ? "Bin" : "Device"} deleted`);
      if (confirmDelete.kind === "bin") {
        refetchBins();
      } else {
        refetchDevices();
      }
    }
    setConfirmDelete(null);
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    toast.success("API key copied");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage devices, bins, and system settings</p>
      </div>

      {/* Devices */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Cpu className="h-4 w-4 text-accent" /> IoT Devices ({devices.length})
          </h3>
          <Button size="sm" onClick={() => setDeviceDialog({ open: true, device: null })} className="gap-2">
            <Plus className="h-4 w-4" /> Add Device
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground">ESP ID</th>
                <th className="pb-3 font-medium text-muted-foreground">Name</th>
                <th className="pb-3 font-medium text-muted-foreground">API Key</th>
                <th className="pb-3 font-medium text-muted-foreground">Status</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(d => (
                <tr key={d.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">{d.esp_id}</td>
                  <td className="py-3">{d.device_name}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] font-mono bg-muted px-2 py-1 rounded">
                        {revealedKey === d.id ? d.api_key : "•".repeat(20)}
                      </code>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setRevealedKey(revealedKey === d.id ? null : d.id)}>
                        <KeyRound className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyKey(d.api_key, d.id)}>
                        {copied === d.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant="outline" className={d.online ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-muted-foreground"}>
                      {d.online ? "Online" : "Offline"}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeviceDialog({ open: true, device: d })}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setConfirmDelete({ kind: "device", id: d.id, name: d.device_name })}>
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {devices.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No devices yet. Click "Add Device" to register an ESP32.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bins */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-primary" /> Smart Bins ({bins.length})
          </h3>
          <Button size="sm" onClick={() => setBinDialog({ open: true, bin: null })} className="gap-2">
            <Plus className="h-4 w-4" /> Add Bin
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground">Code</th>
                <th className="pb-3 font-medium text-muted-foreground">Location</th>
                <th className="pb-3 font-medium text-muted-foreground">Device</th>
                <th className="pb-3 font-medium text-muted-foreground">Fill</th>
                <th className="pb-3 font-medium text-muted-foreground">Thresholds</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bins.map(bin => (
                <tr key={bin.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">{bin.bin_code}</td>
                  <td className="py-3 text-xs">{bin.location}</td>
                  <td className="py-3 text-xs">{bin.devices?.device_name ?? <span className="text-muted-foreground">—</span>}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${bin.current_fill_percentage >= bin.threshold_full ? "bg-red-500" : bin.current_fill_percentage >= bin.threshold_warning ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${bin.current_fill_percentage}%` }} />
                      </div>
                      <span className="text-xs">{bin.current_fill_percentage}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">{bin.threshold_warning}/{bin.threshold_full}%</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setBinDialog({ open: true, bin })}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setConfirmDelete({ kind: "bin", id: bin.id, name: bin.bin_code })}>
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {bins.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-sm text-muted-foreground">No bins yet. Add one to start monitoring.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ESP32 ingest snippet */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">ESP32 Integration</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Send sensor readings from your ESP32 to this endpoint. Include the device's API key in the <code>x-api-key</code> header.
        </p>
        <code className="block text-[11px] font-mono bg-muted p-3 rounded overflow-x-auto whitespace-pre">
{`POST ${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ingest-reading
Headers:
  Content-Type: application/json
  x-api-key: <device-api-key>
Body:
  { "bin_code": "BIN-001", "distance_cm": 12.5 }`}
        </code>
      </div>

      <BinFormDialog
        open={binDialog.open}
        onOpenChange={(open) => setBinDialog({ open, bin: open ? binDialog.bin : null })}
        bin={binDialog.bin}
        devices={devices}
        onSaved={refetchBins}
      />
      <DeviceFormDialog
        open={deviceDialog.open}
        onOpenChange={(open) => setDeviceDialog({ open, device: open ? deviceDialog.device : null })}
        device={deviceDialog.device}
        onSaved={refetchDevices}
      />
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {confirmDelete?.kind}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{confirmDelete?.name}</strong> and any associated data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
