import React, { useState } from 'react';
import { Download, Smartphone, Laptop, Check, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  variant?: 'header' | 'hero' | 'compact';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Check className="w-3.5 h-3.5" />
        <span>Ecolux Instalada</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        return;
      }
    }
    // If not installable directly (e.g. iOS Safari, or browser ambient mode), show the quick instruction guide
    setShowGuideModal(true);
  };

  const buttonClasses =
    variant === 'header'
      ? 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer'
      : 'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all cursor-pointer';

  return (
    <>
      <button
        onClick={handleClick}
        className={buttonClasses}
        title="Instala Ecolux en tu dispositivo"
        aria-label="Instala Ecolux"
      >
        <Download className="w-4 h-4 shrink-0 text-white" />
        <span className="whitespace-nowrap">Instala Ecolux</span>
      </button>

      {/* Interactive Installation Guide Modal for Android, iOS & Desktop */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-left">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">Instalar Ecolux</h3>
                <p className="text-xs text-black/70">Acceso instantáneo sin conexión y pantalla completa</p>
              </div>
            </div>

            <div className="space-y-4 my-4">
              {isIOS ? (
                <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sky-900 text-sm">
                    <Smartphone className="w-4 h-4 text-sky-600" />
                    <span>Instrucciones para iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="text-xs text-black/80 space-y-2 list-decimal list-inside pl-1">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-sky-700">1.</span>
                      <span>
                        Toca el botón <strong>Compartir</strong> <Share2 className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" /> en la barra inferior de Safari.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-sky-700">2.</span>
                      <span>
                        Desliza y selecciona <strong>"Agregar a pantalla de inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" />.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-sky-700">3.</span>
                      <span>Toca <strong>Agregar</strong> en la esquina superior derecha.</span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-black text-sm">
                      <Smartphone className="w-4 h-4 text-sky-600" />
                      <span>En Teléfono Android (Chrome):</span>
                    </div>
                    <p className="text-xs text-black/70">
                      Toca el menú de tres puntos <strong>(⋮)</strong> en la esquina superior y pulsa <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla de inicio"</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-black text-sm">
                      <Laptop className="w-4 h-4 text-sky-600" />
                      <span>En Computadora (Chrome / Edge):</span>
                    </div>
                    <p className="text-xs text-black/70">
                      Haz clic en el icono de instalación <strong>(⤓)</strong> ubicado al lado derecho de la barra de direcciones de tu navegador.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full sm:w-auto px-5 py-2 text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
