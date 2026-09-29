import React from 'react';
import { LayoutDashboard, Boxes, CheckSquare, MessageSquareText, ClipboardList, PackageMinus, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, criticalStockCount, pendingTasksCount } = useApp();

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
      label: 'Inventario',
      icon: Boxes,
      badge: criticalStockCount > 0 ? criticalStockCount : null,
      badgeColor: 'bg-rose-500',
    },
    {
      id: 'tasks',
      label: 'Pendientes',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'surveys',
      label: 'Encuestas',
      icon: MessageSquareText,
      badge: null,
    },
  ];

  const operativeTabs = [
    {
      id: 'my_tasks',
      label: 'Mis Tareas',
      icon: ClipboardList,
      badge: null,
    },
    {
      id: 'supplies',
      label: 'Consumo',
      icon: PackageMinus,
      badge: null,
    },
    {
      id: 'close_service',
      label: 'Cierre / QR',
      icon: QrCode,
      badge: null,
    },
    {
      id: 'inventory',
      label: 'Insumos',
      icon: Boxes,
      badge: null,
    },
  ];

  const tabs = currentRole === 'admin' ? adminTabs : operativeTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1 safe-area-pb">
      <div className="grid grid-flow-col auto-cols-fr items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-sky-600 font-bold' : 'text-black/70 hover:text-black font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-sky-600 stroke-[2.25]' : 'stroke-[1.75]'}`} />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-1 leading-none tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-sky-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
