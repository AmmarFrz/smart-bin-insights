import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subHours } from "date-fns";

export interface HourlyFill {
  time: string;
  avg: number;
}

export function useSensorHistory() {
  const [historyData, setHistoryData] = useState<HourlyFill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    // Fetch from last 12 hours
    const twelveHoursAgo = subHours(new Date(), 11).toISOString();
    
    const { data, error } = await supabase
      .from("sensor_readings")
      .select("fill_percentage, recorded_at")
      .gte("recorded_at", twelveHoursAgo)
      .order("recorded_at", { ascending: true });

    if (!error) {
      // Group by hour
      const grouped: Record<string, number[]> = {};
      
      // Initialize the last 12 hours with empty arrays to ensure the graph axis has all 12 hours
      for(let i = 11; i >= 0; i--) {
         const h = subHours(new Date(), i);
         const key = format(h, "HH:00");
         grouped[key] = [];
      }

      if (data) {
        data.forEach((reading) => {
          const date = new Date(reading.recorded_at);
          const key = format(date, "HH:00");
          if(grouped[key] !== undefined) {
            grouped[key].push(reading.fill_percentage);
          } else {
             grouped[key] = [reading.fill_percentage];
          }
        });
      }

      let lastVal = 0;
      const formattedData: HourlyFill[] = Object.keys(grouped).sort().map(key => {
        const values = grouped[key];
        let avg = 0;
        
        if (values.length > 0) {
          avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
          lastVal = avg;
        } else {
          // Keep previous hour's value if no new data, so graph doesn't drop to 0
          avg = lastVal;
        }
        
        return {
          time: key,
          avg
        };
      });

      setHistoryData(formattedData);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHistory();
    // Subscribe to new readings to update graph in real-time
    const channel = supabase
      .channel("sensor_readings_dashboard_history")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "sensor_readings" }, fetchHistory)
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [fetchHistory]);

  return { historyData, loading };
}
