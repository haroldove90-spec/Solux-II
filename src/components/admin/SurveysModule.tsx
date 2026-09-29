import React, { useState } from 'react';
import {
  Star,
  QrCode,
  Share2,
  Copy,
  Check,
  Settings,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  Filter,
  Send,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QRCodeView } from '../common/QRCodeView';

export const SurveysModule: React.FC = () => {
  const { ratings, surveyConfig, updateSurveyConfig, averageRating, setCurrentRole } = useApp();

  const [activeTab, setActiveTab] = useState<'report' | 'generator' | 'config'>('report');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedClientFilter, setSelectedClientFilter] = useState('all');
  const [targetServiceName, setTargetServiceName] = useState('Servicio General de Limpieza');
  const [targetStaff, setTargetStaff] = useState('Carlos Mendoza');

  // Compute stats
  const totalSurveys = ratings.length;
  const avgQuality =
    totalSurveys > 0
      ? (ratings.reduce((acc, r) => acc + r.cleanQualityScore, 0) / totalSurveys).toFixed(1)
      : '5.0';
  const avgPunctuality =
    totalSurveys > 0
      ? (ratings.reduce((acc, r) => acc + r.punctualityScore, 0) / totalSurveys).toFixed(1)
      : '5.0';
  const avgStaffCare =
    totalSurveys > 0
      ? (ratings.reduce((acc, r) => acc + r.staffCareScore, 0) / totalSurveys).toFixed(1)
      : '5.0';

  // Distribution
  const starCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: ratings.filter((r) => r.overallScore === stars).length,
    percentage:
      totalSurveys > 0
        ? Math.round(
            (ratings.filter((r) => r.overallScore === stars).length / totalSurveys) * 100
          )
        : 0,
  }));

  // Public survey link
  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://ecolux.app';
  const surveyUrl = `${currentOrigin}/?role=client&service=${encodeURIComponent(
    targetServiceName
  )}&staff=${encodeURIComponent(targetStaff)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `¡Hola! Gracias por confiar en Ecolux para la limpieza de tus instalaciones. Te invitamos a calificar nuestro servicio en 1 minuto aquí: ${surveyUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredRatings = ratings.filter((r) => {
    if (selectedClientFilter === 'all') return true;
    if (selectedClientFilter === '5') return r.overallScore === 5;
    if (selectedClientFilter === '4') return r.overallScore === 4;
    if (selectedClientFilter === 'low') return r.overallScore <= 3;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
            Encuestas de Satisfacción
          </h1>
          <p className="text-sm text-black/70 mt-1">
            Supervisa el NPS, las opiniones de clientes y genera enlaces QR para el cierre de servicios.
          </p>
        </div>

        <button
          onClick={() => setCurrentRole('client')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 rounded-xl transition cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 text-sky-600" />
          <span>Abrir Formulario de Cliente</span>
        </button>
      </div>

      {/* Subtabs de navegación */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition cursor-pointer ${
            activeTab === 'report'
              ? 'bg-sky-100 text-sky-800'
              : 'text-black/70 hover:text-black hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Reporte Consolidado</span>
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition cursor-pointer ${
            activeTab === 'generator'
              ? 'bg-sky-100 text-sky-800'
              : 'text-black/70 hover:text-black hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Generador de Enlace & QR</span>
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition cursor-pointer ${
            activeTab === 'config'
              ? 'bg-sky-100 text-sky-800'
              : 'text-black/70 hover:text-black hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Configuración de Preguntas</span>
        </button>
      </div>

      {/* CONTENIDO 1: REPORTE CONSOLIDADO */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Métricas destacadas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-black/70">Promedio General</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-black">{averageRating.toFixed(1)}</span>
                <span className="text-xs text-amber-500 font-bold flex items-center">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 ml-1" />
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-2">
                Basado en {totalSurveys} evaluaciones
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-black/70">Calidad de Limpieza</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-sky-700">{avgQuality}</span>
                <span className="text-xs text-black/70">/ 5.0</span>
              </div>
              <p className="text-[11px] text-black/70 mt-2">Acabados, desinfección y orden</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-black/70">Puntualidad</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-sky-700">{avgPunctuality}</span>
                <span className="text-xs text-black/70">/ 5.0</span>
              </div>
              <p className="text-[11px] text-black/70 mt-2">Llegada a tiempo de cuadrilla</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-black/70">Trato y Cuidado</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-sky-700">{avgStaffCare}</span>
                <span className="text-xs text-black/70">/ 5.0</span>
              </div>
              <p className="text-[11px] text-black/70 mt-2">Respeto y cuidado de bienes</p>
            </div>
          </div>

          {/* Histograma de Estrellas y Resumen */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-black mb-4">
              Distribución de Calificaciones (1 a 5 Estrellas)
            </h3>
            <div className="space-y-2.5 max-w-xl">
              {starCounts.map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-xs">
                  <div className="w-16 flex items-center gap-1 font-bold text-black">
                    <span>{item.stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-right font-mono text-black/70">
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Listado de Evaluaciones */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-bold text-black">Respuestas y Comentarios Recibidos</h3>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-black/70 font-semibold mr-1">Filtrar:</span>
                {[
                  { id: 'all', label: 'Todas' },
                  { id: '5', label: '5 Estrellas' },
                  { id: '4', label: '4 Estrellas' },
                  { id: 'low', label: '≤ 3 Estrellas' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedClientFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedClientFilter === f.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-black/70 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredRatings.map((rating) => (
                <div
                  key={rating.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-black">{rating.clientName}</h4>
                        <span className="text-xs text-sky-700 font-semibold">• {rating.serviceName}</span>
                      </div>
                      <div className="text-[11px] text-black/70 font-mono mt-0.5">{rating.date}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rating.overallScore
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-black ml-1.5">
                        {rating.overallScore}.0
                      </span>
                    </div>
                  </div>

                  {/* Sub-criterios */}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-black/80 font-medium bg-white/70 p-2 rounded-lg border border-slate-100">
                    <span>
                      Limpieza: <strong>{rating.cleanQualityScore}★</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Puntualidad: <strong>{rating.punctualityScore}★</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Atención: <strong>{rating.staffCareScore}★</strong>
                    </span>
                    {rating.staffAssigned && (
                      <>
                        <span>•</span>
                        <span>
                          Cuadrilla: <strong>{rating.staffAssigned}</strong>
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-black/80 italic">
                    "{rating.comments || 'Sin comentarios adicionales.'}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 2: GENERADOR DE ENLACE WEB Y CÓDIGO QR */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parámetros del enlace */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <QrCode className="w-5 h-5 text-sky-600" />
              <span>Personalizar Enlace de Encuesta</span>
            </h3>
            <p className="text-xs text-black/70">
              Genera un código QR o enlace web personalizado para que el cliente final califique inmediatamente al terminar el servicio.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Cliente o Servicio
                </label>
                <input
                  type="text"
                  value={targetServiceName}
                  onChange={(e) => setTargetServiceName(e.target.value)}
                  placeholder="Ej. Torre Reforma Corporativo"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Personal Asignado / Responsable
                </label>
                <select
                  value={targetStaff}
                  onChange={(e) => setTargetStaff(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Carlos Mendoza">Carlos Mendoza</option>
                  <option value="Ana Torres">Ana Torres</option>
                  <option value="Romel Montes">Romel Montes</option>
                  <option value="Equipo Ecolux">Equipo Ecolux (General)</option>
                </select>
              </div>
            </div>

            {/* Enlace generado */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                URL Pública de Encuesta
              </label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-black break-all select-all">
                {surveyUrl}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-black rounded-xl transition cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">¡Enlace Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>Copiar Enlace</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Enviar por WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Vista previa del Código QR */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
            <h4 className="text-base font-bold text-black mb-1">
              Código QR para Escaneo In Situ
            </h4>
            <p className="text-xs text-black/70 mb-4 max-w-xs">
              Muestra este código al cliente en tu teléfono o imprímelo en el reporte de servicio.
            </p>

            <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-md">
              <QRCodeView value={surveyUrl} size={190} />
            </div>

            <div className="mt-4 flex flex-col items-center">
              <span className="text-xs font-bold text-black">{targetServiceName}</span>
              <span className="text-[11px] text-sky-700 font-semibold">Atendido por: {targetStaff}</span>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 3: CONFIGURACIÓN DE PREGUNTAS */}
      {activeTab === 'config' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-black">Configuración del Formulario</h3>
            <p className="text-xs text-black/70 mt-1">
              Ajusta las preguntas clave que se presentan al cliente final.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                Mensaje de Bienvenida al Cliente
              </label>
              <textarea
                rows={2}
                value={surveyConfig.welcomeMessage}
                onChange={(e) => updateSurveyConfig({ welcomeMessage: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase text-black/70 block">
                Preguntas Activas en la Escala 1-5 Estrellas
              </span>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-black">Calidad del Servicio de Limpieza</div>
                  <div className="text-xs text-black/70">
                    Evalúa acabados, desinfección y orden general
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={surveyConfig.enableQualityQuestion}
                  onChange={(e) =>
                    updateSurveyConfig({ enableQualityQuestion: e.target.checked })
                  }
                  className="w-5 h-5 text-sky-600 rounded-md"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-black">Puntualidad del Personal</div>
                  <div className="text-xs text-black/70">
                    Evalúa la llegada y cumplimiento de horario acordado
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={surveyConfig.enablePunctualityQuestion}
                  onChange={(e) =>
                    updateSurveyConfig({ enablePunctualityQuestion: e.target.checked })
                  }
                  className="w-5 h-5 text-sky-600 rounded-md"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-black">Trato y Cuidado de Instalaciones</div>
                  <div className="text-xs text-black/70">
                    Evalúa la amabilidad, uniforme y cuidado con mobiliario
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={surveyConfig.enableStaffCareQuestion}
                  onChange={(e) =>
                    updateSurveyConfig({ enableStaffCareQuestion: e.target.checked })
                  }
                  className="w-5 h-5 text-sky-600 rounded-md"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-black">Campo Abierto de Comentarios</div>
                  <div className="text-xs text-black/70">
                    Permite al cliente dejar sugerencias o felicitaciones
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={surveyConfig.enableComments}
                  onChange={(e) => updateSurveyConfig({ enableComments: e.target.checked })}
                  className="w-5 h-5 text-sky-600 rounded-md"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                Teléfono de Atención Ecolux (Para soporte en encuesta)
              </label>
              <input
                type="text"
                value={surveyConfig.companyContactPhone}
                onChange={(e) => updateSurveyConfig({ companyContactPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
