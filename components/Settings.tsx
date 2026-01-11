import React, { useState } from 'react';
import { Config } from '../types';
import { Save } from 'lucide-react';

interface SettingsProps {
  config: Config;
  onSave: (newConfig: Config) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<Config>(config);

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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración del Sistema</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuota Mensual ($)
          </label>
          <input
            type="number"
            name="cuota_mensual"
            value={formData.cuota_mensual}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plantilla Mensaje (Día 15 - Suave)
          </label>
          <textarea
            name="plantilla_dia_15"
            value={formData.plantilla_dia_15}
            onChange={handleChange}
            rows={3}
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
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-tropical-sea focus:border-transparent outline-none"
          />
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
  );
};

export default Settings;
