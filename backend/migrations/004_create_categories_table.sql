-- ============================================
-- CREAR TABLA CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREAR ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_categories_nombre ON public.categories(nombre);

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE public.categories IS 'Tabla que almacena las categorías de medicamentos';
COMMENT ON COLUMN public.categories.nombre IS 'Nombre único de la categoría';

-- ============================================
-- AGREGAR category_id A MEDICAMENTOS
-- (va aquí porque esta es la primera migración
-- donde la tabla categories ya existe)
-- ============================================
ALTER TABLE public.medicamentos
ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_medicamentos_category_id ON public.medicamentos(category_id);