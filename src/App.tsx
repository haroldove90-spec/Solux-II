/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { RoleSelector } from './components/RoleSelector';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InventoryModule } from './components/admin/InventoryModule';
import { TasksModule } from './components/admin/TasksModule';
import { SurveysModule } from './components/admin/SurveysModule';
import { OperativeDashboard } from './components/operative/OperativeDashboard';
import { ClientSurveyView } from './components/client/ClientSurveyView';
import { OfflineIndicator } from './components/common/OfflineIndicator';

const MainLayout: React.FC = () => {
  const { currentRole, activeTab } = useApp();

  // 1. Selector limpio de Roles en Inicio (Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio)
  if (!currentRole) {
    return <RoleSelector />;
  }

  // 2. Vista Pública: Cliente Final (Sin inicio de sesión)
  if (currentRole === 'client') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <ClientSurveyView />
        <OfflineIndicator />
      </div>
    );
  }

  // 3. Renderizado de Contenido según Rol y Módulo Activo
  const renderContent = () => {
    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'inventory':
          return <InventoryModule />;
        case 'tasks':
          return <TasksModule />;
        case 'surveys':
          return <SurveysModule />;
        default:
          return <AdminDashboard />;
      }
    }

    // Rol: Personal Operativo o Supervisor de Limpieza
    if (currentRole === 'operative' || currentRole === 'supervisor') {
      if (activeTab === 'inventory') {
        return <InventoryModule />;
      }
      return <OperativeDashboard />;
    }

    return <AdminDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-black flex flex-col">
      {/* Cabecera Institucional Unificada */}
      <Header />

      <div className="flex-1 flex w-full">
        {/* Menú Lateral Desplegable en Escritorio */}
        <Sidebar />

        {/* Área de Trabajo Principal - Sin pestañas repetitivas para maximizar área de datos */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden pb-20 md:pb-10">
          {renderContent()}
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomNav />

      {/* Indicador de Estado Offline PWA */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
