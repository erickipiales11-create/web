-- Agregar activo a categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT true;

-- Agregar activo y prescription_id a inventory_movements
ALTER TABLE inventory_movements ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE inventory_movements ADD COLUMN IF NOT EXISTS prescription_id INTEGER REFERENCES prescriptions(id) ON DELETE SET NULL;