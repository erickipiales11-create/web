-- database/init.sql
-- CREAR BASE DE DATOS
CREATE DATABASE farmacia_db;

\c farmacia_db;

-- CREAR TABLAS

-- Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'worker', 'patient')),
    pharmacy_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Farmacias
CREATE TABLE pharmacies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(300) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Medicamentos
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    requires_prescription BOOLEAN DEFAULT FALSE,
    gramaje VARCHAR(50),
    tipo VARCHAR(50) CHECK (tipo IN ('tableta', 'capsula', 'liquido', 'crema', 'inyectable', 'polvo')),
    pharmacy_id INTEGER REFERENCES pharmacies(id),
    expiration_date DATE,
    active_ingredient VARCHAR(200),
    laboratory VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Medicamentos Equivalentes
CREATE TABLE medicine_equivalents (
    id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(id),
    equivalent_medicine_id INTEGER REFERENCES medicines(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(medicine_id, equivalent_medicine_id)
);

-- Tabla de Órdenes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id),
    pharmacy_id INTEGER REFERENCES pharmacies(id),
    medicine_id INTEGER REFERENCES medicines(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'completed', 'cancelled')),
    total DECIMAL(10, 2) DEFAULT 0,
    prescription_image TEXT,
    requires_prescription BOOLEAN DEFAULT FALSE,
    pickup_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar Categorías por Defecto
INSERT INTO categories (name, description) VALUES
('Analgésicos', 'Medicamentos para aliviar el dolor'),
('Antibióticos', 'Medicamentos para combatir infecciones'),
('Antiinflamatorios', 'Medicamentos para reducir la inflamación'),
('Antihistamínicos', 'Medicamentos para alergias'),
('Antidepresivos', 'Medicamentos para la depresión'),
('Antidiabéticos', 'Medicamentos para la diabetes'),
('Antihipertensivos', 'Medicamentos para la presión arterial'),
('Vitaminas', 'Suplementos vitamínicos'),
('Antifúngicos', 'Medicamentos para hongos'),
('Antivirales', 'Medicamentos para virus');

-- Insertar Farmacia por Defecto
INSERT INTO pharmacies (name, address, phone) VALUES
('Farmacia Central', 'Av. Principal 123, Ciudad', '555-1234');

-- Insertar Usuario Admin por Defecto
-- Contraseña: Admin123!
INSERT INTO users (email, password, name, role) VALUES
('admin@farmacia.com', '$2a$10$8q5GQGcWbKsfZk4K8jKUueV2jEwLqyUQv4y8VZ3XZq6mK8sLpQYwu', 'Administrador', 'admin');