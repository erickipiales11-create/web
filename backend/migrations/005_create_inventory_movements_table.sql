CREATE TABLE IF NOT EXISTS inventory_movements (
    id SERIAL PRIMARY KEY,

    medicine_id INTEGER NOT NULL,

    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'salida')),

    cantidad INTEGER NOT NULL CHECK (cantidad > 0),

    observacion TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_medicine
        FOREIGN KEY (medicine_id)
        REFERENCES medicines(id)
        ON DELETE CASCADE
);