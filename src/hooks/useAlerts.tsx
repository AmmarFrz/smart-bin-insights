import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AlertRow {
  id: string;
  bin_id: string | null;
  device_id: string | null;
  type: "critical" | "warning" | "offline" | "info";
  message: string;
  read: boolean;
  read_at: string | null;
  read_by: string | null;
  created_at: string;
}

const playCriticalBeep = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio beep failed", e);
  }
};

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (!error && data) setAlerts(data as AlertRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
    const channel = supabase
      .channel(`alerts-realtime-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) => {
        const a = payload.new as AlertRow;
        if (a.type === "critical") {
          toast.error(a.message);
          playCriticalBeep();
        } else if (a.type === "warning") {
          toast.warning(a.message);
        } else {
          toast.info(a.message);
        }
        fetchAlerts();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "alerts" }, fetchAlerts)
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "alerts" }, fetchAlerts)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAlerts]);

  const markRead = async (id: string) => {
    await supabase.from("alerts").update({ read: true, read_at: new Date().toISOString() }).eq("id", id);
  };

  const markAllRead = async () => {
    await supabase.from("alerts").update({ read: true, read_at: new Date().toISOString() }).eq("read", false);
  };

  return { alerts, loading, refetch: fetchAlerts, markRead, markAllRead, unreadCount: alerts.filter(a => !a.read).length };
}
