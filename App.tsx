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
import Login from './components/Login';
import { Menu, Loader } from 'lucide-react';
import { NotificationService } from './NotificationService';
import { supabase } from './supabaseClient';
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
  updateConfig,
  getEventPhotos,
  addEventPhoto,
  addExpense,
  deleteExpense
} from './services';

const App: React.FC = () => {
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // App State
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [config, setConfig] = useState<Config>(INITIAL_CONFIG);
  const [loading, setLoading] = useState(true);

  // Handle Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setIsGuest(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Data when authenticated or guest
  useEffect(() => {
    if (session || isGuest) {
      fetchData();
    }
  }, [session, isGuest]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empData, payData, expData, confData, photoData] = await Promise.all([
        getEmployees(),
        getPayments(),
        getExpenses(),
        getConfig(),
        getEventPhotos()
      ]);
      setEmployees(empData);
      setPayments(payData);
      setExpenses(expData);
      setConfig(confData);
      setEventPhotos(photoData);

      // Notification logic (only for admin or if explicitly enabled)
      await NotificationService.requestPermission();
      NotificationService.checkAndNotifyBirthdays(empData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Permission check
  const isAdmin = !!session;

  // Handlers (with Admin check)
  const handleTogglePayment = async (employeeId: string, month?: number, year?: number) => {
    if (!isAdmin) return alert("Solo los administradores pueden gestionar pagos.");

    const today = new Date();
    const targetMonth = month || today.getMonth() + 1;
    const targetYear = year || today.getFullYear();

    const targetPayment = payments.find(p =>
      p.empleado_id === employeeId &&
      p.mes === targetMonth &&
      p.anio === targetYear
    );

    if (targetPayment) {
      try {
        const updated = await togglePaymentConfirmation(targetPayment.id, !targetPayment.confirmado);
        setPayments(prev => prev.map(p => p.id === updated.id ? updated : p));
      } catch (error) {
        console.error("Error toggling payment", error);
      }
    } else {
      try {
        const newPayment = await createPayment({
          empleado_id: employeeId,
          mes: targetMonth,
          anio: targetYear,
          monto_pagado: config.cuota_mensual,
          confirmado: true,
          fecha_pago: new Date().toISOString()
        });
        setPayments(prev => [...prev, newPayment]);
      } catch (error) {
        console.error("Error creating payment", error);
      }
    }
  };

  const handleSaveConfig = async (newConfig: Config) => {
    if (!isAdmin) return;
    try {
      const updated = await updateConfig(newConfig);
      setConfig(updated);
    } catch (error) {
      console.error("Error saving config", error);
    }
  };

  const handleAddEmployee = async (newEmp: Omit<Employee, 'id'>) => {
    if (!isAdmin) return;
    try {
      const added = await addEmployee(newEmp);
      setEmployees(prev => [...prev, added]);
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  const handleEditEmployee = async (updatedEmp: Employee) => {
    if (!isAdmin) return;
    try {
      const updated = await updateEmployee(updatedEmp);
      setEmployees(prev => prev.map(emp => emp.id === updated.id ? updated : emp));
    } catch (error) {
      console.error("Error editing employee", error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const handleAddPhoto = async (photo: Omit<EventPhoto, 'id'>) => {
    if (!isAdmin) return;
    try {
      const added = await addEventPhoto(photo);
      setEventPhotos(prev => [...prev, added]);
    } catch (error) {
      console.error("Error adding photo", error);
    }
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!isAdmin) return;
    try {
      const added = await addExpense(expense);
      setExpenses(prev => [...prev, added]);
    } catch (error) {
      console.error("Error adding expense", error);
    }
  };

  // Resort Progress Calculation
  const resortFund = payments
    .filter(p => p.confirmado)
    .reduce((acc, curr) => acc + Math.max(0, curr.monto_pagado - 3), 0);

  const resortProgress = config.meta_resort > 0
    ? Math.min(100, Math.round((resortFund / config.meta_resort) * 100))
    : 0;

  // Render Logic
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-10 h-10 animate-spin text-tropical-teal" />
      </div>
    );
  }

  if (!session && !isGuest) {
    return <Login onGuestMode={() => setIsGuest(true)} />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-full items-center justify-center py-20">
          <Loader className="w-10 h-10 animate-spin text-tropical-teal" />
          <span className="ml-2 text-tropical-teal font-medium tracking-tight">Cargando paraíso...</span>
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
          expenses={expenses}
          config={config}
          onTogglePayment={handleTogglePayment}
        />;
      case 'gallery':
        return <Gallery
          expenses={expenses}
          photos={eventPhotos}
          payments={payments}
          employees={employees}
          onAddPhoto={handleAddPhoto}
          onAddExpense={handleAddExpense}
        />;
      case 'settings':
        return <Settings config={config} onSave={handleSaveConfig} />;
      default:
        return <Dashboard employees={employees} payments={payments} expenses={expenses} monthlyFee={config.cuota_mensual} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-gray-800">
      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white/80 backdrop-blur-md z-30 border-b border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black text-tropical-sea">AlohaFunds</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          currentView={currentView}
          setView={(v) => { setView(v); setIsMobileMenuOpen(false); }}
          user={session?.user}
          resortProgress={resortProgress}
        />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 ml-0 md:ml-0 w-full max-w-7xl mx-auto overflow-y-auto">
        <header className="mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            {currentView === 'dashboard' && 'Resumen General 🌴'}
            {currentView === 'calendar' && 'Calendario de Fiestas 📅'}
            {currentView === 'collaborators' && 'Gestión de Equipo 👥'}
            {currentView === 'treasurer' && 'Panel del Tesorero 💰'}
            {currentView === 'gallery' && 'Social & Transparencia 📸'}
            {currentView === 'settings' && 'Configuración ⚙️'}
          </h2>
          <p className="text-gray-400 mt-2 font-medium">
            {currentView === 'dashboard' && 'Control de la recaudación y metas del equipo.'}
            {currentView === 'calendar' && 'Fechas de cumpleaños de todos los colaboradores.'}
            {currentView === 'collaborators' && 'Administración de los miembros del fondo.'}
            {currentView === 'treasurer' && 'Control de aportes y recordatorios por cobrar.'}
            {currentView === 'gallery' && 'Registro visual de eventos y facturas de gastos.'}
            {currentView === 'settings' && 'Ajustes globales del sistema AlohaFunds.'}
          </p>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;