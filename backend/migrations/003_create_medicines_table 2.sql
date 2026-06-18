-- ============================================
-- CREAR TABLA MEDICAMENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.medicamentos (
    id SERIAL PRIMARY KEY,
    farmacia_id INTEGER NOT NULL REFERENCES public.farmacias(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    nombre_generico VARCHAR(255),
    marca VARCHAR(255),
    cantidad INTEGER NOT NULL DEFAULT 0,
    unidad VARCHAR(50) DEFAULT 'unidades',
    precio DECIMAL(10, 2) NOT NULL,
    precio_compra DECIMAL(10, 2),
    numero_lote VARCHAR(100) NOT NULL,
    fecha_caducidad DATE NOT NULL,
    fecha_fabricacion DATE,
    categoria VARCHAR(100),
    subcategoria VARCHAR(100),
    principio_activo TEXT,
    dosis VARCHAR(100),
    presentacion VARCHAR(100),
    requiere_receta BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    stock_minimo INTEGER DEFAULT 5,
    stock_maximo INTEGER DEFAULT 100,
    condiciones_almacenamiento TEXT,
    codigo_barras VARCHAR(100) UNIQUE,
    url_imagen VARCHAR(500),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREAR ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_medicamentos_farmacia_id ON public.medicamentos(farmacia_id);
CREATE INDEX IF NOT EXISTS idx_medicamentos_nombre ON public.medicamentos(nombre);
CREATE INDEX IF NOT EXISTS idx_medicamentos_caducidad ON public.medicamentos(fecha_caducidad);
CREATE INDEX IF NOT EXISTS idx_medicamentos_lote ON public.medicamentos(numero_lote);
CREATE INDEX IF NOT EXISTS idx_medicamentos_codigo_barras ON public.medicamentos(codigo_barras);
CREATE INDEX IF NOT EXISTS idx_medicamentos_activo ON public.medicamentos(activo);
CREATE INDEX IF NOT EXISTS idx_medicamentos_categoria ON public.medicamentos(categoria);
CREATE INDEX IF NOT EXISTS idx_medicamentos_precio ON public.medicamentos(precio);

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE public.medicamentos IS 'Tabla que almacena los medicamentos de cada farmacia';
COMMENT ON COLUMN public.medicamentos.nombre IS 'Nombre comercial del medicamento';
COMMENT ON COLUMN public.medicamentos.nombre_generico IS 'Nombre genérico del medicamento';
COMMENT ON COLUMN public.medicamentos.numero_lote IS 'Número de lote del medicamento';
COMMENT ON COLUMN public.medicamentos.fecha_caducidad IS 'Fecha de caducidad del medicamento';
COMMENT ON COLUMN public.medicamentos.requiere_receta IS 'Indica si requiere receta médica para su venta';
COMMENT ON COLUMN public.medicamentos.stock_minimo IS 'Cantidad mínima de stock para alertar reabastecimiento';
COMMENT ON COLUMN public.medicamentos.stock_maximo IS 'Cantidad máxima de stock permitida';
COMMENT ON COLUMN public.medicamentos.codigo_barras IS 'Código de barras del medicamento (único)';