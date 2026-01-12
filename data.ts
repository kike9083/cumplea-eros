import { Employee, Payment, Config, Expense, EventPhoto } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', nombre: 'Carlos "El Fiestero"', fecha_nacimiento: '1990-10-15', email: 'carlos@company.com', telefono: '5551234567' },
  { id: '2', nombre: 'Ana "La Chef"', fecha_nacimiento: '1985-05-22', email: 'ana@company.com', telefono: '5559876543' },
  { id: '3', nombre: 'Roberto "Playa"', fecha_nacimiento: '1992-10-05', email: 'roberto@company.com', telefono: '5551112222' },
  { id: '4', nombre: 'Lucía "Cuentas Claras"', fecha_nacimiento: '1988-12-10', email: 'lucia@company.com', telefono: '5553334444' },
  { id: '5', nombre: 'David "El DJ"', fecha_nacimiento: '1995-02-14', email: 'david@company.com', telefono: '5555556666' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', empleado_id: '1', mes: 10, anio: 2023, monto_pagado: 100, fecha_pago: '2023-10-02T10:00:00Z', confirmado: true },
  { id: 'p2', empleado_id: '2', mes: 10, anio: 2023, monto_pagado: 100, fecha_pago: '2023-10-05T14:30:00Z', confirmado: true },
  { id: 'p3', empleado_id: '3', mes: 10, anio: 2023, monto_pagado: 0, fecha_pago: null, confirmado: false }, // Not paid
  { id: 'p4', empleado_id: '4', mes: 10, anio: 2023, monto_pagado: 100, fecha_pago: '2023-10-01T09:00:00Z', confirmado: true }, // Early bird
  { id: 'p5', empleado_id: '5', mes: 10, anio: 2023, monto_pagado: 0, fecha_pago: null, confirmado: false },
];

export const INITIAL_CONFIG: Config = {
  cuota_mensual: 200,
  plantilla_dia_15: "¡Aloha {nombre}! 🌺 Hoy es 15, día de ponerle sabor al fondo. Son ${monto} para los pasteles y el hotel 5 estrellas. ¡No seas aguafiestas!",
  plantilla_dia_30: "¡Hey {nombre}! 🌊 Se acaba el mes y el mar nos espera. Por favor deposita tu cuota de ${monto} para no nadar con los tiburones.",
  meta_resort: 1000,
};

export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', mes: 9, anio: 2023, concepto: 'Pastel de Chocolate', monto: 450, foto_factura_url: 'https://picsum.photos/200/300?random=1' },
  { id: 'e2', mes: 9, anio: 2023, concepto: 'Refrescos y Platos', monto: 150, foto_factura_url: 'https://picsum.photos/200/300?random=2' },
  { id: 'e3', mes: 10, anio: 2023, concepto: 'Helado Artesanal', monto: 300, foto_factura_url: 'https://picsum.photos/200/300?random=3' },
];

export const MOCK_PHOTOS: EventPhoto[] = [
  { id: 'ph1', url_imagen: 'https://picsum.photos/400/300?random=10', descripcion: 'Cumple de Ana - Septiembre' },
  { id: 'ph2', url_imagen: 'https://picsum.photos/400/300?random=11', descripcion: 'Entrega de reconocimientos' },
  { id: 'ph3', url_imagen: 'https://picsum.photos/400/300?random=12', descripcion: 'Planning del Viaje' },
];
