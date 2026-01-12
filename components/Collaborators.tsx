import React, { useState } from 'react';
import { Employee } from '../types';
import { Plus, Pencil, Trash2, X, Save, User, Mail, Phone, Calendar as CalendarIcon } from 'lucide-react';

interface CollaboratorsProps {
  employees: Employee[];
  onAdd: (emp: Omit<Employee, 'id'>) => void;
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
}

const Collaborators: React.FC<CollaboratorsProps> = ({ employees, onAdd, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha_nacimiento: ''
  });

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({ nombre: '', email: '', telefono: '', fecha_nacimiento: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      nombre: emp.nombre,
      email: emp.email,
      telefono: emp.telefono,
      fecha_nacimiento: emp.fecha_nacimiento
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este colaborador? Se perderá su historial de pagos.')) {
      onDelete(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      onEdit({ ...editingEmployee, ...formData });
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 relative pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 backdrop-blur-md bg-white/80">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Directorio del Equipo</h2>
          <p className="text-xs text-gray-500 font-medium">{employees.length} Embajadores Aloha registrados</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-6 py-3 bg-tropical-sea hover:bg-blue-700 text-white rounded-2xl transition-all text-sm font-black shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Añadir Miembro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(emp)} className="p-2 bg-gray-50 hover:bg-tropical-light text-gray-400 hover:text-tropical-sea rounded-xl transition-all">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(emp.id)} className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-tropical-light to-blue-50 border-4 border-white shadow-md overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${emp.nombre}`}
                    alt={emp.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-tropical-sunset text-white flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-black text-gray-900 text-lg mb-1 truncate w-full" title={emp.nombre}>{emp.nombre}</h3>
              <p className="text-[10px] text-tropical-sea font-black uppercase tracking-widest mb-4">Colaborador Platino</p>

              <div className="w-full space-y-2 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-center text-xs text-gray-600 font-medium">
                  <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center justify-center text-xs text-gray-600 font-medium">
                  <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  <span>{emp.telefono}</span>
                </div>
                <div className="flex items-center justify-center text-xs text-gray-600 font-medium">
                  <CalendarIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  <span>{new Date(emp.fecha_nacimiento).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="bg-gray-50 p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-xl tracking-tight">
                {editingEmployee ? 'Perfil Colaborador' : 'Sumar al Equipo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-tropical-sea transition-colors" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-tropical-sea focus:bg-white outline-none transition-all text-sm font-semibold"
                    placeholder="Ej. Juan Pérez"
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-tropical-sea transition-colors" />
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-tropical-sea focus:bg-white outline-none transition-all text-sm font-semibold"
                    placeholder="juan@empresa.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-tropical-sea transition-colors" />
                    <input
                      type="tel"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-tropical-sea focus:bg-white outline-none transition-all text-sm font-semibold"
                      placeholder="6677-8899"
                      value={formData.telefono}
                      onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cumpleaños</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-tropical-sea transition-colors" />
                    <input
                      type="date"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-tropical-sea focus:bg-white outline-none transition-all text-sm font-semibold"
                      value={formData.fecha_nacimiento}
                      onChange={e => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 border border-gray-100 text-gray-500 rounded-2xl hover:bg-gray-50 font-black text-xs uppercase tracking-widest transition-all"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-tropical-sea text-white rounded-2xl hover:bg-blue-700 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 transition-all flex justify-center items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaborators;