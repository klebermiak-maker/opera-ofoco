import React from 'react';
import { Play, BookOpen, Eye, Award, Shield, CheckCircle2 } from 'lucide-react';
import { AgentAvatar } from './AgentAvatar';
import { DailyTip } from './DailyTip';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenAccessibility: () => void;
  hasExistingProgress: boolean;
  unlockedMissionNumber: number;
  totalScore: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenHowToPlay,
  onOpenAccessibility,
  hasExistingProgress,
  unlockedMissionNumber,
  totalScore,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-61px)] flex flex-col justify-center items-center px-4 sm:px-6 py-8 overflow-hidden">
      {/* Background Tech Grid Graphic */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Decorative ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-6">
        {/* Character element (non-moving, focused, modern) */}
        <div className="flex justify-center mb-2">
          <div className="relative p-2 rounded-full bg-slate-900/80 border border-cyan-500/30 shadow-xl shadow-cyan-950/50">
            <AgentAvatar mood="ready" size="lg" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/40 text-[11px] font-semibold text-cyan-300 uppercase tracking-widest whitespace-nowrap">
              Agente em Treinamento
            </div>
          </div>
        </div>

        {/* Narrative & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900/80 border border-slate-750 text-xs font-semibold text-cyan-400">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Centro de Operações Táticas Cognitivas
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white uppercase text-balance drop-shadow-sm">
            OPERAÇÃO FOCO
          </h1>

          <p className="text-base sm:text-xl font-medium tracking-wide text-cyan-300">
            O DESAFIO DA CONCENTRAÇÃO
          </p>
        </div>

        {/* Componente DailyTip posicionado logo abaixo do subtítulo */}
        <DailyTip />

        {/* Narrative Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 text-left sm:text-center leading-relaxed backdrop-blur-sm shadow-lg">
          <p>
            Uma falha misteriosa atingiu o Centro de Comando. Para restaurar o sistema, o agente precisa completar 15 diferentes missões de concentração, atenção e memória. Cada missão concluída restabelece um subsistema de segurança.
          </p>
        </div>

        {/* Progress status if already played */}
        {hasExistingProgress && (
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Fase Atual: {String(unlockedMissionNumber).padStart(2, '0')}/15
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono-numbers">
              <Award className="w-3.5 h-3.5" />
              {totalScore} pontos
            </span>
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto w-full">
          <button
            onClick={onStartGame}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-base bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 group active:scale-[0.98]"
            aria-label={hasExistingProgress ? 'Continuar treinamento nas missões' : 'Iniciar missão de treinamento'}
          >
            <Play className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>{hasExistingProgress ? 'CONTINUAR MISSÃO' : 'INICIAR MISSÃO'}</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-colors flex items-center justify-center gap-2"
            aria-label="Abrir manual de instruções"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>COMO JOGAR</span>
          </button>

          <button
            onClick={onOpenAccessibility}
            className="w-full sm:w-auto py-3.5 px-4 rounded-xl font-semibold text-sm bg-slate-900/60 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 transition-colors flex items-center justify-center gap-1.5"
            aria-label="Configurar acessibilidade"
          >
            <Eye className="w-4 h-4" />
            <span>ACESSIBILIDADE</span>
          </button>
        </div>

        {/* Footer info for school lab */}
        <div className="pt-4 text-xs text-slate-300">
          Laboratório Educativo de Raciocínio & Computação · Ensino Fundamental
        </div>
      </div>
    </div>
  );
};

