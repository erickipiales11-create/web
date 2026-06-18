-- ============================================
-- CREAR TABLA FARMACIAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.farmacias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nombre_farmacia VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE,
    sitio_web VARCHAR(255),
    numero_licencia VARCHAR(100) NOT NULL UNIQUE,
    horario TEXT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    activo BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREAR ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_farmacias_usuario_id ON public.farmacias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_farmacias_ciudad ON public.farmacias(ciudad);
CREATE INDEX IF NOT EXISTS idx_farmacias_licencia ON public.farmacias(numero_licencia);
CREATE INDEX IF NOT EXISTS idx_farmacias_activo ON public.farmacias(activo);
CREATE INDEX IF NOT EXISTS idx_farmacias_nombre ON public.farmacias(nombre_farmacia);

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE public.farmacias IS 'Tabla que almacena la información de las farmacias registradas';
COMMENT ON COLUMN public.farmacias.nombre_farmacia IS 'Nombre comercial de la farmacia';
COMMENT ON COLUMN public.farmacias.numero_licencia IS 'Número de licencia sanitaria o permiso de funcionamiento';
COMMENT ON COLUMN public.farmacias.activo IS 'Indica si la farmacia está activa (true) o desactivada (false)';
COMMENT ON COLUMN public.farmacias.latitud IS 'Latitud para ubicación en mapa';
COMMENT ON COLUMN public.farmacias.longitud IS 'Longitud para ubicación en mapa';