-- Insert dummy devices
INSERT INTO public.devices (id, esp_id, device_name, online)
VALUES 
  ('d0000000-0000-0000-0000-000000000001', 'dummy_esp_1', 'Virtual Device - Pasar Barat', true),
  ('d0000000-0000-0000-0000-000000000002', 'dummy_esp_2', 'Virtual Device - Alun-Alun', true)
ON CONFLICT (esp_id) DO NOTHING;

-- Insert dummy bins
INSERT INTO public.bins (id, bin_code, location, device_id, height_cm, threshold_warning, threshold_full)
VALUES 
  ('b0000000-0000-0000-0000-000000000001', 'BIN-V1-PSRB', 'Pasar Barat (Virtual)', 'd0000000-0000-0000-0000-000000000001', 50, 60, 90),
  ('b0000000-0000-0000-0000-000000000002', 'BIN-V2-ALUN', 'Alun-Alun (Virtual)', 'd0000000-0000-0000-0000-000000000002', 40, 70, 90)
ON CONFLICT (bin_code) DO NOTHING;

-- Insert some dummy sensor readings to trigger bin updates
INSERT INTO public.sensor_readings (bin_id, device_id, distance_cm, fill_percentage, recorded_at)
VALUES 
  ('b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 30, 40, now() - interval '2 hours'),
  ('b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 20, 60, now() - interval '1 hour'),
  ('b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 15, 70, now()),
  
  ('b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 35, 12, now() - interval '2 hours'),
  ('b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 30, 25, now());
