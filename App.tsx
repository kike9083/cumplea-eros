import React, { useState, useEffect } from 'react';
import { ViewState, Config, Employee, Payment, Expense, EventPhoto } from './types';
import { INITIAL_CONFIG } from './data';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TreasurerPanel from './components/TreasurerPanel';
import Gallery from './components/Gallery';
import Settings from './components/Settings';
import Collaborators from './components/Collaborators';
import Calendar from './components/Calendar';
import { Menu, Loader } from 'lucide-react';
import {
  getEmployees,
  getPayments,
  getConfig,
  getExpenses,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  togglePaymentConfirmation,
  createPayment,
  updateConfig
} from './services';

const App: React.FC = () => {
  // State
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Real Data State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [config, setConfig] = useState<Config>(INITIAL_CONFIG);
  const [loading, setLoading] = useState(true);

  // Fetch Data on Mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, payData, expData, confData] = await Promise.all([
        getEmployees(),
        getPayments(),
        getExpenses(),
        getConfig()
      ]);
      setEmployees(empData);
      setPayments(payData);
      setExpenses(expData);
      setConfig(confData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleTogglePayment = async (employeeId: string) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const targetPayment = payments.find(p =>
      p.empleado_id === employeeId &&
      p.mes === currentMonth &&
      p.anio === currentYear
    );

    if (targetPayment) {
      try {
        const updated = await togglePaymentConfirmation(targetPayment.id, !targetPayment.confirmado);
        setPayments(prev => prev.map(p => p.id === updated.id ? updated : p));
      } catch (error) {
        console.error("Error toggling payment", error);
        alert("Error updating payment");
      }
    } else {
      try {
        const newPayment = await createPayment({
          empleado_id: employeeId,
          mes: currentMonth,
          anio: currentYear,
          monto_pagado: config.cuota_mensual,
          confirmado: true,
          fecha_pago: new Date().toISOString()
        });
        setPayments(prev => [...prev, newPayment]);
      } catch (error) {
        console.error("Error creating payment", error);
        alert("Error creating payment record");
      }
    }
  };

  const handleSaveConfig = async (newConfig: Config) => {
    try {
      const updated = await updateConfig(newConfig);
      setConfig(updated);
    } catch (error) {
      console.error("Error saving config", error);
    }
  };

  // Employee CRUD Handlers
  const handleAddEmployee = async (newEmp: Omit<Employee, 'id'>) => {
    try {
      const added = await addEmployee(newEmp);
      setEmployees(prev => [...prev, added]);
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  const handleEditEmployee = async (updatedEmp: Employee) => {
    try {
      const updated = await updateEmployee(updatedEmp);
      setEmployees(prev => prev.map(emp => emp.id === updated.id ? updated : emp));
    } catch (error) {
      console.error("Error editing employee", error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  // View Routing
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-full items-center justify-center">
          <Loader className="w-10 h-10 animate-spin text-tropical-teal" />
          <span className="ml-2 text-tropical-teal font-medium">Cargando datos del paraíso...</span>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard
          employees={employees}
          payments={payments}
          expenses={expenses}
          monthlyFee={config.cuota_mensual}
        />;
      case 'calendar':
        return <Calendar employees={employees} />;
      case 'collaborators':
        return <Collaborators
          employees={employees}
          onAdd={handleAddEmployee}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />;
      case 'treasurer':
        return <TreasurerPanel
          employees={employees}
          payments={payments}
          config={config}
          onTogglePayment={handleTogglePayment}
        />;
      case 'gallery':
        return <Gallery
          expenses={expenses}
          photos={[]}
          payments={payments}
          employees={employees}
        />;
      case 'settings':
        return <Settings config={config} onSave={handleSaveConfig} />;
      default:
        return <Dashboard
          employees={employees}
          payments={payments}
          expenses={expenses}
          monthlyFee={config.cuota_mensual}
        />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0fdfa] text-gray-800">
      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white z-30 border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-tropical-sea">AlohaFunds</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile) */}
      <div className={`
        fixed inset-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:inset-auto md:w-64 md:block
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar currentView={currentView} setView={(v) => { setView(v); setIsMobileMenuOpen(false); }} />
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 ml-0 md:ml-64 w-full max-w-7xl mx-auto overflow-y-auto">
        {/* Dynamic Title based on View */}
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 capitalize">
            {currentView === 'dashboard' && 'Resumen General 🌴'}
            {currentView === 'calendar' && 'Calendario de Fiestas 📅'}
            {currentView === 'collaborators' && 'Gestión de Equipo 👥'}
            {currentView === 'treasurer' && 'Panel del Tesorero 💰'}
            {currentView === 'gallery' && 'Social & Transparencia 📸'}
            {currentView === 'settings' && 'Configuración ⚙️'}
          </h2>
          <p className="text-gray-500 mt-2">
            {currentView === 'dashboard' && 'Bienvenido al control de la fiesta y la playa.'}
            {currentView === 'calendar' && 'Todas las fechas importantes en un solo lugar.'}
            {currentView === 'collaborators' && 'Administra quiénes forman parte de la familia AlohaFunds.'}
            {currentView === 'treasurer' && 'Gestiona los pagos y envía recordatorios.'}
            {currentView === 'gallery' && 'La evidencia de que el dinero se usa bien.'}
            {currentView === 'settings' && 'Ajusta los montos y mensajes.'}
          </p>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;