import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  AlertCircle,
  MapPin,
  X,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../../types';

export const TasksModule: React.FC = () => {
  const { tasks, addTask, updateTaskStatus } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  // New Task Modal
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newPriority, setNewPriority] = useState<TaskPriority>('Media');
  const [newAssignee, setNewAssignee] = useState('Carlos Mendoza');
  const [newDescription, setNewDescription] = useState('');

  // Closing Note Modal
  const [closingTask, setClosingTask] = useState<Task | null>(null);
  const [closingNoteText, setClosingNoteText] = useState('');

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || t.assignee === assigneeFilter;
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClient.trim()) return;

    addTask({
      title: newTitle.trim(),
      client: newClient.trim(),
      location: newLocation.trim() || 'Sede principal del cliente',
      date: newDate,
      priority: newPriority,
      status: 'todo',
      assignee: newAssignee,
      description: newDescription.trim(),
    });

    setIsNewTaskModalOpen(false);
    setNewTitle('');
    setNewClient('');
    setNewLocation('');
    setNewDescription('');
  };

  const handleOpenCompleteModal = (task: Task) => {
    setClosingTask(task);
    setClosingNoteText('');
  };

  const handleConfirmCloseTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingTask) return;

    updateTaskStatus(
      closingTask.id,
      'completed',
      closingNoteText.trim() || 'Servicio de limpieza concluido satisfactoriamente.'
    );
    setClosingTask(null);
  };

  const renderTaskCard = (task: Task) => (
    <div
      key={task.id}
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
              task.priority === 'Alta'
                ? 'bg-rose-100 text-rose-700'
                : task.priority === 'Media'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-black/70'
            }`}
          >
            {task.priority}
          </span>
          <span className="text-[11px] text-black/70 flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3 text-slate-400" />
            {task.date}
          </span>
        </div>

        <h4 className="text-sm font-bold text-black leading-snug">{task.title}</h4>
        <div className="text-xs font-semibold text-sky-700 mt-1">{task.client}</div>

        {task.location && (
          <div className="text-[11px] text-black/70 mt-1 flex items-start gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{task.location}</span>
          </div>
        )}

        {task.description && (
          <p className="text-xs text-black/70 mt-2 bg-slate-50 p-2 rounded-lg line-clamp-2">
            {task.description}
          </p>
        )}

        {task.closingNote && (
          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-900">
            <span className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Nota de Cierre:
            </span>
            <p className="mt-0.5 text-[11px] text-emerald-800 italic">"{task.closingNote}"</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-black/70">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-black">{task.assignee}</span>
        </div>

        {/* Quick status transition button */}
        <div className="flex items-center gap-1">
          {task.status === 'todo' && (
            <button
              onClick={() => updateTaskStatus(task.id, 'in_progress')}
              className="px-2 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition cursor-pointer"
              title="Pasar a En Progreso"
            >
              Iniciar →
            </button>
          )}
          {task.status === 'in_progress' && (
            <button
              onClick={() => handleOpenCompleteModal(task)}
              className="px-2 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
              title="Marcar como Resuelto"
            >
              Completar ✓
            </button>
          )}
          {task.status === 'completed' && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Listo
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
            Pendientes y Tareas
          </h1>
          <p className="text-sm text-black/70 mt-1">
            Asignación y seguimiento de servicios de limpieza por cuadrilla, fecha y prioridad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch Kanban vs Lista */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-black/70 hover:text-black'
              }`}
              title="Vista Tablero Kanban"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-black/70 hover:text-black'
              }`}
              title="Vista Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Crear Pendiente</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por servicio, cliente o dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-black placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Prioridad */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="all">Todas las Prioridades</option>
            <option value="Alta">Prioridad Alta</option>
            <option value="Media">Prioridad Media</option>
            <option value="Baja">Prioridad Baja</option>
          </select>

          {/* Encargado */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="all">Todos los Encargados</option>
            <option value="Carlos Mendoza">Carlos Mendoza</option>
            <option value="Ana Torres">Ana Torres</option>
            <option value="Romel Montes">Romel Montes</option>
          </select>
        </div>
      </div>

      {/* VISTA 1: TABLERO KANBAN */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna: Por Hacer */}
          <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h3 className="text-sm font-bold text-black uppercase tracking-wide">Por Hacer</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 text-black/70 rounded-full">
                {todoTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto min-h-[150px]">
              {todoTasks.length === 0 ? (
                <div className="text-center py-8 text-black/50 text-xs">Sin tareas pendientes</div>
              ) : (
                todoTasks.map(renderTaskCard)
              )}
            </div>
          </div>

          {/* Columna: En Progreso */}
          <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-sky-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
                <h3 className="text-sm font-bold text-sky-950 uppercase tracking-wide">En Progreso</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full border border-sky-200">
                {inProgressTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto min-h-[150px]">
              {inProgressTasks.length === 0 ? (
                <div className="text-center py-8 text-black/50 text-xs">Ninguna cuadrilla en ejecución</div>
              ) : (
                inProgressTasks.map(renderTaskCard)
              )}
            </div>
          </div>

          {/* Columna: Resuelto */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">Resuelto</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                {completedTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto min-h-[150px]">
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 text-black/50 text-xs">No hay servicios concluidos</div>
              ) : (
                completedTasks.map(renderTaskCard)
              )}
            </div>
          </div>
        </div>
      ) : (
        /* VISTA 2: LISTA DETALLADA */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-black/70 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Servicio / Tarea</th>
                  <th className="py-3 px-4">Cliente & Sede</th>
                  <th className="py-3 px-4">Prioridad</th>
                  <th className="py-3 px-4">Encargado</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {task.status === 'todo' && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                          Por hacer
                        </span>
                      )}
                      {task.status === 'in_progress' && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-sky-100 text-sky-800">
                          En progreso
                        </span>
                      )}
                      {task.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                          Resuelto
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-black max-w-xs">{task.title}</td>
                    <td className="py-3 px-4 text-xs text-black/80">
                      <div className="font-semibold text-black">{task.client}</div>
                      <div className="text-black/70">{task.location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'Alta'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'Media'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-black/70'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-black">{task.assignee}</td>
                    <td className="py-3 px-4 text-xs font-mono text-black/70">{task.date}</td>
                    <td className="py-3 px-4 text-right">
                      {task.status === 'todo' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                          className="px-2.5 py-1 text-xs font-bold text-sky-700 hover:bg-sky-50 rounded-lg cursor-pointer"
                        >
                          Iniciar
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => handleOpenCompleteModal(task)}
                          className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                        >
                          Completar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Crear Pendiente */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-black">Nuevo Pendiente / Servicio</h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Título del Pendiente / Trabajo
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Limpieza profunda de alfombras y cristales"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Cliente / Empresa
                  </label>
                  <input
                    type="text"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="Ej. Corporativo Santander"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Fecha de Ejecución
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Ubicación o Dirección
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Ej. Piso 8, Oficinas de Dirección General"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Personal Encargado
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Carlos Mendoza">Carlos Mendoza</option>
                    <option value="Ana Torres">Ana Torres</option>
                    <option value="Romel Montes">Romel Montes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Instrucciones o Requerimientos Especiales
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Insumos necesarios, protocolos de acceso, precauciones..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-black/70 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Cerrar Tarea con Nota */}
      {closingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-black">Concluir Servicio</h3>
              <button
                onClick={() => setClosingTask(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCloseTask} className="space-y-4 mt-4">
              <div>
                <p className="text-xs text-black/70 mb-1">Tarea a completar:</p>
                <h4 className="text-sm font-bold text-black">{closingTask.title}</h4>
                <p className="text-xs text-sky-700 font-semibold">{closingTask.client}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Nota de Cierre / Observaciones finales
                </label>
                <textarea
                  rows={3}
                  value={closingNoteText}
                  onChange={(e) => setClosingNoteText(e.target.value)}
                  placeholder="Detalla cómo quedó el área, firma de conformidad o entrega de llaves..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClosingTask(null)}
                  className="px-4 py-2 text-xs font-semibold text-black/70 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Marcar como Resuelto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
