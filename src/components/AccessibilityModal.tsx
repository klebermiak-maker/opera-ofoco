import React from 'react';
import { X, Eye, Volume2, VolumeX, Type, ZapOff, Keyboard, Check } from 'lucide-react';
import { AccessibilitySettings } from '../types/game';

interface AccessibilityModalProps {
  isOpen: boolean;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Fechar painel de acessibilidade"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 id="accessibility-title" className="text-xl font-display font-bold text-white">
              Recursos de Acessibilidade
            </h2>
            <p className="text-xs text-slate-400">
              Personalize a experiência para maior conforto visual e motor
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Alto Contraste */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">Modo Alto Contraste</div>
              <p className="text-xs text-slate-400">
                Aumenta o contraste entre o fundo e os elementos do jogo com bordas reforçadas.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.highContrast ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={settings.highContrast}
              aria-label="Alternar modo de alto contraste"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Tamanho da Fonte */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Type className="w-4 h-4 text-cyan-400" />
              Tamanho do Texto
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'extralarge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    settings.fontSize === size
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                  aria-pressed={settings.fontSize === size}
                >
                  {size === 'normal' && 'Padrão'}
                  {size === 'large' && 'Grande'}
                  {size === 'extralarge' && 'Extra Grande'}
                </button>
              ))}
            </div>
          </div>

          {/* Reduzir Animações */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ZapOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-white">Reduzir Animações</div>
                <p className="text-xs text-slate-400">
                  Desativa movimentos e transições para quem tem sensibilidade a estímulos visuais.
                </p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.reducedMotion ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={settings.reducedMotion}
              aria-label="Alternar redução de movimento"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Efeitos Sonoros */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-sm font-semibold text-white">Efeitos Sonoros</div>
                <p className="text-xs text-slate-400">
                  Sons sintetizados de acerto, erro e conquista. O jogo possui feedback visual completo mesmo com som desativado.
                </p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={settings.soundEnabled}
              aria-label="Alternar som"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Dicas de Teclado e Foco */}
          <div className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              Navegação por Teclado Suportada
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use a tecla <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300 font-mono text-[11px] border border-slate-700">Tab</kbd> para navegar entre botões e alvos, e <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300 font-mono text-[11px] border border-slate-700">Enter</kbd> ou <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300 font-mono text-[11px] border border-slate-700">Espaço</kbd> para acionar. Todos os elementos possuem contorno de foco visível.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
          >
            <Check className="w-4 h-4" />
            Salvar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
