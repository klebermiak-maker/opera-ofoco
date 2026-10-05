import React from 'react';
import { RotateCcw, Map } from 'lucide-react';
import { AgentAvatar } from './AgentAvatar';

interface GameOverModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onReturnToCentral: () => void;
  hint?: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onRetry,
  onReturnToCentral,
  hint,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="flex justify-center mb-4">
          <AgentAvatar mood="encouraging" size="md" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
          VIDAS ESGOTADAS
        </div>

        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Quase lá! Tente novamente.
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Observe novamente. Analise todos os elementos com calma antes de responder. A concentração melhora a cada tentativa!
        </p>

        {hint && (
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-amber-300/90 text-left mb-6">
            <span className="font-semibold block text-amber-400 mb-0.5">Dica do Agente:</span>
            {hint}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-400 text-slate-950 transition-colors shadow-lg shadow-rose-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TENTAR NOVAMENTE</span>
          </button>
          <button
            onClick={onReturnToCentral}
            className="py-3 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <Map className="w-4 h-4 text-slate-400" />
            <span>Central</span>
          </button>
        </div>
      </div>
    </div>
  );
};
