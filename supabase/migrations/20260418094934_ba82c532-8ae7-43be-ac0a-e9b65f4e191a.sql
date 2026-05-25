ALTER TABLE public.bins
ADD COLUMN latitude NUMERIC(10, 7),
ADD COLUMN longitude NUMERIC(10, 7);

CREATE INDEX idx_bins_coordinates ON public.bins(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;