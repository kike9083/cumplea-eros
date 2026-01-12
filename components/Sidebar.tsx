import React from 'react';
import { LayoutDashboard, Wallet, Image, Settings, Sun, Users, Calendar } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'collaborators', label: 'Colaboradores', icon: Users },
    { id: 'treasurer', label: 'Tesorero', icon: Wallet },
    { id: 'gallery', label: 'Social & Transparencia', icon: Image },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-tropical-sand h-screen fixed left-0 top-0 z-20 shadow-xl">
      <div className="p-6 flex items-center justify-center border-b border-tropical-sand bg-gradient-to-r from-tropical-sea to-tropical-teal text-white">
        <Sun className="w-8 h-8 mr-2 animate-spin-slow" />
        <h1 className="text-2xl font-bold tracking-tight">AlohaFunds</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-tropical-light text-tropical-sea font-bold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-tropical-teal'
                }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-tropical-sunset' : ''}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-tropical-sand">
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <p className="text-xs text-orange-600 font-semibold mb-1">Meta Playa 🏖️</p>
          <div className="w-full bg-orange-200 rounded-full h-2.5 mb-2">
            <div className="bg-tropical-sunset h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-orange-500 text-right">45% Completado</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;