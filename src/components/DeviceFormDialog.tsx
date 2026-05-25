import { useState, useEffect } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { DeviceRow } from "@/hooks/useDevices";

const schema = z.object({
  esp_id: z.string().trim().min(2).max(60),
  device_name: z.string().trim().min(2).max(80),
  firmware_version: z.string().max(40).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: DeviceRow | null;
  onSaved: () => void;
}

export function DeviceFormDialog({ open, onOpenChange, device, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ esp_id: "", device_name: "", firmware_version: "", notes: "" });

  useEffect(() => {
    if (device) {
      setForm({
        esp_id: device.esp_id, device_name: device.device_name,
        firmware_version: device.firmware_version ?? "", notes: device.notes ?? "",
      });
    } else {
      setForm({ esp_id: "", device_name: "", firmware_version: "", notes: "" });
    }
  }, [device, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      ...form,
      firmware_version: form.firmware_version || null,
      notes: form.notes || null,
    });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }

    setLoading(true);
    const d = parsed.data;
    const payload = {
      esp_id: d.esp_id,
      device_name: d.device_name,
      firmware_version: d.firmware_version ?? null,
      notes: d.notes ?? null,
    };
    const { error } = device
      ? await supabase.from("devices").update(payload).eq("id", device.id)
      : await supabase.from("devices").insert(payload);
    setLoading(false);

    if (error) { toast.error(error.message); return; }
    toast.success(device ? "Device updated" : "Device created");
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{device ? "Edit Device" : "Register New Device"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>ESP ID</Label>
            <Input value={form.esp_id} onChange={(e) => setForm({ ...form, esp_id: e.target.value })} placeholder="ESP-A1-3F2C" required />
          </div>
          <div className="space-y-2">
            <Label>Device Name</Label>
            <Input value={form.device_name} onChange={(e) => setForm({ ...form, device_name: e.target.value })} placeholder="ESP32-Node-A1" required />
          </div>
          <div className="space-y-2">
            <Label>Firmware Version</Label>
            <Input value={form.firmware_version} onChange={(e) => setForm({ ...form, firmware_version: e.target.value })} placeholder="v1.0.0" />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (device ? "Update" : "Register")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
