export interface Employee {
  id: string;
  nombre: string;
  fecha_nacimiento: string; // ISO Date
  email: string;
  telefono: string;
}

export interface Payment {
  id: string;
  empleado_id: string;
  mes: number;
  anio: number;
  monto_pagado: number;
  fecha_pago: string | null;
  confirmado: boolean;
}

export interface Config {
  cuota_mensual: number;
  plantilla_dia_15: string;
  plantilla_dia_30: string;
  meta_resort: number;
}

export interface Expense {
  id: string;
  mes: number;
  anio: number;
  concepto: string;
  monto: number;
  foto_factura_url: string;
}

export interface EventPhoto {
  id: string;
  url_imagen: string;
  descripcion: string;
}

export type ViewState = 'dashboard' | 'calendar' | 'collaborators' | 'treasurer' | 'gallery' | 'settings';
