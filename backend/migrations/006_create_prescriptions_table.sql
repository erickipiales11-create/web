CREATE TABLE IF NOT EXISTS public.prescriptions (
    id SERIAL PRIMARY KEY,

    paciente_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,

    medico_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,

    fecha DATE NOT NULL,

    observacion TEXT,

    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_paciente_id ON public.prescriptions(paciente_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_medico_id ON public.prescriptions(medico_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_fecha ON public.prescriptions(fecha);

COMMENT ON TABLE public.prescriptions IS 'Tabla que almacena las recetas médicas emitidas';
COMMENT ON COLUMN public.prescriptions.paciente_id IS 'Usuario que recibe la receta (rol: usuario)';
COMMENT ON COLUMN public.prescriptions.medico_id IS 'Usuario que emite la receta (rol: médico, si aplica)';