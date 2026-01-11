import React, { useMemo } from 'react';
import { Employee, Payment, Expense } from '../types';
import { Cake, Plane, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface DashboardProps {
  employees: Employee[];
  payments: Payment[];
  expenses: Expense[];
  monthlyFee: number;
}

const Dashboard: React.FC<DashboardProps> = ({ employees, payments, expenses, monthlyFee }) => {
  const currentMonth = new Date().getMonth();
  
  // 1. Calculate Beach Fund (Mock logic: previous surplus + current month balance)
  const totalCollected = payments.filter(p => p.confirmado).reduce((acc, curr) => acc + curr.monto_pagado, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.monto, 0);
  const beachFund = 15000 + (totalCollected - totalExpenses); // 15000 mock base

  // 2. Dulcómetro Logic
  const expectedMonthlyTotal = employees.length * monthlyFee;
  const currentMonthPaid = payments
    .filter(p => p.confirmado && p.mes === 10) // Mocking Oct as current
    .reduce((acc, curr) => acc + curr.monto_pagado, 0);
  
  const progressPercentage = Math.min(100, Math.round((currentMonthPaid / expectedMonthlyTotal) * 100));

  // 3. Upcoming Birthdays
  const birthdays = employees.filter(emp => {
    const birthDate = new Date(emp.fecha_nacimiento);
    return birthDate.getMonth() === 9; // Mocking October (Month index 9)
  });

  const chartData = [
    { name: 'Fondo Playa', value: beachFund, color: '#006994' },
    { name: 'Gastos Mes', value: 750, color: '#fd5e53' }, // Mock current month expense
    { name: 'Pendiente', value: expectedMonthlyTotal - currentMonthPaid, color: '#f3e5ab' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Beach Fund Card */}
        <div className="bg-gradient-to-br from-tropical-sea to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 font-medium mb-1">Fondo Playa Total</p>
              <h3 className="text-4xl font-bold">${beachFund.toLocaleString()}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Plane className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-sm text-blue-200 mt-4">¡Ya huele a coco y mar! 🥥</p>
        </div>

        {/* Dulcómetro Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                <div className="h-full bg-tropical-sunset transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 font-medium">Dulcómetro del Mes</p>
              <h3 className="text-3xl font-bold text-gray-800">{progressPercentage}%</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-tropical-sunset h-4 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 text-right">Meta: ${expectedMonthlyTotal.toLocaleString()}</p>
        </div>

        {/* Active Month Birthdays */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
             <div className="bg-pink-100 p-2 rounded-full mr-3">
               <Cake className="w-5 h-5 text-pink-500" />
             </div>
             <h3 className="font-bold text-gray-800">Cumpleañeros (Oct)</h3>
          </div>
          
          <div className="space-y-3">
            {birthdays.length > 0 ? birthdays.map(emp => (
              <div key={emp.id} className="flex items-center justify-between p-2 hover:bg-pink-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 flex items-center justify-center text-white text-xs font-bold mr-3">
                    {emp.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{emp.nombre}</p>
                    <p className="text-xs text-gray-500">{new Date(emp.fecha_nacimiento).getDate()} de Octubre</p>
                  </div>
                </div>
                <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">¡Fiesta!</span>
              </div>
            )) : (
              <p className="text-gray-400 text-sm italic">Sin cumpleañeros este mes.</p>
            )}
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
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
