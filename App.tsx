import React, { useState } from 'react';
import { ViewState, Config, Employee } from './types';
import { MOCK_EMPLOYEES, MOCK_PAYMENTS, INITIAL_CONFIG, MOCK_EXPENSES, MOCK_PHOTOS } from './data';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TreasurerPanel from './components/TreasurerPanel';
import Gallery from './components/Gallery';
import Settings from './components/Settings';
import Collaborators from './components/Collaborators';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock Data State (Simulating DB)
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [config, setConfig] = useState(INITIAL_CONFIG);

  // Handlers
  const handleTogglePayment = (employeeId: string) => {
    setPayments(prev => prev.map(p => {
      if (p.empleado_id === employeeId) {
        return { 
            ...p, 
            confirmado: !p.confirmado,
            fecha_pago: !p.confirmado ? new Date().toISOString() : null 
        };
      }
      return p;
    }));
  };

  const handleSaveConfig = (newConfig: Config) => {
    setConfig(newConfig);
  };

  // Employee CRUD Handlers
  const handleAddEmployee = (newEmp: Omit<Employee, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9); // Simple random ID
    const employeeWithId: Employee = { ...newEmp, id };
    setEmployees(prev => [...prev, employeeWithId]);
  };

  const handleEditEmployee = (updatedEmp: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  // View Routing
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          employees={employees} 
          payments={payments} 
          expenses={MOCK_EXPENSES}
          monthlyFee={config.cuota_mensual} 
        />;
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
          expenses={MOCK_EXPENSES} 
          photos={MOCK_PHOTOS}
          payments={payments}
          employees={employees}
        />;
      case 'settings':
        return <Settings config={config} onSave={handleSaveConfig} />;
      default:
        return <Dashboard 
          employees={employees} 
          payments={payments} 
          expenses={MOCK_EXPENSES} 
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
                {currentView === 'collaborators' && 'Gestión de Equipo 👥'}
                {currentView === 'treasurer' && 'Panel del Tesorero 💰'}
                {currentView === 'gallery' && 'Social & Transparencia 📸'}
                {currentView === 'settings' && 'Configuración ⚙️'}
            </h2>
            <p className="text-gray-500 mt-2">
                {currentView === 'dashboard' && 'Bienvenido al control de la fiesta y la playa.'}
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