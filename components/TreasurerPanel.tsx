import React, { useState } from 'react';
import { Employee, Payment, Config, Expense } from '../types';
import { CheckCircle2, Send, Copy, ChevronLeft, ChevronRight, Users, FileDown } from 'lucide-react';
import { generateStateReport } from '../PDFService';

interface TreasurerPanelProps {
  employees: Employee[];
  payments: Payment[];
  expenses: Expense[];
  config: Config;
  onTogglePayment: (employeeId: string, month: number, year: number) => void;
}

const TreasurerPanel: React.FC<TreasurerPanelProps> = ({ employees, payments, expenses, config, onTogglePayment }) => {
  const [currentDate] = useState(new Date());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const currentMonthName = monthNames[selectedMonthIndex];
  const selectedMonthNumber = selectedMonthIndex + 1;

  // Handlers for month navigation
  const handlePrevMonth = () => {
    setSelectedMonthIndex(prev => {
      if (prev === 0) {
        setSelectedYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonthIndex(prev => {
      if (prev === 11) {
        setSelectedYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Stats for the selected month
  const paymentsInMonth = payments.filter(p => p.mes === selectedMonthNumber && p.anio === selectedYear && p.confirmado);
  const totalCollected = paymentsInMonth.reduce((acc, p) => acc + p.monto_pagado, 0);
  const totalExpected = employees.length * config.cuota_mensual;
  const progressPercent = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  const handleExportPDF = () => {
    generateStateReport(payments, employees, expenses, selectedMonthNumber, selectedYear, currentMonthName);
  };

  const getWhatsappLink = (emp: Employee, amount: number) => {
    const template = currentDate.getDate() > 20 ? config.plantilla_dia_30 : config.plantilla_dia_15;
    const message = template
      ? template.replace('{nombre}', emp.nombre.split(' ')[0]).replace('{monto}', amount.toString())
      : `Hola ${emp.nombre}, recuerda tu cuota de ${amount} para el fondo de ${currentMonthName}.`;

    return `https://wa.me/${emp.telefono}?text=${encodeURIComponent(message)}`;
  };

  const getGroupNotice = () => {
    const debtors = employees.filter(e => {
      const pay = payments.find(p => p.empleado_id === e.id && p.mes === selectedMonthNumber && p.anio === selectedYear);
      return !pay?.confirmado;
    });

    return `*Faltantes de Pago - ${currentMonthName} 🌺*\n\nHola equipo, recordamos a los que faltan por confirmar su cuota:\n${debtors.map(d => `- ${d.nombre}`).join('\n')}\n\n¡Sigamos ahorrando para la meta! 🏖️`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Mensaje copiado al portapapeles');
  };

  return (
    <div className="space-y-6 pb-20">

      {/* Month Selection & Stats Summary */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Período de Gestión</h3>
            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 font-bold text-gray-700 min-w-[120px] text-center">{currentMonthName} {selectedYear}</span>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-tropical-light/50 p-4 rounded-xl border border-tropical-sand">
              <p className="text-xs font-bold text-tropical-teal uppercase mb-1">Recaudado</p>
              <p className="text-2xl font-black text-tropical-sea">${totalCollected}</p>
              <p className="text-[10px] text-gray-500 mt-1">{paymentsInMonth.length} colaboradores pagaron</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <p className="text-xs font-bold text-orange-600 uppercase mb-1">Progreso</p>
              <p className="text-2xl font-black text-orange-700">{progressPercent}%</p>
              <div className="w-full bg-orange-200 h-1.5 rounded-full mt-2">
                <div className="bg-orange-600 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-tropical-sunset" />
            <h3 className="font-bold text-gray-800">Acciones Rápidas</h3>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => copyToClipboard(getGroupNotice())}
              className="w-full flex items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all text-sm font-bold border border-gray-200"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Lista Deudores
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center justify-center p-3 bg-tropical-teal hover:bg-tropical-sea text-white rounded-xl transition-all text-sm font-bold shadow-sm"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Exportar Reporte (PDF)
            </button>
          </div>
          <p className="text-[10px] text-gray-400 italic text-center mt-2">Descarga un documento formal con el balance del mes.</p>
        </div>
      </div>

      {/* Main Payment Table Section */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="p-6 border-b border-gray-50 bg-white sticky top-0 z-10">
          <h2 className="font-black text-gray-900 text-xl">Detalle de Colaboradores</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Colaborador</th>
                <th className="px-6 py-4 text-center">Estado de Pago</th>
                <th className="px-6 py-4 text-center">Confirmación</th>
                <th className="px-6 py-4 text-right">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map(emp => {
                const payment = payments.find(p => p.empleado_id === emp.id && p.mes === selectedMonthNumber && p.anio === selectedYear);
                const isPaid = payment?.confirmado || false;

                return (
                  <tr key={emp.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${emp.nombre}`}
                          alt={emp.nombre}
                          className="w-10 h-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{emp.nombre}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
                        }`}>
                        {isPaid ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => onTogglePayment(emp.id, selectedMonthNumber, selectedYear)}
                        className={`p-2.5 rounded-2xl transition-all shadow-sm ${isPaid
                          ? 'bg-green-500 text-white hover:bg-red-500'
                          : 'bg-white border border-gray-200 text-gray-300 hover:border-green-500 hover:text-green-500'
                          }`}
                        title={isPaid ? "Marcar como pendiente" : "Confirmar Recepción"}
                      >
                        {isPaid ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-6 h-6 border-2 border-current rounded-full" />}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {!isPaid && (
                        <a
                          href={getWhatsappLink(emp, config.cuota_mensual)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all hover:scale-105"
                        >
                          <Send className="w-3.5 h-3.5 mr-2" />
                          WhatsApp
                        </a>
                      )}
                      {isPaid && (
                        <span className="text-[10px] text-gray-400 font-medium">Pago registrado el {new Date(payment!.fecha_pago!).toLocaleDateString()}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TreasurerPanel;
