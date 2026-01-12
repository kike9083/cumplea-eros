import React from 'react';
import { ViewState } from '../types';
import { supabase } from '../supabaseClient';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Image,
  Settings,
  Calendar,
  LogOut,
  User as UserIcon,
  Palmtree
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: any; // User object from Supabase or null for Guest
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'collaborators', label: 'Colaboradores', icon: Users },
    { id: 'treasurer', label: 'Tesorero', icon: Wallet },
    { id: 'gallery', label: 'Social & Transparencia', icon: Image },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const handleLogout = async () => {
    if (user) {
      await supabase.auth.signOut();
    } else {
      // Just refresh if guest to clear state (App.tsx handles this via state)
      window.location.reload();
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-10 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-tropical-teal to-blue-400 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <Palmtree className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">AlohaFunds</h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm
                ${currentView === item.id
                  ? 'bg-tropical-light text-tropical-sea shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100 flex flex-col space-y-4">
        {/* User Profile / Status */}
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 border border-gray-100">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-800 truncate">
              {user ? (user.email.split('@')[0]) : 'Invitado'}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {user ? 'Administrador' : 'Solo Lectura'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-bold text-sm w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>{user ? 'Cerrar Sesión' : 'Salir del Modo Vista'}</span>
        </button>

        <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-4 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase opacity-80 mb-1">Meta Playa 🏖️</p>
            <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
              <div className="bg-white h-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-[10px] font-bold mt-2">45% Completado</p>
          </div>
          {/* Aesthetic circle */}
          <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;