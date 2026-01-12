import React, { useMemo, useState } from 'react';
import { Employee, Payment, Expense } from '../types';
import { Cake, Plane, TrendingUp, AlertCircle, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface DashboardProps {
  employees: Employee[];
  payments: Payment[];
  expenses: Expense[];
  monthlyFee: number;
}

const Dashboard: React.FC<DashboardProps> = ({ employees, payments, expenses, monthlyFee }) => {
  const today = new Date();
  const currentMonthIndexReal = today.getMonth(); // 0-11
  const currentMonthNumberReal = currentMonthIndexReal + 1;
  const currentYear = today.getFullYear();

  // State for Birthday Navigation
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndexReal);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const currentMonthName = monthNames[currentMonthIndexReal];
  const selectedMonthName = monthNames[selectedMonthIndex];

  // Handlers for month navigation
  const handlePrevMonth = () => {
    setSelectedMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonthIndex(prev => (prev === 11 ? 0 : prev + 1));
  };

  // 1. Calculate Funds Logic (Still based on REAL current date calculations for money)
  const resortFund = payments
    .filter(p => p.confirmado)
    .reduce((acc, curr) => {
      const contribution = Math.max(0, curr.monto_pagado - 3);
      return acc + contribution;
    }, 0);

  const birthdayFundMonth = payments
    .filter(p => p.confirmado && p.mes === currentMonthNumberReal && p.anio === currentYear)
    .reduce((acc, curr) => acc + 3, 0);

  // 2. Dulcómetro Logic (Still based on REAL current date)
  const expectedMonthlyTotal = employees.length * monthlyFee;
  const currentMonthPaid = payments
    .filter(p => p.confirmado && p.mes === currentMonthNumberReal && p.anio === currentYear)
    .reduce((acc, curr) => acc + curr.monto_pagado, 0);

  const progressPercentage = expectedMonthlyTotal > 0
    ? Math.min(100, Math.round((currentMonthPaid / expectedMonthlyTotal) * 100))
    : 0;

  // 3. Upcoming Birthdays (Based on SELECTED month from navigation)
  const birthdays = employees.filter(emp => {
    const parts = emp.fecha_nacimiento.split('-');
    if (parts.length !== 3) return false;
    // parts[1] is month (1-12)
    return parseInt(parts[1]) === selectedMonthIndex + 1;
  });

  const chartData = [
    { name: 'Fondo Resort', value: resortFund, color: '#006994' },
    { name: 'Fondo Cumple (Mes)', value: birthdayFundMonth, color: '#f3e5ab' },
  ];

  const formatMoney = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Resort Fund Card */}
        <div className="bg-gradient-to-br from-tropical-sea to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 font-medium mb-1">Fondo Resort Total</p>
              <h3 className="text-4xl font-bold">{formatMoney(resortFund)}</h3>
              <p className="text-xs text-blue-200 opacity-80 mt-1">(Cuota - $3.00) acumulado</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Plane className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-sm text-blue-200 mt-4">¡El viaje de fin de año espera! 🥥</p>
        </div>

        {/* Birthday Fund Card */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-pink-100 font-medium mb-1">Fondo Cumple ({currentMonthName})</p>
              <h3 className="text-4xl font-bold">{formatMoney(birthdayFundMonth)}</h3>
              <p className="text-xs text-pink-200 opacity-80 mt-1">$3.00 por pago</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Cake className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-sm text-pink-200 mt-4">Para la fiesta de fin de mes 🎉</p>
        </div>

        {/* Active Month Birthdays List (Modern UI) */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-visible flex flex-col transition-shadow hover:shadow-xl duration-300">

          {/* Modern Header with Pills - Responsive Fix */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 p-3 rounded-2xl flex-shrink-0">
                <Cake className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">Cumpleañeros</h3>
                <p className="text-xs text-gray-400 font-medium whitespace-nowrap">Fiesta: Fin de mes</p>
              </div>
            </div>

            {/* Pill Navigation - Fixed positioning and width */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1.5 shadow-sm border border-gray-100 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-white hover:shadow-sm transition-all duration-200"
                title="Mes Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-gray-700 w-24 text-center select-none uppercase tracking-wide">
                {selectedMonthName}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-white hover:shadow-sm transition-all duration-200"
                title="Mes Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 max-h-52 custom-scrollbar pr-2">
            {birthdays.length > 0 ? birthdays.map(emp => (
              <div key={emp.id} className="group flex items-center justify-between p-3 bg-gray-50/50 hover:bg-purple-50 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-sm border border-transparent hover:border-purple-100 cursor-default">
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder - Using Dicebear for 'Nano Banana' vibes */}
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${emp.nombre}`}
                    alt={emp.nombre}
                    className="w-10 h-10 rounded-full bg-white shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-700">{emp.nombre}</p>
                    <p className="text-xs text-gray-500 font-medium">{new Date(emp.fecha_nacimiento).getDate() + 1} de {selectedMonthName}</p>
                  </div>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl">
                  🎁
                </span>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <p className="text-sm italic">Sin cumpleaños este mes 😴</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dulcómetro Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-700">Progreso Recaudación {currentMonthName}</h3>
          <span className="text-sm font-medium text-gray-500">{progressPercentage}% del total esperado</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-orange-400 to-tropical-sunset h-4 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow">
              <DollarSign className="w-3 h-3 text-tropical-sunset" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-tropical-teal" />
          Distribución de Fondos
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
