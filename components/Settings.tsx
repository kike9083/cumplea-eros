import React, { useState } from 'react';
import { Config } from '../types';
import { Save, Calculator } from 'lucide-react';

interface SettingsProps {
  config: Config;
  onSave: (newConfig: Config) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<Config>(config);

  // Projection State
  const [projectionEmployees, setProjectionEmployees] = useState(10); // Default placeholder
  const [projectionFee, setProjectionFee] = useState(20);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cuota_mensual' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('Configuración guardada exitosamente');
  };

  // Projection Logic
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
  const monthsRemaining = 12 - currentMonth; // Including current month if we assume full month payment? 
  // User asked "a fin de año". If it's Jan 11, there are ~12 months payments usually.
  // If it's Oct, Nov, Dec = 3 months. 
  // Simple logic: 11 (Dec) - currentMonth + 1 (inclusive)??
  // Let's assume inclusive of current month.
  // 12 - currentMonth is safe (e.g. Oct (9). 12-9=3. Oct, Nov, Dec).

  const projectedResortSavings = (projectionEmployees * Math.max(0, projectionFee - 3)) * monthsRemaining;
  const projectedBirthdayFund = (projectionEmployees * 3) * monthsRemaining;

  const formatMoney = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Main Config Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración del Sistema</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuota Mensual Actual ($)
            </label>
            <input
              type="number"
              name="cuota_mensual"
              value={formData.cuota_mensual}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-tropical-sea focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Resort Total ($) 🏖️
            </label>
            <input
              type="number"
              name="meta_resort"
              value={formData.meta_resort}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-tropical-sea focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-sm font-bold text-blue-800 mb-2">Variables Disponibles</h4>
            <p className="text-xs text-blue-600">
              Usa <code>{`{nombre}`}</code> para el nombre del empleado y <code>{`{monto}`}</code> para la cantidad a cobrar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plantilla Mensaje (Día 15 - Suave)
              </label>
              <textarea
                name="plantilla_dia_15"
                value={formData.plantilla_dia_15}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-tropical-sea focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plantilla Mensaje (Día 30 - Urgente)
              </label>
              <textarea
                name="plantilla_dia_30"
                value={formData.plantilla_dia_30}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-tropical-sea focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-tropical-sea hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tropical-sea transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* Projection Tool */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-blue-100">
        <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center">
          <Calculator className="w-6 h-6 mr-2 text-indigo-600" />
          Simulador de Ahorro Anual
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Número de Colaboradores
              </label>
              <input
                type="number"
                value={projectionEmployees}
                onChange={(e) => setProjectionEmployees(Number(e.target.value))}
                className="w-full p-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Cuota Hipotética ($)
              </label>
              <input
                type="number"
                value={projectionFee}
                onChange={(e) => setProjectionFee(Number(e.target.value))}
                className="w-full p-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
            <div className="text-xs text-indigo-600 italic mt-2">
              * Cálculo basado en los {monthsRemaining} meses restantes del año (incluyendo este mes).
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100 flex flex-col justify-center space-y-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Proyección Fondo Resort (Fin de Año)</p>
              <p className="text-3xl font-bold text-tropical-sea">{formatMoney(projectedResortSavings)}</p>
              <p className="text-xs text-gray-400">Total acumulado hipotético</p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Proyección Fondo Cumpleaños</p>
              <p className="text-xl font-bold text-pink-500">{formatMoney(projectedBirthdayFund)}</p>
              <p className="text-xs text-gray-400">Dinero para fiestas ($3.00 fijos x persona x mes)</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
