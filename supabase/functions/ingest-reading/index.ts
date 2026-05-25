// Edge function: ingest-reading
// ESP32 → POST sensor readings. Authenticated by device api_key.
// Public endpoint (verify_jwt = false) but requires x-api-key header.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface IngestPayload {
  bin_code?: string;
  distance_cm?: number;
  fill_percentage?: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey.length < 10) {
    return new Response(JSON.stringify({ error: "Missing or invalid x-api-key header" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: IngestPayload;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!body.bin_code || typeof body.bin_code !== "string") {
    return new Response(JSON.stringify({ error: "bin_code is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (typeof body.distance_cm !== "number" || body.distance_cm < 0 || body.distance_cm > 1000) {
    return new Response(JSON.stringify({ error: "distance_cm must be a number between 0 and 1000" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Look up device by API key
  const { data: device, error: deviceErr } = await supabase
    .from("devices")
    .select("id")
    .eq("api_key", apiKey)
    .maybeSingle();

  if (deviceErr || !device) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Look up bin by code
  const { data: bin, error: binErr } = await supabase
    .from("bins")
    .select("id, height_cm")
    .eq("bin_code", body.bin_code)
    .maybeSingle();

  if (binErr || !bin) {
    return new Response(JSON.stringify({ error: `Bin '${body.bin_code}' not found` }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Calculate fill percentage from distance
  const fillPct = typeof body.fill_percentage === "number"
    ? Math.max(0, Math.min(100, Math.round(body.fill_percentage)))
    : Math.max(0, Math.min(100, Math.round(((bin.height_cm - body.distance_cm) / bin.height_cm) * 100)));

  // Insert sensor reading (trigger will update bin status & generate alerts)
  const { error: insertErr } = await supabase.from("sensor_readings").insert({
    bin_id: bin.id,
    device_id: device.id,
    distance_cm: body.distance_cm,
    fill_percentage: fillPct,
  });

  if (insertErr) {
    return new Response(JSON.stringify({ error: insertErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Mark device online & update last_seen
  await supabase
    .from("devices")
    .update({ online: true, last_seen: new Date().toISOString() })
    .eq("id", device.id);

  return new Response(JSON.stringify({
    success: true,
    bin_code: body.bin_code,
    distance_cm: body.distance_cm,
    fill_percentage: fillPct,
  }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
