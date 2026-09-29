import React from 'react';
import {
  Star,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Package,
  Plus,
  ArrowRight,
  Sparkles,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    tasks,
    ratings,
    criticalStockCount,
    averageRating,
    pendingTasksCount,
    setActiveTab,
  } = useApp();

  const criticalProducts = products.filter((p) => p.currentStock <= p.minStock);
  const urgentTasks = tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 4);
  const recentRatings = ratings.slice(0, 3);

  const fiveStarPercentage = ratings.length > 0
    ? Math.round((ratings.filter((r) => r.overallScore === 5).length / ratings.length) * 100)
    : 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-sky-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-sky-100 backdrop-blur-xs mb-3 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>Panel de Control Gerencial Ecolux</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Bienvenido, Romel Montes
            </h1>
            <p className="text-sm text-sky-100/90 mt-1 max-w-xl">
              Monitorea el inventario de insumos, el estatus operativo de las cuadrillas y la satisfacción del cliente en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('inventory')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-sky-900 hover:bg-sky-50 transition shadow-xs cursor-pointer"
            >
              <Package className="w-4 h-4 text-sky-700" />
              <span>Gestionar Stock</span>
            </button>
            <button
              onClick={() => setActiveTab('surveys')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-500/40 hover:bg-sky-500/60 text-white border border-white/20 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-sky-200" />
              <span>Generar Encuesta QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Métricas Clave Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {/* Métrica 1: Calificación Promedio de Satisfacción */}
        <div
          onClick={() => setActiveTab('surveys')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-black/70">
              Satisfacción del Cliente
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-black">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-black/70">/ 5.0 estrellas</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {fiveStarPercentage}% valoraciones 5★
            </span>
            <span className="text-sky-600 font-medium group-hover:underline">
              {ratings.length} encuestas →
            </span>
          </div>
        </div>

        {/* Métrica 2: Alertas de Stock Mínimo */}
        <div
          onClick={() => setActiveTab('inventory')}
          className={`bg-white p-5 rounded-2xl border shadow-xs hover:shadow-md transition cursor-pointer group ${
            criticalStockCount > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-black/70">
              Alertas de Stock Mínimo
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                criticalStockCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl sm:text-4xl font-black ${
                criticalStockCount > 0 ? 'text-rose-600' : 'text-black'
              }`}
            >
              {criticalStockCount}
            </span>
            <span className="text-xs font-semibold text-black/70">
              {criticalStockCount === 1 ? 'insumo crítico' : 'insumos críticos'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span
              className={`font-semibold ${
                criticalStockCount > 0 ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {criticalStockCount > 0 ? 'Requieren compra inmediata' : 'Niveles óptimos'}
            </span>
            <span className="text-sky-600 font-medium group-hover:underline">
              Ver catálogo →
            </span>
          </div>
        </div>

        {/* Métrica 3: Total de Pendientes por Resolver */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-black/70">
              Pendientes por Resolver
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-black">
              {pendingTasksCount}
            </span>
            <span className="text-xs font-semibold text-black/70">servicios activos</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-black/70 font-semibold">
              {tasks.filter((t) => t.status === 'in_progress').length} en ejecución ahora
            </span>
            <span className="text-sky-600 font-medium group-hover:underline">
              Ver tablero →
            </span>
          </div>
        </div>
      </div>

      {/* Grid de 2 Columnas: Stock Crítico & Tareas Prioritarias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Insumos Críticos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-black">Insumos bajo Nivel Crítico</h2>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              Ver todo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {criticalProducts.length === 0 ? (
            <div className="text-center py-8 text-black/70 text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Todos los insumos químicos, herramientas y consumibles cuentan con stock suficiente.
            </div>
          ) : (
            <div className="space-y-3">
              {criticalProducts.slice(0, 4).map((product) => {
                const stockPercent = Math.min(
                  100,
                  Math.round((product.currentStock / product.minStock) * 100)
                );
                return (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-black/80">
                            {product.category}
                          </span>
                          <span className="text-xs font-mono text-black/70">{product.sku}</span>
                        </div>
                        <h4 className="text-sm font-bold text-black mt-1">{product.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                          {product.currentStock} {product.unit}
                        </span>
                        <div className="text-[11px] text-black/70 mt-1">
                          Mínimo: {product.minStock} {product.unit}
                        </div>
                      </div>
                    </div>
                    {/* Barra de progreso */}
                    <div className="mt-2.5 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all"
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tareas y Pendientes del Día */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-black">Seguimiento de Servicios del Día</h2>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              Tablero completo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          task.priority === 'Alta'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'Media'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-black/70'
                        }`}
                      >
                        Prioridad {task.priority}
                      </span>
                      <span className="text-xs font-semibold text-sky-700">{task.client}</span>
                    </div>
                    <h4 className="text-sm font-bold text-black mt-1">{task.title}</h4>
                    <p className="text-xs text-black/70 mt-0.5 flex items-center gap-1">
                      <span>Encargado:</span>
                      <span className="font-semibold text-black">{task.assignee}</span>
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-lg shrink-0 ${
                      task.status === 'in_progress'
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : 'bg-slate-200 text-black/70'
                    }`}
                  >
                    {task.status === 'in_progress' ? 'En Progreso' : 'Por Hacer'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calificaciones Recientes de Clientes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-black">Últimas Evaluaciones Recibidas</h2>
          </div>
          <button
            onClick={() => setActiveTab('surveys')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            Ver reporte consolidado <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentRatings.map((rating) => (
            <div
              key={rating.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rating.overallScore
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-black/70 font-mono">{rating.date}</span>
                </div>
                <h4 className="text-sm font-bold text-black">{rating.serviceName}</h4>
                <p className="text-xs font-semibold text-sky-700">{rating.clientName}</p>
                <p className="text-xs text-black/70 italic mt-2 line-clamp-3">
                  "{rating.comments || 'Sin comentarios adicionales.'}"
                </p>
              </div>

              {rating.staffAssigned && (
                <div className="mt-3 pt-2 border-t border-slate-200/70 text-[11px] text-black/70 flex items-center justify-between">
                  <span>Personal:</span>
                  <span className="font-semibold text-black">{rating.staffAssigned}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
