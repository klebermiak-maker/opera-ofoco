import React from 'react';
import { Volume2, VolumeX, Eye, Map, Home } from 'lucide-react';
import { ScreenState, AccessibilitySettings } from '../types/game';
import { sounds } from '../utils/audio';

interface TopBarProps {
  currentScreen: ScreenState;
  activeMissionId?: number;
  missionTitle?: string;
  totalScore: number;
  unlockedCount: number;
  accessibility: AccessibilitySettings;
  onToggleSound: () => void;
  onOpenAccessibility: () => void;
  onNavigateToCentral: () => void;
  onNavigateToTitle: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  activeMissionId,
  missionTitle,
  totalScore,
  unlockedCount,
  accessibility,
  onToggleSound,
  onOpenAccessibility,
  onNavigateToCentral,
  onNavigateToTitle,
}) => {
  return (
    <header className="w-full bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onNavigateToTitle}
          className="text-left font-display font-bold text-lg sm:text-xl tracking-tight text-white hover:text-cyan-400 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-sm"
          aria-label="Operação Foco - Ir para tela inicial"
        >
          OPERAÇÃO FOCO
        </button>

        {/* Zone 2: Informational context - unboxed metadata */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 font-medium">
          {currentScreen === 'playing' && activeMissionId ? (
            <>
              <span className="text-cyan-400 font-mono-numbers font-semibold">
                FASE {String(activeMissionId).padStart(2, '0')}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-200 truncate max-w-xs">{missionTitle}</span>
            </>
          ) : (
            <>
              <span className="text-slate-300">Centro de Treinamento Cognitivo</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{Math.round((unlockedCount / 15) * 100)}% Restaurado</span>
            </>
          )}
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-amber-400 font-mono-numbers font-semibold">
            {totalScore} PTS
          </span>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {currentScreen === 'playing' && (
            <button
              onClick={() => {
                sounds.playClick();
                onNavigateToCentral();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
              aria-label="Abrir Central de Missões"
            >
              <Map className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Missões</span>
            </button>
          )}

          {currentScreen === 'central' && (
            <button
              onClick={() => {
                sounds.playClick();
                onNavigateToTitle();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
              aria-label="Voltar para a tela inicial"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Início</span>
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleSound();
            }}
            className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
              accessibility.soundEnabled
                ? 'bg-slate-900 border-slate-700/80 text-cyan-400 hover:bg-slate-800'
                : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            aria-label={accessibility.soundEnabled ? 'Desativar som do jogo' : 'Ativar som do jogo'}
            title={accessibility.soundEnabled ? 'Som: Ativado' : 'Som: Desativado'}
          >
            {accessibility.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Accessibility Settings Modal Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAccessibility();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-400 transition-colors whitespace-nowrap"
            aria-label="Abrir opções de acessibilidade"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Acessibilidade</span>
          </button>
        </div>
      </div>
    </header>
  );
};
