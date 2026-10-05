import React from 'react';
import { Heart, Timer, Award, AlertCircle, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import { MissionDef, FeedbackState } from '../types/game';

interface MissionContainerProps {
  mission: MissionDef;
  lives: number;
  score: number;
  timeLeft?: number;
  maxTime?: number;
  streak: number;
  feedback: FeedbackState;
  onRetry: () => void;
  children: React.ReactNode;
}

export const MissionContainer: React.FC<MissionContainerProps> = ({
  mission,
  lives,
  score,
  timeLeft,
  maxTime,
  streak,
  feedback,
  onRetry,
  children,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-4">
      {/* Top Mission HUD */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mission Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono-numbers font-bold flex items-center justify-center text-sm shadow-sm">
            {String(mission.id).padStart(2, '0')}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-cyan-400">
              <span>{mission.code}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">{mission.category}</span>
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white leading-tight">
              {mission.title}
            </h2>
          </div>
        </div>

        {/* Right: Lives, Timer & Score */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Timer if present */}
          {timeLeft !== undefined && maxTime !== undefined && (
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Timer className="w-4 h-4 text-cyan-400" />
              <span className="font-mono-numbers font-bold text-sm text-cyan-300">
                {timeLeft}s
              </span>
            </div>
          )}

          {/* Lives: 3 hearts */}
          <div
            className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
            aria-label={`${lives} de 3 vidas restantes`}
          >
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  heart <= lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-700 scale-90 opacity-40'
                }`}
              />
            ))}
          </div>

          {/* Current Score & Streak */}
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Pontuação</div>
            <div className="font-mono-numbers font-bold text-sm sm:text-base text-amber-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{score}</span>
              {streak > 1 && (
                <span className="text-[10px] text-emerald-400 font-normal ml-1">
                  ({streak}x)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Banner - Clear, prominent and accessible */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-cyan-100 leading-relaxed font-medium">
          <span className="font-bold text-cyan-300 mr-1.5">INSTRUÇÃO DA MISSÃO:</span>
          {mission.instruction}
        </div>
      </div>

      {/* Real-time Feedback Banner if active */}
      {feedback.type && (
        <div
          role="status"
          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs sm:text-sm font-semibold transition-all ${
            feedback.type === 'correct'
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
              : 'bg-rose-950/70 border-rose-500/60 text-rose-300'
          }`}
        >
          {feedback.type === 'correct' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Active Phase Content Stage */}
      <div className="min-h-[420px] rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col justify-center relative">
        {children}
      </div>

      {/* Bottom Hint / Pedagogy line */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-300 px-1">
        <span>Foco Cognitivo: {mission.cognitiveFocus.join(' · ')}</span>
        <button
          onClick={onRetry}
          className="text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1"
          aria-label="Reiniciar tentativa atual"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Esta Fase</span>
        </button>
      </div>
    </div>
  );
};
