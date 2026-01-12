import React, { useState } from 'react';
import { Expense, EventPhoto, Payment, Employee } from '../types';
import { Camera, FileText, Trophy, Plus, X, Image as ImageIcon, DollarSign } from 'lucide-react';

interface GalleryProps {
  expenses: Expense[];
  photos: EventPhoto[];
  payments: Payment[];
  employees: Employee[];
  onAddPhoto: (photo: Omit<EventPhoto, 'id'>) => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const Gallery: React.FC<GalleryProps> = ({ expenses, photos, payments, employees, onAddPhoto, onAddExpense }) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [photoForm, setPhotoForm] = useState({ url_imagen: '', descripcion: '' });
  const [expenseForm, setExpenseForm] = useState({ concepto: '', monto: 0, foto_factura_url: '', mes: new Date().getMonth() + 1, anio: new Date().getFullYear() });

  // Logic for "Early Birds" (Top 5 fastest payers of the CURRENT year overall or specific month)
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const topPayers = payments
    .filter(p => p.confirmado && p.fecha_pago)
    .sort((a, b) => new Date(a.fecha_pago!).getTime() - new Date(b.fecha_pago!).getTime())
    .slice(0, 5)
    .map((p, index) => {
      const emp = employees.find(e => e.id === p.empleado_id);
      return { ...emp, rank: index + 1, payDate: p.fecha_pago };
    })
    .filter(tp => tp.id); // Filter out any undefined

  const handlePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPhoto(photoForm);
    setPhotoForm({ url_imagen: '', descripcion: '' });
    setIsPhotoModalOpen(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense(expenseForm);
    setExpenseForm({ concepto: '', monto: 0, foto_factura_url: '', mes: currentMonth, anio: currentYear });
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">

      {/* Ranking Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100">
        <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-3 text-yellow-600 animate-bounce" />
          Wall of Fame: Prontos Pagadores
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {topPayers.length > 0 ? topPayers.map(tp => (
            <div key={`${tp.id}-${tp.payDate}`} className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center text-center border border-yellow-100">
              <div className="relative mb-2">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${tp.nombre}`}
                  alt={tp.nombre}
                  className="w-12 h-12 rounded-full bg-orange-50"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  #{tp.rank}
                </div>
              </div>
              <p className="font-bold text-gray-800 text-xs truncate w-full">{tp.nombre}</p>
              <p className="text-[10px] text-gray-500 mt-1">
                {tp.payDate ? new Date(tp.payDate).toLocaleDateString() : ''}
              </p>
            </div>
          )) : (
            <div className="col-span-full py-4 text-center text-gray-400 italic text-sm">Aún no hay pagos confirmados este mes.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Expenses Transparency */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-tropical-teal" />
              Transparencia Administrativa
            </h3>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="text-xs bg-tropical-teal/10 text-tropical-teal px-3 py-1.5 rounded-lg font-bold hover:bg-tropical-teal/20 transition-colors"
            >
              + Registrar Gasto
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expenses.length > 0 ? expenses.map(exp => (
              <div key={exp.id} className="group relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img
                    src={exp.foto_factura_url || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'}
                    alt={exp.concepto}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-gray-800 text-sm truncate flex-1">{exp.concepto}</p>
                    <span className="text-xs font-bold text-tropical-sea bg-tropical-sea/5 px-2 py-0.5 rounded">
                      ${exp.monto}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">Año {exp.anio} - Mes {exp.mes}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <FileText className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">No hay gastos registrados aún.</p>
              </div>
            )}
          </div>
        </div>

        {/* Social Wall */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-pink-500" />
              Muro de la Fama 🥥
            </h3>
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="text-xs bg-pink-50 text-pink-600 px-3 py-1.5 rounded-lg font-bold hover:bg-pink-100 transition-colors"
            >
              + Subir Recuerdo
            </button>
          </div>
          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            {photos.length > 0 ? photos.map((photo) => (
              <div key={photo.id} className="relative rounded-2xl overflow-hidden shadow-sm group break-inside-avoid">
                <img src={photo.url_imagen} alt={photo.descripcion} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium leading-relaxed">{photo.descripcion}</p>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 w-full">
                <Camera className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">¡Comparte los mejores momentos!</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Photo Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-pink-50 flex justify-between items-center">
              <h3 className="font-bold text-pink-700 text-lg flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" /> Subir un Recuerdo
              </h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className="text-pink-400 hover:text-pink-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handlePhotoSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL de la Imagen</label>
                <input
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none text-sm"
                  placeholder="https://images.unsplash.com/..."
                  value={photoForm.url_imagen}
                  onChange={e => setPhotoForm({ ...photoForm, url_imagen: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción corta</label>
                <textarea
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none text-sm h-24"
                  placeholder="Momento en la playa con el equipo..."
                  value={photoForm.descripcion}
                  onChange={e => setPhotoForm({ ...photoForm, descripcion: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 shadow-lg shadow-pink-200 transition-all">
                Publicar en el Muro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-tropical-light flex justify-between items-center">
              <h3 className="font-bold text-tropical-sea text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2" /> Registrar Gasto
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Concepto</label>
                  <input
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tropical-sea outline-none text-sm"
                    placeholder="Pastel de cumpleaños..."
                    value={expenseForm.concepto}
                    onChange={e => setExpenseForm({ ...expenseForm, concepto: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monto ($)</label>
                  <input
                    type="number"
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tropical-sea outline-none text-sm"
                    placeholder="50.00"
                    value={expenseForm.monto}
                    onChange={e => setExpenseForm({ ...expenseForm, monto: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mes</label>
                  <select
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tropical-sea outline-none text-sm"
                    value={expenseForm.mes}
                    onChange={e => setExpenseForm({ ...expenseForm, mes: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL de Factura (Opcional)</label>
                  <input
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tropical-sea outline-none text-sm"
                    placeholder="https://..."
                    value={expenseForm.foto_factura_url}
                    onChange={e => setExpenseForm({ ...expenseForm, foto_factura_url: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-tropical-sea text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                Guardar Registro
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;
