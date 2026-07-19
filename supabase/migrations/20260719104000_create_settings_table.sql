-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id integer PRIMARY KEY DEFAULT 1,
    company_name text,
    company_logo text,
    primary_phone text,
    whatsapp_number text,
    email text,
    address text,
    working_hours text,
    google_maps_link text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_by uuid REFERENCES auth.users(id),
    
    -- Ensure only one row can exist
    CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policies for settings
CREATE POLICY "Allow public read access on settings"
    ON public.settings FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to update settings"
    ON public.settings FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert settings"
    ON public.settings FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Insert default row if it doesn't exist
INSERT INTO public.settings (
    id, 
    company_name, 
    primary_phone,
    whatsapp_number, 
    email, 
    address, 
    working_hours
) VALUES (
    1,
    'Leesa Power Systems',
    '7702778412',
    '8121515858',
    'contact@leesapower.com',
    '#3-2-840, Station Road, Kachiguda, Hyderabad, Telangana 500027',
    'Mon - Sat: 10:00 AM - 8:30 PM | Sun: Closed'
) ON CONFLICT (id) DO UPDATE SET
    primary_phone = EXCLUDED.primary_phone,
    whatsapp_number = EXCLUDED.whatsapp_number;
