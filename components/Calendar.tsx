import React, { useState } from 'react';
import { Employee } from '../types';
import { Calendar as CalendarIcon, Filter, Search } from 'lucide-react';

interface CalendarProps {
    employees: Employee[];
}

const Calendar: React.FC<CalendarProps> = ({ employees }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Group employees by month
    const employeesByMonth = useMemo(() => {
        const grouped = Array(12).fill(null).map(() => [] as Employee[]);

        employees.forEach(emp => {
            const parts = emp.fecha_nacimiento.split('-');
            if (parts.length === 3) {
                const monthIndex = parseInt(parts[1]) - 1; // 0-11
                if (monthIndex >= 0 && monthIndex <= 11) {
                    grouped[monthIndex].push(emp);
                }
            }
        });

        return grouped;
    }, [employees]);

    // Filter months to show based on search? 
    // If searching, we show all months but only employees matching.
    // Actually, better to just highlight matching employees.

    const currentMonthIndex = new Date().getMonth();

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <CalendarIcon className="w-6 h-6 mr-2 text-tropical-sea" />
                        Calendario Anual
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Una vista panorámica de todas las fiestas del año. 🎈</p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar cumpleañero..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tropical-sea outline-none w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
            </div>

            {/* Bento Grid Layout for Months */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {monthNames.map((month, idx) => {
                    const empsInMonth = employeesByMonth[idx]
                        .sort((a, b) => {
                            const dayA = new Date(a.fecha_nacimiento).getDate();
                            const dayB = new Date(b.fecha_nacimiento).getDate();
                            return dayA - dayB;
                        })
                        .filter(e => e.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

                    const isCurrentMonth = idx === currentMonthIndex;

                    return (
                        <div
                            key={month}
                            className={`
                        relative rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg
                        ${isCurrentMonth
                                    ? 'bg-gradient-to-br from-white to-blue-50 border-tropical-sea/30 shadow-md ring-1 ring-tropical-sea/20'
                                    : 'bg-white border-gray-100'
                                }
                        ${empsInMonth.length === 0 && searchTerm ? 'opacity-50' : 'opacity-100'}
                      `}
                        >
                            {isCurrentMonth && (
                                <span className="absolute top-3 right-3 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tropical-sea opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-tropical-sea"></span>
                                </span>
                            )}

                            <h3 className={`font-bold text-lg mb-4 ${isCurrentMonth ? 'text-tropical-sea' : 'text-gray-700'}`}>
                                {month}
                            </h3>

                            <div className="space-y-3">
                                {empsInMonth.length > 0 ? empsInMonth.map(emp => {
                                    const day = new Date(emp.fecha_nacimiento).getDate() + 1; // Timezone adjustment
                                    return (
                                        <div key={emp.id} className="flex items-center gap-3 group">
                                            <img
                                                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${emp.nombre}`}
                                                alt={emp.nombre}
                                                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 group-hover:scale-110 transition-transform"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{emp.nombre}</p>
                                                <p className="text-xs text-gray-500">Día {day}</p>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="h-10 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
                                        <span className="text-xs text-gray-300">
                                            {searchTerm ? 'No encontrado' : 'Sin cumples'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Need to import useMemo
import { useMemo } from 'react';

export default Calendar;
