import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DeviceRow {
  id: string;
  esp_id: string;
  device_name: string;
  api_key: string;
  firmware_version: string | null;
  online: boolean;
  last_seen: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useDevices() {
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = useCallback(async () => {
    const { data, error } = await supabase.from("devices").select("*").order("device_name");
    if (!error && data) setDevices(data as DeviceRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDevices();
    const channel = supabase
      .channel(`devices-realtime-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "devices" }, fetchDevices)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchDevices]);

  return { devices, loading, refetch: fetchDevices };
}
