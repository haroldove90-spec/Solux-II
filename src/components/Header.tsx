import React from 'react';
import { LogOut, UserCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole } = useApp();

  const getRoleDisplay = () => {
    switch (currentRole) {
      case 'admin':
        return {
          title: 'Romel Montes',
          badge: 'Administrador / Gerente General',
          badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
        };
      case 'supervisor':
        return {
          title: 'Supervisor de Operaciones',
          badge: 'Supervisor de Limpieza',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'operative':
        return {
          title: 'Carlos Mendoza',
          badge: 'Personal Operativo',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'client':
        return {
          title: 'Cliente Final',
          badge: 'Vista Pública',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      default:
        return {
          title: 'Invitado',
          badge: 'Sin Rol',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  const roleInfo = getRoleDisplay();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logotipo del Sistema */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-black flex items-center gap-1.5 leading-none">
              Ecolux
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-black/70 font-semibold mt-0.5">
              Servicios Profesionales de Limpieza
            </span>
          </div>
        </div>

        {/* Acciones de Cabecera: Rol Activo + Instala Ecolux + Cerrar Sesión */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Identificación del Rol Activo */}
          <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-xl">
            <UserCheck className="w-4 h-4 text-sky-600" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-black leading-tight">{roleInfo.title}</span>
              <span className="text-[10px] font-semibold text-black/70">{roleInfo.badge}</span>
            </div>
          </div>

          {/* Botón de instalación rápida de la aplicación */}
          <PWAInstallButton variant="header" />

          {/* Botón de Cierre de Sesión / Cambiar Rol */}
          <button
            onClick={() => setCurrentRole(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-black/70 hover:text-black hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Cambiar de Rol / Cerrar Sesión"
          >
            <LogOut className="w-4 h-4 text-black/70" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};
