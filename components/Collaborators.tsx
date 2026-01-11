import React, { useState } from 'react';
import { Employee } from '../types';
import { Plus, Pencil, Trash2, X, Save, User, Mail, Phone, Calendar } from 'lucide-react';

interface CollaboratorsProps {
  employees: Employee[];
  onAdd: (emp: Omit<Employee, 'id'>) => void;
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
}

const Collaborators: React.FC<CollaboratorsProps> = ({ employees, onAdd, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form State
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
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Directorio de Colaboradores</h2>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-tropical-sea hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Nuevo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tropical-teal to-blue-200 flex items-center justify-center text-white font-bold text-xl">
                 {emp.nombre.charAt(0)}
               </div>
               <div className="flex space-x-2">
                 <button onClick={() => openEditModal(emp)} className="text-gray-400 hover:text-tropical-sea transition-colors">
                   <Pencil className="w-4 h-4" />
                 </button>
                 <button onClick={() => handleDelete(emp.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <h3 className="font-bold text-gray-800 text-lg truncate" title={emp.nombre}>{emp.nombre}</h3>
              
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-tropical-teal" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-tropical-teal" />
                <span>{emp.telefono}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-tropical-teal" />
                <span>{new Date(emp.fecha_nacimiento).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="bg-tropical-light p-4 flex justify-between items-center border-b border-tropical-sand">
              <h3 className="font-bold text-tropical-sea text-lg">
                {editingEmployee ? 'Editar Colaborador' : 'Nuevo Colaborador'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tropical-sea focus:border-transparent outline-none"
                    placeholder="Ej. Juan Pérez"
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tropical-sea focus:border-transparent outline-none"
                    placeholder="juan@empresa.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tropical-sea focus:border-transparent outline-none"
                    placeholder="555-123-4567"
                    value={formData.telefono}
                    onChange={e => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tropical-sea focus:border-transparent outline-none"
                    value={formData.fecha_nacimiento}
                    onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                 <button 
                   type="button" 
                   onClick={() => setIsModalOpen(false)}
                   className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="submit" 
                   className="flex-1 px-4 py-2 bg-tropical-sea text-white rounded-lg hover:bg-blue-700 font-medium flex justify-center items-center shadow-sm"
                 >
                   <Save className="w-4 h-4 mr-2" />
                   Guardar
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