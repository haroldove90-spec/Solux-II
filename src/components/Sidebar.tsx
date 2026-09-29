import React, { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  CheckSquare,
  MessageSquareText,
  ClipboardList,
  PackageMinus,
  QrCode,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck,
  HardHat,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    criticalStockCount,
    pendingTasksCount,
    resetAllData,
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  if (currentRole === 'client') return null;

  const adminTabs = [
    {
      id: 'dashboard',
      label: 'Panel General',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'inventory',
      label: 'Inventario de Insumos',
      icon: Boxes,
      badge: criticalStockCount > 0 ? `${criticalStockCount} alertas` : null,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    },
    {
      id: 'tasks',
      label: 'Pendientes y Tareas',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount} activos` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'surveys',
      label: 'Encuestas y Satisfacción',
      icon: MessageSquareText,
      badge: null,
    },
  ];

  const operativeTabs = [
    {
      id: 'my_tasks',
      label: 'Mis Pendientes del Día',
      icon: ClipboardList,
      badge: null,
    },
    {
      id: 'supplies',
      label: 'Consumo de Material',
      icon: PackageMinus,
      badge: null,
    },
    {
      id: 'close_service',
      label: 'Cierre de Servicio / QR',
      icon: QrCode,
      badge: null,
    },
    {
      id: 'inventory',
      label: 'Consulta de Inventario',
      icon: Boxes,
      badge: criticalStockCount > 0 ? `${criticalStockCount} bajo stock` : null,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    },
  ];

  const tabs = currentRole === 'admin' ? adminTabs : operativeTabs;

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-20 ${
        isCollapsed ? 'w-20' : 'w-64 lg:w-72'
      }`}
    >
      {/* Role Profile Bar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              {currentRole === 'admin' ? (
                <ShieldCheck className="w-5 h-5 text-sky-600" />
              ) : (
                <HardHat className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div className="truncate">
              <h4 className="text-sm font-bold text-black truncate leading-tight">
                {currentRole === 'admin' ? 'Romel Montes' : 'Carlos Mendoza'}
              </h4>
              <p className="text-xs text-black/70 font-semibold truncate">
                {currentRole === 'admin' ? 'Gerente General' : 'Personal Operativo'}
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <User className="w-5 h-5 text-sky-600" />
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-black/70 hover:text-black hover:bg-slate-100 transition-colors ml-auto cursor-pointer"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-black/70">
            {!isCollapsed ? 'Módulos Operativos' : '•'}
          </p>
        </div>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-black/70 hover:text-black hover:bg-slate-100'
              }`}
              title={tab.label}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-white stroke-[2.2]' : 'text-black/70 group-hover:text-black'
                }`}
              />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="truncate">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : tab.badgeColor
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer controls inside sidebar */}
      <div className="p-3 border-t border-slate-100 space-y-1.5">
        <button
          onClick={() => setCurrentRole(null)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-black/70 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          title="Cambiar de Rol"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Cambiar Rol / Salir</span>}
        </button>

        <button
          onClick={() => {
            if (window.confirm('¿Deseas reiniciar los datos de prueba a los valores de fábrica?')) {
              resetAllData();
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-black/70 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
          title="Reiniciar datos iniciales"
        >
          <RefreshCw className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Restablecer Datos Demo</span>}
        </button>
      </div>
    </aside>
  );
};
