import React, { useState, useEffect } from 'react';
import { Employee, Payment, Config } from '../types';
import { CheckCircle2, XCircle, Send, Copy, AlertTriangle } from 'lucide-react';

interface TreasurerPanelProps {
  employees: Employee[];
  payments: Payment[];
  config: Config;
  onTogglePayment: (employeeId: string) => void;
}

const TreasurerPanel: React.FC<TreasurerPanelProps> = ({ employees, payments, config, onTogglePayment }) => {
  const [currentDay] = useState(new Date().getDate());
  
  // Logic for Alerts
  const isWarningDay = [13, 28].includes(currentDay);
  const isCollectionDay = [14, 15, 29, 30].includes(currentDay);

  const getWhatsappLink = (emp: Employee, amount: number) => {
    // Select template based on date (roughly)
    const template = currentDay > 20 ? config.plantilla_dia_30 : config.plantilla_dia_15;
    const message = template
      .replace('{nombre}', emp.nombre.split(' ')[0])
      .replace('{monto}', amount.toString());
    
    return `https://wa.me/${emp.telefono}?text=${encodeURIComponent(message)}`;
  };

  const getGroupNotice = () => {
    const debtors = employees.filter(e => {
       const pay = payments.find(p => p.empleado_id === e.id);
       return !pay?.confirmado;
    });
    
    return `*Aviso Grupal - AlohaFunds 🌺*\n\nHola equipo, faltan los siguientes pagos para el fondo:\n${debtors.map(d => `- ${d.nombre}`).join('\n')}\n\n¡Ayúdennos a llegar a la playa! 🏖️`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Mensaje copiado al portapapeles');
  };

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
      {isWarningDay && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-sm flex items-center">
          <AlertTriangle className="text-yellow-500 mr-3" />
          <div>
            <p className="font-bold text-yellow-700">Aviso Preventivo</p>
            <p className="text-sm text-yellow-600">Hoy es día de enviar recordatorios suaves a los olvidadizos.</p>
          </div>
        </div>
      )}
      {isCollectionDay && (
        <div className="bg-red-50 border-l-4 border-tropical-sunset p-4 rounded-r shadow-sm flex items-center">
          <AlertTriangle className="text-tropical-sunset mr-3" />
          <div>
            <p className="font-bold text-red-700">¡Día de Cobro!</p>
            <p className="text-sm text-red-600">Asegúrate de marcar los pagos recibidos hoy.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Pagos (Octubre)</h2>
        <button 
          onClick={() => copyToClipboard(getGroupNotice())}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copiar Aviso Grupal
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
              <th className="p-4">Empleado</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Acción</th>
              <th className="p-4 text-right">Recordatorio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map(emp => {
              const payment = payments.find(p => p.empleado_id === emp.id);
              const isPaid = payment?.confirmado || false;

              return (
                <tr key={emp.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{emp.nombre}</div>
                    <div className="text-xs text-gray-500">{emp.email}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isPaid ? 'Pagado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onTogglePayment(emp.id)}
                      className={`p-2 rounded-full transition-all ${
                        isPaid 
                          ? 'bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-600' 
                          : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
                      }`}
                      title={isPaid ? "Marcar como pendiente" : "Marcar como pagado"}
                    >
                      {isPaid ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    {!isPaid && (
                      <a
                        href={getWhatsappLink(emp, config.cuota_mensual)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                      >
                        <Send className="w-3 h-3 mr-2" />
                        WhatsApp
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreasurerPanel;
