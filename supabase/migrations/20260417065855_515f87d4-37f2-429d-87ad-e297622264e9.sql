-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'operator', 'viewer');
CREATE TYPE public.bin_status AS ENUM ('empty', 'medium', 'full');
CREATE TYPE public.alert_type AS ENUM ('critical', 'warning', 'offline', 'info');

-- =========================================
-- UTILITY: updated_at trigger function
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- USER_ROLES (separate table, never on profiles!)
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper to get current user's highest role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY CASE role
    WHEN 'admin' THEN 1
    WHEN 'operator' THEN 2
    WHEN 'viewer' THEN 3
  END
  LIMIT 1
$$;

-- =========================================
-- DEVICES (ESP32 nodes)
-- =========================================
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  esp_id TEXT NOT NULL UNIQUE,
  device_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  firmware_version TEXT,
  online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_devices_esp_id ON public.devices(esp_id);

CREATE TRIGGER trg_devices_updated_at
BEFORE UPDATE ON public.devices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- BINS (Smart bins)
-- =========================================
CREATE TABLE public.bins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bin_code TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  height_cm INTEGER NOT NULL DEFAULT 30 CHECK (height_cm > 0),
  threshold_warning INTEGER NOT NULL DEFAULT 70 CHECK (threshold_warning BETWEEN 0 AND 100),
  threshold_full INTEGER NOT NULL DEFAULT 90 CHECK (threshold_full BETWEEN 0 AND 100),
  current_distance_cm NUMERIC(6,2),
  current_fill_percentage INTEGER DEFAULT 0 CHECK (current_fill_percentage BETWEEN 0 AND 100),
  status bin_status NOT NULL DEFAULT 'empty',
  last_reading_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bins ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_bins_device_id ON public.bins(device_id);
CREATE INDEX idx_bins_status ON public.bins(status);

CREATE TRIGGER trg_bins_updated_at
BEFORE UPDATE ON public.bins
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- SENSOR_READINGS (historical sensor data)
-- =========================================
CREATE TABLE public.sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bin_id UUID NOT NULL REFERENCES public.bins(id) ON DELETE CASCADE,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  distance_cm NUMERIC(6,2) NOT NULL,
  fill_percentage INTEGER NOT NULL CHECK (fill_percentage BETWEEN 0 AND 100),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_sensor_readings_bin_recorded ON public.sensor_readings(bin_id, recorded_at DESC);

-- =========================================
-- ALERTS
-- =========================================
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bin_id UUID REFERENCES public.bins(id) ON DELETE CASCADE,
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  type alert_type NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  read_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_alerts_read_created ON public.alerts(read, created_at DESC);

-- =========================================
-- RLS POLICIES
-- =========================================

-- Profiles: users see/update their own; admins see all
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- user_roles: users view own; admins manage all
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Devices: all authenticated users can view; only admin can modify
CREATE POLICY "Authenticated view devices" ON public.devices
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage devices" ON public.devices
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bins: all authenticated can view; admin can manage
CREATE POLICY "Authenticated view bins" ON public.bins
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage bins" ON public.bins
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Sensor readings: all authenticated can view
CREATE POLICY "Authenticated view sensor readings" ON public.sensor_readings
  FOR SELECT TO authenticated USING (true);

-- Alerts: all authenticated can view; admin/operator can update (mark read)
CREATE POLICY "Authenticated view alerts" ON public.alerts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin/operator update alerts" ON public.alerts
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operator'));

CREATE POLICY "Admins delete alerts" ON public.alerts
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- First user becomes admin, others viewer
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
  assigned_role app_role;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );

  -- Determine role: first user = admin, others = viewer
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'viewer';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- AUTO-UPDATE BIN STATUS & GENERATE ALERTS
-- =========================================
CREATE OR REPLACE FUNCTION public.update_bin_from_reading()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bin RECORD;
  v_new_status bin_status;
  v_existing_alert UUID;
BEGIN
  SELECT * INTO v_bin FROM public.bins WHERE id = NEW.bin_id;

  -- Determine new status
  IF NEW.fill_percentage >= v_bin.threshold_full THEN
    v_new_status := 'full';
  ELSIF NEW.fill_percentage >= v_bin.threshold_warning THEN
    v_new_status := 'medium';
  ELSE
    v_new_status := 'empty';
  END IF;

  -- Update bin
  UPDATE public.bins SET
    current_distance_cm = NEW.distance_cm,
    current_fill_percentage = NEW.fill_percentage,
    status = v_new_status,
    last_reading_at = NEW.recorded_at
  WHERE id = NEW.bin_id;

  -- Generate alert when bin becomes full (and no recent unread alert)
  IF v_new_status = 'full' AND v_bin.status <> 'full' THEN
    SELECT id INTO v_existing_alert FROM public.alerts
    WHERE bin_id = NEW.bin_id AND type = 'critical' AND read = false
    LIMIT 1;

    IF v_existing_alert IS NULL THEN
      INSERT INTO public.alerts (bin_id, device_id, type, message)
      VALUES (
        NEW.bin_id,
        NEW.device_id,
        'critical',
        format('%s is full (%s%%) — Collection needed', v_bin.bin_code, NEW.fill_percentage)
      );
    END IF;
  ELSIF v_new_status = 'medium' AND v_bin.status = 'empty' THEN
    INSERT INTO public.alerts (bin_id, device_id, type, message)
    VALUES (
      NEW.bin_id,
      NEW.device_id,
      'warning',
      format('%s reaching %s%% capacity', v_bin.bin_code, NEW.fill_percentage)
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sensor_reading_updates_bin
AFTER INSERT ON public.sensor_readings
FOR EACH ROW EXECUTE FUNCTION public.update_bin_from_reading();

-- =========================================
-- ENABLE REALTIME for live dashboard
-- =========================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.bins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;

ALTER TABLE public.bins REPLICA IDENTITY FULL;
ALTER TABLE public.alerts REPLICA IDENTITY FULL;
ALTER TABLE public.devices REPLICA IDENTITY FULL;