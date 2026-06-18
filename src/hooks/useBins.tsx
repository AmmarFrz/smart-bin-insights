import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type BinStatus = "empty" | "medium" | "full";

export interface BinRow {
  id: string;
  bin_code: string;
  location: string;
  device_id: string | null;
  height_cm: number;
  threshold_warning: number;
  threshold_full: number;
  current_distance_cm: number | null;
  current_fill_percentage: number;
  status: BinStatus;
  last_reading_at: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  is_maintenance: boolean;
  devices?: { device_name: string; esp_id: string; online: boolean } | null;
  previous_fill_percentage?: number | null;
  previous_reading_at?: string | null;
}

export function useBins() {
  const [bins, setBins] = useState<BinRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBins = useCallback(async () => {
    const { data, error } = await supabase
      .from("bins")
      .select("*, devices(device_name, esp_id, online)")
      .order("bin_code", { ascending: true });
      
    if (!error && data) {
      setBins(prevBins => {
        return (data as unknown as BinRow[]).map(newBin => {
          const oldBin = prevBins.find(b => b.id === newBin.id);
          return {
            ...newBin,
            previous_fill_percentage: oldBin ? oldBin.current_fill_percentage : null,
            previous_reading_at: oldBin ? oldBin.last_reading_at : null
          };
        });
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBins();
    const channel = supabase
      .channel(`bins-realtime-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "bins" }, fetchBins)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchBins]);

  return { bins, loading, refetch: fetchBins };
}
