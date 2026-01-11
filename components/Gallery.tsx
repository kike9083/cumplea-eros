import React from 'react';
import { Expense, EventPhoto, Payment, Employee } from '../types';
import { Camera, FileText, Trophy } from 'lucide-react';

interface GalleryProps {
  expenses: Expense[];
  photos: EventPhoto[];
  payments: Payment[];
  employees: Employee[];
}

const Gallery: React.FC<GalleryProps> = ({ expenses, photos, payments, employees }) => {
  
  // Logic for "Early Birds" (Top 5 fastest payers)
  const topPayers = payments
    .filter(p => p.confirmado && p.fecha_pago)
    .sort((a, b) => new Date(a.fecha_pago!).getTime() - new Date(b.fecha_pago!).getTime())
    .slice(0, 5)
    .map((p, index) => {
      const emp = employees.find(e => e.id === p.empleado_id);
      return { ...emp, rank: index + 1, payDate: p.fecha_pago };
    });

  return (
    <div className="space-y-8">
      
      {/* Ranking Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100">
        <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
          Ranking: Prontos Pagadores (Oct)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topPayers.map(tp => (
            <div key={tp.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-white font-bold flex items-center justify-center mb-2 shadow-sm">
                #{tp.rank}
              </div>
              <p className="font-semibold text-gray-800 text-sm truncate w-full">{tp.nombre?.split('"')[1] || tp.nombre?.split(' ')[0]}</p>
              <p className="text-xs text-gray-500 mt-1">
                {tp.payDate ? new Date(tp.payDate).toLocaleDateString() : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Expenses Transparency */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-tropical-teal" />
              Transparencia: Gastos Recientes
            </h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Supabase Storage</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expenses.map(exp => (
              <div key={exp.id} className="group relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <img src={exp.foto_factura_url} alt={exp.concepto} className="w-full h-32 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="p-3">
                  <p className="font-bold text-gray-700 text-sm">{exp.concepto}</p>
                  <p className="text-tropical-sea font-bold">${exp.monto}</p>
                </div>
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Factura
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Wall */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-pink-500" />
              Muro de la Fama
            </h3>
            <button className="text-xs text-tropical-sea font-semibold hover:underline">+ Subir Foto</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
             {/* Featured Masonry-style Layout simulated */}
             <div className="grid grid-cols-2 gap-2">
                {photos.map((photo, idx) => (
                    <div key={photo.id} className={`relative rounded-xl overflow-hidden shadow-sm ${idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                        <img src={photo.url_imagen} alt={photo.descripcion} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <p className="text-white text-xs font-medium">{photo.descripcion}</p>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Gallery;
