import React, { useState } from 'react';
import { Lock, Play, CheckCircle2, RotateCcw, Award, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { MISSIONS } from '../data/missions';
import { GameProgress, MissionStatus } from '../types/game';
import { sounds } from '../utils/audio';

interface MissionCentralProps {
  progress: GameProgress;
  onSelectMission: (missionId: number) => void;
  onResetProgress: () => void;
  onViewFinalVictory: () => void;
}

export const MissionCentral: React.FC<MissionCentralProps> = ({
  progress,
  onSelectMission,
  onResetProgress,
  onViewFinalVictory,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Compute stats
  const completedMissionsCount = Object.values(progress.missions).filter(m => m.completed).length;
  const totalStars = Object.values(progress.missions).reduce((acc, m) => acc + (m.stars || 0), 0);
  const percentRestored = Math.round((completedMissionsCount / 15) * 100);
  const allCompleted = completedMissionsCount >= 15;

  const getMissionStatus = (id: number): MissionStatus => {
    if (progress.missions[id]?.completed) return 'completed';
    if (id <= progress.unlockedMissionId) return 'available';
    return 'locked';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner / System Restoration Status */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              CENTRAL DE MISSÕES E RESTAURAÇÃO DO SISTEMA
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
              Painel de Controle Tático
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Complete as etapas em ordem para desbloquear os módulos de segurança do Centro de Comando.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 self-start md:self-auto bg-slate-950/60 p-3 sm:px-5 sm:py-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Concluídas</div>
              <div className="text-base sm:text-lg font-bold font-mono-numbers text-cyan-400">
                {completedMissionsCount}/15
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Estrelas</div>
              <div className="text-base sm:text-lg font-bold font-mono-numbers text-amber-400 flex items-center gap-1">
                <span>★</span> {totalStars}/45
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Pontuação</div>
              <div className="text-base sm:text-lg font-bold font-mono-numbers text-emerald-400">
                {progress.totalScore}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">Integridade do Centro de Comando</span>
            <span className="font-mono-numbers font-bold text-cyan-300">{percentRestored}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${percentRestored}%` }}
            />
          </div>
        </div>

        {/* Victory Callout if all 15 are completed */}
        {allCompleted && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Todos os 15 módulos foram restaurados com sucesso!</span>
            </div>
            <button
              onClick={onViewFinalVictory}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors whitespace-nowrap shadow-sm"
            >
              Ver Relatório Final
            </button>
          </div>
        )}
      </div>

      {/* Grid of 15 Missions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MISSIONS.map((mission) => {
          const status = getMissionStatus(mission.id);
          const missionData = progress.missions[mission.id];
          const isCompleted = status === 'completed';
          const isAvailable = status === 'available';
          const isLocked = status === 'locked';

          return (
            <div
              key={mission.id}
              className={`group relative rounded-2xl border p-5 transition-all text-left flex flex-col justify-between ${
                isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                  : isAvailable
                  ? 'bg-slate-900 border-cyan-500/50 hover:border-cyan-400 shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div>
                {/* Header: Code & Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-numbers font-bold text-xs text-slate-400">
                      {mission.code}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-cyan-300/80 font-medium">
                      {mission.category}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Concluída
                      </span>
                    )}
                    {isAvailable && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 animate-pulse">
                        <Play className="w-3 h-3 fill-cyan-400" />
                        Disponível
                      </span>
                    )}
                    {isLocked && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        <Lock className="w-3 h-3" />
                        Bloqueada
                      </span>
                    )}
                  </div>
                </div>

                {/* Mission Title */}
                <h3 className="text-base sm:text-lg font-display font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {mission.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                  {mission.description}
                </p>
              </div>

              {/* Bottom Card Area */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {/* Stars earned if completed */}
                <div>
                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                      {[1, 2, 3].map((s) => (
                        <span key={s} className={s <= (missionData?.stars || 0) ? 'text-amber-400' : 'text-slate-700'}>
                          ★
                        </span>
                      ))}
                      <span className="ml-1 text-[11px] font-mono-numbers text-slate-400">
                        {missionData?.highScore || 0} pts
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      {isAvailable ? 'Pronta para iniciar' : 'Conclua a anterior'}
                    </span>
                  )}
                </div>

                {/* Action button */}
                <button
                  disabled={isLocked}
                  onClick={() => {
                    sounds.playClick();
                    onSelectMission(mission.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isAvailable
                      ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 active:scale-95'
                      : isCompleted
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                      : 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                  }`}
                  aria-label={`${isCompleted ? 'Jogar novamente' : 'Iniciar'} ${mission.title}`}
                >
                  {isCompleted ? (
                    <>
                      <span>Revisar</span>
                      <RotateCcw className="w-3 h-3" />
                    </>
                  ) : isAvailable ? (
                    <>
                      <span>Jogar</span>
                      <Play className="w-3 h-3 fill-slate-950" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Trancada</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Controls: Reset Progress */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Progresso salvo automaticamente no seu navegador.
        </div>

        <div>
          {showConfirmReset ? (
            <div className="flex items-center gap-2 bg-rose-950/50 p-2 rounded-xl border border-rose-500/30">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-rose-200 text-xs">Zerar todo o progresso?</span>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowConfirmReset(false);
                }}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-[11px]"
              >
                Sim, Zerar
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Progresso do Jogo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
