import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'primary' | 'subtle' | 'compact';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'primary' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [manualPromptSuccess, setManualPromptSuccess] = useState(false);

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">App</span> Instalada
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) setManualPromptSuccess(true);
    } else {
      setShowModal(true);
    }
  };

  const getButtonClasses = () => {
    if (variant === 'subtle') {
      return 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-200 active:scale-95';
    }
    if (variant === 'compact') {
      return 'p-2 rounded-lg text-rose-700 hover:bg-rose-50 transition border border-rose-200 active:scale-95';
    }
    return 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md hover:from-rose-700 hover:to-rose-800 transition active:scale-95';
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Instalar Marketplace Belleza"
        title="Instalar aplicación en dispositivo"
        className={getButtonClasses()}
      >
        <Download className="w-4 h-4 text-current animate-bounce" />
        <span className={variant === 'compact' ? 'sr-only' : ''}>Instalar App</span>
      </button>

      {/* Guidance modal for iOS Safari or instructions on desktop/other */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Instalar Marketplace Belleza</h3>
                <p className="text-xs text-slate-500">Acceso rápido sin descargas de tienda</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-sm text-slate-600 bg-rose-50/60 p-4 rounded-xl border border-rose-100">
                <p className="font-medium text-slate-800">Para instalar en tu iPhone o iPad:</p>
                <div className="flex items-start gap-2.5">
                  <Share2 className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <span>1. Toca el botón <strong>Compartir</strong> en la barra inferior de Safari.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <PlusSquare className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <span>2. Desplaza hacia abajo y selecciona <strong>"Agregar a Inicio"</strong>.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="font-medium text-slate-800">Instalación en Android o Computadora:</p>
                <p className="text-xs leading-relaxed">
                  Haz clic en el menú del navegador (tres puntos ⋮ en la esquina superior) y pulsa <strong>"Instalar Marketplace Belleza"</strong> o <strong>"Agregar a pantalla principal"</strong>.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
