CREATE TABLE IF NOT EXISTS public.pharmacies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    pharmacy_name VARCHAR(255) NOT NULL,
    pharmacy_address TEXT,
    pharmacy_phone VARCHAR(50),
    pharmacy_license_number VARCHAR(100) NOT NULL UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pharmacies_user_id ON public.pharmacies(user_id);