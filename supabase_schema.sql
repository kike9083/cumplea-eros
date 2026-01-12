-- Create Employees Table
CREATE TABLE employees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  email TEXT,
  telefono TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Payments Table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empleado_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  monto_pagado DECIMAL(10, 2) NOT NULL,
  fecha_pago TIMESTAMP WITH TIME ZONE,
  confirmado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Config Table (Singleton)
CREATE TABLE config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  cuota_mensual DECIMAL(10, 2) NOT NULL DEFAULT 20.00,
  plantilla_dia_15 TEXT,
  plantilla_dia_30 TEXT,
  meta_resort DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
  CHECK (id = 1)
);

-- Create Expenses Table
CREATE TABLE expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  concepto TEXT NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  foto_factura_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Event Photos Table
CREATE TABLE event_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  url_imagen TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Config
INSERT INTO config (cuota_mensual, plantilla_dia_15, plantilla_dia_30)
VALUES (20.00, 'Hola {nombre}, recuerda la cuota del día 15.', 'Hola {nombre}, hoy es fin de mes, ¡no olvides tu cuota!');