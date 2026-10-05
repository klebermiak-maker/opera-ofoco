import React from 'react';
import { Award, RotateCcw, Home, Map, Star, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { AgentAvatar } from './AgentAvatar';
import { GameProgress } from '../types/game';

interface FinalVictoryScreenProps {
  progress: GameProgress;
  onPlayAgain: () => void;
  onGoToMenu: () => void;
  onGoToCentral: () => void;
}

export const FinalVictoryScreen: React.FC<FinalVictoryScreenProps> = ({
  progress,
  onPlayAgain,
  onGoToMenu,
  onGoToCentral,
}) => {
  const totalStars = Object.values(progress.missions).reduce((sum, m) => sum + (m.stars || 0), 0);
  const maxPossibleStars = 45; // 15 missions * 3
  const starPercentage = Math.round((totalStars / maxPossibleStars) * 100);

  // Concentration profile rating
  let profile = {
    title: 'FOCO EXCELENTE',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/60 border-emerald-500/40',
    indicator: '🟢',
    description: 'Você demonstrou extraordinária atenção seletiva, controle inibitório e raciocínio sequencial sob pressão. O Centro de Comando está 100% operacional sob sua guarda!'
  };

  if (starPercentage < 50) {
    profile = {
      title: 'FOCO EM DESENVOLVIMENTO',
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/60 border-sky-500/40',
      indicator: '🔵',
      description: 'Você concluiu todas as 15 etapas de treinamento! Com mais rodadas de treino, seu tempo de resposta e memória operacional ficarão ainda mais afiados!'
    };
  } else if (starPercentage < 80) {
    profile = {
      title: 'BOM FOCO',
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/60 border-amber-500/40',
      indicator: '🟡',
      description: 'Excelente precisão e dedicação! Você superou desafios complexos de detalhes, padrões e regras duplas com grande habilidade de concentração.'
    };
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Character Celebration */}
        <div className="flex justify-center">
          <div className="relative">
            <AgentAvatar mood="celebrating" size="lg" />
            <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-400 text-slate-950 shadow-lg">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            SISTEMA 100% RESTAURADO
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            🏆 OPERAÇÃO CONCLUÍDA!
          </h1>
          <p className="text-base sm:text-xl font-medium text-cyan-300">
            “Você demonstrou excelente capacidade de concentração!”
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Pontuação Final</div>
            <div className="text-2xl font-mono-numbers font-bold text-emerald-400">
              {progress.totalScore}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Missões Feitas</div>
            <div className="text-2xl font-mono-numbers font-bold text-cyan-400">
              15/15
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Estrelas Ganhas</div>
            <div className="text-2xl font-mono-numbers font-bold text-amber-400 flex items-center justify-center gap-1">
              <span>★</span> {totalStars}/{maxPossibleStars}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Desempenho</div>
            <div className="text-2xl font-mono-numbers font-bold text-purple-400">
              {starPercentage}%
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className={`p-5 rounded-2xl border text-left max-w-2xl mx-auto ${profile.bgColor}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">{profile.indicator}</span>
            <span className={`text-base font-display font-bold uppercase tracking-wider ${profile.color}`}>
              Nível Avaliado: {profile.title}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
            {profile.description}
          </p>
          <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-2">
            * Resultado puramente lúdico e formativo do desempenho no jogo, não constituindo avaliação psicológica ou diagnóstica.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={onPlayAgain}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>JOGAR NOVAMENTE</span>
          </button>

          <button
            onClick={onGoToCentral}
            className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Map className="w-4 h-4 text-cyan-400" />
            <span>CENTRAL</span>
          </button>

          <button
            onClick={onGoToMenu}
            className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
