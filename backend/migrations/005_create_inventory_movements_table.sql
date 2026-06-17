CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id SERIAL PRIMARY KEY,

    medicine_id INTEGER NOT NULL,

    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'salida')),

    cantidad INTEGER NOT NULL CHECK (cantidad > 0),

    observacion TEXT,

    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_inventory_medicine
        FOREIGN KEY (medicine_id)
        REFERENCES public.medicamentos(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_medicine_id ON public.inventory_movements(medicine_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_tipo ON public.inventory_movements(tipo);

COMMENT ON TABLE public.inventory_movements IS 'Tabla que registra los movimientos de entrada y salida de inventario';
COMMENT ON COLUMN public.inventory_movements.tipo IS 'Tipo de movimiento: entrada o salida';