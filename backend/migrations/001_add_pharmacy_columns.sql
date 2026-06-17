-- ============================================
-- CREAR TABLA USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'usuario',
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREAR ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON public.usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON public.usuarios(activo);

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE public.usuarios IS 'Tabla que almacena los usuarios del sistema';
COMMENT ON COLUMN public.usuarios.rol IS 'Rol del usuario: usuario, farmacia, administrador';
COMMENT ON COLUMN public.usuarios.telefono IS 'Número de teléfono del usuario';
COMMENT ON COLUMN public.usuarios.activo IS 'Indica si el usuario está activo';
COMMENT ON COLUMN public.usuarios.ultimo_login IS 'Fecha y hora del último inicio de sesión';