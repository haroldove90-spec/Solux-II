import React from 'react';
import { ShieldCheck, UserCog, HardHat, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';

interface RoleOption {
  id: Role;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const RoleSelector: React.FC = () => {
  const { setCurrentRole } = useApp();

  const roles: RoleOption[] = [
    {
      id: 'admin',
      name: 'Administrador / Gerente General',
      icon: ShieldCheck,
    },
    {
      id: 'supervisor',
      name: 'Supervisor de Limpieza',
      icon: UserCog,
    },
    {
      id: 'operative',
      name: 'Personal Operativo',
      icon: HardHat,
    },
    {
      id: 'client',
      name: 'Cliente Final (Vista Pública)',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl">
        {/* Brand identity emblem subtle & minimal */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/20 mb-3">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              <path d="M16 14l3-3" />
              <path d="M8 10l-2-2" />
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black">Ecolux</h1>
          <p className="text-xs uppercase tracking-widest text-black/70 font-semibold mt-1">
            Sistema de Gestión Integral
          </p>
        </div>

        {/* Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio: Sin header, sin descripciones, solo nombre del rol */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setCurrentRole(role.id)}
                className="group relative flex flex-col items-center justify-center min-h-[170px] sm:min-h-[200px] p-6 bg-white hover:bg-sky-50/50 active:bg-sky-100/60 rounded-2xl border border-slate-200 hover:border-sky-500 shadow-sm hover:shadow-md transition-all duration-200 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 mb-4 rounded-xl bg-slate-100 group-hover:bg-sky-600 group-hover:text-white text-sky-700 flex items-center justify-center transition-colors duration-200">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-sm sm:text-base font-bold text-black group-hover:text-sky-900 leading-snug">
                  {role.name}
                </span>
                <span className="absolute bottom-3 text-[11px] text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  Ingresar →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
