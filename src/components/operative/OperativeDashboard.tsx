import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Play,
  PackageMinus,
  QrCode,
  Send,
  MapPin,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Share2,
  ExternalLink,
  Sparkles,
  X,
  FileText,
  Boxes,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { QRCodeView } from '../common/QRCodeView';

export const OperativeDashboard: React.FC = () => {
  const {
    tasks,
    updateTaskStatus,
    products,
    consumeSupplies,
    activeTab,
    setActiveTab,
    setCurrentRole,
  } = useApp();

  // Closing Task Modal
  const [closingTask, setClosingTask] = useState<Task | null>(null);
  const [closingNoteText, setClosingNoteText] = useState('');

  // Supply Consumption State
  const [selectedTaskForSupplies, setSelectedTaskForSupplies] = useState<string>(
    tasks[0]?.client || 'Servicio de Limpieza'
  );
  const [consumptionItems, setConsumptionItems] = useState<
    { productId: string; quantity: number }[]
  >([
    { productId: products[0]?.id || '', quantity: 2 },
  ]);
  const [consumptionSuccess, setConsumptionSuccess] = useState(false);

  // QR / Survey Presentation State
  const [selectedTaskForQR, setSelectedTaskForQR] = useState<string>(
    tasks[0]?.client || 'Servicio Ecolux'
  );
  const [clientPhone, setClientPhone] = useState('');

  // Filter tasks for operative (Carlos Mendoza / current active)
  const operativeName = 'Carlos Mendoza';
  const myTasks = tasks.filter(
    (t) => t.assignee === operativeName || t.status === 'in_progress'
  );

  const handleStartTask = (taskId: string) => {
    updateTaskStatus(taskId, 'in_progress');
  };

  const handleOpenCloseModal = (task: Task) => {
    setClosingTask(task);
    setClosingNoteText('');
  };

  const handleConfirmClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingTask) return;

    updateTaskStatus(
      closingTask.id,
      'completed',
      closingNoteText.trim() || 'Servicio de limpieza concluido satisfactoriamente.'
    );
    setClosingTask(null);
  };

  // Add line to consumption form
  const handleAddConsumptionLine = () => {
    setConsumptionItems((prev) => [
      ...prev,
      { productId: products[0]?.id || '', quantity: 1 },
    ]);
  };

  const handleRemoveConsumptionLine = (index: number) => {
    setConsumptionItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateItem = (index: number, productId: string, quantity: number) => {
    setConsumptionItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { productId, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleSaveConsumption = (e: React.FormEvent) => {
    e.preventDefault();
    consumeSupplies(consumptionItems, selectedTaskForSupplies, operativeName);
    setConsumptionSuccess(true);
    setTimeout(() => {
      setConsumptionSuccess(false);
      setConsumptionItems([{ productId: products[0]?.id || '', quantity: 1 }]);
    }, 3000);
  };

  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://ecolux.app';
  const surveyUrl = `${currentOrigin}/?role=client&service=${encodeURIComponent(
    selectedTaskForQR
  )}&staff=${encodeURIComponent(operativeName)}`;

  const handleSendWhatsApp = () => {
    const text = `¡Hola! Gracias por confiar en el equipo de Ecolux. Por favor califica mi servicio aquí en 1 minuto: ${surveyUrl}`;
    const cleanNumber = clientPhone.replace(/\D/g, '');
    const waUrl = cleanNumber
      ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Banner de Cuadrilla Operativa */}
      <div className="bg-gradient-to-r from-sky-800 to-sky-700 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-sky-100 backdrop-blur-xs mb-2">
            <span>Operaciones de Campo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Hola, {operativeName}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-0.5">
            Turno activo • Registra avances, consumo de insumos y entrega la encuesta al cliente.
          </p>
        </div>

        {/* Quick Tabs switcher for operative */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('my_tasks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'my_tasks'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'bg-sky-900/50 text-white hover:bg-sky-900'
            }`}
          >
            Mis Tareas
          </button>
          <button
            onClick={() => setActiveTab('supplies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'supplies'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'bg-sky-900/50 text-white hover:bg-sky-900'
            }`}
          >
            Reportar Consumo
          </button>
          <button
            onClick={() => setActiveTab('close_service')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'close_service'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'bg-sky-900/50 text-white hover:bg-sky-900'
            }`}
          >
            QR de Encuesta
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: MIS PENDIENTES DEL DÍA */}
      {activeTab === 'my_tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-sky-600" />
              <span>Tareas Asignadas para Hoy</span>
            </h2>
            <span className="text-xs text-black/70 font-semibold">
              {myTasks.filter((t) => t.status !== 'completed').length} pendientes por completar
            </span>
          </div>

          <div className="space-y-3">
            {myTasks.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-black/70">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-black">¡No tienes servicios pendientes por ahora!</p>
                <p className="text-xs text-black/70 mt-1">Buen trabajo manteniendo todo al día.</p>
              </div>
            ) : (
              myTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition ${
                    task.status === 'in_progress'
                      ? 'border-sky-400 ring-2 ring-sky-100 bg-sky-50/20'
                      : task.status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50/15 opacity-85'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            task.priority === 'Alta'
                              ? 'bg-rose-100 text-rose-700'
                              : task.priority === 'Media'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-black/70'
                          }`}
                        >
                          Prioridad {task.priority}
                        </span>

                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            task.status === 'in_progress'
                              ? 'bg-sky-100 text-sky-800'
                              : task.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-black/70'
                          }`}
                        >
                          {task.status === 'in_progress'
                            ? '● En Ejecución'
                            : task.status === 'completed'
                            ? '✓ Resuelto'
                            : 'Pendiente de inicio'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-black">{task.title}</h3>
                      <div className="text-sm font-semibold text-sky-800 mt-0.5">{task.client}</div>

                      {task.location && (
                        <div className="text-xs text-black/70 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.location}</span>
                        </div>
                      )}

                      {task.description && (
                        <div className="text-xs text-black/80 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="font-bold text-black/90">Instrucciones: </span>
                          {task.description}
                        </div>
                      )}

                      {task.closingNote && (
                        <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-950">
                          <span className="font-bold">Nota de Cierre Guardada: </span>
                          <span className="italic">"{task.closingNote}"</span>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción operativa */}
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      {task.status === 'todo' && (
                        <button
                          onClick={() => handleStartTask(task.id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                          <span>Iniciar Tarea</span>
                        </button>
                      )}

                      {task.status === 'in_progress' && (
                        <>
                          <button
                            onClick={() => handleOpenCloseModal(task)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Completar</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTaskForSupplies(task.client);
                              setActiveTab('supplies');
                            }}
                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition cursor-pointer"
                          >
                            <PackageMinus className="w-3 h-3 text-sky-600" />
                            <span>Insumos Usados</span>
                          </button>
                        </>
                      )}

                      {task.status === 'completed' && (
                        <button
                          onClick={() => {
                            setSelectedTaskForQR(task.client);
                            setActiveTab('close_service');
                          }}
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Encuesta QR</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: SOLICITUD / CONSUMO DE MATERIAL */}
      {activeTab === 'supplies' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-black flex items-center gap-2">
                <PackageMinus className="w-5 h-5 text-sky-600" />
                <span>Reporte de Consumo de Insumos</span>
              </h2>
              <p className="text-xs text-black/70 mt-0.5">
                Registra los productos químicos o consumibles utilizados para descontar automáticamente del inventario central.
              </p>
            </div>
          </div>

          {consumptionSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                ¡Consumo registrado con éxito! El inventario central de Ecolux ha sido actualizado.
              </span>
            </div>
          )}

          <form onSubmit={handleSaveConsumption} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                Servicio / Sede donde se utilizaron los insumos
              </label>
              <select
                value={selectedTaskForSupplies}
                onChange={(e) => setSelectedTaskForSupplies(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {tasks.map((t) => (
                  <option key={t.id} value={t.client}>
                    {t.client} — {t.title}
                  </option>
                ))}
                <option value="Limpieza General Extra">Limpieza General Extra / Taller</option>
              </select>
            </div>

            {/* Lista de productos consumidos */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-black/70">
                  Insumos a Descontar
                </span>
                <button
                  type="button"
                  onClick={handleAddConsumptionLine}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar otro insumo
                </button>
              </div>

              {consumptionItems.map((item, index) => {
                const selectedProd = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  >
                    <div className="flex-1">
                      <select
                        value={item.productId}
                        onChange={(e) =>
                          handleUpdateItem(index, e.target.value, item.quantity)
                        }
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.category}] {p.name} (Stock: {p.currentStock} {p.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max={selectedProd ? selectedProd.currentStock : 99}
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(
                              index,
                              item.productId,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-20 p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-black text-center focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <span className="text-xs text-black/70 font-semibold w-16">
                          {selectedProd?.unit || 'unidades'}
                        </span>
                      </div>

                      {consumptionItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveConsumptionLine(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="Eliminar fila"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition cursor-pointer"
              >
                Confirmar y Descontar de Bodega
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECCIÓN 3: CIERRE DE SERVICIO / ENVÍO DE ENCUESTA */}
      {activeTab === 'close_service' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <QrCode className="w-5 h-5 text-sky-600" />
              <span>Cierre de Servicio y Envío de Encuesta</span>
            </h2>
            <p className="text-xs text-black/70 mt-0.5">
              Solicita la evaluación del cliente en persona mostrando este código QR o enviando el enlace por WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Código QR grande para escanear en pantalla */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-black/70 mb-3">
                Muestra la pantalla al cliente
              </span>

              <div className="p-3 bg-white rounded-2xl border-2 border-sky-400 shadow-md">
                <QRCodeView value={surveyUrl} size={200} />
              </div>

              <div className="mt-4">
                <div className="text-sm font-bold text-black">{selectedTaskForQR}</div>
                <div className="text-xs text-sky-700 font-semibold mt-0.5">
                  Atendido por: {operativeName}
                </div>
              </div>
            </div>

            {/* Opciones directas: WhatsApp / Enlace / Abrir en este dispositivo */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Cambiar Servicio Asociado
                </label>
                <select
                  value={selectedTaskForQR}
                  onChange={(e) => setSelectedTaskForQR(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.client}>
                      {t.client}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>Enviar por WhatsApp al Cliente</span>
                </div>
                <p className="text-xs text-black/70">
                  Ingresa el número celular del cliente (opcional) o abre WhatsApp para seleccionar el chat:
                </p>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Ej. 55 1234 5678"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="flex-1 p-2 bg-white border border-emerald-200 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSendWhatsApp}
                    className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition cursor-pointer"
                  >
                    Enviar WhatsApp
                  </button>
                </div>
              </div>

              {/* Botón de llenado directo en este equipo */}
              <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200 space-y-2">
                <div className="text-xs font-bold text-sky-950">
                  ¿El cliente no tiene teléfono a mano?
                </div>
                <p className="text-xs text-black/70">
                  Permítele calificar el servicio directamente en este dispositivo:
                </p>
                <button
                  onClick={() => setCurrentRole('client')}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Abrir Encuesta en esta pantalla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cerrar Tarea con Nota de Cierre */}
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

            <form onSubmit={handleConfirmClose} className="space-y-4 mt-4">
              <div>
                <p className="text-xs text-black/70 mb-1">Servicio a concluir:</p>
                <h4 className="text-sm font-bold text-black">{closingTask.title}</h4>
                <p className="text-xs text-sky-700 font-semibold">{closingTask.client}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Nota de Cierre / Reporte del Servicio
                </label>
                <textarea
                  rows={3}
                  value={closingNoteText}
                  onChange={(e) => setClosingNoteText(e.target.value)}
                  placeholder="Ej. Áreas desinfectadas, botes vaciados, piso pulido. Cliente conforme."
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
                  Guardar y Finalizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
