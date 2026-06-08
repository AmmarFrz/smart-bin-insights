import { useState, useEffect } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, MapPin, Search } from "lucide-react";
import { MapPicker } from "@/components/MapPicker";
import type { BinRow } from "@/hooks/useBins";
import type { DeviceRow } from "@/hooks/useDevices";

const schema = z.object({
  bin_code: z.string().trim().min(2, "Bin code minimal 2 karakter").max(40),
  location: z.string().trim().min(2, "Lokasi minimal 2 karakter").max(120),
  height_cm: z.coerce.number().int().min(5, "Tinggi minimal 5 cm").max(500),
  threshold_warning: z.coerce.number().int().min(0).max(100),
  threshold_full: z.coerce.number().int().min(0).max(100),
  device_id: z.string().nullable(),
  is_maintenance: z.boolean().default(false),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
}).refine((d) => d.threshold_warning < d.threshold_full, {
  message: "Warning % harus lebih kecil dari Full %",
  path: ["threshold_warning"],
}).refine((d) => (d.latitude === null) === (d.longitude === null), {
  message: "Latitude dan longitude harus diisi keduanya atau dikosongkan keduanya",
  path: ["latitude"],
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bin?: BinRow | null;
  devices: DeviceRow[];
  onSaved: () => void;
}

export function BinFormDialog({ open, onOpenChange, bin, devices, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [form, setForm] = useState({
    bin_code: "", location: "", height_cm: 30,
    threshold_warning: 70, threshold_full: 90, device_id: "none" as string,
    is_maintenance: false,
    latitude: null as number | null, longitude: null as number | null,
  });

  useEffect(() => {
    if (bin) {
      setForm({
        bin_code: bin.bin_code, location: bin.location,
        height_cm: bin.height_cm, threshold_warning: bin.threshold_warning,
        threshold_full: bin.threshold_full, device_id: bin.device_id ?? "none",
        is_maintenance: bin.is_maintenance ?? false,
        latitude: bin.latitude !== null ? Number(bin.latitude) : null,
        longitude: bin.longitude !== null ? Number(bin.longitude) : null,
      });
    } else {
      setForm({
        bin_code: "", location: "", height_cm: 30, threshold_warning: 70, threshold_full: 90,
        device_id: "none", is_maintenance: false, latitude: null, longitude: null,
      });
    }
  }, [bin, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      ...form,
      device_id: form.device_id === "none" ? null : form.device_id,
    });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }

    setLoading(true);
    const d = parsed.data;
    const payload = {
      bin_code: d.bin_code,
      location: d.location,
      height_cm: d.height_cm,
      threshold_warning: d.threshold_warning,
      threshold_full: d.threshold_full,
      device_id: d.device_id,
      is_maintenance: d.is_maintenance,
      latitude: d.latitude,
      longitude: d.longitude,
    };
    const { error } = bin
      ? await supabase.from("bins").update(payload).eq("id", bin.id)
      : await supabase.from("bins").insert(payload);
    setLoading(false);

    if (error) { toast.error(error.message); return; }
    toast.success(bin ? "Bin updated" : "Bin created");
    onSaved();
    onOpenChange(false);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
      () => toast.error("Could not get your location")
    );
  };

  const searchLocation = async () => {
    if (!form.location) {
      toast.error("Silakan masukkan deskripsi lokasi terlebih dahulu");
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.location)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setForm(f => ({ ...f, latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) }));
        toast.success("Lokasi otomatis ditemukan di peta!");
      } else {
        toast.error("Lokasi tidak ditemukan di peta");
      }
    } catch (e) {
      toast.error("Gagal mencari koordinat lokasi");
    } finally {
      setSearching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bin ? "Edit Bin" : "Add New Bin"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Bin Code</Label>
              <Input value={form.bin_code} onChange={(e) => setForm({ ...form, bin_code: e.target.value })} placeholder="BIN-001" required />
            </div>
            <div className="space-y-2">
              <Label>Linked Device</Label>
              <Select value={form.device_id} onValueChange={(v) => setForm({ ...form, device_id: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— No device —</SelectItem>
                  {devices.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.device_name} ({d.esp_id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location (description)</Label>
            <div className="flex gap-2">
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Alun Alun Kidul" required />
              <Button type="button" variant="secondary" onClick={searchLocation} disabled={searching} className="shrink-0 gap-2">
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Cari di Peta
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Map Location</Label>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={useMyLocation}>
                  Use my location
                </Button>
                {form.latitude !== null && (
                  <Button type="button" size="sm" variant="ghost" onClick={() => setForm({ ...form, latitude: null, longitude: null })}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Click on the map to set the bin's exact coordinates.</p>
            <MapPicker
              latitude={form.latitude}
              longitude={form.longitude}
              onChange={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
              height="280px"
            />
            {form.latitude !== null && form.longitude !== null && (
              <p className="text-xs text-muted-foreground font-mono">
                {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input type="number" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Warning %</Label>
              <Input type="number" value={form.threshold_warning} onChange={(e) => setForm({ ...form, threshold_warning: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Full %</Label>
              <Input type="number" value={form.threshold_full} onChange={(e) => setForm({ ...form, threshold_full: Number(e.target.value) })} />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Switch
              id="maintenance-mode"
              checked={form.is_maintenance}
              onCheckedChange={(c) => setForm({ ...form, is_maintenance: c })}
            />
            <Label htmlFor="maintenance-mode" className="flex flex-col gap-1 cursor-pointer">
              <span>Maintenance Mode</span>
              <span className="font-normal text-xs text-muted-foreground">Temporarily disable warnings for this bin while it's being repaired.</span>
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (bin ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
