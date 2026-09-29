import React, { useState, useEffect } from 'react';
import { Star, Sparkles, CheckCircle2, Heart, ArrowLeft, ShieldCheck, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClientSurveyView: React.FC = () => {
  const { submitSurvey, surveyConfig, setCurrentRole } = useApp();

  // Read URL parameters if provided
  const [clientName, setClientName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [staffAssigned, setStaffAssigned] = useState('');

  const [overallScore, setOverallScore] = useState<number>(5);
  const [cleanQualityScore, setCleanQualityScore] = useState<number>(5);
  const [punctualityScore, setPunctualityScore] = useState<number>(5);
  const [staffCareScore, setStaffCareScore] = useState<number>(5);
  const [comments, setComments] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlService = params.get('service');
      const urlStaff = params.get('staff');
      if (urlService) setServiceName(urlService);
      else setServiceName('Servicio de Limpieza Corporativa Ecolux');
      if (urlStaff) setStaffAssigned(urlStaff);
      else setStaffAssigned('Cuadrilla Ecolux');
    }
  }, []);

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 5:
        return '¡Excelente! Superó mis expectativas';
      case 4:
        return 'Muy Bueno, servicio de alta calidad';
      case 3:
        return 'Bueno, cumplió con lo básico';
      case 2:
        return 'Regular, hay áreas de mejora';
      case 1:
        return 'Deficiente, requiere revisión';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSurvey({
      clientName: clientName.trim() || 'Cliente Satisfecho',
      serviceName: serviceName.trim() || 'Servicio de Limpieza Ecolux',
      overallScore,
      cleanQualityScore,
      punctualityScore,
      staffCareScore,
      comments: comments.trim(),
      staffAssigned: staffAssigned || 'Equipo Ecolux',
    });
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Brand Header */}
        <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-sky-600 p-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 border border-white/20">
              <Sparkles className="w-6 h-6 text-sky-200" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Ecolux</h1>
            <p className="text-xs uppercase tracking-widest text-sky-200 font-semibold mt-0.5">
              Encuesta de Satisfacción del Cliente
            </p>
          </div>
        </div>

        {isSubmitted ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-black">¡Muchas Gracias por tu Opinión!</h2>
            <p className="text-sm text-black/70 max-w-sm mx-auto">
              Tu retroalimentación nos ayuda a mantener la máxima calidad y pulcritud en cada uno de nuestros servicios.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-black/80 space-y-1">
              <div>
                <strong>Calificación enviada:</strong> {overallScore} de 5 estrellas ★
              </div>
              <div>
                <strong>Atendido por:</strong> {staffAssigned}
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setComments('');
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition cursor-pointer"
              >
                Calificar otro servicio
              </button>
              <button
                onClick={() => setCurrentRole(null)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-black/70 hover:text-black transition cursor-pointer"
              >
                Volver al selector de roles
              </button>
            </div>
          </div>
        ) : (
          /* Feedback Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 text-xs text-sky-900">
              <p className="font-semibold text-sky-950">
                {surveyConfig.welcomeMessage}
              </p>
              <div className="mt-2 text-[11px] text-sky-800 flex items-center gap-1">
                <span>Servicio:</span>
                <span className="font-bold text-sky-950">{serviceName}</span>
              </div>
            </div>

            {/* PREGUNTA PRINCIPAL: 1-5 ESTRELLAS */}
            <div className="text-center space-y-2">
              <label className="block text-sm font-bold uppercase tracking-wide text-black">
                ¿Cómo calificarías tu experiencia general con Ecolux?
              </label>

              <div className="flex items-center justify-center gap-2 py-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallScore(star)}
                    className="p-1.5 focus:outline-none hover:scale-110 active:scale-95 transition cursor-pointer"
                    aria-label={`${star} estrellas`}
                  >
                    <Star
                      className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                        star <= overallScore
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold text-sky-700 bg-sky-50 py-1.5 px-3 rounded-full inline-block">
                {getScoreLabel(overallScore)}
              </div>
            </div>

            {/* PREGUNTAS SECUNDARIAS */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {surveyConfig.enableQualityQuestion && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black">
                      Calidad de Limpieza y Desinfección
                    </span>
                    <span className="text-xs font-mono font-bold text-sky-700">
                      {cleanQualityScore}/5 ★
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCleanQualityScore(val)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                          val === cleanQualityScore
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-slate-50 text-black/70 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val}★
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {surveyConfig.enablePunctualityQuestion && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black">
                      Puntualidad del Personal
                    </span>
                    <span className="text-xs font-mono font-bold text-sky-700">
                      {punctualityScore}/5 ★
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPunctualityScore(val)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                          val === punctualityScore
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-slate-50 text-black/70 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val}★
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {surveyConfig.enableStaffCareQuestion && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black">
                      Trato y Cuidado de tus Bienes
                    </span>
                    <span className="text-xs font-mono font-bold text-sky-700">
                      {staffCareScore}/5 ★
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setStaffCareScore(val)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                          val === staffCareScore
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-slate-50 text-black/70 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val}★
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DATOS DEL CLIENTE Y COMENTARIOS */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Tu Nombre o Empresa (Opcional)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Ing. Carlos Pérez / Torre Corporativa"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {surveyConfig.enableComments && (
                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Comentarios, Sugerencias o Felicitaciones
                  </label>
                  <textarea
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Cuéntanos más detalles sobre tu experiencia con el equipo de Ecolux..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}
            </div>

            {/* Botón de Enviar */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm shadow-md shadow-sky-600/25 transition cursor-pointer"
              >
                Enviar mi Calificación
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentRole(null)}
                className="text-xs text-black/70 hover:text-black flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al menú de roles</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
