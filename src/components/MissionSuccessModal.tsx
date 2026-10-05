import React from 'react';
import { Award, ArrowRight, RotateCcw, Map, Sparkles, CheckCircle2 } from 'lucide-react';
import { AgentAvatar } from './AgentAvatar';

interface MissionSuccessModalProps {
  isOpen: boolean;
  missionNumber: number;
  missionTitle: string;
  earnedStars: number;
  scoreGained: number;
  streakBonus: number;
  speedBonus: number;
  hasNextMission: boolean;
  onNextMission: () => void;
  onRetryMission: () => void;
  onReturnToCentral: () => void;
}

export const MissionSuccessModal: React.FC<MissionSuccessModalProps> = ({
  isOpen,
  missionNumber,
  missionTitle,
  earnedStars,
  scoreGained,
  streakBonus,
  speedBonus,
  hasNextMission,
  onNextMission,
  onRetryMission,
  onReturnToCentral,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative corner light */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-center mb-4">
          <AgentAvatar mood="celebrating" size="md" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          MISSÃO {String(missionNumber).padStart(2, '0')} CONCLUÍDA!
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-1">
          Excelente! Você manteve o foco!
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Módulo <span className="text-slate-200 font-semibold">{missionTitle}</span> restaurado com sucesso no Centro de Comando.
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((star) => (
            <div
              key={star}
              className={`text-3xl transition-transform duration-300 ${
                star <= earnedStars ? 'text-amber-400 scale-110' : 'text-slate-700 opacity-40'
              }`}
              aria-label={star <= earnedStars ? 'Estrela conquistada' : 'Estrela não conquistada'}
            >
              ★
            </div>
          ))}
        </div>

        {/* Score Breakdown Card */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 mb-6 text-xs text-left space-y-2">
          <div className="flex justify-between items-center text-slate-300">
            <span>Pontos da Missão:</span>
            <span className="font-mono-numbers font-bold text-emerald-400">+{scoreGained} pts</span>
          </div>
          {speedBonus > 0 && (
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1 text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" /> Bônus de Rapidez:
              </span>
              <span className="font-mono-numbers font-bold text-cyan-400">+{speedBonus} pts</span>
            </div>
          )}
          {streakBonus > 0 && (
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1 text-amber-300">
                <Award className="w-3.5 h-3.5" /> Sequência Perfeita:
              </span>
              <span className="font-mono-numbers font-bold text-amber-400">+{streakBonus} pts</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-700 flex justify-between items-center font-bold text-sm text-white">
            <span>Total na Rodada:</span>
            <span className="font-mono-numbers text-amber-400">
              +{scoreGained + speedBonus + streakBonus} pts
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {hasNextMission ? (
            <button
              onClick={onNextMission}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <span>Próxima Missão</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onReturnToCentral}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20"
            >
              <span>Ver Grande Conclusão</span>
              <Award className="w-4 h-4" />
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={onRetryMission}
              className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Jogar esta fase novamente para melhorar a pontuação"
              aria-label="Repetir Missão"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onReturnToCentral}
              className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Voltar ao mapa de missões"
              aria-label="Central de Missões"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
